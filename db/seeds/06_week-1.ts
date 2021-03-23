import { Knex } from "knex";

import leagues from "./data/leagues";
import seasonWeeks from "./data/week-1/season-weeks";
import seasonWeekContestants from "./data/week-1/insert-week-1-contestants";
import { seedRandomLineups } from "./utils";

export async function seed(knex: Knex) {
  await knex.insert(seasonWeeks).into("season_weeks");

  await knex.insert(seasonWeekContestants).into("season_week_contestants");

  // Set random lineups for previous week.
  await seedRandomLineups(knex, leagues[0].id, 1);
}
