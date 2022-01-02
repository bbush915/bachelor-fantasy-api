import { Knex } from "knex";

export function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("users", (tableBuilder) => {
    tableBuilder.enum("role", ["admin", "basic_user"]).notNullable().defaultTo("basic_user");
  });
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("users", (tableBuilder) => {
    tableBuilder.dropColumn("role");
  });
}
