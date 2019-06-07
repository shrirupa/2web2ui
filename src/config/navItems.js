/* eslint max-lines: ["error", 160] */
import { Home, InsertChart, Code, MailOutline, Language, Settings, Compare, NotificationsActive, Signal, VerifiedUser } from '@sparkpost/matchbox-icons';

import campaignNavItems from './campaignNavItems';
import settingsNavItems from './settingsNavItems';
import inboxPlacementNavItems from './inboxPlacementNavItems';

export default [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: Home
  },
  {
    label: 'Reports',
    to: '/reports',
    icon: InsertChart,
    children: [
      {
        label: 'Summary',
        to: '/reports/summary'
      },
      {
        label: 'Bounce',
        to: '/reports/bounce'
      },
      {
        label: 'Rejections',
        to: '/reports/rejections'
      },
      {
        label: 'Accepted',
        to: '/reports/accepted'
      },
      {
        label: 'Delayed',
        to: '/reports/delayed'
      },
      {
        label: 'Engagement',
        to: '/reports/engagement'
      },
      {
        label: 'Events Search',
        to: '/reports/message-events',
        tag: 'new'
      }
    ]
  },
  {
    label: 'Signals',
    to: '/signals',
    icon: Signal,
    tag: 'new',
    children: [
      {
        label: 'Health Score',
        to: '/signals/health-score'
      },
      {
        label: 'Spam Traps',
        to: '/signals/spam-traps'
      },
      {
        label: 'Engagement Recency',
        to: '/signals/engagement'
      },
      {
        label: 'Ingestion Status',
        to: '/signals/ingest-batch-status'
      }
    ]
  },
  {
    ...campaignNavItems
  },
  //TODO remove it in TR-1455
  {
    label: 'Templates',
    to: '/templates',
    icon: Code
  },
  //TODO remove it in TR-1455
  {
    label: 'A/B Testing',
    to: '/ab-testing',
    icon: Compare
  },
  {
    label: 'Lists',
    to: '/lists',
    icon: MailOutline,
    children: [
      {
        label: 'Recipient Lists',
        to: '/lists/recipient-lists'
      },
      {
        label: 'Suppressions',
        to: '/lists/suppressions'
      }
    ]
  },
  {
    label: 'Recipient Validation',
    to: '/recipient-validation',
    icon: VerifiedUser,
    tag: 'new'
  },
  {
    label: 'Webhooks',
    to: '/webhooks',
    icon: Language
  },
  {
    ...settingsNavItems
  },
  {
    label: 'Alerts',
    to: '/alerts',
    tag: 'new',
    icon: NotificationsActive
  },
  //TODO remove it in TR-1455
  {
    label: 'Snippets',
    to: '/snippets',
    tag: 'labs',
    divider: true,
    icon: Code
  },
  {
    ...inboxPlacementNavItems
  }
];
