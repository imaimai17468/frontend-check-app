import { NextResponse } from 'next/server';
import { createDb } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { notifications, teams, team_confirmations } from '@/db/schema';
import { D1Database } from '@cloudflare/workers-types';
import { createSlackClient } from '@/lib/slack';
import { z } from 'zod';

export const runtime = 'edge';

const sendNotificationSchema = z.object({
  notification_id: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validationResult = sendNotificationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { notification_id } = validationResult.data;
    const db = createDb(process.env.DB as any as D1Database);

    // 通知情報の取得
    const [notification] = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, notification_id));

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    // チーム情報の取得
    const targetTeams = await db
      .select({
        team_id: teams.id,
        slack_mention: teams.slack_mention,
      })
      .from(team_confirmations)
      .leftJoin(teams, eq(team_confirmations.team_id, teams.id))
      .where(eq(team_confirmations.notification_id, notification_id));

    const validTeams = targetTeams.filter(
      (team): team is { team_id: string; slack_mention: string } =>
        team.team_id !== null && team.slack_mention !== null
    );

    const slackClient = createSlackClient();

    // Slack通知の送信
    const results = await slackClient.sendNotificationToTeams({
      teams: validTeams,
      text: `新しい連絡があります: ${notification.title}`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🔔 新しい連絡',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${notification.title}*\n\n${notification.content}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `作成者: ${notification.created_by}\n作成日時: ${new Date(
              notification.created_at
            ).toLocaleString('ja-JP')}`,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '確認する',
              },
              url: `${process.env.NEXT_PUBLIC_APP_URL}/notifications/${notification.id}`,
              style: 'primary',
            },
          ],
        },
      ],
    });

    return NextResponse.json({
      message: 'Notifications sent successfully',
      results,
    });
  } catch (error) {
    console.error('Error sending Slack notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
