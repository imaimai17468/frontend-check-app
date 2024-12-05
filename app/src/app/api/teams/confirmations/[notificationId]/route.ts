import { notifications, team_confirmations } from '@/db/schema';
import { createDb } from '@/lib/db';
import { and, eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export const runtime = 'edge';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ notificationId: string }> }
) {
  try {
    const { notificationId } = await params;
    const { team_id } = await request.json();
    const db = createDb(process.env.DB);

    // チーム確認状態を更新
    await db
      .update(team_confirmations)
      .set({
        status: 'confirmed',
        confirmed_at: new Date(),
      })
      .where(
        and(
          eq(team_confirmations.notification_id, notificationId),
          eq(team_confirmations.team_id, team_id),
        ),
      );

    // 全てのチームが確認済みかチェック
    const [result] = await db
      .select({
        total: sql<number>`count(distinct ${team_confirmations.team_id})`,
        confirmed: sql<number>`count(case when ${team_confirmations.status} = 'confirmed' then 1 end)`,
      })
      .from(team_confirmations)
      .where(eq(team_confirmations.notification_id, notificationId))
      .groupBy(team_confirmations.notification_id);

    // 全てのチームが確認済みの場合、通知のステータスを完了に更新
    if (result && result.total === result.confirmed) {
      await db
        .update(notifications)
        .set({ status: 'completed' })
        .where(eq(notifications.id, notificationId));
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Error updating team confirmation:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
