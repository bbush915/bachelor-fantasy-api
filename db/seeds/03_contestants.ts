import { Knex } from "knex";

import contestants from "./data/contestants";

export async function seed(knex: Knex) {
  await knex.insert(contestants).into("contestants");
}
