import React from 'react';
import { ViewType, SortOption } from '../types';
import { ListIcon, GalleryIcon } from './Icons';

interface HeaderProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  itemCount: number;
}

const SortButton: React.FC<{
  currentSort: SortOption;
  targetSort: SortOption;
  onSortChange: (option: SortOption) => void;
  children: React.ReactNode;
}> = ({ currentSort, targetSort, onSortChange, children }) => (
  <button
    onClick={() => onSortChange(targetSort)}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      currentSort === targetSort
        ? 'bg-primary text-white'
        : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
    }`}
  >
    {children}
  </button>
);


const Header: React.FC<HeaderProps> = ({ 
    view, onViewChange, 
    sortOption, onSortChange, 
    itemCount
}) => {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          All Resources <span className="text-gray-500 dark:text-gray-400 font-normal text-base">({itemCount})</span>
        </h2>
      </div>

      <div className="flex items-center flex-wrap gap-4">
        <div className="flex items-center bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-1 gap-1">
          <SortButton currentSort={sortOption} targetSort="default" onSortChange={onSortChange}>Default</SortButton>
          <SortButton currentSort={sortOption} targetSort="priority" onSortChange={onSortChange}>By Priority</SortButton>
          <SortButton currentSort={sortOption} targetSort="title" onSortChange={onSortChange}>By Title</SortButton>
        </div>

        <div className="flex items-center bg-gray-200 dark:bg-gray-800 rounded-md p-1">
          <button
            onClick={() => onViewChange('list')}
            title="List View"
            className={`p-2 rounded ${view === 'list' ? 'bg-primary text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'}`}
          >
            <ListIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewChange('gallery')}
            title="Gallery View"
            className={`p-2 rounded ${view === 'gallery' ? 'bg-primary text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'}`}
          >
            <GalleryIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
