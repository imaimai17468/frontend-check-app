import { notifications, team_confirmations } from '@/db/schema';
import { createDb } from '@/lib/db';
import { eq, sql } from 'drizzle-orm';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const db = createDb(process.env.DB);
    const result = await db
      .select({
        id: notifications.id,
        title: notifications.title,
        content: notifications.content,
        created_at: notifications.created_at,
        created_by: notifications.created_by,
        status: notifications.status,
        teams: sql<
          Array<{
            id: string;
            name: string;
            slack_mention: string;
            status: 'pending' | 'confirmed';
          }>
        >`json_group_array(json_object(
          'id', ${team_confirmations.team_id},
          'status', ${team_confirmations.status}
        ))`,
      })
      .from(notifications)
      .leftJoin(team_confirmations, eq(notifications.id, team_confirmations.notification_id))
      .where(eq(notifications.id, id))
      .groupBy(notifications.id)
      .get();

    if (!result) {
      return new Response('Not Found', { status: 404 });
    }

    return Response.json(result);
  } catch (error) {
    console.error('Error fetching notification:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
