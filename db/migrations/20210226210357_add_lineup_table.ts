import { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable("lineups", (tableBuilder) => {
    tableBuilder.uuid("id").primary().notNullable().defaultTo(knex.raw("gen_random_uuid()"));

    tableBuilder.timestamps(true, true);

    tableBuilder.uuid("league_member_id").notNullable().references("id").inTable("league_members");
    tableBuilder.uuid("season_week_id").notNullable().references("id").inTable("season_weeks");
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable("lineups");
}
