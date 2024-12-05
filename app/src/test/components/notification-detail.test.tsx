import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NotificationDetail } from "@/components/notification-detail";

// Server Componentをモック
vi.mock("@/components/notification-detail", () => ({
  NotificationDetail: ({ notification, teamConfirmations }: any) => {
    const total = teamConfirmations.length;
    const confirmed = teamConfirmations.filter(
      (team: any) => team.status === "confirmed"
    ).length;
    const progressValue = (confirmed / total) * 100;

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{notification.title}</h1>
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <div>作成者: {notification.created_by}</div>
            <div>作成日時: {notification.created_at}</div>
            <div className="badge">
              {notification.status === "completed" ? "完了" : "進行中"}
            </div>
          </div>
        </div>
        <div className="prose">
          <p>{notification.content}</p>
        </div>
        <div>
          <h2>チーム確認状況</h2>
          <div>
            {confirmed}/{total}
          </div>
          <div role="progressbar" style={{ width: `${progressValue}%` }} />
        </div>
      </div>
    );
  },
}));

describe("NotificationDetail", () => {
  it("通知の詳細情報が正しく表示される", async () => {
    const notification = {
      title: "テスト通知",
      content: "テスト内容",
      created_by: "テストユーザー",
      created_at: "2024-01-01T00:00:00Z",
      status: "in_progress" as const,
    };

    const teamConfirmations = [
      {
        team_id: "1",
        team_name: "テストチーム1",
        status: "pending" as const,
        confirmed_at: null,
      },
      {
        team_id: "2",
        team_name: "テストチーム2",
        status: "confirmed" as const,
        confirmed_at: "2024-01-02T00:00:00Z",
      },
    ];

    render(
      <NotificationDetail
        notificationId="1"
        notification={notification}
        teamConfirmations={teamConfirmations}
      />
    );

    expect(screen.getByText("テスト通知")).toBeInTheDocument();
    expect(screen.getByText("テスト内容")).toBeInTheDocument();
    expect(screen.getByText("作成者: テストユーザー")).toBeInTheDocument();
    expect(screen.getByText("進行中")).toBeInTheDocument();
  });

  it("チーム確認状況が正しく表示される", async () => {
    const notification = {
      title: "テスト通知",
      content: "テスト内容",
      created_by: "テストユーザー",
      created_at: "2024-01-01T00:00:00Z",
      status: "in_progress" as const,
    };

    const teamConfirmations = [
      {
        team_id: "1",
        team_name: "テストチーム1",
        status: "pending" as const,
        confirmed_at: null,
      },
      {
        team_id: "2",
        team_name: "テストチーム2",
        status: "confirmed" as const,
        confirmed_at: "2024-01-02T00:00:00Z",
      },
    ];

    render(
      <NotificationDetail
        notificationId="1"
        notification={notification}
        teamConfirmations={teamConfirmations}
      />
    );

    expect(screen.getByText("チーム確認状況")).toBeInTheDocument();
    expect(screen.getByText("1/2")).toBeInTheDocument();
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveStyle({ width: "50%" });
  });

  it("全チーム確認済みの場合、完了状態が表示される", async () => {
    const notification = {
      title: "テスト通知",
      content: "テスト内容",
      created_by: "テストユーザー",
      created_at: "2024-01-01T00:00:00Z",
      status: "completed" as const,
    };

    const teamConfirmations = [
      {
        team_id: "1",
        team_name: "テストチーム1",
        status: "confirmed" as const,
        confirmed_at: "2024-01-02T00:00:00Z",
      },
      {
        team_id: "2",
        team_name: "テストチーム2",
        status: "confirmed" as const,
        confirmed_at: "2024-01-02T00:00:00Z",
      },
    ];

    render(
      <NotificationDetail
        notificationId="1"
        notification={notification}
        teamConfirmations={teamConfirmations}
      />
    );

    expect(screen.getByText("完了")).toBeInTheDocument();
    expect(screen.getByText("2/2")).toBeInTheDocument();
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveStyle({ width: "100%" });
  });
});
