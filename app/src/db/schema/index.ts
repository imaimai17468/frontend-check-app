import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
  created_by: text('created_by').notNull(),
  status: text('status', { enum: ['in_progress', 'completed'] })
    .notNull()
    .default('in_progress'),
});

export const teams = sqliteTable('teams', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slack_mention: text('slack_mention').notNull(),
});

export const team_confirmations = sqliteTable('team_confirmations', {
  id: text('id').primaryKey(),
  notification_id: text('notification_id')
    .notNull()
    .references(() => notifications.id),
  team_id: text('team_id')
    .notNull()
    .references(() => teams.id),
  status: text('status', { enum: ['pending', 'confirmed'] })
    .notNull()
    .default('pending'),
  confirmed_at: integer('confirmed_at', { mode: 'timestamp' }),
});
