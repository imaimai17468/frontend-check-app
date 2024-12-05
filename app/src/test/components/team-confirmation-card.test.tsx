import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TeamConfirmationCard } from '@/components/team-confirmation-card';

const TEST_TEAM_CONFIRMATION = {
  team_id: 'test-team-id',
  team_name: 'テストチーム',
  status: 'pending' as const,
  confirmed_at: null,
};

describe('TeamConfirmationCard', () => {
  it('チーム確認情報が正しく表示される', () => {
    render(
      <TeamConfirmationCard
        notificationId="test-notification-id"
        teamConfirmation={TEST_TEAM_CONFIRMATION}
      />
    );

    // チーム名が表示される
    expect(screen.getByText('テストチーム')).toBeInTheDocument();

    // 未確認状態のバッジが表示される
    expect(screen.getByText('未確認')).toBeInTheDocument();

    // 確認ボタンが表示される
    expect(screen.getByRole('button', { name: '確認する' })).toBeInTheDocument();
  });

  it('確認済み状態が正しく表示される', () => {
    const confirmedTeam = {
      ...TEST_TEAM_CONFIRMATION,
      status: 'confirmed' as const,
      confirmed_at: '2024-01-01T00:00:00.000Z',
    };

    render(
      <TeamConfirmationCard
        notificationId="test-notification-id"
        teamConfirmation={confirmedTeam}
      />
    );

    // 確認済みバッジが表示される
    expect(screen.getByText('確認済み')).toBeInTheDocument();

    // 確認日時が表示される
    expect(screen.getByText('確認日時: 2024/1/1 09:00')).toBeInTheDocument();
  });
});
