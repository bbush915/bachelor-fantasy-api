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
import { Lineup, LineupInput, MyLineupInput, SaveLineupInput } from "./schema";

@Resolver(Lineup)
class LineupResolver {
  @Query(() => Lineup, { nullable: true })
  @UseMiddleware(authentication)
  async lineup(@Args() { leagueMemberId, seasonWeekId }: LineupInput): Promise<Lineup | undefined> {
    return knex.select().from<Lineup>("lineups").where({ leagueMemberId, seasonWeekId }).first();
  }

  @Query(() => Lineup, { nullable: true })
  @UseMiddleware(authentication)
  async myLineup(
    @Args() { leagueId, seasonWeekId }: MyLineupInput,
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

    return this.lineup({ leagueMemberId: leagueMember.id, seasonWeekId });
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

    let existingLineup = await knex
      .select()
      .from<Lineup>("lineups")
      .where({ leagueMemberId: leagueMember.id, seasonWeekId })
      .first();

    return knex.transaction(async (trx) => {
      if (existingLineup) {
        await trx
          .delete()
          .from<LineupContestant>("lineup_contestants")
          .where({ lineupId: existingLineup.id });
      } else {
        existingLineup = (
          await trx
            .insert({
              leagueMemberId: leagueMember.id,
              seasonWeekId,
            })
            .into("lineups")
            .returning("*")
        )[0];
      }

      const lineupContestants: Partial<LineupContestant>[] = contestantIds.map((contestantId) => ({
        lineupId: existingLineup!.id,
        contestantId,
      }));

      await trx.insert(lineupContestants).into("lineup_contestants");

      return existingLineup!;
    });
  }
}

export default LineupResolver;
