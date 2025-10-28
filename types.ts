export interface DictionaryItem {
  id: string;
  code: string;
  label: string;
  sortOrder: number;
  isEnabled: boolean;
}

export interface Dictionaries {
  topics: DictionaryItem[];
  priorities: DictionaryItem[];
  statuses: DictionaryItem[];
}

export interface FileAttachment {
    name: string;
    type: string;
    content: string; // Base64 or text content
}

export interface LinkItem {
  id: string;
  url: string;
  title: string;
  description?: string;
  topic: string; // code from Dictionaries.topics
  priority: string; // code from Dictionaries.priorities
  status: string; // code from Dictionaries.statuses
  createdAt: string; // ISO string
  notes?: string;
  relatedLinkIds?: string[];
  favicon?: string;
  image?: string; // Base64 data URI
  fileAttachment?: FileAttachment;
}

export type ViewType = 'list' | 'gallery';
export type SortOption = 'default' | 'priority' | 'title';
export type Page = 'dashboard' | 'resources' | 'settings';
export type ThemeSetting = 'light' | 'dark' | 'system';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}
