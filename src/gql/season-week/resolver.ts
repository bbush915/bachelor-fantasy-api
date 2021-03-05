import { FieldResolver, Resolver, Root } from "type-graphql";

import { SeasonWeekContestant } from "gql/season-week-contestant";
import knex from "lib/knex";
import { SeasonWeek } from "./schema";

@Resolver(SeasonWeek)
class SeasonWeekResolver {
  @FieldResolver(() => [SeasonWeekContestant])
  seasonWeekContestants(@Root() { id: seasonWeekId }: SeasonWeek): Promise<SeasonWeekContestant[]> {
    return knex("season_week_contestants").where({ seasonWeekId });
  }
}

export default SeasonWeekResolver;
