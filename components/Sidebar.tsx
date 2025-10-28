import React from 'react';
import { DictionaryItem } from '../types';

interface SidebarProps {
  selectedTopics: string[];
  onTopicToggle: (topic: string) => void;
  topics: DictionaryItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ selectedTopics, onTopicToggle, topics }) => {
  const visibleTopics = topics.filter(t => t.isEnabled).sort((a,b) => a.sortOrder - b.sortOrder);

  return (
    <aside className="w-64 flex-shrink-0 p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hidden lg:block">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h2>
      <nav>
        <ul>
            <li>
                <button
                  onClick={() => onTopicToggle('all')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 text-sm ${
                    selectedTopics.length === 0
                      ? 'bg-primary/20 text-primary font-semibold'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  All Categories
                </button>
            </li>
          {visibleTopics.map(topic => {
            const isSelected = selectedTopics.includes(topic.code);
            return (
              <li key={topic.id}>
                <button
                  onClick={() => onTopicToggle(topic.code)}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 text-sm ${
                    isSelected
                      ? 'bg-primary/20 text-primary font-semibold'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  {topic.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
