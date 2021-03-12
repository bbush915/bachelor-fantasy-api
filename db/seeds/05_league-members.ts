import { Knex } from "knex";

import leagueMembers from "./data/league-members";

export async function seed(knex: Knex) {
  await knex.insert(leagueMembers).into("league_members");
}
