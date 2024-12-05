import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { CreateNotificationForm } from '@/components/create-notification-form';
import userEvent from '@testing-library/user-event';

const TEST_TEAMS = [
  { id: 'team-1', name: 'テストチーム1', slack_mention: '@team1' },
  { id: 'team-2', name: 'テストチーム2', slack_mention: '@team2' },
];

// Next.js Router のモック
const mockRouter = {
  push: vi.fn(),
  refresh: vi.fn(),
};

// fetchのモック
const mockFetch = vi.fn();
global.fetch = mockFetch;

// useToastのモック
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

describe('CreateNotificationForm', () => {
  beforeEach(() => {
    mockRouter.push.mockClear();
    mockFetch.mockClear();
    vi.clearAllMocks();
  });

  it('フォームの入力が正しく機能する', async () => {
    render(<CreateNotificationForm teams={TEST_TEAMS} />);
    const user = userEvent.setup();

    // タイトルを入力
    const titleInput = screen.getByLabelText('タイトル');
    await user.type(titleInput, 'テスト通知');
    expect(titleInput).toHaveValue('テスト通知');

    // 内容を入力
    const contentInput = screen.getByLabelText('連絡内容');
    await user.type(contentInput, 'テスト内容');
    expect(contentInput).toHaveValue('テスト内容');
  });

  it('必須項目が未入力の場合にエラーが表示される', async () => {
    render(<CreateNotificationForm teams={TEST_TEAMS} />);
    const user = userEvent.setup();

    // 送信ボタンをクリック
    const submitButton = screen.getByRole('button', { name: '作成' });
    await user.click(submitButton);

    // エラーメッセージが表示される
    expect(await screen.findByText('タイトルは必須です')).toBeInTheDocument();
    expect(await screen.findByText('内容は必須です')).toBeInTheDocument();
  });

  it('正しい入力で送信が成功する', async () => {
    // fetchのレスポンスをモック
    const notificationResponse = { id: 'test-id' };
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(notificationResponse),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

    render(<CreateNotificationForm teams={TEST_TEAMS} />);
    const user = userEvent.setup();

    // フォームに入力
    await act(async () => {
      await user.type(screen.getByLabelText('タイトル'), 'テスト通知');
      await user.type(screen.getByLabelText('連絡内容'), 'テスト内容');

      // チームを選択
      const checkbox = screen.getByLabelText('テストチーム1');
      await user.click(checkbox);

      // フォームを送信
      const submitButton = screen.getByRole('button', { name: '作成' });
      await user.click(submitButton);
    });

    // APIが呼び出されたことを確認
    await waitFor(
      () => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(mockFetch).toHaveBeenNthCalledWith(1, '/api/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: 'テスト通知',
            content: 'テスト内容',
            teams: ['team-1'],
            created_by: '@imaimai',
          }),
        });
        expect(mockFetch).toHaveBeenNthCalledWith(2, '/api/slack/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            notification_id: 'test-id',
          }),
        });
        expect(mockRouter.push).toHaveBeenCalledWith('/');
      },
      { timeout: 3000 },
    );
  });
});
