import { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable("season_week_contestants", (tableBuilder) => {
    tableBuilder.uuid("id").primary().notNullable().defaultTo(knex.raw("gen_random_uuid()"));

    tableBuilder.timestamps(true, true);

    tableBuilder.uuid("season_week_id").notNullable().references("id").inTable("season_weeks");
    tableBuilder.uuid("contestant_id").notNullable().references("id").inTable("contestants");

    tableBuilder.boolean("rose");
    tableBuilder.boolean("special_rose");
    tableBuilder.boolean("group_date");
    tableBuilder.boolean("one_on_one_date");
    tableBuilder.boolean("two_on_one_date");
    tableBuilder.boolean("sent_home");
    tableBuilder.integer("score");
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable("season_week_contestants");
}
