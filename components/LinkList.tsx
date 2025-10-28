import React from 'react';
import { LinkItem, Dictionaries } from '../types';
import { TrashIcon, EditIcon, ExternalLinkIcon } from './Icons';

interface LinkListProps {
  links: LinkItem[];
  dictionaries: Dictionaries;
  onEdit: (link: LinkItem) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  selectedIds: Set<string>;
  onViewDetails: (link: LinkItem) => void;
}

const getLabel = (items: {code: string, label: string}[], code: string) => items.find(i => i.code === code)?.label || code;

const LinkListItem: React.FC<{ link: LinkItem; dictionaries: Dictionaries; onEdit: (link: LinkItem) => void; onDelete: (id: string) => void; onSelect: (id: string) => void; isSelected: boolean; onViewDetails: (link: LinkItem) => void; }> = ({ link, dictionaries, onEdit, onDelete, onSelect, isSelected, onViewDetails }) => {
    return (
        <div className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${isSelected ? 'bg-blue-100 dark:bg-blue-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'}`}>
            <input type="checkbox" checked={isSelected} onChange={() => onSelect(link.id)} className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 dark:border-gray-600 focus:ring-primary dark:bg-gray-700" />
            <img src={link.favicon || `https://www.google.com/s2/favicons?domain=${link.url}&sz=32`} alt="favicon" className="w-8 h-8 rounded-md object-cover flex-shrink-0 bg-gray-200" />
            <div className="flex-grow min-w-0">
                <button onClick={() => onViewDetails(link)} className="text-left w-full">
                  <span className="font-semibold text-gray-800 dark:text-white hover:text-primary truncate block">{link.title}</span>
                </button>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{link.description}</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm">
                <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">{getLabel(dictionaries.topics, link.topic)}</span>
                <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">{getLabel(dictionaries.priorities, link.priority)}</span>
                <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">{getLabel(dictionaries.statuses, link.status)}</span>
            </div>
            <div className="flex items-center gap-2">
                <a href={link.url} target="_blank" rel="noopener noreferrer" title="Open Link" className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><ExternalLinkIcon className="w-5 h-5" /></a>
                <button onClick={() => onEdit(link)} title="Edit" className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><EditIcon className="w-5 h-5" /></button>
                <button onClick={() => onDelete(link.id)} title="Delete" className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><TrashIcon className="w-5 h-5" /></button>
            </div>
        </div>
    );
}

const LinkList: React.FC<LinkListProps> = ({ links, dictionaries, onEdit, onDelete, onSelect, selectedIds, onViewDetails }) => {
  return (
    <div className="space-y-2">
      {links.length > 0 ? (
        links.map(link => <LinkListItem key={link.id} link={link} dictionaries={dictionaries} onEdit={onEdit} onDelete={onDelete} onSelect={onSelect} isSelected={selectedIds.has(link.id)} onViewDetails={onViewDetails} />)
      ) : (
        <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">No resources found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your filters or adding a new resource.</p>
        </div>
      )}
    </div>
  );
};

export default LinkList;