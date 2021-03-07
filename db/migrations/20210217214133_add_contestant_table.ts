import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("contestants", (tableBuilder) => {
    tableBuilder.uuid("id").notNullable().primary().defaultTo(knex.raw("gen_random_uuid()"));

    tableBuilder.timestamps(true, true);

    tableBuilder.uuid("season_id").notNullable().references("id").inTable("seasons");

    tableBuilder.string("name").notNullable();
    tableBuilder.string("image_url").notNullable();
    tableBuilder.integer("age").notNullable();
    tableBuilder.string("occupation").notNullable();
    tableBuilder.string("hometown").notNullable();
    tableBuilder.text("bio").notNullable();
    tableBuilder.jsonb("trivia").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("contestants");
}
