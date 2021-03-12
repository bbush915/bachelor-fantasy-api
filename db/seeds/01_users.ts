import { Knex } from "knex";

import users from "./data/users";

export async function seed(knex: Knex) {
  await knex.insert(users).into("users");
}
