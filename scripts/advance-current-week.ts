import { config } from "dotenv";
import { SeasonWeek } from "gql/season-week";
import minimist from "minimist";
import { resolve } from "path";

config({ path: resolve(__dirname, "../.env") });

import { Season } from "../src/gql/season";
import { SeasonWeekContestant } from "../src/gql/season-week-contestant";
import knex from "../src/lib/knex";

const lineupSpotsMap = [
  18, // Week 2
  15, // Week 3
  15, // Week 4
  11, // Week 5
  8, // Week 6
  4, // Week 7
  3, // Week 8
  2, // Week 9
  1, // Week 10
];

async function main() {
  const { d: episodeAirDate, c: shouldComplete } = minimist(process.argv);

  if (!episodeAirDate) {
    throw new Error("Missing required argument: [-d : Episode air date]");
  }

  const activeSeason = await knex
    .select()
    .from<Season>("seasons")
    .where({ isActive: true })
    .first();

  if (shouldComplete) {
    await knex<Season>("seasons").update({ isComplete: true }).where({ id: activeSeason!.id });
    return;
  }

  // Create new week.

  const seasonWeek = (
    await knex<SeasonWeek>("season_weeks")
      .insert({
        seasonId: activeSeason!.id,
        weekNumber: activeSeason!.currentWeekNumber + 1,
        episodeAirDate,
        lineupSpotsAvailable: lineupSpotsMap[activeSeason!.currentWeekNumber - 1],
      })
      .returning("*")
  )[0];

  // Insert new week contestants.

  const { rows: contestantIds } = await knex.raw(
    `
      SELECT
        SWC.contestant_id
      FROM
        season_week_contestants SWC
        JOIN season_weeks SW ON (SW.id = SWC.season_week_id)
      WHERE
        1 = 1
        AND (SW.week_number = ?)
        AND (
          ((SWC.rose IS NULL) OR (SWC.rose = TRUE)) OR
          ((SWC.special_rose IS NULL) OR (SWC.special_rose = TRUE))
        )
        AND ((SWC.sent_home IS NULL) OR (SWC.sent_home = TRUE))
    `,
    [activeSeason!.currentWeekNumber]
  );

  const seasonWeekContestants = contestantIds.map((x: any) => ({
    seasonWeekId: seasonWeek.id,
    contestantId: x.contestant_id,
  }));

  await knex<SeasonWeekContestant>("season_week_contestants").insert(seasonWeekContestants);

  // Update current week.

  await knex<Season>("seasons")
    .update({ currentWeekNumber: activeSeason!.currentWeekNumber + 1 })
    .where({ id: activeSeason!.id });
}

main()
  .then(() => console.log("Complete!"))
  .catch((error) => console.error("Failed: ", error))
  .finally(() => knex.destroy());
