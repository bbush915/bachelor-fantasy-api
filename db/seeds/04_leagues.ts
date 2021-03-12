import { Knex } from "knex";

import leagues from "./data/leagues";

export async function seed(knex: Knex) {
  await knex.insert(leagues).into("leagues");
}
