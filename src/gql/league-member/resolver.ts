import { FieldResolver, Resolver, Root } from "type-graphql";

import { User } from "gql/user";
import knex from "lib/knex";
import { LeagueMember } from "./schema";

@Resolver(LeagueMember)
class LeagueMemberResolver {
  @FieldResolver(() => User)
  user(@Root() { userId }: LeagueMember): Promise<User> {
    return knex("users").where({ id: userId }).first();
  }
}

export default LeagueMemberResolver;
