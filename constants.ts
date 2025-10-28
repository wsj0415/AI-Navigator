import { LinkItem, Dictionaries } from './types';

export const INITIAL_DICTIONARIES: Dictionaries = {
  topics: [
    { id: '1', code: 'ai-ml', label: 'AI/ML', sortOrder: 0, isEnabled: true },
    { id: '2', code: 'web-development', label: 'Web Development', sortOrder: 1, isEnabled: true },
    { id: '3', code: 'design', label: 'Design', sortOrder: 2, isEnabled: true },
    { id: '4', code: 'productivity', label: 'Productivity', sortOrder: 3, isEnabled: true },
    { id: '5', code: 'career', label: 'Career', sortOrder: 4, isEnabled: true },
    { id: '6', code: 'other', label: 'Other', sortOrder: 5, isEnabled: true },
  ],
  priorities: [
    { id: 'p1', code: 'high', label: 'High', sortOrder: 0, isEnabled: true },
    { id: 'p2', code: 'medium', label: 'Medium', sortOrder: 1, isEnabled: true },
    { id: 'p3', code: 'low', label: 'Low', sortOrder: 2, isEnabled: true },
  ],
  statuses: [
    { id: 's1', code: 'to-read', label: 'To Read', sortOrder: 0, isEnabled: true },
    { id: 's2', code: 'in-progress', label: 'In Progress', sortOrder: 1, isEnabled: true },
    { id: 's3', code: 'completed', label: 'Completed', sortOrder: 2, isEnabled: true },
    { id: 's4', code: 'archived', label: 'Archived', sortOrder: 3, isEnabled: true },
  ],
};

export const INITIAL_LINKS: LinkItem[] = [
  {
    id: crypto.randomUUID(),
    url: 'https://react.dev/',
    title: 'React Official Website',
    description: 'The library for web and native user interfaces.',
    topic: 'web-development',
    priority: 'high',
    status: 'to-read',
    createdAt: new Date().toISOString(),
    relatedLinkIds: [],
  },
  {
    id: crypto.randomUUID(),
    url: 'https://tailwindcss.com/',
    title: 'Tailwind CSS',
    description: 'A utility-first CSS framework for rapid UI development.',
    topic: 'web-development',
    priority: 'medium',
    status: 'in-progress',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    relatedLinkIds: [],
  },
  {
    id: crypto.randomUUID(),
    url: 'https://gemini.google.com/',
    title: 'Google Gemini',
    description: 'A family of multimodal models from Google.',
    topic: 'ai-ml',
    priority: 'high',
    status: 'completed',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    relatedLinkIds: [],
  },
];