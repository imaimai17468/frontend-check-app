import { MainLayout } from '@/components/layout/main-layout';
import { CreateNotificationForm } from '@/components/create-notification-form';
import { createDb } from '@/lib/db';
import { teams } from '@/db/schema';
import { D1Database } from '@cloudflare/workers-types';

export const runtime = 'edge';

export default async function CreateNotificationPage() {
  const db = createDb(process.env.DB as any as D1Database);
  const teamList = await db.select().from(teams);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">新規連絡作成</h1>
          <p className="text-muted-foreground">
            新しい連絡を作成し、チームに通知を送信します。
          </p>
        </div>
        <div className="max-w-2xl">
          <CreateNotificationForm teams={teamList} />
        </div>
      </div>
    </MainLayout>
  );
}
