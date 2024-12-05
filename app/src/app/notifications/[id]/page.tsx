import { MainLayout } from '@/components/layout/main-layout';
import { TeamConfirmationCard } from '@/components/team-confirmation-card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/utils';

export const runtime = 'edge';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function NotificationDetailPage({ params }: PageProps) {
  // 連絡詳細を取得
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/${params.id}`
  );

  if (!response.ok) {
    throw new Error('連絡の取得に失敗しました');
  }

  const { notification, teamConfirmations } = await response.json();

  // 確認状況の集計
  const total = teamConfirmations.length;
  const confirmed = teamConfirmations.filter(
    (team: any) => team.status === 'confirmed'
  ).length;
  const progressValue = (confirmed / total) * 100;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{notification.title}</h1>
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <div>作成者: {notification.created_by}</div>
            <div>作成日時: {formatDate(notification.created_at)}</div>
            <Badge
              variant={notification.status === 'completed' ? 'secondary' : 'default'}
            >
              {notification.status === 'completed' ? '完了' : '進行中'}
            </Badge>
          </div>
        </div>

        <div className="prose max-w-none">
          <p>{notification.content}</p>
        </div>

        <Separator className="my-8" />

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">チーム確認状況</h2>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between text-sm">
                <span>確認状況</span>
                <span>
                  {confirmed}/{total}
                </span>
              </div>
              <Progress value={progressValue} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {teamConfirmations.map((teamConfirmation: any) => (
              <TeamConfirmationCard
                key={teamConfirmation.team_id}
                notificationId={params.id}
                teamConfirmation={teamConfirmation}
              />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
