import React from 'react';
import { LinkItem, Attachment } from '../types';
import { EditIcon, TrashIcon, ExternalLinkIcon, LinkIcon, PaperclipIcon } from './Icons';

interface LinkGalleryProps {
  links: LinkItem[];
  allLinks: LinkItem[];
  onEdit: (link: LinkItem) => void;
  onDelete: (id: string) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
}

const RelatedLinksIndicator: React.FC<{ link: LinkItem; allLinks: LinkItem[] }> = ({ link, allLinks }) => {
    if (link.relatedLinkIds.length === 0) {
        return null;
    }
    const relatedLinks = allLinks.filter(l => link.relatedLinkIds.includes(l.id));

    return (
        <div className="relative group flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
            <LinkIcon className="w-3 h-3" />
            <span>{link.relatedLinkIds.length}</span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-gray-800 text-white text-xs rounded-md py-1.5 px-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 border border-gray-700 shadow-lg">
                <ul className="space-y-1">
                    {relatedLinks.map(related => (
                        <li key={related.id} className="truncate">{related.title}</li>
                    ))}
                </ul>
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
            </div>
        </div>
    );
};

const AttachmentsIndicator: React.FC<{ attachments: Attachment[] }> = ({ attachments }) => {
    if (!attachments || attachments.length === 0) {
        return null;
    }

    return (
        <div className="relative group flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
            <PaperclipIcon className="w-3 h-3" />
            <span>{attachments.length}</span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-gray-800 text-white text-xs rounded-md py-1.5 px-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 border border-gray-700 shadow-lg">
                <ul className="space-y-1">
                     {attachments.map(att => (
                        <li key={att.id} className="truncate">
                           <a href={att.dataUrl} target="_blank" rel="noopener noreferrer" download={att.name} className="pointer-events-auto hover:underline">{att.name}</a>
                        </li>
                    ))}
                </ul>
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
            </div>
        </div>
    );
};

const LinkCard: React.FC<{
    link: LinkItem;
    allLinks: LinkItem[];
    isSelected: boolean;
    onToggleSelect: (id: string) => void;
    onEdit: (link: LinkItem) => void;
    onDelete: (id: string) => void;
}> = ({ link, allLinks, isSelected, onToggleSelect, onEdit, onDelete }) => {
    
    const getPriorityColor = (priority: string) => {
        if (priority === 'High') return 'border-red-400 dark:border-red-500 text-red-600 dark:text-red-400';
        if (priority === 'Medium') return 'border-yellow-400 dark:border-yellow-500 text-yellow-600 dark:text-yellow-400';
        return 'border-gray-400 dark:border-gray-500 text-gray-600 dark:text-gray-400';
    };

    return (
        <div className={`relative bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg group transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-lg ${isSelected ? 'ring-2 ring-primary border-primary' : ''}`}>
             <div className="absolute top-2 left-2 z-10">
                 <input type="checkbox" checked={isSelected} onChange={() => onToggleSelect(link.id)} className={`w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-opacity ${ isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
            </div>
            <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white pr-4">{link.title}</h3>
                    <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">{new Date(link.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 h-10 overflow-hidden">{link.description}</p>
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(link.priority)}`}>{link.priority}</span>
                        <span className="px-2 py-1 text-xs text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-full">{link.topic}</span>
                        <AttachmentsIndicator attachments={link.attachments} />
                        <RelatedLinksIndicator link={link} allLinks={allLinks} />
                    </div>
                     <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a href={link.url} target="_blank" rel="noopener noreferrer" title="Open Link" className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"><ExternalLinkIcon className="w-4 h-4" /></a>
                        <button onClick={() => onEdit(link)} title="Edit" className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"><EditIcon className="w-4 h-4" /></button>
                        <button onClick={() => onDelete(link.id)} title="Delete" className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LinkGallery: React.FC<LinkGalleryProps> = ({ links, allLinks, onEdit, onDelete, selectedIds, onToggleSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {links.map(link => (
        <LinkCard
            key={link.id}
            link={link}
            allLinks={allLinks}
            isSelected={selectedIds.includes(link.id)}
            onToggleSelect={onToggleSelect}
            onEdit={onEdit}
            onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default LinkGallery;