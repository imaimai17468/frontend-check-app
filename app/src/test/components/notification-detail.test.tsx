import { NotificationDetail } from '@/components/notification-detail';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

interface TeamConfirmation {
  team_id: string;
  team_name: string;
  status: 'pending' | 'confirmed';
  confirmed_at: string | null;
}

interface NotificationDetailProps {
  notification: {
    title: string;
    content: string;
    created_by: string;
    created_at: string;
    status: 'in_progress' | 'completed';
  };
  teamConfirmations: TeamConfirmation[];
}

// Server Componentをモック
vi.mock('@/components/notification-detail', () => ({
  NotificationDetail: ({ notification, teamConfirmations }: NotificationDetailProps) => {
    const total = teamConfirmations.length;
    const confirmed = teamConfirmations.filter((team) => team.status === 'confirmed').length;
    const progressValue = (confirmed / total) * 100;

    return (
      <div className="space-y-6">
        <div>
          <h1>{notification.title}</h1>
          <div>{notification.status}</div>
        </div>
        <div>
          <div>
            {confirmed}/{total}
          </div>
          <div
            role="progressbar"
            aria-valuenow={progressValue}
            aria-valuemin={0}
            aria-valuemax={100}
            tabIndex={0}
            style={{ width: `${progressValue}%` }}
          />
        </div>
      </div>
    );
  },
}));

describe('NotificationDetail', () => {
  it('通知の詳細情報が正しく表示される', async () => {
    const notification = {
      title: 'テスト通知',
      content: 'テスト内容',
      created_by: 'テストユーザー',
      created_at: '2024-01-01T00:00:00Z',
      status: 'in_progress' as const,
    };

    const teamConfirmations = [
      {
        team_id: '1',
        team_name: 'テストチーム1',
        status: 'pending' as const,
        confirmed_at: null,
      },
      {
        team_id: '2',
        team_name: 'テストチーム2',
        status: 'confirmed' as const,
        confirmed_at: '2024-01-02T00:00:00Z',
      },
    ];

    render(
      <NotificationDetail
        notificationId="1"
        notification={notification}
        teamConfirmations={teamConfirmations}
      />,
    );

    expect(screen.getByText('テスト通知')).toBeInTheDocument();
    expect(screen.getByText('テスト内容')).toBeInTheDocument();
    expect(screen.getByText('作成者: テストユーザー')).toBeInTheDocument();
    expect(screen.getByText('進行中')).toBeInTheDocument();
  });

  it('チーム確認状況が正しく表示される', async () => {
    const notification = {
      title: 'テスト通知',
      content: 'テスト内容',
      created_by: 'テストユーザー',
      created_at: '2024-01-01T00:00:00Z',
      status: 'in_progress' as const,
    };

    const teamConfirmations = [
      {
        team_id: '1',
        team_name: 'テストチーム1',
        status: 'pending' as const,
        confirmed_at: null,
      },
      {
        team_id: '2',
        team_name: 'テストチーム2',
        status: 'confirmed' as const,
        confirmed_at: '2024-01-02T00:00:00Z',
      },
    ];

    render(
      <NotificationDetail
        notificationId="1"
        notification={notification}
        teamConfirmations={teamConfirmations}
      />,
    );

    expect(screen.getByText('チーム確認状況')).toBeInTheDocument();
    expect(screen.getByText('1/2')).toBeInTheDocument();
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle({ width: '50%' });
  });

  it('全チーム確認済みの場合、完了状態が表示される', async () => {
    const notification = {
      title: 'テスト通知',
      content: 'テスト内容',
      created_by: 'テストユーザー',
      created_at: '2024-01-01T00:00:00Z',
      status: 'completed' as const,
    };

    const teamConfirmations = [
      {
        team_id: '1',
        team_name: 'テストチーム1',
        status: 'confirmed' as const,
        confirmed_at: '2024-01-02T00:00:00Z',
      },
      {
        team_id: '2',
        team_name: 'テストチーム2',
        status: 'confirmed' as const,
        confirmed_at: '2024-01-02T00:00:00Z',
      },
    ];

    render(
      <NotificationDetail
        notificationId="1"
        notification={notification}
        teamConfirmations={teamConfirmations}
      />,
    );

    expect(screen.getByText('完了')).toBeInTheDocument();
    expect(screen.getByText('2/2')).toBeInTheDocument();
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle({ width: '100%' });
  });
});
