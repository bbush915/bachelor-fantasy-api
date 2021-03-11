import { Arg, FieldResolver, Resolver, Root } from "type-graphql";

import { User } from "gql/user";
import knex from "lib/knex";
import { LeagueMember } from "./schema";

@Resolver(LeagueMember)
class LeagueMemberResolver {
  @FieldResolver(() => User)
  user(@Root() { userId }: LeagueMember): Promise<User> {
    return knex("users").where({ id: userId }).first();
  }

  @FieldResolver({ nullable: true })
  weeklyScore(
    @Arg("seasonWeekId") seasonWeekId: string,
    @Root() { id }: LeagueMember
  ): Promise<number> {
    return knex("lineups")
      .where({ leagueMemberId: id, seasonWeekId })
      .select("weekly_score")
      .first();
  }
}

export default LeagueMemberResolver;
