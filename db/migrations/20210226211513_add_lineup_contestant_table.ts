import { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable("lineup_contestants", (tableBuilder) => {
    tableBuilder.uuid("id").primary().notNullable().defaultTo(knex.raw("gen_random_uuid()"));

    tableBuilder.timestamps(true, true);

    tableBuilder.uuid("lineup_id").notNullable().references("id").inTable("lineups");
    tableBuilder.uuid("contestant_id").notNullable().references("id").inTable("contestants");
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable("lineup_contestants");
}
