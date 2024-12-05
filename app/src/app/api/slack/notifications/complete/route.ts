import { NextResponse } from 'next/server';
import { createDb } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { notifications } from '@/db/schema';
import { D1Database } from '@cloudflare/workers-types';
import { createSlackClient } from '@/lib/slack';
import { z } from 'zod';

export const runtime = 'edge';

const completeNotificationSchema = z.object({
  notification_id: z.string().uuid(),
  creator_mention: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validationResult = completeNotificationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validationResult.error.flatten() },
        { status: 400 },
      );
    }

    const { notification_id, creator_mention } = validationResult.data;
    const db = createDb(process.env.DB as any as D1Database);

    // 通知情報の取得
    const [notification] = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, notification_id));

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    const slackClient = createSlackClient();

    // 完了通知の送信
    const result = await slackClient.sendNotification({
      channel: creator_mention,
      text: `連絡「${notification.title}」の確認が完了しました`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '✅ 連絡確認完了',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `連絡「*${notification.title}*」の確認が完了しました。\n全てのチームからの確認が取れました。`,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '詳細を確認',
              },
              url: `${process.env.NEXT_PUBLIC_APP_URL}/notifications/${notification.id}`,
            },
          ],
        },
      ],
    });

    return NextResponse.json({
      message: 'Complete notification sent successfully',
      result,
    });
  } catch (error) {
    console.error('Error sending complete notification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
