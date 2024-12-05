import { beforeAll, afterEach, afterAll } from "vitest";
import { setupServer } from "msw/node";
import { http } from "msw";

// グローバルなMSWサーバーの設定
export const server = setupServer();

beforeAll(() => {
  // テスト開始前にMSWサーバーを起動
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  // 各テスト後にハンドラーをリセット
  server.resetHandlers();
});

afterAll(() => {
  // すべてのテスト終了後にサーバーをクローズ
  server.close();
});
