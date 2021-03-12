import { Query, Resolver } from "type-graphql";

import knex from "lib/knex";
import { Contestant } from "./schema";
import { Season } from "gql/season";

@Resolver(Contestant)
class ContestantResolver {
  @Query(() => [Contestant])
  async contestants(): Promise<Contestant[]> {
    const activeSeason = await knex
      .select()
      .from<Season>("seasons")
      .where({ isActive: true })
      .first();

    return knex.select().from<Contestant>("contestants").where({ seasonId: activeSeason!.id });
  }
}

export default ContestantResolver;
