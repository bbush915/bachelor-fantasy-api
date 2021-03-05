import { FieldResolver, Resolver, Root } from "type-graphql";

import { Contestant } from "gql/contestant";
import knex from "lib/knex";
import { SeasonWeekContestant } from "./schema";

@Resolver(SeasonWeekContestant)
class SeasonWeekContestantResolver {
  @FieldResolver(() => Contestant)
  contestant(@Root() { contestantId }: SeasonWeekContestant): Promise<Contestant> {
    return knex("contestants").where({ id: contestantId }).first();
  }
}

export default SeasonWeekContestantResolver;
