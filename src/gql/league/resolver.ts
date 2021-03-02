import { Arg, FieldResolver, Query, Resolver, Root, UseMiddleware } from "type-graphql";

import { LeagueMember } from "gql/league-member";
import { Season } from "gql/season";
import knex from "lib/knex";
import { authentication } from "middleware";
import { League } from "./schema";

@Resolver(League)
class LeagueResolver {
  @Query(() => League, { nullable: true })
  league(@Arg("id") id: string): Promise<League> {
    return knex("leagues").where({ id }).first();
  }

  @FieldResolver(() => [LeagueMember])
  @UseMiddleware(authentication)
  leagueMembers(@Root() { id }: League): Promise<LeagueMember[]> {
    return knex("league_members").where({ leagueId: id });
  }

  @FieldResolver(() => Season)
  @UseMiddleware(authentication)
  season(@Root() { seasonId }: League): Promise<Season> {
    return knex("seasons").where({ id: seasonId }).first();
  }
}

export default LeagueResolver;
