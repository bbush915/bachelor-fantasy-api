import { FieldResolver, Resolver, Root, UseMiddleware } from "type-graphql";

import { User } from "gql/user";
import knex from "lib/knex";
import { authentication } from "middleware";
import { LeagueMember } from "./schema";

@Resolver(LeagueMember)
class LeagueMemberResolver {
  @FieldResolver(() => User)
  @UseMiddleware(authentication)
  user(@Root() { userId }: LeagueMember): Promise<User> {
    return knex("users").where({ id: userId }).first();
  }
}

export default LeagueMemberResolver;
