import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('weeks', (tableBuilder) => {
    tableBuilder
      .uuid('id')
      .notNullable()
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    tableBuilder.timestamps(true, true);

    tableBuilder
      .uuid('season_id')
      .notNullable()
      .references('id')
      .inTable('seasons');

    tableBuilder.integer('week_number').notNullable();
    tableBuilder.dateTime('episode_air_date').notNullable();
    tableBuilder.integer('number_of_spots').notNullable();
    tableBuilder.boolean('is_active').notNullable();
    tableBuilder.boolean('is_scored').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('weeks');
}
