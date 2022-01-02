import { Arg, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";

import { SeasonWeek } from "gql/season-week";
import knex from "lib/knex";
import { DbSeason, DbSeasonWeek, DbSeasonWeekContestant } from "types";
import { AdvanceCurrentWeekInput, Season } from "./schema";
import { authentication, authorization } from "middleware";
import { OperationResponse } from "gql/utils";

@Resolver(Season)
class SeasonResolver {
  @Query(() => Season)
  async activeSeason(): Promise<DbSeason> {
    const season = await knex.select().from<DbSeason>("seasons").where({ isActive: true }).first();
    return season!;
  }

  @FieldResolver(() => SeasonWeek, { nullable: true })
  async currentSeasonWeek(
    @Root() { id: seasonId, currentWeekNumber }: Season
  ): Promise<DbSeasonWeek | undefined> {
    if (!currentWeekNumber) {
      return;
    }

    return this._getSeasonWeek(seasonId, currentWeekNumber);
  }

  @FieldResolver(() => SeasonWeek, { nullable: true })
  async previousSeasonWeek(
    @Root() { id: seasonId, currentWeekNumber }: Season
  ): Promise<DbSeasonWeek | undefined> {
    if (!currentWeekNumber || currentWeekNumber === 1) {
      return;
    }

    return this._getSeasonWeek(seasonId, currentWeekNumber - 1);
  }

  @Mutation(() => OperationResponse)
  @UseMiddleware(authentication, authorization(["admin"]))
  async advanceCurrentWeek(
    @Arg("input")
    { shouldComplete, nextEpisodeAirDate, nextLineupSpotsAvailable }: AdvanceCurrentWeekInput
  ): Promise<OperationResponse> {
    const activeSeason = await knex
      .select()
      .from<DbSeason>("seasons")
      .where({ isActive: true })
      .first();

    if (shouldComplete) {
      await knex<DbSeason>("seasons").update({ isComplete: true }).where({ id: activeSeason!.id });

      return {
        success: true,
      };
    }

    await knex.transaction(async (trx) => {
      // NOTE - Set random lineups for previous week.

      const previousSeasonWeek = await knex
        .select()
        .from<DbSeasonWeek>("season_weeks")
        .where({ seasonId: activeSeason!.id, weekNumber: activeSeason!.currentWeekNumber })
        .first();

      await trx.raw(
        `
          INSERT INTO
            lineups ( league_member_id, season_week_id )
          SELECT
            LM.id AS league_member_id,
            :seasonWeekId AS season_week_id
          FROM
            league_members LM
            JOIN users U ON (U.id = LM.user_id)
            LEFT JOIN lineups L ON (L.league_member_id = LM.id) AND (L.season_week_id = :seasonWeekId)
          WHERE
            1 = 1
            AND (U.set_random_lineup = TRUE)
            AND (L.id IS NULL)
        `,
        { seasonWeekId: previousSeasonWeek!.id }
      );

      await trx.raw(
        `
          INSERT INTO
            lineup_contestants ( lineup_id, contestant_id )
          SELECT
            L.id AS lineup_id,
            WC.contestant_id
          FROM
            lineups L
            LEFT JOIN lineup_contestants LC ON (LC.lineup_id = L.id)
            JOIN LATERAL (
              SELECT
                SWC.contestant_id
              FROM
                season_week_contestants SWC
                JOIN season_weeks SW ON (SW.id = SWC.season_week_id)
              WHERE
                1 = 1
                AND (SW.id = :seasonWeekId)
              ORDER BY
                random(),
                md5(concat(L.id, SWC.id))
              LIMIT
                :lineupSpotsAvailable
            ) WC ON TRUE
          WHERE
            1 = 1
            AND (LC.id IS NULL);
        `,
        {
          seasonWeekId: previousSeasonWeek!.id,
          lineupSpotsAvailable: previousSeasonWeek!.lineupSpotsAvailable,
        }
      );

      // NOTE - Create next week.

      const seasonWeek = (
        await trx<DbSeasonWeek>("season_weeks")
          .insert({
            seasonId: activeSeason!.id,
            weekNumber: activeSeason!.currentWeekNumber + 1,
            episodeAirDate: nextEpisodeAirDate!,
            lineupSpotsAvailable: nextLineupSpotsAvailable!,
          })
          .returning("*")
      )[0];

      // NOTE - Insert next week contestants.

      const { rows: contestantIds } = await trx.raw(
        `
          SELECT
            SWC.contestant_id
          FROM
            season_week_contestants SWC
            JOIN season_weeks SW ON (SW.id = SWC.season_week_id)
          WHERE
            1 = 1
            AND (SW.week_number = ?)
            AND (
              ((SWC.rose IS NULL) OR (SWC.rose = TRUE)) OR
              ((SWC.special_rose IS NULL) OR (SWC.special_rose = TRUE))
            )
        `,
        [activeSeason!.currentWeekNumber]
      );

      const seasonWeekContestants = contestantIds.map((x: any) => ({
        seasonWeekId: seasonWeek.id,
        contestantId: x.contestant_id,
      }));

      await trx<DbSeasonWeekContestant>("season_week_contestants").insert(seasonWeekContestants);

      // NOTE - Update current week.

      await trx<DbSeason>("seasons")
        .update({ currentWeekNumber: activeSeason!.currentWeekNumber + 1 })
        .where({ id: activeSeason!.id });
    });

    return {
      success: true,
    };
  }

  private async _getSeasonWeek(seasonId: string, weekNumber: number): Promise<DbSeasonWeek> {
    const seasonWeek = await knex
      .select()
      .from<DbSeasonWeek>("season_weeks")
      .where({ seasonId, weekNumber })
      .first();

    return seasonWeek!;
  }
}

export default SeasonResolver;
