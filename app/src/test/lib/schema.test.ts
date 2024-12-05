import {
  createNotificationSchema,
  notificationQuerySchema,
  updateTeamConfirmationSchema,
} from '@/lib/schema';
import { describe, expect, it } from 'vitest';

const TEST_UUID = '123e4567-e89b-12d3-a456-426614174000';
const TEST_UUID2 = '987fcdeb-51a2-43d1-9876-543210987000';

describe('createNotificationSchema', () => {
  it('正しい入力データを検証できる', () => {
    const validData = {
      title: 'テスト通知',
      content: 'テスト内容',
      teams: [TEST_UUID, TEST_UUID2],
      created_by: 'テストユーザー',
    };

    const result = createNotificationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('必須フィールドが欠けている場合にエラーを返す', () => {
    const invalidData = {
      title: 'テスト通知',
      // contentが欠けている
      teams: [TEST_UUID],
      created_by: 'テストユーザー',
    };

    const result = createNotificationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('notificationQuerySchema', () => {
  it('有効なステータスを検証できる', () => {
    const validStatuses = ['in_progress', 'completed', 'all'];

    for (const status of validStatuses) {
      const result = notificationQuerySchema.safeParse({ status });
      expect(result.success).toBe(true);
    }
  });

  it('無効なステータスを拒否する', () => {
    const result = notificationQuerySchema.safeParse({ status: 'invalid' });
    expect(result.success).toBe(false);
  });
});

describe('updateTeamConfirmationSchema', () => {
  it('正しいチームIDを検証できる', () => {
    const validData = {
      team_id: TEST_UUID,
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
