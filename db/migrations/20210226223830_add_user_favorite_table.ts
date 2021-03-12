import { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable("user_favorites", (tableBuilder) => {
    tableBuilder.uuid("id").primary().notNullable().defaultTo(knex.raw("gen_random_uuid()"));

    tableBuilder.timestamps(true, true);

    tableBuilder.uuid("user_id").notNullable().references("id").inTable("users");
    tableBuilder.uuid("contestant_id").notNullable().references("id").inTable("contestants");
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable("user_favorites");
}
