import { Knex } from "knex";

import seasonWeeks from "./data/season-weeks";

export function seed(knex: Knex): Promise<any> {
  return knex("season_weeks").insert(seasonWeeks);
}
