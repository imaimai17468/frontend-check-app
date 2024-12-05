import { notifications, team_confirmations, teams } from '@/db/schema';
import { createDb } from '@/lib/db';
import type { D1Database } from '@cloudflare/workers-types';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const db = createDb(process.env.DB);

    // 通知の基本情報を取得
    const [notification] = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, params.id));

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    // チーム確認状況を取得
    const teamConfirmations = await db
      .select({
        team_id: teams.id,
        team_name: teams.name,
        status: team_confirmations.status,
        confirmed_at: team_confirmations.confirmed_at,
      })
      .from(team_confirmations)
      .leftJoin(teams, eq(team_confirmations.team_id, teams.id))
      .where(eq(team_confirmations.notification_id, params.id));

    return NextResponse.json({
      notification,
      teamConfirmations,
    });
  } catch (error) {
    console.error('Error fetching notification details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
