import { Arg, Ctx, FieldResolver, ID, Mutation, Resolver, Root, UseMiddleware } from "type-graphql";

import { IContext } from "gql/context";
import { LeagueMemberScore } from "gql/league-member-score";
import { Lineup } from "gql/lineup";
import { SeasonWeek } from "gql/season-week";
import { User } from "gql/user";
import knex from "lib/knex";
import { authentication } from "middleware";
import { DbLeagueMember, DbLineup, DbSeason, DbUser } from "types";
import { JoinLeagueInput, LeagueMember, QuitLeagueInput, RemoveLeagueMemberInput } from "./schema";

@Resolver(LeagueMember)
class LeagueMemberResolver {
  @FieldResolver(() => User)
  async user(@Root() { userId }: LeagueMember): Promise<DbUser> {
    const user = await knex.select().from<DbUser>("users").where({ id: userId }).first();
    return user!;
  }

  @FieldResolver(() => Lineup, { nullable: true })
  @UseMiddleware(authentication)
  lineup(
    @Arg("seasonWeekId", () => ID) seasonWeekId: string,
    @Root() { id }: LeagueMember
  ): Promise<DbLineup | undefined> {
    return knex
      .select()
      .from<DbLineup>("lineups")
      .where({ leagueMemberId: id, seasonWeekId })
      .first();
  }

  @FieldResolver()
  @UseMiddleware(authentication)
  async isLineupSet(@Root() { id, leagueId }: LeagueMember): Promise<boolean> {
    const season: DbSeason | undefined = await knex
      .select("seasons.*")
      .from("leagues")
      .join("seasons", "seasons.id", "=", "leagues.season_id")
      .where("leagues.id", "=", leagueId)
      .first();

    const lineup: DbLineup | undefined = await knex
      .select("lineups.*")
      .from("lineups")
      .join("season_weeks", "season_weeks.id", "=", "lineups.season_week_id")
      .where("lineups.league_member_id", "=", id)
      .andWhere("season_weeks.week_number", "=", season!.currentWeekNumber)
      .first();

    return !!lineup;
  }

  @FieldResolver(() => LeagueMemberScore)
  @UseMiddleware(authentication)
  async leagueMemberScore(
    @Arg("seasonWeekId", () => ID) seasonWeekId: string,
    @Root() { id, leagueId }: LeagueMember
  ): Promise<LeagueMemberScore> {
    const seasonWeek = await knex
      .select()
      .from<SeasonWeek>("season_weeks")
      .where({ id: seasonWeekId })
      .first();

    const { rows } = await knex.raw(
      `
        SELECT
          LM.id AS league_member_id,
          S.weekly_score,
          CASE
            WHEN LM.is_active 
            THEN rank() OVER ( 
              ORDER BY 
                LM.is_active DESC, -- Inactive members.
                CASE WHEN S.weekly_score IS NULL THEN 1 ELSE 0 END, -- Didn't set lineup this week.
                S.weekly_score DESC
            )
          END AS weekly_rank,
          S.cumulative_score,
          CASE
            WHEN LM.is_active 
            THEN rank() OVER ( 
              ORDER BY 
                LM.is_active DESC, -- Inactive members.
                CASE WHEN S.cumulative_score IS NULL THEN 1 ELSE 0 END, -- Didn't set lineup ever.
                S.cumulative_score DESC
            )
          END AS cumulative_rank
        FROM
          league_members LM
          LEFT JOIN (
            SELECT
              LM.id AS league_member_id,
              sum(CASE WHEN SW.week_number = :weekNumber THEN SWC.score ELSE NULL END) AS weekly_score,
              sum(CASE WHEN SW.week_number <= :weekNumber THEN SWC.score ELSE NULL END) AS cumulative_score
            FROM
              league_members LM
              JOIN lineups LU ON (LU.league_member_id = LM.id)
              JOIN lineup_contestants LUC ON (LUC.lineup_id = LU.id)
              JOIN season_weeks SW ON (SW.id = LU.season_week_id)
              JOIN seasons S ON (S.id = SW.season_id)
              JOIN season_week_contestants SWC ON (SWC.season_week_id = LU.season_week_id) AND (SWC.contestant_id = LUC.contestant_id)
            WHERE
              1 = 1
              AND (LM.league_id = :leagueId)
              AND (S.is_active = TRUE)
            GROUP BY
              LM.id
          ) S ON (S.league_member_id = LM.id)
        WHERE
          1 = 1
          AND (LM.league_id = :leagueId)
      `,
      {
        leagueId,
        weekNumber: seasonWeek!.weekNumber,
      }
    );

    const row = rows.find((x: any) => x.league_member_id === id);

    return {
      leagueMemberId: id,
      seasonWeekId,
      weeklyScore: row.weekly_score,
      weeklyRank: row.weekly_rank,
      cumulativeScore: row.cumulative_score,
      cumulativeRank: row.cumulative_rank,
    };
  }

