import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";

import { LeagueMember } from "gql/league-member";
import { Season } from "gql/season";
import { User } from "gql/user";
import knex from "lib/knex";
import { League } from "./schema";

@Resolver(League)
class LeagueResolver {
  @Query(() => League, { nullable: true })
  league(@Arg("id") id: string): Promise<League> {
    return knex("leagues").where({ id }).first();
  }

  @FieldResolver(() => Season)
  season(@Root() { seasonId }: League): Promise<Season> {
    return knex("seasons").where({ id: seasonId }).first();
  }

  @FieldResolver(() => User)
  commissioner(@Root() { commissionerId }: League): Promise<User> {
    return knex("users").where({ id: commissionerId }).first();
  }

  @FieldResolver(() => [LeagueMember])
  leagueMembers(@Root() { id }: League): Promise<LeagueMember[]> {
    return knex("league_members").where({ leagueId: id });
  }
}

export default LeagueResolver;
