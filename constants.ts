import { Dictionaries, LinkItem } from './types';

export const INITIAL_DICTIONARIES: Dictionaries = {
  topics: [
    { id: 'topic1', value: 'AI/ML' },
    { id: 'topic2', value: 'Web Development' },
    { id: 'topic3', value: 'Design' },
    { id: 'topic4', value: 'Productivity' },
    { id: 'topic5', value: 'Career' },
    { id: 'topic6', value: 'Other' },
  ],
  priorities: [
    { id: 'prio1', value: 'High' },
    { id: 'prio2', value: 'Medium' },
    { id: 'prio3', value: 'Low' },
  ],
  statuses: [
    { id: 'stat1', value: 'To Read' },
    { id: 'stat2', value: 'In Progress' },
    { id: 'stat3', value: 'Completed' },
  ]
};

export const INITIAL_LINKS: LinkItem[] = [
  {
    id: 'link1',
    url: 'https://www.google.com',
    title: 'Google',
    description: 'The worlds most popular search engine.',
    topic: 'Productivity',
    priority: 'Medium',
    status: 'To Read',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    relatedLinkIds: [],
    attachments: [],
  },
  {
    id: 'link2',
    url: 'https://react.dev',
    title: 'React Documentation',
    description: 'Official docs for React.',
    topic: 'Web Development',
    priority: 'High',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    relatedLinkIds: [],
    attachments: [],
  },
  {
    id: 'link3',
    url: 'https://figma.com',
    title: 'Figma',
    description: 'A collaborative design tool.',
    topic: 'Design',
    priority: 'Low',
    status: 'Completed',
    createdAt: new Date().toISOString(),
    relatedLinkIds: [],
    attachments: [],
  },
];
