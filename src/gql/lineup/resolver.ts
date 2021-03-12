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
  async myLineup(
    @Args() { leagueId, seasonWeekId }: LineupInput,
    @Ctx() { identity }: IContext
  ): Promise<Lineup | undefined> {
    const leagueMember = await knex
      .select()
      .from<LeagueMember>("league_members")
      .where({ leagueId, userId: identity!.id })
      .first();

    if (!leagueMember) {
      throw new Error("You are not a member of this league");
    }

    return knex
      .select()
      .from<Lineup>("lineups")
      .where({ leagueMemberId: leagueMember.id, seasonWeekId })
      .first();
  }

  @FieldResolver(() => LeagueMember)
  async leagueMember(@Root() { leagueMemberId }: Lineup): Promise<LeagueMember> {
    const leagueMember = await knex
      .select()
      .from<LeagueMember>("league_members")
      .where({ id: leagueMemberId })
      .first();

    return leagueMember!;
  }

  @FieldResolver(() => [LineupContestant])
  lineupContestants(@Root() { id }: Lineup): Promise<LineupContestant[]> {
    return knex.select().from<LineupContestant>("lineup_contestants").where({ lineupId: id });
  }

  @Mutation(() => Lineup)
  @UseMiddleware(authentication)
  async saveLineup(
    @Arg("input") { leagueId, seasonWeekId, contestantIds }: SaveLineupInput,
    @Ctx() { identity }: IContext
  ): Promise<Lineup> {
    const leagueMember = await knex
      .select()
      .from<LeagueMember>("league_members")
      .where({ leagueId, userId: identity!.id })
      .first();

    if (!leagueMember) {
      throw new Error("You are not a member of this league");
    }

    let lineup = await knex
      .select()
      .from<Lineup>("lineups")
      .where({ leagueMemberId: leagueMember.id, seasonWeekId })
      .first();

    if (lineup) {
      await knex
        .delete()
        .from<LineupContestant>("lineup_contestants")
        .where({ lineupId: lineup.id });
    } else {
      lineup = (
        await knex
          .insert({
            leagueMemberId: leagueMember.id,
            seasonWeekId,
          })
          .into("lineups")
          .returning("*")
      )[0];
    }

    const lineupContestants: Partial<LineupContestant>[] = contestantIds.map((contestantId) => ({
      lineupId: lineup!.id,
      contestantId,
    }));

    await knex.insert(lineupContestants).into("lineup_contestants");

    return lineup!;
  }
}

export default LineupResolver;
