import { WebClient } from '@slack/web-api';

export class SlackClient {
  private client: WebClient;

  constructor(token: string) {
    this.client = new WebClient(token);
  }

  async sendNotification({
    channel,
    text,
    blocks,
  }: {
    channel: string;
    text: string;
    blocks?: any[];
  }) {
    try {
      const result = await this.client.chat.postMessage({
        channel,
        text,
        blocks,
      });
      return result;
    } catch (error) {
      console.error('Error sending Slack notification:', error);
      throw error;
    }
  }

  async sendNotificationToTeams({
    teams,
    text,
    blocks,
  }: {
    teams: { slack_mention: string }[];
    text: string;
    blocks?: any[];
  }) {
    const results = await Promise.allSettled(
      teams.map((team) =>
        this.sendNotification({
          channel: team.slack_mention,
          text,
          blocks,
        }),
      ),
    );

    return results;
  }
}

export function createSlackClient() {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) {
    throw new Error('SLACK_BOT_TOKEN is not set');
  }
  return new SlackClient(token);
}
