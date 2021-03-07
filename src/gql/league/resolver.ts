import { Arg, Ctx, FieldResolver, Query, Resolver, Root, UseMiddleware } from "type-graphql";

import { IContext } from "gql/context";
import { LeagueMember } from "gql/league-member";
import { Season } from "gql/season";
import { User } from "gql/user";
import knex from "lib/knex";
import { authentication } from "middleware";
import { League } from "./schema";

@Resolver(League)
class LeagueResolver {
  @Query(() => [League])
  @UseMiddleware(authentication)
  myLeagues(@Ctx() { identity }: IContext): Promise<League[]> {
    return knex("league_members")
      .join("leagues", "leagues.id", "=", "league_members.league_id")
      .where("league_members.user_id", "=", identity!.id)
      .select("leagues.*");
  }

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
