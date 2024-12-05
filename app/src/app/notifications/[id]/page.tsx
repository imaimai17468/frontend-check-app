import { MainLayout } from "@/components/layout/main-layout";
import { NotificationDetail } from "@/components/notification-detail";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const runtime = "edge";

interface PageProps {
  params: {
    id: string;
  };
}

async function NotificationDetailLoader({ id }: { id: string }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/${id}`
  );

  if (!response.ok) {
    throw new Error("連絡の取得に失敗しました");
  }

  const { notification, teamConfirmations } = await response.json();

  return (
    <NotificationDetail
      notificationId={id}
      notification={notification}
      teamConfirmations={teamConfirmations}
    />
  );
}

function NotificationDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-2/3" />
        <div className="mt-2 flex items-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <Skeleton className="h-24 w-full" />
      <div className="space-y-6">
        <div>
          <Skeleton className="h-6 w-40" />
          <div className="mt-2 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function NotificationDetailPage({ params }: PageProps) {
  return (
    <MainLayout>
      <Suspense fallback={<NotificationDetailSkeleton />}>
        <NotificationDetailLoader id={params.id} />
      </Suspense>
    </MainLayout>
  );
}
