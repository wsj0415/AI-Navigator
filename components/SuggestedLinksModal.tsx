import React, { useState, useEffect, useMemo } from 'react';
import { LinkItem } from '../types';
// Fix: Use relative path for component imports.
import { SparklesIcon, CloseIcon } from './Icons';

interface SuggestedLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedIds: string[]) => void;
  allLinks: LinkItem[];
  suggestedIds: string[];
}

const SuggestedLinksModal: React.FC<SuggestedLinksModalProps> = ({ isOpen, onClose, onSave, allLinks, suggestedIds }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(new Set(suggestedIds));
    }
  }, [isOpen, suggestedIds]);

  const suggestedLinks = useMemo(() => {
    return allLinks.filter(link => suggestedIds.includes(link.id));
  }, [allLinks, suggestedIds]);

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
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-xl m-4 h-[70vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-primary" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">AI Suggestions for Related Resources</h2>
          </div>
          <button onClick={onClose} title="Close" className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><CloseIcon className="w-5 h-5" /></button>
        </header>

        <p className="p-4 text-sm text-gray-600 dark:text-gray-400 flex-shrink-0 border-b border-gray-200 dark:border-gray-800">
            The AI found these resources to be strongly related. Review and approve the connections you'd like to create.
        </p>

        <div className="overflow-y-auto flex-grow px-4">
          <ul className="space-y-1 py-2">
            {suggestedLinks.map(link => {
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
             {suggestedLinks.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No suggestions found.
                </div>
             )}
          </ul>
        </div>

        <footer className="bg-gray-100 dark:bg-gray-800 px-6 py-3 flex justify-between items-center rounded-b-lg mt-auto flex-shrink-0">
          <span>{selectedIds.size} of {suggestedLinks.length} selected</span>
          <div>
            <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-md transition duration-200 text-sm mr-2">Cancel</button>
            <button type="button" onClick={handleSave} disabled={selectedIds.size === 0} className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-md transition duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              Add Selected
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SuggestedLinksModal;
