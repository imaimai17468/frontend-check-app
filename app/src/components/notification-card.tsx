import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";

interface NotificationCardProps {
  notification: {
    id: string;
    title: string;
    created_at: Date | string | number;
    created_by: string;
    status: "in_progress" | "completed";
    progress: {
      total: number;
      confirmed: number;
    };
  };
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const progressValue =
    (notification.progress.confirmed / notification.progress.total) * 100;

  return (
    <Link href={`/notifications/${notification.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{notification.title}</CardTitle>
            <Badge
              variant={
                notification.status === "completed" ? "secondary" : "default"
              }
            >
              {notification.status === "completed" ? "完了" : "進行中"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {formatDate(notification.created_at)}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>確認状況</span>
                <span>
                  {notification.progress.confirmed}/
                  {notification.progress.total}
                </span>
              </div>
              <Progress value={progressValue} />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
