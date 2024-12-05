import '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll } from 'vitest';

// MSWのハンドラー定義
const handlers = [
  http.get('/api/notifications', () => {
    return HttpResponse.json([
      {
        id: '1',
        title: 'テスト通知',
        content: 'テスト内容',
        created_at: new Date().toISOString(),
        created_by: 'テストユーザー',
        status: 'in_progress',
        progress: {
          total: 5,
          confirmed: 2,
        },
      },
    ]);
  }),
];

const server = setupServer(...handlers);

// テスト環境のセットアップ
beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
