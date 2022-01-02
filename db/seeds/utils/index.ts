import { Knex } from "knex";

import { DbLineup, DbLineupContestant, DbSeasonWeek, DbSeasonWeekContestant } from "types";

export async function seedRandomLineups(knex: Knex, leagueId: string, weekNumber: number) {
  const seasonWeek = await knex
    .select()
    .from<DbSeasonWeek>("season_weeks")
    .where({ weekNumber })
    .first();

  const seasonWeekContestants = await knex
    .select()
    .from<DbSeasonWeekContestant>("season_week_contestants")
    .where({
      seasonWeekId: seasonWeek!.id,
    });

  const leagueMembers = await knex
    .select("league_members.*")
    .from("league_members")
    .join("users", "users.id", "=", "league_members.user_id")
    .where("league_members.league_id", "=", leagueId)
    .andWhere("users.set_random_lineup", "=", true);

  for (const leagueMember of leagueMembers) {
    const lineups = await knex<DbLineup>("lineups")
      .insert({ leagueMemberId: leagueMember.id, seasonWeekId: seasonWeek!.id })
      .returning("*");

    await knex<DbLineupContestant>("lineup_contestants").insert(
      shuffle(seasonWeekContestants)
        .slice(0, seasonWeek!.lineupSpotsAvailable)
        .map((seasonWeekContestant) => ({
          lineupId: lineups[0].id,
          contestantId: seasonWeekContestant.contestantId,
        }))
    );
  }
}

function shuffle(values: any[]) {
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    swap(values, i, j);
  }

  return values;
}

function swap(values: any[], i: number, j: number) {
  [values[i], values[j]] = [values[j], values[i]];
}
