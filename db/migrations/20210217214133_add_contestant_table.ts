import { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable("contestants", (tableBuilder) => {
    tableBuilder.uuid("id").primary().notNullable().defaultTo(knex.raw("gen_random_uuid()"));

    tableBuilder.timestamps(true, true);

    tableBuilder.uuid("season_id").notNullable().references("id").inTable("seasons");

    tableBuilder.text("name").notNullable();
    tableBuilder.text("headshot_url").notNullable();
    tableBuilder.integer("age").notNullable();
    tableBuilder.text("occupation").notNullable();
    tableBuilder.text("hometown").notNullable();
    tableBuilder.text("bio").notNullable();
    tableBuilder.jsonb("trivia").notNullable();
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable("contestants");
}
