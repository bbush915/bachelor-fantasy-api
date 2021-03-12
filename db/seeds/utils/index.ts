import { Knex } from "knex";

import { LeagueMember } from "gql/league-member";
import { SeasonWeek } from "gql/season-week";
import { SeasonWeekContestant } from "gql/season-week-contestant";

export async function seedRandomLineups(knex: Knex, leagueId: string, weekNumber: number) {
  const seasonWeek = await knex
    .select()
    .from<SeasonWeek>("season_weeks")
    .where({ weekNumber })
    .first();

  const seasonWeekContestants = await knex
    .select()
    .from<SeasonWeekContestant>("season_week_contestants")
    .where({
      seasonWeekId: seasonWeek!.id,
    });

  const leagueMembers = await knex
    .select()
    .from<LeagueMember>("league_members")
    .where({ leagueId });

  for (const leagueMember of leagueMembers) {
    const lineups = await knex
      .insert({ leagueMemberId: leagueMember.id, seasonWeekId: seasonWeek!.id })
      .into("lineups")
      .returning("*");

    await knex
      .insert(
        shuffle(seasonWeekContestants)
          .slice(0, seasonWeek!.lineupSpotsAvailable)
          .map((seasonWeekContestant) => ({
            lineupId: lineups[0].id,
            contestantId: seasonWeekContestant.contestantId,
          }))
      )
      .into("lineup_contestants");
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
  var temp = values[i];
  values[i] = values[j];
  values[j] = temp;
}
