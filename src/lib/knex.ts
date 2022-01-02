import Knex from "knex";

import dbConfiguration from "../../db/knexfile";

export function camelCase(rows: any) {
  return dbConfiguration.postProcessResponse(rows);
}

export default Knex(dbConfiguration);
