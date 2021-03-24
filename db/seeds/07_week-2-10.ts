import { Knex } from "knex";

import { Season } from "gql/season";
import { SeasonWeekContestant } from "gql/season-week-contestant";
import leagues from "./data/leagues";
import { seedRandomLineups } from "./utils";

export async function seed(knex: Knex) {
  for (let weekNumber = 2; weekNumber <= Number(process.env.SEED_WEEK); weekNumber++) {
    await seedRandomLineups(knex, leagues[0].id!, weekNumber - 1);

    const { scoredSeasonWeekContestants } = require(`./data/week-${weekNumber - 1}`);

    for (const seasonWeekContestant of scoredSeasonWeekContestants as SeasonWeekContestant[]) {
      const score =
        (seasonWeekContestant.rose ? weekNumber - 1 : 0) +
        (seasonWeekContestant.specialRose ? 5 : 0) +
        (seasonWeekContestant.groupDate ? 1 : 0) +
        (seasonWeekContestant.oneOnOneDate ? 10 : 0) +
        (seasonWeekContestant.twoOnOneDate ? -5 : 0) +
        (seasonWeekContestant.sentHome ? -10 : 0);

      seasonWeekContestant.score = score;

      const { id, ...rest } = seasonWeekContestant;
      await knex<SeasonWeekContestant>("season_week_contestants").update(rest).where({ id });
    }

    if (weekNumber <= 10) {
      const { seasonWeeks, seasonWeekContestants } = require(`./data/week-${weekNumber}`);

      await knex.insert(seasonWeeks).into("season_weeks");

      for (const seasonWeekContestant of seasonWeekContestants) {
        await knex
          .insert(seasonWeekContestant)
          .into<SeasonWeekContestant>("season_week_contestants");
      }

      await knex<Season>("seasons")
        .update({ currentWeekNumber: weekNumber })
        .where({ id: leagues[0].seasonId });
    }
  }
}
