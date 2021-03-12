import { Arg, Query, Resolver } from "type-graphql";

import knex from "lib/knex";
import { SeasonWeek } from "./schema";

@Resolver(SeasonWeek)
class SeasonWeekResolver {
  @Query(() => [SeasonWeek])
  seasonWeeks(@Arg("seasonId") seasonId: string): Promise<SeasonWeek[]> {
    return knex.select().from<SeasonWeek>("season_weeks").where({ seasonId });
  }
}

export default SeasonWeekResolver;
