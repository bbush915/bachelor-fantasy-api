import { Knex } from "knex";

import seasonWeeks from "./data/season-weeks";

export async function seed(knex: Knex) {
  await knex.insert(seasonWeeks).into("season_weeks");
}
