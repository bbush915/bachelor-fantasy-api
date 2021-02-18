import { Query, Resolver } from "type-graphql";

import knex from "lib/knex";
import { User } from "./schema";

@Resolver(User)
class UserResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    return knex("users");
  }
}

export default UserResolver;
