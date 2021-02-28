import * as Knex from "knex";

import weeks from "./data/weeks";

export function seed(knex: Knex): Promise<any> {
  return knex("weeks").insert(weeks);
}
