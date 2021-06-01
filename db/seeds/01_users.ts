import { Knex } from "knex";

import { User } from "gql/user";
import { users } from "./data/bachelorette-season-17/users";

export async function seed(knex: Knex) {
  await knex.insert(users).into<User>("users");
}
