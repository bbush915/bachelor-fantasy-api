import { Knex } from "knex";

import { Season } from "gql/season";
import { SeasonWeekContestant } from "gql/season-week-contestant";
import leagues from "./data/leagues";
import { seasonWeekContestants, seasonWeeks } from "./data/week-2";
import { seedRandomLineups } from "./utils";

export async function seed(knex: Knex) {
  if (Number(process.env.SEED_WEEK) < 2) {
    return;
  }

  // Set random lineups for previous week.
  await seedRandomLineups(knex, leagues[0].id, 1);

  // Create new week.
  await knex.insert(seasonWeeks).into("season_weeks");

  // Score previous week contestants and insert new week contestants.
  for (const seasonWeekContestant of seasonWeekContestants) {
    const dbSeasonWeekContestant = await knex
      .select()
      .from<SeasonWeekContestant>("season_week_contestants")
      .where({ id: seasonWeekContestant.id })
      .first();

    if (dbSeasonWeekContestant) {
      const { id, ...rest } = seasonWeekContestant;
      await knex<SeasonWeekContestant>("season_week_contestants").update(rest).where({ id });
    } else {
      await knex.insert(seasonWeekContestant).into<SeasonWeekContestant>("season_week_contestants");
    }
  }

  // Update current week.
  await knex<Season>("seasons").update({ currentWeekNumber: 2 }).where({ id: leagues[0].seasonId });
}
