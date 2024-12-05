import { z } from "zod";

// 共通の列挙型
export const NotificationStatus = z.enum(["in_progress", "completed"]);
export const TeamConfirmationStatus = z.enum(["pending", "confirmed"]);

// 通知作成のスキーマ
export const createNotificationSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  content: z.string().min(1, "内容は必須です"),
  teams: z.array(z.string().uuid()).min(1, "少なくとも1つのチームを選択してください"),
  created_by: z.string().min(1, "作成者は必須です"),
});

// 通知検索のクエリパラメータスキーマ
export const notificationQuerySchema = z.object({
  status: z.enum(["in_progress", "completed", "all"]).optional(),
});

// チーム確認更新のスキーマ
export const updateTeamConfirmationSchema = z.object({
  team_id: z.string().uuid(),
});

// 型の出力
export type NotificationStatus = z.infer<typeof NotificationStatus>;
export type TeamConfirmationStatus = z.infer<typeof TeamConfirmationStatus>;
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type NotificationQuery = z.infer<typeof notificationQuerySchema>;
export type UpdateTeamConfirmation = z.infer<typeof updateTeamConfirmationSchema>;
