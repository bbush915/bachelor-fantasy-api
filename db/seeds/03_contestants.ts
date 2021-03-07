import { Knex } from "knex";

import contestants from "./data/contestants";

export function seed(knex: Knex): Promise<any> {
  return knex("contestants").insert(contestants);
}
