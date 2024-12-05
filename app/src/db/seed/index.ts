import type { D1Database } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';
import { teams } from '../schema';
import { teamsSeedData } from './teams';

export async function seed(db: D1Database) {
  const d1 = drizzle(db);

  console.info('🌱 Seeding teams...');
  for (const team of teamsSeedData) {
    await d1.insert(teams).values(team).run();
  }
  console.info('✅ Teams seeded successfully!');
}
