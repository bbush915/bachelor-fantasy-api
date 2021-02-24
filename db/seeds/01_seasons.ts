import * as Knex from "knex";

import seasons from "./data/seasons";

export async function seed(knex: Knex): Promise<any> {
  return knex("seasons").insert(seasons);
}
