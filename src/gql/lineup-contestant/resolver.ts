import { FieldResolver, Resolver, Root } from "type-graphql";

import { Contestant } from "gql/contestant";
import knex from "lib/knex";
import { LineupContestant } from "./schema";

@Resolver(LineupContestant)
class LineupContestantResolver {
  @FieldResolver(() => Contestant)
  contestant(@Root() { contestantId }: LineupContestant): Promise<Contestant> {
    return knex("contestants").where({ id: contestantId }).first();
  }
}

export default LineupContestantResolver;
