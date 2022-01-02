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
import { LineupContestant } from "gql/lineup-contestant";
import knex from "lib/knex";
import { authentication } from "middleware";
import { DbLeagueMember, DbLineup, DbLineupContestant } from "types";
import { Lineup, LineupInput, MyLineupInput, SaveLineupInput } from "./schema";

@Resolver(Lineup)
class LineupResolver {
  @Query(() => Lineup, { nullable: true })
  @UseMiddleware(authentication)
  lineup(@Args() { leagueMemberId, seasonWeekId }: LineupInput): Promise<DbLineup | undefined> {
    return knex.select().from<DbLineup>("lineups").where({ leagueMemberId, seasonWeekId }).first();
  }

  @Query(() => Lineup, { nullable: true })
  @UseMiddleware(authentication)
  async myLineup(
    @Args() { leagueId, seasonWeekId }: MyLineupInput,
    @Ctx() { identity }: IContext
  ): Promise<DbLineup | undefined> {
    const leagueMember = await knex
      .select()
      .from<DbLeagueMember>("league_members")
      .where({ leagueId, userId: identity!.id })
      .first();

    if (!leagueMember) {
      throw new Error("You are not a member of this league");
    }

    return this.lineup({ leagueMemberId: leagueMember.id, seasonWeekId });
  }

  @FieldResolver(() => [LineupContestant])
  lineupContestants(@Root() { id }: Lineup): Promise<DbLineupContestant[]> {
    return knex.select().from<DbLineupContestant>("lineup_contestants").where({ lineupId: id });
  }

  @Mutation(() => Lineup)
  @UseMiddleware(authentication)
  async saveLineup(
    @Arg("input") { leagueId, seasonWeekId, contestantIds }: SaveLineupInput,
    @Ctx() { identity }: IContext
  ): Promise<DbLineup> {
    const leagueMember = await knex
      .select()
      .from<DbLeagueMember>("league_members")
      .where({ leagueId, userId: identity!.id })
      .first();

    if (!leagueMember) {
      throw new Error("You are not a member of this league");
    }

    let existingLineup = await knex
      .select()
      .from<DbLineup>("lineups")
      .where({ leagueMemberId: leagueMember.id, seasonWeekId })
      .first();

    return knex.transaction(async (trx) => {
      if (existingLineup) {
        await trx<DbLineupContestant>("lineup_contestants")
          .delete()
          .where({ lineupId: existingLineup.id });
      } else {
        existingLineup = (
          await trx<DbLineup>("lineups")
            .insert({
              leagueMemberId: leagueMember.id,
              seasonWeekId,
            })
            .returning("*")
        )[0];
      }

      const lineupContestants: Partial<DbLineupContestant>[] = contestantIds.map(
        (contestantId) => ({
          lineupId: existingLineup!.id,
          contestantId,
        })
      );

      await trx<DbLineupContestant>("lineup_contestants").insert(lineupContestants);

      return existingLineup!;
    });
  }
}

export default LineupResolver;
