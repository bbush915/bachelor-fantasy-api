import { Arg, Query, Resolver } from "type-graphql";

import knex from "lib/knex";
import { Contestant } from "./schema";
import { Season } from "gql/season";

@Resolver(Contestant)
class ContestantResolver {
  @Query(() => [Contestant])
  async allContestants(): Promise<Contestant[]> {
    const activeSeason = await knex
      .select()
      .from<Season>("seasons")
      .where({ isActive: true })
      .first();

    return knex.select().from<Contestant>("contestants").where({ seasonId: activeSeason!.id });
  }

  @Query(() => [Contestant])
  async weeklyContestants(@Arg("seasonWeekId") seasonWeekId: string): Promise<Contestant[]> {
    const activeSeason = await knex
      .select()
      .from<Season>("seasons")
      .where({ isActive: true })
      .first();

    return knex
      .select("contestants.*")
      .from<Contestant>("contestants")
      .join("season_week_contestants", (joinBuilder) =>
        joinBuilder
          .on("season_week_contestants.season_week_id", "=", knex.raw("?", [seasonWeekId]))
          .andOn("season_week_contestants.contestant_id", "=", "contestants.id")
      )
      .where({ seasonId: activeSeason!.id });
  }
}

export default ContestantResolver;
