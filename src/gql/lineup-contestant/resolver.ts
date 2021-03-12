import { FieldResolver, Resolver, Root } from "type-graphql";

import { Contestant } from "gql/contestant";
import knex from "lib/knex";
import { LineupContestant } from "./schema";

@Resolver(LineupContestant)
class LineupContestantResolver {
  @FieldResolver(() => Contestant)
  async contestant(@Root() { contestantId }: LineupContestant): Promise<Contestant> {
    const contestant = await knex
      .select()
      .from<Contestant>("contestants")
      .where({ id: contestantId })
      .first();

    return contestant!;
  }
}

export default LineupContestantResolver;
