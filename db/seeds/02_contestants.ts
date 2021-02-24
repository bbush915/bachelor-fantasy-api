import * as Knex from "knex";

import contestants from "./data/contestants";

export async function seed(knex: Knex): Promise<any> {
  return knex("contestants").insert(contestants);
}
