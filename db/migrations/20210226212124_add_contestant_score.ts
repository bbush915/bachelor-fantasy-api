import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('contestant_scores', (tableBuilder) => {
    tableBuilder
      .uuid('id')
      .notNullable()
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    tableBuilder.timestamps(true, true);

    tableBuilder
      .uuid('contestant_id')
      .notNullable()
      .references('id')
      .inTable('contestants');

    tableBuilder
      .uuid('week_id')
      .notNullable()
      .references('id')
      .inTable('weeks');

    tableBuilder.boolean('rose');
    tableBuilder.boolean('special_rose');
    tableBuilder.boolean('group_date');
    tableBuilder.boolean('one_on_one_date');
    tableBuilder.boolean('two_on_one_date');
    tableBuilder.boolean('sent_home');

    tableBuilder.integer('score');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('contestant_scores');
}
