import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NotificationCard } from '@/components/notification-card';

describe('NotificationCard', () => {
  it('通知の情報が正しく表示される', () => {
    const notification = {
      id: '1',
      title: 'テスト通知',
      created_at: '2024-01-01T00:00:00Z',
      created_by: 'テストユーザー',
      status: 'in_progress' as const,
      progress: {
        total: 2,
        confirmed: 1,
      },
    };

    render(<NotificationCard notification={notification} />);

    expect(screen.getByText('テスト通知')).toBeInTheDocument();
    expect(screen.getByText('進行中')).toBeInTheDocument();
    expect(screen.getByText('1/2')).toBeInTheDocument();
  });

  it('進捗バーが正しく表示される', () => {
    const notification = {
      id: '1',
      title: 'テスト通知',
      created_at: '2024-01-01T00:00:00Z',
      created_by: 'テストユーザー',
      status: 'in_progress' as const,
      progress: {
        total: 2,
        confirmed: 1,
      },
    };

    render(<NotificationCard notification={notification} />);

    const progressBar = screen.getByRole('progressbar').querySelector('div');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveStyle({ transform: 'translateX(-50%)' });
  });

  it('完了状態の通知が正しく表示される', () => {
    const notification = {
      id: '1',
      title: 'テスト通知',
      created_at: '2024-01-01T00:00:00Z',
      created_by: 'テストユーザー',
      status: 'completed' as const,
      progress: {
        total: 2,
        confirmed: 2,
      },
    };

    render(<NotificationCard notification={notification} />);

    expect(screen.getByText('完了')).toBeInTheDocument();
    expect(screen.getByText('2/2')).toBeInTheDocument();
    const progressBar = screen.getByRole('progressbar').querySelector('div');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveStyle({ transform: 'translateX(-0%)' });
  });
});