  @Mutation(() => LeagueMember)
  @UseMiddleware(authentication)
  async joinLeague(
    @Arg("input") { leagueId }: JoinLeagueInput,
    @Ctx() { identity }: IContext
  ): Promise<DbLeagueMember> {
    // NOTE - Since we only soft-delete league members, we may only need to
    // mark them as active again.

    const existingLeagueMember = await knex
      .select()
      .from<DbLeagueMember>("league_members")
      .where({ leagueId, userId: identity!.id })
      .first();

    let leagueMember: DbLeagueMember;

    if (existingLeagueMember) {
      if (existingLeagueMember.isActive) {
        throw new Error("You are already a member of this league");
      } else {
        leagueMember = (
          await knex<DbLeagueMember>("league_members")
            .update({ isActive: true })
            .where({ id: existingLeagueMember.id })
            .returning("*")
        )[0];
      }
    } else {
      leagueMember = (
        await knex<DbLeagueMember>("league_members")
          .insert({ leagueId, userId: identity!.id })
          .returning("*")
      )[0];
    }

    return leagueMember;
  }

  @Mutation(() => LeagueMember)
  @UseMiddleware(authentication)
  async quitLeague(
    @Arg("input") { leagueId }: QuitLeagueInput,
    @Ctx() { identity }: IContext
  ): Promise<DbLeagueMember> {
    // NOTE - We only soft-delete league member to allow them to rejoin later
    // without losing their previous data.

    const existingLeagueMember = await knex
      .select()
      .from<DbLeagueMember>("league_members")
      .where({ leagueId, userId: identity!.id })
      .first();

    if (existingLeagueMember?.isActive) {
      return (
        await knex<DbLeagueMember>("league_members")
          .update({ isActive: false })
          .where({ id: existingLeagueMember.id })
          .returning("*")
      )[0];
    } else {
      throw new Error("You are not a member of this league");
    }
  }

  @Mutation(() => LeagueMember)
  @UseMiddleware(authentication)
  async removeLeagueMember(
    @Arg("input") { leagueMemberId }: RemoveLeagueMemberInput,
    @Ctx() { identity }: IContext
  ): Promise<DbLeagueMember> {
    const leagueMember = await knex
      .select()
      .from<DbLeagueMember>("league_members")
      .where({ id: leagueMemberId })
      .first();

    if (!leagueMember) {
      throw new Error("League member does not exist");
    }

    const comissioner = await knex
      .select()
      .from<DbLeagueMember>("league_members")
      .where({ leagueId: leagueMember.leagueId, isCommissioner: true })
      .first();

    if (identity!.id !== comissioner?.userId) {
      throw new Error("You are not authorized to delete this league member");
    }

    await knex.transaction(async (trx) => {
      // NOTE - Delete lineup contestants.
      await trx.raw(
        `
          WITH src AS (
            SELECT
              LC.id
            FROM
              lineup_contestants LC
              JOIN lineups L ON (L.id = LC.lineup_id)
            WHERE
              1 = 1
              AND (L.league_member_id = ?)
          )
          DELETE FROM
            lineup_contestants LC
          USING
            src
          WHERE
            1 = 1
            AND (src.id = LC.id)
        `,
        [leagueMemberId]
      );

      // NOTE - Delete lineups.
      await trx<DbLineup>("lineups").delete().where({ leagueMemberId });

      // NOTE - Delete league member.
      await trx<DbLeagueMember>("league_members").delete().where({ id: leagueMemberId });
    });

    return leagueMember;
  }
}

export default LeagueMemberResolver;
