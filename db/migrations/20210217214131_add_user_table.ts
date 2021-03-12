import { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable("users", (tableBuilder) => {
    tableBuilder.uuid("id").primary().notNullable().defaultTo(knex.raw("gen_random_uuid()"));

    tableBuilder.timestamps(true, true);

    tableBuilder.text("email").notNullable();
    tableBuilder.text("hashed_password").notNullable();
    tableBuilder.boolean("verified_email").notNullable().defaultTo(false);
    tableBuilder.text("avatar_url").nullable();
    tableBuilder.text("display_name").notNullable();
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable("users");
}
