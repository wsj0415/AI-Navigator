import React, { useState, useMemo } from 'react';
import { LinkItem } from '../types';
// Fix: Use relative path for component imports.
import { SearchIcon, CloseIcon } from './Icons';

interface AddRelatedLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedIds: string[]) => void;
  allLinks: LinkItem[];
  currentLink: LinkItem | null;
}

const AddRelatedLinkModal: React.FC<AddRelatedLinkModalProps> = ({ isOpen, onClose, onSave, allLinks, currentLink }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredLinks = useMemo(() => {
    if (!currentLink) return [];
    return allLinks.filter(link => 
        link.id !== currentLink.id && 
        !currentLink.relatedLinkIds?.includes(link.id) &&
        link.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allLinks, currentLink, searchTerm]);

  const handleToggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSave = () => {
    onSave(Array.from(selectedIds));
    setSearchTerm('');
    setSelectedIds(new Set());
  };

  const handleClose = () => {
      onClose();
      setSearchTerm('');
      setSelectedIds(new Set());
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50" onClick={handleClose}>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-xl m-4 h-[70vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add Related Resources</h2>
          <button onClick={handleClose} title="Close" className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><CloseIcon className="w-5 h-5" /></button>
        </header>

        <div className="p-4 flex-shrink-0">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="h-5 w-5 text-gray-400 dark:text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search existing resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 dark:text-gray-200 text-sm"
              autoFocus
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-grow px-4">
          <ul className="space-y-1">
            {filteredLinks.map(link => {
              const isSelected = selectedIds.has(link.id);
              return (
                <li key={link.id}>
                  <label className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${isSelected ? 'bg-primary/20' : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'}`}>
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => handleToggleSelection(link.id)}
                      className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 dark:border-gray-600 focus:ring-primary dark:bg-gray-700"
                    />
                    <img src={link.favicon || `https://www.google.com/s2/favicons?domain=${link.url}&sz=16`} alt="" className="w-4 h-4 rounded-sm flex-shrink-0" />
                    <span className={`text-sm ${isSelected ? 'font-semibold text-primary' : 'text-gray-800 dark:text-gray-200'}`}>{link.title}</span>
                  </label>
                </li>
              );
            })}
             {filteredLinks.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No matching resources found.
                </div>
             )}
          </ul>
        </div>

        <footer className="bg-gray-100 dark:bg-gray-800 px-6 py-3 flex justify-between items-center rounded-b-lg mt-auto flex-shrink-0">
          <span>{selectedIds.size} selected</span>
          <div>
            <button type="button" onClick={handleClose} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-md transition duration-200 text-sm mr-2">Cancel</button>
            <button type="button" onClick={handleSave} disabled={selectedIds.size === 0} className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-md transition duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              Add Selected
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AddRelatedLinkModal;
