import React from 'react';
import { LinkItem, Attachment } from '../types';
import { EditIcon, TrashIcon, ExternalLinkIcon, LinkIcon, PaperclipIcon } from './Icons';

interface LinkListProps {
  links: LinkItem[];
  allLinks: LinkItem[];
  onEdit: (link: LinkItem) => void;
  onDelete: (id: string) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
}

const RelatedLinksTooltip: React.FC<{ link: LinkItem; allLinks: LinkItem[] }> = ({ link, allLinks }) => {
  if (link.relatedLinkIds.length === 0) {
    return <span className="text-gray-400 dark:text-gray-500">-</span>;
  }
  const relatedLinks = allLinks.filter(l => link.relatedLinkIds.includes(l.id));

  return (
    <div className="relative group flex items-center gap-1">
      <LinkIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
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

const AttachmentsTooltip: React.FC<{ attachments: Attachment[] }> = ({ attachments }) => {
  if (!attachments || attachments.length === 0) {
    return <span className="text-gray-400 dark:text-gray-500">-</span>;
  }

  return (
    <div className="relative group flex items-center gap-1">
      <PaperclipIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
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


const LinkRow: React.FC<{
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
        <tr className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
            <td className="w-4 p-4">
                <input type="checkbox" checked={isSelected} onChange={() => onToggleSelect(link.id)} className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            </td>
            <td className="px-4 py-3">
                <div className="font-semibold text-gray-900 dark:text-white truncate max-w-xs">{link.title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{link.description}</div>
            </td>
            <td className="px-4 py-3">
                <span className="px-2 py-1 text-xs text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-full">{link.topic}</span>
            </td>
            <td className="px-4 py-3 text-center">
                <AttachmentsTooltip attachments={link.attachments} />
            </td>
             <td className="px-4 py-3 text-center">
                <RelatedLinksTooltip link={link} allLinks={allLinks} />
            </td>
            <td className="px-4 py-3">
                 <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(link.priority)}`}>{link.priority}</span>
            </td>
            <td className="px-4 py-3">{link.status}</td>
            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{new Date(link.createdAt).toLocaleDateString()}</td>
            <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" title="Open Link" className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"><ExternalLinkIcon className="w-4 h-4" /></a>
                    <button onClick={() => onEdit(link)} title="Edit" className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"><EditIcon className="w-4 h-4" /></button>
                    <button onClick={() => onDelete(link.id)} title="Delete" className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"><TrashIcon className="w-4 h-4" /></button>
                </div>
            </td>
        </tr>
    );
}

const LinkList: React.FC<LinkListProps> = ({ links, allLinks, onEdit, onDelete, selectedIds, onToggleSelect, onToggleSelectAll }) => {
  return (
    <div className="relative overflow-x-auto bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="p-4">
                <input type="checkbox" onChange={onToggleSelectAll} checked={links.length > 0 && selectedIds.length === links.length} className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
            </th>
            <th scope="col" className="px-4 py-3">Resource</th>
            <th scope="col" className="px-4 py-3">Category</th>
            <th scope="col" className="px-4 py-3">Attachments</th>
            <th scope="col" className="px-4 py-3">Related</th>
            <th scope="col" className="px-4 py-3">Priority</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3">Date Added</th>
            <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
            {links.map(link => (
                <LinkRow 
                    key={link.id}
                    link={link}
                    allLinks={allLinks}
                    isSelected={selectedIds.includes(link.id)}
                    onToggleSelect={onToggleSelect}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default LinkList;