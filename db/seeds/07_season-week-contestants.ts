import { Knex } from "knex";

import seasonWeekContestants from "./data/week-1/insert-week-1-contestants";

export async function seed(knex: Knex) {
  await knex.insert(seasonWeekContestants).into("season_week_contestants");
}
