import { Arg, ID, Query, Resolver } from "type-graphql";

import knex from "lib/knex";
import { DbSeasonWeek } from "types";
import { SeasonWeek } from "./schema";

@Resolver(SeasonWeek)
class SeasonWeekResolver {
  @Query(() => [SeasonWeek])
  seasonWeeks(@Arg("seasonId", () => ID) seasonId: string): Promise<DbSeasonWeek[]> {
    return knex.select().from<DbSeasonWeek>("season_weeks").where({ seasonId });
  }
}

export default SeasonWeekResolver;
