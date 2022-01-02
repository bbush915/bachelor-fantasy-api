import { Arg, ID, Query, Resolver } from "type-graphql";

import knex from "lib/knex";
import { DbContestant, DbSeason } from "types";
import { Contestant } from "./schema";

@Resolver(Contestant)
class ContestantResolver {
  @Query(() => [Contestant])
  async allContestants(): Promise<DbContestant[]> {
    const activeSeason = await knex
      .select()
      .from<DbSeason>("seasons")
      .where({ isActive: true })
      .first();

    // ASSUMPTION - There will always be an active season.

    return knex.select().from<DbContestant>("contestants").where({ seasonId: activeSeason!.id });
  }

  @Query(() => [Contestant])
  async weeklyContestants(
    @Arg("seasonWeekId", () => ID) seasonWeekId: string
  ): Promise<DbContestant[]> {
    const activeSeason = await knex
      .select()
      .from<DbSeason>("seasons")
      .where({ isActive: true })
      .first();

    // ASSUMPTION - There will always be an active season.

    return knex
      .select("contestants.*")
      .from<DbContestant>("contestants")
      .join("season_week_contestants", (joinBuilder) =>
        joinBuilder
          .on("season_week_contestants.season_week_id", "=", knex.raw("?", [seasonWeekId]))
          .andOn("season_week_contestants.contestant_id", "=", "contestants.id")
      )
      .where({ seasonId: activeSeason!.id });
  }
}

export default ContestantResolver;
