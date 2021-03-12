import { Arg, Args, FieldResolver, Query, Resolver, Root, UseMiddleware } from "type-graphql";

import { Lineup } from "gql/lineup";
import { User } from "gql/user";
import knex, { camelCase } from "lib/knex";
import { authentication } from "middleware";
import { LeagueMember, OverallScoreDetailsInput, WeeklyScoreDetailsInput } from "./schema";

@Resolver(LeagueMember)
class LeagueMemberResolver {
  @Query(() => [LeagueMember], { nullable: true })
  @UseMiddleware(authentication)
  async overallScoreDetails(
    @Args() { leagueId, weekNumber }: OverallScoreDetailsInput
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
}

export default LeagueMemberResolver;
