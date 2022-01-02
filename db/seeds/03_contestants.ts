import { Knex } from "knex";

import { DbContestant } from "types";
import { contestants } from "./data/bachelor-season-26/contestants";

export async function seed(knex: Knex) {
  await knex<DbContestant>("contestants").insert(contestants);
}
