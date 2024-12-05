import { MainLayout } from '@/components/layout/main-layout';
import { CreateNotificationForm } from '@/components/create-notification-form';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { createDb } from '@/lib/db';
import { teams } from '@/db/schema';
import { D1Database } from '@cloudflare/workers-types';

export const runtime = 'edge';

async function CreateNotificationLoader() {
  const db = createDb(process.env.DB as any as D1Database);
  const teamList = await db.select().from(teams);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">新規連絡作成</h1>
        <p className="text-muted-foreground">新しい連絡を作成し、チームに通知を送信します。</p>
      </div>
      <div className="max-w-2xl">
        <CreateNotificationForm teams={teamList} />
      </div>
    </div>
  );
}

function CreateNotificationSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96 mt-2" />
      </div>
      <div className="max-w-2xl space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

export default function CreateNotificationPage() {
  return (
    <MainLayout>
      <Suspense fallback={<CreateNotificationSkeleton />}>
        <CreateNotificationLoader />
      </Suspense>
    </MainLayout>
  );
}
