import { Knex } from "knex";

import { DbLeague } from "types";
import { leagues } from "./data/leagues";

export async function seed(knex: Knex) {
  await knex<DbLeague>("leagues").insert(leagues);
}
