import React from 'react';
import { ViewType, SortOption } from '../types';
// Fix: Use relative path for component imports.
import { ListIcon, GalleryIcon } from './Icons';

interface HeaderProps {
    linkCount: number;
    sortOption: SortOption;
    onSortChange: (option: SortOption) => void;
    viewType: ViewType;
    onViewChange: (view: ViewType) => void;
}

const Header: React.FC<HeaderProps> = ({ linkCount, sortOption, onSortChange, viewType, onViewChange }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resources</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{linkCount} items found</p>
      </div>
      <div className="flex items-center gap-4">
        <div>
            <select 
                value={sortOption} 
                onChange={e => onSortChange(e.target.value as SortOption)}
                className="form-input text-sm"
            >
                <option value="default">Sort by: Newest</option>
                <option value="priority">Sort by: Priority</option>
                <option value="title">Sort by: Title</option>
            </select>
        </div>
        <div className="flex items-center bg-gray-200 dark:bg-gray-800 rounded-md p-1">
            <button
                onClick={() => onViewChange('list')}
                title="List View"
                className={`p-2 rounded ${viewType === 'list' ? 'bg-primary text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'}`}
            >
                <ListIcon className="w-5 h-5" />
            </button>
            <button
                onClick={() => onViewChange('gallery')}
                title="Gallery View"
                className={`p-2 rounded ${viewType === 'gallery' ? 'bg-primary text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'}`}
            >
                <GalleryIcon className="w-5 h-5" />
            </button>
        </div>
      </div>
      <style>{`.form-input { display: block; border-radius: 0.375rem; border: 1px solid #d1d5db; background-color: #fff; padding: 0.5rem 2rem 0.5rem 0.75rem; color: #1f2937; -webkit-appearance: none; -moz-appearance: none; appearance: none; background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); background-position: right 0.5rem center; background-repeat: no-repeat; background-size: 1.5em 1.5em; } .dark .form-input { border-color: #4b5563; background-color: #1f2937; color: #f3f4f6; background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); } .form-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); }`}</style>
    </div>
  );
};

export default Header;
