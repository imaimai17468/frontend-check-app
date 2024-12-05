import { NextResponse } from "next/server";
import { createDb } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import { notifications, team_confirmations } from "@/db/schema";
import { desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { D1Database } from "@cloudflare/workers-types";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as "in_progress" | "completed" | "all" | null;
    const db = createDb(process.env.DB as any as D1Database);

    const query = db
      .select({
        id: notifications.id,
        title: notifications.title,
        created_at: notifications.created_at,
        created_by: notifications.created_by,
        status: notifications.status,
        progress: {
          total: sql<number>`count(distinct ${team_confirmations.team_id})`,
          confirmed: sql<number>`count(case when ${team_confirmations.status} = 'confirmed' then 1 end)`,
        },
      })
      .from(notifications)
      .leftJoin(
        team_confirmations,
        eq(notifications.id, team_confirmations.notification_id)
      )
      .groupBy(notifications.id)
      .orderBy(desc(notifications.created_at));

    if (status && status !== "all") {
      query.where(eq(notifications.status, status));
    }

    const result = await query;

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = createDb(process.env.DB as any as D1Database);
    const { title, content, teams, created_by } = await request.json();

    // バリデーション
    if (!title || !content || !teams || teams.length === 0 || !created_by) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const notificationId = uuidv4();
    const now = new Date();

    // 通知の作成
    await db.insert(notifications).values({
      id: notificationId,
      title,
      content,
      created_at: now,
      created_by,
      status: "in_progress",
    });

    // チーム確認状態の作成
    await Promise.all(
      teams.map((teamId: string) =>
        db.insert(team_confirmations).values({
          id: uuidv4(),
          notification_id: notificationId,
          team_id: teamId,
          status: "pending",
        })
      )
    );

    return NextResponse.json(
      { id: notificationId, message: "Notification created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
