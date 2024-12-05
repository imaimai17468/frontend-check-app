import { MainLayout } from '@/components/layout/main-layout';
import { Dashboard } from '@/components/dashboard';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const runtime = 'edge';

async function DashboardLoader({ status }: { status: string }) {
  const notifications = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/notifications${
      status !== 'all' ? `?status=${status}` : ''
    }`,
  ).then((res) => res.json());

  return <Dashboard notifications={notifications} status={status} />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <Skeleton className="h-10 w-[180px]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function HomePage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = searchParams.status || 'all';

  return (
    <MainLayout>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLoader status={status} />
      </Suspense>
    </MainLayout>
  );
}
