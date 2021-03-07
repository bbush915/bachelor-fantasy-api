import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("leagues", (tableBuilder) => {
    tableBuilder.uuid("id").notNullable().primary().defaultTo(knex.raw("gen_random_uuid()"));

    tableBuilder.timestamps(true, true);

    tableBuilder.uuid("season_id").notNullable().references("id").inTable("seasons");
    tableBuilder.uuid("commissioner_id").notNullable().references("id").inTable("users");

    tableBuilder.string("name").notNullable();
    tableBuilder.string("description").notNullable();
    tableBuilder.string("image_url").notNullable();
    tableBuilder.boolean("is_public").notNullable();
    tableBuilder.boolean("is_shareable").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("leagues");
}
