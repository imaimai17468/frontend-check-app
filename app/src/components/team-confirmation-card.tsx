import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface TeamConfirmationCardProps {
  notificationId: string;
  teamConfirmation: {
    team_id: string;
    team_name: string;
    status: 'pending' | 'confirmed';
    confirmed_at: string | null;
  };
}

export function TeamConfirmationCard({
  notificationId,
  teamConfirmation,
}: TeamConfirmationCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);

      const response = await fetch(
        `/api/teams/confirmations/${notificationId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            team_id: teamConfirmation.team_id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('確認の更新に失敗しました');
      }

      const result = await response.json();

      toast({
        title: '確認を更新しました',
        description: result.notification_completed
          ? '全てのチームの確認が完了しました'
          : undefined,
      });

      router.refresh();
    } catch (error) {
      console.error('Error updating confirmation:', error);
      toast({
        title: 'エラーが発生しました',
        description: '確認の更新に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={teamConfirmation.status === 'confirmed' ? 'border-l-4 border-l-primary' : undefined}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{teamConfirmation.team_name}</CardTitle>
          <Badge variant={teamConfirmation.status === 'confirmed' ? 'secondary' : 'default'}>
            {teamConfirmation.status === 'confirmed' ? '確認済み' : '未確認'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teamConfirmation.confirmed_at ? (
            <div className="text-sm text-muted-foreground">
              確認日時: {formatDate(teamConfirmation.confirmed_at)}
            </div>
          ) : (
            <Button
              onClick={handleConfirm}
              disabled={isSubmitting}
              variant="outline"
              className="w-full"
            >
              {isSubmitting ? '更新中...' : '確認する'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
