import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('lineups', (tableBuilder) => {
    tableBuilder
      .uuid('id')
      .notNullable()
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    tableBuilder.timestamps(true, true);

    tableBuilder
      .uuid('league_member_id')
      .notNullable()
      .references('id')
      .inTable('league_members');

    tableBuilder
      .uuid('week_id')
      .notNullable()
      .references('id')
      .inTable('weeks');

    tableBuilder.integer('weekly_score');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('lineups');
}
