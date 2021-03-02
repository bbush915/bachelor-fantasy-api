import { Arg, Ctx, FieldResolver, Query, Resolver, Root, UseMiddleware } from "type-graphql";

import { IContext } from "gql/context";
import { LineupContestant } from "gql/lineup-contestant";
import knex from "lib/knex";
import { authentication } from "middleware";
import { Lineup } from "./schema";

@Resolver(Lineup)
class LineupResolver {
  @Query(() => Lineup, { nullable: true })
  @UseMiddleware(authentication)
  async currentLineup(@Arg("leagueId") leagueId: string, @Ctx() { identity }: IContext): Promise<Lineup> {
    const leagueMember = await knex("league_members").where({ leagueId, userId: identity!.id }).first();

    if (!leagueMember) {
      throw new Error(`User [ID: ${identity!.id}] is not a member of league [ID: ${leagueId}]`);
    }

    return knex("lineups").where({ leagueMemberId: leagueMember.id }).first();
  }

  @FieldResolver(() => [LineupContestant])
  async lineupContestants(@Root() { id }: Lineup): Promise<LineupContestant[]> {
    return knex("lineup_contestants").where({ lineupId: id });
  }
}

export default LineupResolver;
