import { Query, Resolver } from "type-graphql";

import knex from "lib/knex";
import { Contestant } from "./schema";

@Resolver(Contestant)
class ContestantResolver {
  @Query(() => [Contestant])
  contestants(): Promise<Contestant[]> {
    return knex("contestants");
  }
}

export default ContestantResolver;
