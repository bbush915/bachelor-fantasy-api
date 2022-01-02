import { writeFileSync } from "fs";
import minimist from "minimist";

import knex, { camelCase } from "../src/lib/knex";

async function main() {
  const { w: weekNumber, o: outputFile } = minimist(process.argv);

  if (!weekNumber) {
    throw new Error("Missing required argument: [-w : Week number]");
  }

  const { rows } = await knex.raw(
    `
      SELECT
        SWC.id,
        SWC.season_week_id,
        SWC.contestant_id,
        C.name AS contestant_name,
        SWC.rose,
        SWC.special_rose,
        SWC.group_date,
        SWC.one_on_one_date,
        SWC.two_on_one_date,
        SWC.sent_home
      FROM
        season_week_contestants SWC
        JOIN season_weeks SW ON (SW.id = SWC.season_week_id)
        JOIN contestants C ON (C.id = SWC.contestant_id)
        JOIN seasons S ON (S.id = SW.season_id)
      WHERE
        1 = 1
        AND (S.is_active = TRUE)
        AND (SW.week_number = ?)
      ORDER BY
        C.name
    `,
    [weekNumber]
  );

  const file = outputFile ?? `${new Date().getTime()}_week_${weekNumber}_scores.csv`;

  const data = [];

  data.push(Object.keys(camelCase(rows)[0]).join(","));
  data.push(...rows.map((x: any) => Object.values(x).join(",")));

  writeFileSync(file, data.join("\n"));
}

main()
  .then(() => console.log("Complete!"))
  .catch((error) => console.error("Failed: ", error))
  .finally(() => knex.destroy());
