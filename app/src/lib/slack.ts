import { WebClient } from '@slack/web-api';

interface SlackBlock {
  type: 'header' | 'section' | 'actions';
  text?: {
    type: 'plain_text' | 'mrkdwn';
    text: string;
  };
  elements?: Array<{
    type: 'button';
    text: {
      type: 'plain_text';
      text: string;
    };
    url?: string;
    style?: 'primary' | 'danger';
  }>;
}

function createSlackClient() {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) {
    throw new Error('SLACK_BOT_TOKEN is not set');
  }

  async function sendNotification({
    channel,
    text,
    blocks,
  }: {
    channel: string;
    text: string;
    blocks?: SlackBlock[];
  }) {
    try {
      const response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          channel,
          text,
          blocks,
        }),
      });

      const result = await response.json();
      if (!result.ok) {
        throw new Error(result.error);
      }
      return result;
    } catch (error) {
      console.error('Error sending Slack notification:', error);
      throw error;
    }
  }

  async function sendNotificationToTeams({
    teams,
    text,
    blocks,
  }: {
    teams: { slack_mention: string }[];
    text: string;
    blocks?: SlackBlock[];
  }) {
    const results = await Promise.allSettled(
      teams.map((team) =>
        sendNotification({
          channel: team.slack_mention,
          text,
          blocks,
        }),
      ),
    );

    return results;
  }

  return {
    sendNotification,
    sendNotificationToTeams,
  };
}

export { createSlackClient };
