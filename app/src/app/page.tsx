import { MainLayout } from '@/components/layout/main-layout';
import { NotificationCard } from '@/components/notification-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createDb } from '@/lib/db';
import { D1Database } from '@cloudflare/workers-types';

export const runtime = 'edge';

export default async function Home({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const db = createDb(process.env.DB as any as D1Database);
  const status = searchParams.status || 'all';

  // 連絡一覧を取得
  const notifications = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/notifications${
      status !== 'all' ? `?status=${status}` : ''
    }`
  ).then((res) => res.json());

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">ダッシュボード</h1>
            <p className="text-muted-foreground">連絡一覧と進捗状況を確認できます。</p>
          </div>
          <Select defaultValue={status}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="ステータス" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="in_progress">進行中</SelectItem>
              <SelectItem value="completed">完了</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notifications.map((notification: any) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
