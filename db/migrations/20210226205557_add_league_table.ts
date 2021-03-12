import { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable("leagues", (tableBuilder) => {
    tableBuilder.uuid("id").primary().notNullable().defaultTo(knex.raw("gen_random_uuid()"));

    tableBuilder.timestamps(true, true);

    tableBuilder.uuid("season_id").notNullable().references("id").inTable("seasons");

    tableBuilder.text("name").notNullable();
    tableBuilder.text("description").notNullable();
    tableBuilder.text("logo_url").notNullable();
    tableBuilder.boolean("is_public").notNullable();
    tableBuilder.boolean("is_shareable").notNullable();
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable("leagues");
}
