import React from 'react';
import { ViewType, SortOption, Dictionaries } from '../types';
import { ListIcon, GalleryIcon } from './Icons';

interface HeaderProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  itemCount: number;
  dictionaries: Dictionaries;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedPriority: string;
  onPriorityChange: (priority: string) => void;
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
    itemCount, dictionaries, 
    selectedStatus, onStatusChange, 
    selectedPriority, onPriorityChange 
}) => {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Resources <span className="text-gray-500 dark:text-gray-400 font-normal text-base">({itemCount})</span>
        </h2>
      </div>

      <div className="flex items-center flex-wrap gap-4">
        <div className="flex items-center gap-2">
            <select
                value={selectedStatus}
                onChange={(e) => onStatusChange(e.target.value)}
                className="form-input text-sm"
            >
                <option value="all">All Statuses</option>
                {dictionaries.statuses.map(opt => <option key={opt.id} value={opt.value}>{opt.value}</option>)}
            </select>
            <select
                value={selectedPriority}
                onChange={(e) => onPriorityChange(e.target.value)}
                className="form-input text-sm"
            >
                <option value="all">All Priorities</option>
                {dictionaries.priorities.map(opt => <option key={opt.id} value={opt.value}>{opt.value}</option>)}
            </select>
        </div>

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
       <style>{`.form-input { display: block; border-radius: 0.375rem; border: 1px solid #d1d5db; background-color: #f3f4f6; padding: 0.5rem 0.75rem; color: #1f2937; appearance: none; background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); background-position: right 0.5rem center; background-repeat: no-repeat; background-size: 1.5em 1.5em; padding-right: 2.5rem; } .dark .form-input { border-color: #444; background-color: #2d2d2d; color: #e0e0e0; } .form-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); }`}</style>
    </div>
  );
};

export default Header;