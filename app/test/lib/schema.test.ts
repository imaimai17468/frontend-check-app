import { describe, it, expect } from 'vitest';
import {
  createNotificationSchema,
  notificationQuerySchema,
  updateTeamConfirmationSchema,
} from '@/lib/schema';

describe('createNotificationSchema', () => {
  it('正しい入力データを検証できる', () => {
    const validData = {
      title: 'テスト通知',
      content: 'テスト内容',
      teams: ['team-1', 'team-2'],
      created_by: 'テストユーザー',
    };

    const result = createNotificationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('必須フィールドが欠けている場合にエラーを返す', () => {
    const invalidData = {
      title: 'テスト通知',
      // contentが欠けている
      teams: ['team-1'],
      created_by: 'テストユーザー',
    };

    const result = createNotificationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('notificationQuerySchema', () => {
  it('有効なステータスを検証できる', () => {
    const validStatuses = ['in_progress', 'completed', 'all'];

    validStatuses.forEach((status) => {
      const result = notificationQuerySchema.safeParse({ status });
      expect(result.success).toBe(true);
    });
  });

  it('無効なステータスを拒否する', () => {
    const result = notificationQuerySchema.safeParse({ status: 'invalid' });
    expect(result.success).toBe(false);
  });
});

describe('updateTeamConfirmationSchema', () => {
  it('正しいチームIDを検証できる', () => {
    const validData = {
      team_id: 'team-1',
    };

    const result = updateTeamConfirmationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('チームIDが欠けている場合にエラーを返す', () => {
    const invalidData = {};

    const result = updateTeamConfirmationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
