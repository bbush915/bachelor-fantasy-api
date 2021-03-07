import { Knex } from "knex";

import leagueMembers from "./data/league-members";

export function seed(knex: Knex): Promise<any> {
  return knex("league_members").insert(leagueMembers);
}
