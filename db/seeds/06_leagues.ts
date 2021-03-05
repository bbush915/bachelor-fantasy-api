import * as Knex from "knex";

import leagues from "./data/leagues";

export function seed(knex: Knex): Promise<any> {
  return knex("leagues").insert(leagues);
}
