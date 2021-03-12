import { FieldResolver, Resolver, Root } from "type-graphql";

import { Contestant } from "gql/contestant";
import knex from "lib/knex";
import { SeasonWeekContestant } from "./schema";

@Resolver(SeasonWeekContestant)
class SeasonWeekContestantResolver {
  @FieldResolver(() => Contestant)
  async contestant(@Root() { contestantId }: SeasonWeekContestant): Promise<Contestant> {
    const contestant = await knex
      .select()
      .from<Contestant>("contestants")
      .where({ id: contestantId })
      .first();

    return contestant!;
  }
}

export default SeasonWeekContestantResolver;
