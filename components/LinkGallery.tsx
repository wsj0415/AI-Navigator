import React from 'react';
import { LinkItem, Dictionaries } from '../types';
import { TrashIcon, EditIcon, ExternalLinkIcon } from './Icons';

interface LinkGalleryProps {
  links: LinkItem[];
  dictionaries: Dictionaries;
  onEdit: (link: LinkItem) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  selectedIds: Set<string>;
  onViewDetails: (link: LinkItem) => void;
}

const getLabel = (items: {code: string, label: string}[], code: string) => items.find(i => i.code === code)?.label || code;

const LinkCard: React.FC<{ link: LinkItem; dictionaries: Dictionaries; onEdit: (link: LinkItem) => void; onDelete: (id: string) => void; onSelect: (id: string) => void; isSelected: boolean; onViewDetails: (link: LinkItem) => void; }> = ({ link, dictionaries, onEdit, onDelete, onSelect, isSelected, onViewDetails }) => {
    const placeholderImage = `https://via.placeholder.com/400x200.png/E2E8F0/4A5568?text=${encodeURIComponent(link.title)}`;
    
    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

    return (
        <button onClick={() => onViewDetails(link)} className={`text-left w-full relative border rounded-lg overflow-hidden transition-all duration-200 ${isSelected ? 'border-primary ring-2 ring-primary bg-white dark:bg-gray-800/50' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:shadow-lg hover:-translate-y-1'}`}>
            <div className="absolute top-2 left-2 z-10" onClick={stopPropagation}>
                <input type="checkbox" checked={isSelected} onChange={() => onSelect(link.id)} className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 dark:border-gray-600 focus:ring-primary dark:bg-gray-700" />
            </div>
            <img src={link.image || placeholderImage} alt={link.title} className="w-full h-40 object-cover bg-gray-200" />
            <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                    <img src={link.favicon || `https://www.google.com/s2/favicons?domain=${link.url}&sz=16`} alt="favicon" className="w-4 h-4" />
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">{getLabel(dictionaries.topics, link.topic)}</span>
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white truncate" title={link.title}>{link.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 h-10 overflow-hidden text-ellipsis">{link.description}</p>
                <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">{getLabel(dictionaries.priorities, link.priority)}</span>
                        <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">{getLabel(dictionaries.statuses, link.status)}</span>
                    </div>
                    <div className="flex items-center gap-1" onClick={stopPropagation}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" title="Open Link" className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><ExternalLinkIcon className="w-5 h-5" /></a>
                        <button onClick={() => onEdit(link)} title="Edit" className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><EditIcon className="w-5 h-5" /></button>
                        <button onClick={() => onDelete(link.id)} title="Delete" className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><TrashIcon className="w-5 h-5" /></button>
                    </div>
                </div>
            </div>
        </button>
    );
};


const LinkGallery: React.FC<LinkGalleryProps> = ({ links, dictionaries, onEdit, onDelete, onSelect, selectedIds, onViewDetails }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {links.length > 0 ? (
        links.map(link => <LinkCard key={link.id} link={link} dictionaries={dictionaries} onEdit={onEdit} onDelete={onDelete} onSelect={onSelect} isSelected={selectedIds.has(link.id)} onViewDetails={onViewDetails} />)
      ) : (
        <div className="text-center py-12 col-span-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">No resources found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your filters or adding a new resource.</p>
        </div>
      )}
    </div>
  );
};

export default LinkGallery;