import { Knex } from "knex";

import { Contestant } from "gql/contestant";
import { contestants } from "./data/bachelor-season-25/contestants";

export async function seed(knex: Knex) {
  await knex.insert(contestants).into<Contestant>("contestants");
}
