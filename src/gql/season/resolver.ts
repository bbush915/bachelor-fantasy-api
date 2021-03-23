import { FieldResolver, Query, Resolver, Root } from "type-graphql";

import { SeasonWeek } from "gql/season-week";
import knex from "lib/knex";
import { Season } from "./schema";

@Resolver(Season)
class SeasonResolver {
  @Query(() => Season)
  async activeSeason(): Promise<Season> {
    const season = await knex.select().from<Season>("seasons").where({ isActive: true }).first();
    return season!;
  }

  @FieldResolver(() => SeasonWeek, { nullable: true })
  async currentSeasonWeek(
    @Root() { id: seasonId, currentWeekNumber }: Season
  ): Promise<SeasonWeek | undefined> {
    if (!currentWeekNumber) {
      return;
    }

    return this._getSeasonWeek(seasonId, currentWeekNumber);
  }

  @FieldResolver(() => SeasonWeek, { nullable: true })
  async previousSeasonWeek(
    @Root() { id: seasonId, currentWeekNumber }: Season
  ): Promise<SeasonWeek | undefined> {
    if (!currentWeekNumber || currentWeekNumber === 1) {
      return;
    }

    return this._getSeasonWeek(seasonId, currentWeekNumber - 1);
  }

  private async _getSeasonWeek(seasonId: string, weekNumber: number): Promise<SeasonWeek> {
    const seasonWeek = await knex
      .select()
      .from<SeasonWeek>("season_weeks")
      .where({ seasonId, weekNumber })
      .first();

    return seasonWeek!;
  }
}

export default SeasonResolver;
