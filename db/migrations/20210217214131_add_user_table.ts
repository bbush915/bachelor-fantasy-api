import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (tableBuilder) => {
    tableBuilder.uuid("id").notNullable().primary().defaultTo(knex.raw("gen_random_uuid()"));

    tableBuilder.timestamps(true, true);

    tableBuilder.string("email").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users");
}