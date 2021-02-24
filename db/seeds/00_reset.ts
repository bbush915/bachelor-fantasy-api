import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
  const { rows: tables } = await knex.raw(
    `
			SELECT
				tablename 
			FROM 
				pg_tables 
			WHERE 
				1 = 1
				AND (schemaname='public')
				AND (tablename NOT IN (?))
		`,
    [["knex_migrations", "knex_migrations_lock"]]
  );

  if (tables.length === 0) {
    return;
  }

  await knex.raw(`TRUNCATE ${tables.map((x: any) => x.tablename).join(",")} CASCADE`);
}
