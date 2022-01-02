import { Knex } from "knex";

import { User } from "gql/user";
import { users } from "./data/users";

export async function seed(knex: Knex) {
  await knex.insert(users).into<User>("users");
}
