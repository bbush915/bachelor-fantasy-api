import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('league_members', (tableBuilder) => {
    tableBuilder
      .uuid('id')
      .notNullable()
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    tableBuilder.timestamps(true, true);

    tableBuilder
      .uuid('league_id')
      .notNullable()
      .references('id')
      .inTable('leagues');

    tableBuilder
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users');

    tableBuilder.integer('total_score');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('league_members');
}
