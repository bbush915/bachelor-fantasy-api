import { FieldResolver, Resolver, Root, UseMiddleware } from "type-graphql";

import { SeasonWeek } from "gql/season-week";
import knex from "lib/knex";
import { authentication } from "middleware";
import { Season } from "./schema";

@Resolver(Season)
class SeasonResolver {
  @FieldResolver(() => SeasonWeek)
  @UseMiddleware(authentication)
  currentWeek(@Root() { currentWeekNumber }: Season): Promise<SeasonWeek> {
    return knex("season_weeks").where({ weekNumber: currentWeekNumber }).first();
  }
}

export default SeasonResolver;
