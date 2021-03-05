import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("user_favorites", (tableBuilder) => {
    tableBuilder.uuid("id").notNullable().primary().defaultTo(knex.raw("gen_random_uuid()"));

    tableBuilder.timestamps(true, true);

    tableBuilder.uuid("user_id").notNullable().references("id").inTable("users");
    tableBuilder.uuid("contestant_id").notNullable().references("id").inTable("contestants");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("user_favorites");
}
