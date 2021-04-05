import { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable("seasons", (tableBuilder) => {
    tableBuilder.uuid("id").primary().notNullable().defaultTo(knex.raw("gen_random_uuid()"));

    tableBuilder.timestamps(true, true);

    tableBuilder.integer("current_week_number").notNullable().defaultTo(1);
    tableBuilder.text("series_name").notNullable();
    tableBuilder.integer("season_number").notNullable();
    tableBuilder.boolean("is_active").notNullable().defaultTo(false);
    tableBuilder.boolean("is_complete").notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("seasons");
}
