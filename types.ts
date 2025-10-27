export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number; // in bytes
  dataUrl: string; // base64 encoded
}

export interface LinkItem {
  id: string;
  url: string;
  title: string;
  description: string;
  topic: string; // The value from a DictionaryItem
  priority: string; // The value from a DictionaryItem
  status: string; // The value from a DictionaryItem
  createdAt: string; // ISO date string
  relatedLinkIds: string[]; // IDs of other linked items
  attachments: Attachment[];
}

export interface DictionaryItem {
  id: string;
  value: string;
}

export interface Dictionaries {
  topics: DictionaryItem[];
  priorities: DictionaryItem[];
  statuses: DictionaryItem[];
}

export type Page = 'dashboard' | 'resources' | 'settings';

export type ViewType = 'list' | 'gallery';

export type SortOption = 'default' | 'priority' | 'title';
