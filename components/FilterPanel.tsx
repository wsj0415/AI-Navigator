import React, { useState } from 'react';
import { Dictionaries, DictionaryItem } from '../types';
import { ChevronDownIcon } from './Icons';

interface FilterPanelProps {
    dictionaries: Dictionaries;
    selectedTopics: string[];
    onTopicToggle: (code: string) => void;
    selectedStatuses: string[];
    onStatusToggle: (code: string) => void;
    selectedPriorities: string[];
    onPriorityToggle: (code: string) => void;
}

const FilterSection: React.FC<{
    title: string;
    items: DictionaryItem[];
    selectedItems: string[];
    onToggle: (code: string) => void;
}> = ({ title, items, selectedItems, onToggle }) => {
    const [isOpen, setIsOpen] = useState(true);
    const visibleItems = items.filter(i => i.isEnabled).sort((a,b) => a.sortOrder - b.sortOrder);

    return (
        <div className="border-b border-gray-200 dark:border-gray-800 py-4">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex justify-between items-center text-left font-semibold text-gray-800 dark:text-gray-200"
            >
                <span>{title}</span>
                <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="mt-3 space-y-2">
                    {visibleItems.map(item => (
                        <label key={item.id} className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedItems.includes(item.code)}
                                onChange={() => onToggle(item.code)}
                                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary dark:bg-gray-700"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-300">{item.label}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

const FilterPanel: React.FC<FilterPanelProps> = ({
    dictionaries,
    selectedTopics,
    onTopicToggle,
    selectedStatuses,
    onStatusToggle,
    selectedPriorities,
    onPriorityToggle,
}) => {
    return (
        <aside id="filter-panel" className="w-64 flex-shrink-0 p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hidden lg:block self-start">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Filters</h2>
            
            <FilterSection 
                title="By Category"
                items={dictionaries.topics}
                selectedItems={selectedTopics}
                onToggle={onTopicToggle}
            />

            <FilterSection 
                title="By Priority"
                items={dictionaries.priorities}
                selectedItems={selectedPriorities}
                onToggle={onPriorityToggle}
            />

            <FilterSection 
                title="By Status"
                items={dictionaries.statuses}
                selectedItems={selectedStatuses}
                onToggle={onStatusToggle}
            />
        </aside>
    );
};

export default FilterPanel;
