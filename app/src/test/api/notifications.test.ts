import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../setup';

// モックデータ
const TEST_NOTIFICATION = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  title: 'テスト通知',
  content: 'テスト内容',
  created_at: '2024-01-01T00:00:00.000Z',
  created_by: 'テストユーザー',
  status: 'in_progress' as const,
  progress: {
    total: 5,
    confirmed: 2,
  },
};

describe('Notifications API', () => {
  beforeEach(() => {
    // 各テストの前にハンドラーを設定
    server.use(
      http.get('/api/notifications', () => {
        return HttpResponse.json([TEST_NOTIFICATION]);
      }),

      http.get('/api/notifications/:id', ({ params }) => {
        const { id } = params;
        if (id === TEST_NOTIFICATION.id) {
          return HttpResponse.json({
            notification: TEST_NOTIFICATION,
            teamConfirmations: [
              {
                team_id: '987fcdeb-51a2-43d1-9876-543210987000',
                team_name: 'フロントエンドチーム1',
                status: 'pending',
                confirmed_at: null,
              },
            ],
          });
        }
        return new HttpResponse(null, { status: 404 });
      }),
    );
  });

  describe('GET /api/notifications', () => {
    it('通知一覧を取得できる', async () => {
      const response = await fetch('/api/notifications');
      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(1);
      expect(data[0]).toEqual(TEST_NOTIFICATION);
    });

    it('ステータスでフィルタリングできる', async () => {
      const response = await fetch('/api/notifications?status=in_progress');
      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data[0].status).toBe('in_progress');
    });
  });

  describe('GET /api/notifications/:id', () => {
    it('通知の詳細を取得できる', async () => {
      const response = await fetch(`/api/notifications/${TEST_NOTIFICATION.id}`);
      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data.notification).toEqual(TEST_NOTIFICATION);
      expect(Array.isArray(data.teamConfirmations)).toBe(true);
      expect(data.teamConfirmations.length).toBe(1);
    });

    it('存在しない通知IDの場合は404を返す', async () => {
      const response = await fetch('/api/notifications/non-existent-id');
      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
    });
  });
});
