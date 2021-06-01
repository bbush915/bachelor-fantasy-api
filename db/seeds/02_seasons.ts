import { Knex } from "knex";

import { Season } from "gql/season";
import { seasons } from "./data/bachelorette-season-17/seasons";

export async function seed(knex: Knex) {
  await knex.insert(seasons).into<Season>("seasons");
}
