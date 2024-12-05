import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createNotificationSchema } from "@/lib/schema";
import type { CreateNotificationInput } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface Team {
  id: string;
  name: string;
  slack_mention: string;
}

interface CreateNotificationFormProps {
  teams: Team[];
}

export function CreateNotificationForm({ teams }: CreateNotificationFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateNotificationInput>({
    resolver: zodResolver(createNotificationSchema),
    defaultValues: {
      title: "",
      content: "",
      teams: [],
      created_by: "@imaimai", // TODO: ユーザー情報から取得
    },
  });

  async function onSubmit(data: CreateNotificationInput) {
    try {
      setIsSubmitting(true);

      // 連絡を作成
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("連絡の作成に失敗しました");
      }

      const result = await response.json();

      // Slack通知を送信
      await fetch("/api/slack/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notification_id: result.id,
        }),
      });

      toast({
        title: "連絡を作成しました",
        description: "選択したチームに通知を送信しました",
      });

      router.push("/");
    } catch (error) {
      console.error("Error creating notification:", error);
      toast({
        title: "エラーが発生しました",
        description: "連絡の作成に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>タイトル</FormLabel>
              <FormControl>
                <Input placeholder="連絡のタイトル" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>連絡内容</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="連絡の内容を入力してください"
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="teams"
          render={() => (
            <FormItem>
              <FormLabel>通知先チーム</FormLabel>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {teams.map((team) => (
                  <FormField
                    key={team.id}
                    control={form.control}
                    name="teams"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(team.id)}
                            onCheckedChange={(checked) => {
                              const value = field.value || [];
                              if (checked) {
                                field.onChange([...value, team.id]);
                              } else {
                                field.onChange(
                                  value.filter((id) => id !== team.id)
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">{team.name}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "作成中..." : "作成"}
        </Button>
      </form>
    </Form>
  );
}
