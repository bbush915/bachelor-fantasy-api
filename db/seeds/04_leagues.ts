import { Knex } from "knex";

import { League } from "gql/league";
import { leagues } from "./data/leagues";

export async function seed(knex: Knex) {
  await knex.insert(leagues).into<League>("leagues");
}
