import { http } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { vi } from 'vitest';

// Next.js Router のモック
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// useToast のモック
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// グローバルなMSWサーバーの設定
export const server = setupServer();

beforeAll(() => {
  // テスト開始前にMSWサーバーを起動
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  // 各テスト後にハンドラーをリセット
  server.resetHandlers();
  cleanup();
});

afterAll(() => {
  // すべてのテスト終了後にサーバーをクローズ
  server.close();
});
