import { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("season_weeks", (tableBuilder) => {
    tableBuilder.uuid("id").primary().notNullable().defaultTo(knex.raw("gen_random_uuid()"));

    tableBuilder.timestamps(true, true);

    tableBuilder.uuid("season_id").notNullable().references("id").inTable("seasons");

    tableBuilder.integer("week_number").notNullable();
    tableBuilder.dateTime("episode_air_date").notNullable();
    tableBuilder.integer("lineup_spots_available").notNullable();
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable("season_weeks");
}
