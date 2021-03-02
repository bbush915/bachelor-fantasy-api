import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("season_weeks", (tableBuilder) => {
    tableBuilder.uuid("id").notNullable().primary().defaultTo(knex.raw("gen_random_uuid()"));

    tableBuilder.timestamps(true, true);

    tableBuilder.uuid("season_id").notNullable().references("id").inTable("seasons");

    tableBuilder.integer("week_number").notNullable();
    tableBuilder.dateTime("episode_air_date").notNullable();
    tableBuilder.integer("lineup_spots_available").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("season_weeks");
}
