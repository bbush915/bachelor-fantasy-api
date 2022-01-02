import { Knex } from "knex";

import { Season } from "gql/season";
import { SeasonWeek } from "gql/season-week";
import { SeasonWeekContestant } from "gql/season-week-contestant";
import {
  seasonWeekContestants as initialSeasonWeekContestants,
  seasonWeeks as initialSeasonWeeks,
} from "./data/bachelor-season-25/week-1";
import { leagues } from "./data/leagues";
import { seedRandomLineups } from "./utils";

export async function seed(knex: Knex) {
  await knex.insert(initialSeasonWeeks).into<SeasonWeek>("season_weeks");
  await knex
    .insert(initialSeasonWeekContestants)
    .into<SeasonWeekContestant>("season_week_contestants");

  const seedWeekNumber = Number(process.env.SEED_WEEK_NUMBER);

  if (seedWeekNumber < 2) {
    return;
  }

  for (let weekNumber = 2; weekNumber <= seedWeekNumber; weekNumber++) {
    await seedRandomLineups(knex, leagues[0].id!, weekNumber - 1);

    const {
      scoredSeasonWeekContestants,
    }: { scoredSeasonWeekContestants: SeasonWeekContestant[] } = require(`./data/week-${
      weekNumber - 1
    }`);

    for (const seasonWeekContestant of scoredSeasonWeekContestants) {
      seasonWeekContestant.score =
        (seasonWeekContestant.rose ? weekNumber - 1 : 0) +
        (seasonWeekContestant.specialRose ? 5 : 0) +
        (seasonWeekContestant.groupDate ? 1 : 0) +
        (seasonWeekContestant.oneOnOneDate ? 10 : 0) +
        (seasonWeekContestant.twoOnOneDate ? -5 : 0) +
        (seasonWeekContestant.sentHome ? -10 : 0);

      const { id, ...rest } = seasonWeekContestant;

      await knex<SeasonWeekContestant>("season_week_contestants").update(rest).where({ id });
    }

    if (weekNumber <= 10) {
      const { seasonWeeks, seasonWeekContestants } = require(`./data/week-${weekNumber}`);

      await knex.insert(seasonWeeks).into<SeasonWeek>("season_weeks");
      await knex
        .insert(seasonWeekContestants)
        .into<SeasonWeekContestant>("season_week_contestants");

      await knex<Season>("seasons")
        .update({ currentWeekNumber: weekNumber })
        .where({ id: leagues[0].seasonId });
    }
  }

  if (seedWeekNumber <= 10) {
    return;
  }

  await knex<Season>("seasons").update({ isComplete: true }).where({ id: leagues[0].seasonId });
}
