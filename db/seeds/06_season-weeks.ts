import { Knex } from "knex";

import seasonWeeks from "./data/week-1/season-weeks";

export async function seed(knex: Knex) {
  await knex.insert(seasonWeeks).into("season_weeks");
}
