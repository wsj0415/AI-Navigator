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

export interface LinkItem {
  id: string;
  url: string;
  title: string;
  description: string;
  topic: string; 
  priority: string;
  status: string; 
  createdAt: string; 
  favicon?: string;
  image?: string;
  notes?: string;
  fileAttachment?: {
    name: string;
    content: string;
  };
}

export type ViewType = 'list' | 'gallery';

export type SortOption = 'default' | 'priority' | 'title';

export type Page = 'dashboard' | 'resources' | 'settings';

export type ThemeSetting = 'light' | 'dark' | 'system';
