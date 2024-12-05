import { NextResponse } from "next/server";
import { createDb } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { notifications, team_confirmations } from "@/db/schema";
import { sql } from "drizzle-orm";
import { D1Database } from "@cloudflare/workers-types";
import { updateTeamConfirmationSchema } from "@/lib/schema";

export const runtime = "edge";

export async function POST(
  request: Request,
  { params }: { params: { notificationId: string } }
) {
  try {
    const body = await request.json();
    const validationResult = updateTeamConfirmationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { team_id } = validationResult.data;
    const db = createDb(process.env.DB as any as D1Database);
    const now = new Date();

    // チーム確認状態を更新
    await db
      .update(team_confirmations)
      .set({
        status: "confirmed",
        confirmed_at: now,
      })
      .where(
        and(
          eq(team_confirmations.notification_id, params.notificationId),
          eq(team_confirmations.team_id, team_id)
        )
      );

    // 全チームが確認済みかチェック
    const [{ count }] = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(team_confirmations)
      .where(
        and(
          eq(team_confirmations.notification_id, params.notificationId),
          eq(team_confirmations.status, "pending")
        )
      );

    // 全チームが確認済みの場合、通知のステータスを更新
    if (count === 0) {
      await db
        .update(notifications)
        .set({ status: "completed" })
        .where(eq(notifications.id, params.notificationId));

      return NextResponse.json({
        message: "Confirmation updated and notification completed",
        confirmed_at: now,
        notification_completed: true,
      });
    }

    return NextResponse.json({
      message: "Confirmation updated",
      confirmed_at: now,
      notification_completed: false,
    });
  } catch (error) {
    console.error("Error updating confirmation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
