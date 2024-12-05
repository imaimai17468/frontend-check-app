import { drizzle } from 'drizzle-orm/d1';
import type { D1Database } from '@cloudflare/workers-types';
import { teams } from '../schema';
import { teamsSeedData } from './teams';

export async function seed(db: D1Database) {
  const d1 = drizzle(db);

  console.log('🌱 Seeding teams...');
  for (const team of teamsSeedData) {
    await d1.insert(teams).values(team).run();
  }
  console.log('✅ Teams seeded successfully!');
}
