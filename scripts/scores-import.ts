import { config } from "dotenv";
import { readFileSync } from "fs";
import minimist from "minimist";
import { resolve } from "path";

config({ path: resolve(__dirname, "../.env") });

import { SeasonWeekContestant } from "../src/gql/season-week-contestant";
import knex from "../src/lib/knex";

async function main() {
  const { weekNumber, i: inputFile } = minimist(process.argv, { alias: { w: ["weekNumber"] } });

  const data = readFileSync(inputFile).toString().split("\n");

  const fields = data[0].split(",");

  const rows = data
    .slice(1)
    .map((x) => x.split(",").reduce((acc: any, cur, idx) => ((acc[fields[idx]] = cur), acc), {}));

  for (const row of rows) {
    row.score =
      (parseBoolean(row.rose) ? weekNumber - 1 : 0) +
      (parseBoolean(row.specialRose) ? 5 : 0) +
      (parseBoolean(row.groupDate) ? 1 : 0) +
      (parseBoolean(row.oneOnOneDate) ? 10 : 0) +
      (parseBoolean(row.twoOnOneDate) ? -5 : 0) +
      (parseBoolean(row.sentHome) ? -10 : 0);

    const { id, contestantName, ...rest } = row;

    await knex<SeasonWeekContestant>("season_week_contestants").update(rest).where({ id });
  }
}

function parseBoolean(value: string) {
  return ["1", "t", "true"].includes(value.toLocaleLowerCase());
}

main()
  .then(() => console.log("Complete!"))
  .catch((error) => console.error("Failed: ", error))
  .finally(() => knex.destroy());
