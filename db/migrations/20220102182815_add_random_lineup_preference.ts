import { Knex } from "knex";

export function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("users", (tableBuilder) => {
    tableBuilder.boolean("set_random_lineup").notNullable().defaultTo(false);
  });
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("users", (tableBuilder) => {
    tableBuilder.dropColumn("set_random_lineup");
  });
}
