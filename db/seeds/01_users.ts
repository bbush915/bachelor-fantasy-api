import { Knex } from "knex";

import { DbUser } from "types";
import { users } from "./data/users";

export async function seed(knex: Knex) {
  await knex<DbUser>("users").insert(users);
}
