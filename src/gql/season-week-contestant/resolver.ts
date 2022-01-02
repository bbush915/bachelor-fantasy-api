import {
  Arg,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";

import { Contestant } from "gql/contestant";
import knex from "lib/knex";
import { authentication, authorization } from "middleware";
import { DbContestant, DbSeasonWeek, DbSeasonWeekContestant } from "types";
import { ScoreSeasonWeekContestantsInput, SeasonWeekContestant } from "./schema";

@Resolver(SeasonWeekContestant)
class SeasonWeekContestantResolver {
  @Query(() => [SeasonWeekContestant])
  seasonWeekContestants(
    @Arg("seasonWeekId", () => ID) seasonWeekId: string
  ): Promise<DbSeasonWeekContestant[]> {
    return knex
      .select()
      .from<DbSeasonWeekContestant>("season_week_contestants")
      .where({ seasonWeekId });
  }

  @FieldResolver(() => Contestant)
  async contestant(@Root() { contestantId }: SeasonWeekContestant): Promise<DbContestant> {
    const contestant = await knex
      .select()
      .from<DbContestant>("contestants")
      .where({ id: contestantId })
      .first();

    return contestant!;
  }

  @Mutation(() => [SeasonWeekContestant])
  @UseMiddleware(authentication, authorization(["admin"]))
  async scoreSeasonWeekContestants(
    @Arg("input") { scores }: ScoreSeasonWeekContestantsInput
  ): Promise<DbSeasonWeekContestant[]> {
    const seasonWeeks = await knex
      .select()
      .from<DbSeasonWeek>("season_weeks")
      .whereIn("id", [...new Set(scores.map((x) => x.seasonWeekId)).values()]);

    const seasonWeekContestants: DbSeasonWeekContestant[] = [];

    for (const { id, seasonWeekId, ...rest } of scores) {
      const seasonWeek = seasonWeeks.find((x) => x.id === seasonWeekId);

      const score =
        (rest.rose ? seasonWeek!.weekNumber : 0) +
        (rest.specialRose ? 5 : 0) +
        (rest.groupDate ? 1 : 0) +
        (rest.oneOnOneDate ? 10 : 0) +
        (rest.twoOnOneDate ? -5 : 0) +
        (rest.sentHome ? -10 : 0);

      const seasonWeekContestant = (
        await knex<DbSeasonWeekContestant>("season_week_contestants")
          .update({ ...rest, score })
          .where({ id })
          .returning("*")
      )[0];

      seasonWeekContestants.push(seasonWeekContestant);
    }

    return seasonWeekContestants;
  }
}

export default SeasonWeekContestantResolver;
