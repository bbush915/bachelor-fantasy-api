import { Knex } from "knex";

import leagues from "./data/leagues";
import { seasonWeekContestants, seasonWeeks } from "./data/week-1";
import { seedRandomLineups } from "./utils";

export async function seed(knex: Knex) {
  await knex.insert(seasonWeeks).into("season_weeks");
  await knex.insert(seasonWeekContestants).into("season_week_contestants");

  await seedRandomLineups(knex, leagues[0].id!, 1);
}
