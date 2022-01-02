import { Knex } from "knex";

import { DbSeason, DbSeasonWeek, DbSeasonWeekContestant } from "types";
import {
  seasonWeekContestants as initialSeasonWeekContestants,
  seasonWeeks as initialSeasonWeeks,
} from "./data/bachelor-season-26/week-1";
import { leagues } from "./data/leagues";
import { seedRandomLineups } from "./utils";

export async function seed(knex: Knex) {
  await knex<DbSeasonWeek>("season_weeks").insert(initialSeasonWeeks);
  await knex<DbSeasonWeekContestant>("season_week_contestants").insert(
    initialSeasonWeekContestants
  );

  const seedWeekNumber = Number(process.env.SEED_WEEK_NUMBER);

  if (seedWeekNumber < 2) {
    return;
  }

  for (let weekNumber = 2; weekNumber <= seedWeekNumber; weekNumber++) {
    await seedRandomLineups(knex, leagues[0].id!, weekNumber - 1);

    const {
      scoredSeasonWeekContestants,
    }: {
      scoredSeasonWeekContestants: DbSeasonWeekContestant[];
    } = require(`./data/bachelor-season-26/week-${weekNumber - 1}`);

    for (const seasonWeekContestant of scoredSeasonWeekContestants) {
      seasonWeekContestant.score =
        (seasonWeekContestant.rose ? weekNumber - 1 : 0) +
        (seasonWeekContestant.specialRose ? 5 : 0) +
        (seasonWeekContestant.groupDate ? 1 : 0) +
        (seasonWeekContestant.oneOnOneDate ? 10 : 0) +
        (seasonWeekContestant.twoOnOneDate ? -5 : 0) +
        (seasonWeekContestant.sentHome ? -10 : 0);

      const { id, ...rest } = seasonWeekContestant;

      await knex<DbSeasonWeekContestant>("season_week_contestants").update(rest).where({ id });
    }

    if (weekNumber <= 10) {
      const {
        seasonWeeks,
        seasonWeekContestants,
      } = require(`./data/bachelor-season-26/week-${weekNumber}`);

      await knex<DbSeasonWeek>("season_weeks").insert(seasonWeeks);
      await knex<DbSeasonWeekContestant>("season_week_contestants").insert(seasonWeekContestants);

      await knex<DbSeason>("seasons")
        .update({ currentWeekNumber: weekNumber })
        .where({ id: leagues[0].seasonId });
    }
  }

  if (seedWeekNumber <= 10) {
    return;
  }

  await knex<DbSeason>("seasons").update({ isComplete: true }).where({ id: leagues[0].seasonId });
}
