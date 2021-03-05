import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("seasons", (tableBuilder) => {
    tableBuilder.uuid("id").notNullable().primary().defaultTo(knex.raw("gen_random_uuid()"));

    tableBuilder.timestamps(true, true);

    tableBuilder.integer("current_week_number").nullable();

    tableBuilder.string("series").notNullable();
    tableBuilder.integer("season_number").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("seasons");
}
