import { Knex } from "knex";

import { DbLeagueMember } from "types";
import { leagueMembers } from "./data/league-members";

export async function seed(knex: Knex) {
  await knex<DbLeagueMember>("league_members").insert(leagueMembers);
}
