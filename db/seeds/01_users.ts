import * as Knex from "knex";

import users from "./data/users";

export function seed(knex: Knex): Promise<any> {
  return knex("users").insert(users);
}
