import Knex from "knex";

import configuration from "../../db/knexfile";

export function camelCase(rows: any) {
  return configuration.postProcessResponse(rows);
}

export default Knex(configuration);
