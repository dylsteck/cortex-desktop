import { Kysely, PostgresDialect, SqliteDialect } from 'kysely'
import Pool from 'pg-pool'
import type { KyselyDB } from '../types/database';
import Database from 'better-sqlite3';

export const db = new Kysely<KyselyDB>({
  dialect: new SqliteDialect({
    database: async () => new Database('db/nexus.db')
  })
});