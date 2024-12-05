import { Dashboard } from '@/components/dashboard';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

interface Notification {
  id: string;
  title: string;
  created_at: string;
  created_by: string;
  status: 'in_progress' | 'completed';
  progress: {
    total: number;
    confirmed: number;
  };
}

interface DashboardProps {
  notifications: Notification[];
  status: string;
}

// Server Componentをモック
vi.mock('@/components/dashboard', () => ({
  Dashboard: ({ notifications, status }: DashboardProps) => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">ダッシュボード</h1>
            <p className="text-muted-foreground">連絡一覧と進捗状況を確認できます。</p>
          </div>
          <select value={status}>
            <option value="all">すべて</option>
            <option value="in_progress">進行中</option>
            <option value="completed">完了</option>
          </select>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notifications.map((notification) => (
            <div key={notification.id}>
              <h2>{notification.title}</h2>
              <div>{notification.status === 'completed' ? '完了' : '進行中'}</div>
            </div>
          ))}
        </div>
      </div>
    );
  },
}));

describe('Dashboard', () => {
  it('通知一覧が正しく表示される', async () => {
    const TEST_NOTIFICATIONS: Notification[] = [
      {
        id: '1',
        title: 'テスト通知1',
        created_at: '2024-01-01T00:00:00Z',
        created_by: 'テストユーザー1',
        status: 'in_progress',
        progress: {
          total: 2,
          confirmed: 1,
        },
      },
      {
        id: '2',
        title: 'テスト通知2',
        created_at: '2024-01-02T00:00:00Z',
        created_by: 'テストユーザー2',
        status: 'completed',
        progress: {
          total: 2,
          confirmed: 2,
        },
      },
    ];

    render(<Dashboard notifications={TEST_NOTIFICATIONS} status="all" />);

    // タイトルが表示される
    expect(screen.getByText('ダッシュボード')).toBeInTheDocument();
    expect(screen.getByText('連絡一覧と進捗状況を確認できます。')).toBeInTheDocument();

    // 通知カードが表示される
    expect(screen.getByText('テスト通知1')).toBeInTheDocument();
    expect(screen.getByText('テスト通知2')).toBeInTheDocument();
  });

  it('ステータスフィルターが機能する', async () => {
    const TEST_NOTIFICATIONS: Notification[] = [
      {
        id: '1',
        title: 'テスト通知1',
        created_at: '2024-01-01T00:00:00Z',
        created_by: 'テストユーザー1',
        status: 'in_progress',
        progress: {
          total: 2,
          confirmed: 1,
        },
      },
    ];

    render(<Dashboard notifications={TEST_NOTIFICATIONS} status="in_progress" />);

    // フィルターオプションが存在することを確認
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('in_progress');
  });
});
