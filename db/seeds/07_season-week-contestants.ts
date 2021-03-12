import { Knex } from "knex";

import seasonWeekContestants from "./data/season-week-contestants";

export async function seed(knex: Knex) {
  await knex.insert(seasonWeekContestants).into("season_week_contestants");
}
