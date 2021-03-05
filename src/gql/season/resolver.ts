import { FieldResolver, Resolver, Root } from "type-graphql";

import { SeasonWeek } from "gql/season-week";
import knex from "lib/knex";
import { Season } from "./schema";

@Resolver(Season)
class SeasonResolver {
  @FieldResolver(() => SeasonWeek, { nullable: true })
  currentSeasonWeek(@Root() { id: seasonId, currentWeekNumber }: Season): Promise<SeasonWeek> {
    return knex("season_weeks").where({ seasonId, weekNumber: currentWeekNumber }).first();
  }
}

export default SeasonResolver;
