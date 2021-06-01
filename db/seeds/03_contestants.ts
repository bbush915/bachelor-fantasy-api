import { Knex } from "knex";

import { Contestant } from "gql/contestant";
import { contestants } from "./data/bachelorette-season-17/contestants";

export async function seed(knex: Knex) {
  await knex.insert(contestants).into<Contestant>("contestants");
}
