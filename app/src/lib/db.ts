import * as schema from '@/db/schema';
import type { D1Database } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';

export function createDb(db: unknown) {
  if (!db) {
    throw new Error('Database is not initialized');
  }
  return drizzle(db as D1Database, { schema });
}

export function getD1Database(db: unknown): D1Database {
  if (!db) {
    throw new Error('Database is not initialized');
  }
  return db as D1Database;
}
