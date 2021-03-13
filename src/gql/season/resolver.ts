import { FieldResolver, Resolver, Root } from "type-graphql";

import { SeasonWeek } from "gql/season-week";
import knex from "lib/knex";
import { Season } from "./schema";

@Resolver(Season)
class SeasonResolver {
  @FieldResolver(() => SeasonWeek, { nullable: true })
  currentSeasonWeek(
    @Root() { id: seasonId, currentWeekNumber }: Season
  ): Promise<SeasonWeek | undefined> {
    return knex
      .select()
      .from<SeasonWeek>("season_weeks")
      .where({ seasonId, weekNumber: currentWeekNumber })
      .first();
  }

  @FieldResolver(() => SeasonWeek, { nullable: true })
  async previousSeasonWeek(
    @Root() { id: seasonId, currentWeekNumber }: Season
  ): Promise<SeasonWeek | undefined> {
    if (!currentWeekNumber || currentWeekNumber < 2) {
      return;
    }

    return knex
      .select()
      .from<SeasonWeek>("season_weeks")
      .where({ seasonId, weekNumber: currentWeekNumber - 1 })
      .first();
  }
}

export default SeasonResolver;
