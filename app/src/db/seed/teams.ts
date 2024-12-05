import { teams } from '../schema';
import { v4 as uuidv4 } from 'uuid';

export const teamsSeedData = [
  {
    id: uuidv4(),
    name: 'フロントエンドチーム1',
    slack_mention: '@frontend-team-1',
  },
  {
    id: uuidv4(),
    name: 'フロントエンドチーム2',
    slack_mention: '@frontend-team-2',
  },
  {
    id: uuidv4(),
    name: 'フロントエンドチーム3',
    slack_mention: '@frontend-team-3',
  },
  {
    id: uuidv4(),
    name: 'フロントエンドチーム4',
    slack_mention: '@frontend-team-4',
  },
  {
    id: uuidv4(),
    name: 'フロントエンドチーム5',
    slack_mention: '@frontend-team-5',
  },
];
