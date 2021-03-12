import { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable("league_members", (tableBuilder) => {
    tableBuilder.uuid("id").primary().notNullable().defaultTo(knex.raw("gen_random_uuid()"));

    tableBuilder.timestamps(true, true);

    tableBuilder.uuid("league_id").notNullable().references("id").inTable("leagues");
    tableBuilder.uuid("user_id").notNullable().references("id").inTable("users");

    tableBuilder.boolean("is_commissioner").notNullable().defaultTo(false);
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable("league_members");
}
