import { config } from "dotenv";
import { readFileSync } from "fs";
import minimist from "minimist";
import { resolve } from "path";

config({ path: resolve(__dirname, "../.env") });

import { SeasonWeekContestant } from "../src/gql/season-week-contestant";
import knex from "../src/lib/knex";

const conversionMap: Record<string, (value: string) => boolean | null> = {
  rose: parseBoolean,
  specialRose: parseBoolean,
  groupDate: parseBoolean,
  oneOnOneDate: parseBoolean,
  twoOnOneDate: parseBoolean,
  sentHome: parseBoolean,
};

async function main() {
  const { w: weekNumber, i: inputFile } = minimist(process.argv);

  if (!weekNumber) {
    throw new Error("Missing required argument: [-w : Week number]");
  }

  if (!inputFile) {
    throw new Error("Missing required argument: [-i : Input file]");
  }

  const data = readFileSync(inputFile)
    .toString()
    .split(/\r\n|\n/g);

  const fields = data[0].split(",");

  const rows = data
    .slice(1)
    .map((x) =>
      x
        .split(",")
        .reduce(
          (acc: any, cur, idx) => (
            (acc[fields[idx]] = (conversionMap[fields[idx]] ?? ((value: string) => value))(cur)),
            acc
          ),
          {}
        )
    );

  for (const row of rows) {
    row.score =
      (row.rose ? weekNumber : 0) +
      (row.specialRose ? 5 : 0) +
      (row.groupDate ? 1 : 0) +
      (row.oneOnOneDate ? 10 : 0) +
      (row.twoOnOneDate ? -5 : 0) +
      (row.sentHome ? -10 : 0);

    const { id, contestantName, ...rest } = row;

    await knex<SeasonWeekContestant>("season_week_contestants").update(rest).where({ id });
  }
}

function parseBoolean(value: string) {
  if (!value) {
    return null;
  }

  return value.toLowerCase() === "true";
}

main()
  .then(() => console.log("Complete!"))
  .catch((error) => console.error("Failed: ", error))
  .finally(() => knex.destroy());
