import Knex from "knex";

import knexfile from "../../db/knexfile";

export function camelCase(rows: any) {
  return require("knex-stringcase")().postProcessResponse(rows);
}

export default Knex(knexfile);
