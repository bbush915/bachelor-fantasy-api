import { Knex } from "knex";
import { Arg, Args, FieldResolver, Int, Query, Resolver, Root, UseMiddleware } from "type-graphql";

import { Lineup } from "gql/lineup";
import { Season } from "gql/season";
import { User } from "gql/user";
import knex, { camelCase } from "lib/knex";
import { authentication } from "middleware";
import { LeagueMember, OverallScoreDetailsInput, WeeklyScoreDetailsInput } from "./schema";

@Resolver(LeagueMember)
class LeagueMemberResolver {
  @Query(() => [LeagueMember], { nullable: true })
  @UseMiddleware(authentication)
  overallScoreDetails(
    @Args() { leagueId, weekNumber }: OverallScoreDetailsInput
  ): Promise<LeagueMember[]> {
    return this._getOverallScoreDetails(knex, leagueId, weekNumber);
  }

  @Query(() => [LeagueMember], { nullable: true })
  @UseMiddleware(authentication)
  async weeklyScoreDetails(
    @Args() { leagueId, seasonWeekId }: WeeklyScoreDetailsInput
  ): Promise<LeagueMember[]> {
    const { rows } = await knex.raw(
      `
        SELECT
          LM.*,
          WS.weekly_score
        FROM
          league_members LM
          JOIN (
            SELECT
              LM.id AS league_member_id,
              sum(SWC.score) AS weekly_score
            FROM
              league_members LM
              JOIN lineups LU ON (LU.league_member_id = LM.id)
              JOIN lineup_contestants LUC ON (LUC.lineup_id = LU.id)
              JOIN season_week_contestants SWC ON (SWC.season_week_id = LU.season_week_id) AND (SWC.contestant_id = LUC.contestant_id)
            WHERE
              1 = 1
              AND (LM.league_id = :leagueId)
              AND (LU.season_week_id = :seasonWeekId)
            GROUP BY
              LM.id
          ) WS ON (WS.league_member_id = LM.id)
        WHERE
          1 = 1
          AND (LM.league_id = :leagueId)
      `,
      {
        leagueId,
        seasonWeekId,
      }
    );

    return camelCase(rows);
  }

  @FieldResolver(() => Lineup, { nullable: true })
  async lineup(
    @Arg("seasonWeekId") seasonWeekId: string,
    @Root() { id }: LeagueMember
  ): Promise<Lineup | undefined> {
    return knex
      .select()
      .from<Lineup>("lineups")
      .where({ leagueMemberId: id, seasonWeekId })
      .first();
  }

  @FieldResolver(() => User)
  async user(@Root() { userId }: LeagueMember): Promise<User> {
    const user = await knex.select().from<User>("users").where({ id: userId }).first();
    return user!;
  }

  @FieldResolver(() => Int, { nullable: true })
  async place(@Root() { id, leagueId }: LeagueMember): Promise<number | undefined> {
    const season: Season = await knex
      .select("seasons.*")
      .from("leagues")
      .join("seasons", "seasons.id", "=", "leagues.season_id")
      .where("leagues.id", "=", leagueId)
      .first();

    const overallScoreDetails = await this._getOverallScoreDetails(
      knex,
      leagueId,
      season.currentWeekNumber!
    );

    return (
      Math.max(
        overallScoreDetails
          .sort((x, y) => Number(y.cumulativeScore) - Number(x.cumulativeScore))
          .findIndex((x) => x.id === id),
        0
      ) + 1
    );
  }

  @FieldResolver()
  async isLineupSet(@Root() { id, leagueId }: LeagueMember): Promise<boolean> {
    const season: Season = await knex
      .select("seasons.*")
      .from("leagues")
      .join("seasons", "seasons.id", "=", "leagues.season_id")
      .where("leagues.id", "=", leagueId)
      .first();

    const lineup = await knex
      .select("lineups.*")
      .from("lineups")
      .join("season_weeks", "season_weeks.id", "=", "lineups.season_week_id")
      .where("lineups.league_member_id", "=", id!)
      .andWhere("season_weeks.week_number", "=", season.currentWeekNumber!)
      .first();

    return !!lineup;
  }

  private async _getOverallScoreDetails(
    knex: Knex,
    leagueId: string,
    weekNumber: number
  ): Promise<LeagueMember[]> {
    const { rows } = await knex.raw(
      `
        SELECT
          LM.*,
          CS.cumulative_score
        FROM
          league_members LM
          JOIN (
            SELECT
              LM.id AS league_member_id,
              sum(SWC.score) AS cumulative_score
            FROM
              league_members LM
              JOIN lineups LU ON (LU.league_member_id = LM.id)
              JOIN lineup_contestants LUC ON (LUC.lineup_id = LU.id)
              JOIN season_weeks SW ON (SW.id = LU.season_week_id)
              JOIN season_week_contestants SWC ON (SWC.season_week_id = LU.season_week_id) AND (SWC.contestant_id = LUC.contestant_id)
            WHERE
              1 = 1
              AND (LM.league_id = :leagueId)
              AND (SW.week_number <= :weekNumber)
            GROUP BY
              LM.id
          ) CS ON (CS.league_member_id = LM.id)
        WHERE
          1 = 1
          AND (LM.league_id = :leagueId)
      `,
      {
        leagueId,
        weekNumber,
      }
    );

    return camelCase(rows);
  }
}

export default LeagueMemberResolver;
