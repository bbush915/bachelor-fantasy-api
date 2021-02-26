import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('lineup_contestants', (tableBuilder) => {
    tableBuilder
      .uuid('id')
      .notNullable()
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    tableBuilder.timestamps(true, true);

    tableBuilder
      .uuid('lineup_id')
      .notNullable()
      .references('id')
      .inTable('lineups');

    tableBuilder
      .uuid('contestant_id')
      .notNullable()
      .references('id')
      .inTable('contestants');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('lineup_contestants');
}
