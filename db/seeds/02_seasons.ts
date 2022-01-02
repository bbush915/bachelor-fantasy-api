import { Knex } from "knex";

import { DbSeason } from "types";
import { seasons } from "./data/bachelor-season-26/seasons";

export async function seed(knex: Knex) {
  await knex<DbSeason>("seasons").insert(seasons);
}
