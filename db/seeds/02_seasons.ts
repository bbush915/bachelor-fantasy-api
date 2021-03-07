import { Knex } from "knex";

import seasons from "./data/seasons";

export function seed(knex: Knex): Promise<any> {
  return knex("seasons").insert(seasons);
}
