import { Knex } from "knex";

import seasonWeekContestants from "./data/season-week-contestants";

export function seed(knex: Knex): Promise<any> {
  return knex("season_week_contestants").insert(seasonWeekContestants);
}
