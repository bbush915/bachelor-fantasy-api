import { Knex } from "knex";

import seasons from "./data/seasons";

export async function seed(knex: Knex) {
  await knex.insert(seasons).into("seasons");
}
