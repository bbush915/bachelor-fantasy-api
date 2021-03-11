import {
  Arg,
  Args,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";

import { IContext } from "gql/context";
import { LeagueMember } from "gql/league-member";
import { LineupContestant } from "gql/lineup-contestant";
import knex from "lib/knex";
import { authentication } from "middleware";
import { Lineup, LineupInput, SaveLineupInput } from "./schema";

@Resolver(Lineup)
class LineupResolver {
  @Query(() => Lineup, { nullable: true })
  @UseMiddleware(authentication)
  async lineup(
    @Args() { leagueId, seasonWeekId }: LineupInput,
    @Ctx() { identity }: IContext
  ): Promise<Lineup> {
    const leagueMember: LeagueMember = await knex("league_members")
      .where({ leagueId, userId: identity!.id })
      .first();

    if (!leagueMember) {
      throw new Error("You are not a member of this league");
    }

    return knex("lineups").where({ leagueMemberId: leagueMember.id, seasonWeekId }).first();
  }

  @Query(() => [Lineup])
  async leaderboard(@Args() { leagueId, seasonWeekId }: LineupInput): Promise<Lineup[]> {
    return knex()
      .select("lineups.*")
      .from("lineups")
      .join("league_members", "league_members.id", "=", "lineups.league_member_id")
      .where("league_members.league_id", "=", leagueId)
      .andWhere("lineups.season_week_id", "=", seasonWeekId)
      .orderBy("lineups.weekly_score", "desc");
  }

  @Query(() => Lineup, { nullable: true })
  @UseMiddleware(authentication)
  async currentLineup(
    @Arg("leagueId") leagueId: string,
    @Ctx() context: IContext
  ): Promise<Lineup> {
    const { rows } = await knex.raw(
      `
        SELECT
          SW.id AS season_week_id
        FROM
          leagues L
          JOIN seasons S ON (S.id = L.season_id)
          LEFT JOIN season_weeks SW ON (SW.season_id = S.id) AND (SW.week_number = S.current_week_number)
      `
    );

    const seasonWeekId = rows[0].season_week_id;

    return this.lineup({ leagueId, seasonWeekId }, context);
  }

  @FieldResolver(() => LeagueMember)
  leagueMember(@Root() { leagueMemberId }: Lineup): Promise<LeagueMember> {
    return knex().select("*").first().from("league_members").where({ id: leagueMemberId });
  }

  @FieldResolver(() => [LineupContestant])
  lineupContestants(@Root() { id }: Lineup): Promise<LineupContestant[]> {
    return knex("lineup_contestants").where({ lineupId: id });
  }

  @Mutation(() => Lineup)
  @UseMiddleware(authentication)
  async saveLineup(
    @Arg("input") { leagueId, seasonWeekId, contestantIds }: SaveLineupInput,
    @Ctx() { identity }: IContext
  ): Promise<Lineup> {
    const leagueMember: LeagueMember = await knex("league_members")
      .where({ leagueId, userId: identity!.id })
      .first();

    if (!leagueMember) {
      throw new Error("You are not a member of this league");
    }

    let lineup: Lineup = await knex("lineups")
      .where({ leagueMemberId: leagueMember.id, seasonWeekId })
      .first();

    if (lineup) {
      await knex("lineup_contestants").where({ lineupId: lineup.id }).delete();
    } else {
      lineup = (
        await knex("lineups")
          .insert({
            leagueMemberId: leagueMember.id,
            seasonWeekId,
          })
          .returning("*")
      )[0];
    }

    const lineupContestants: Partial<LineupContestant>[] = contestantIds.map((contestantId) => ({
      lineupId: lineup.id,
      contestantId,
    }));

    await knex("lineup_contestants").insert(lineupContestants);

    return lineup;
  }
}

export default LineupResolver;
