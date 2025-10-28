import React, { useState } from 'react';
import { LinkItem, Dictionaries } from '../types';
import { CloseIcon, EditIcon, TrashIcon, PlusIcon, SparklesIcon, FileIcon, ExternalLinkIcon, LinkIcon } from './Icons';
import MarkdownRenderer from './MarkdownRenderer';

interface ResourceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: LinkItem | null;
  dictionaries: Dictionaries;
  allLinks: LinkItem[];
  onEdit: (link: LinkItem) => void;
  onDelete: (id: string) => void;
  onUpdateLink: (link: LinkItem) => void; // For internal updates like removing a related link
  onAddRelated: (link: LinkItem) => void;
  onFindRelated: (link: LinkItem) => Promise<string[]>;
  onNavigate: (linkId: string) => void;
}

const getLabel = (items: {code: string, label: string}[], code: string) => items.find(i => i.code === code)?.label || code;

const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({
    isOpen, onClose, link, dictionaries, allLinks, onEdit, onDelete, onUpdateLink, onAddRelated, onFindRelated, onNavigate
}) => {
    const [activeTab, setActiveTab] = useState<'details' | 'notes' | 'related'>('details');
    const [isFindingRelated, setIsFindingRelated] = useState(false);

    if (!isOpen || !link) return null;

    const relatedLinks = (link.relatedLinkIds || [])
        .map(id => allLinks.find(l => l.id === id))
        .filter((l): l is LinkItem => l !== undefined);
        
    const handleFindRelatedClick = async () => {
        setIsFindingRelated(true);
        await onFindRelated(link);
        setIsFindingRelated(false);
    };

    const handleRemoveRelated = (relatedId: string) => {
        const updatedIds = link.relatedLinkIds?.filter(id => id !== relatedId) || [];
        onUpdateLink({ ...link, relatedLinkIds: updatedIds });
    };
    
    const handleDeleteClick = () => {
        if(window.confirm(`Are you sure you want to delete "${link.title}"?`)) {
            onDelete(link.id);
            onClose();
        }
    }

    const TabButton: React.FC<{ tab: 'details' | 'notes' | 'related', children: React.ReactNode }> = ({ tab, children }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl m-4 h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <img src={link.favicon || `https://www.google.com/s2/favicons?domain=${link.url}&sz=32`} alt="favicon" className="w-6 h-6 rounded-md object-cover flex-shrink-0 bg-gray-200" />
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate" title={link.title}>{link.title}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <a href={link.url} target="_blank" rel="noopener noreferrer" title="Open Link" className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><ExternalLinkIcon className="w-5 h-5" /></a>
                        <button onClick={() => onEdit(link)} title="Edit" className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><EditIcon className="w-5 h-5" /></button>
                        <button onClick={handleDeleteClick} title="Delete" className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><TrashIcon className="w-5 h-5" /></button>
                        <button onClick={onClose} title="Close" className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><CloseIcon className="w-5 h-5" /></button>
                    </div>
                </header>

                <main className="flex-grow overflow-y-auto">
                    <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 border-b border-gray-200 dark:border-gray-800">
                        <nav className="flex items-center gap-2">
                            <TabButton tab="details">Details</TabButton>
                            <TabButton tab="notes">Notes & Files</TabButton>
                            <TabButton tab="related">Related</TabButton>
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'details' && (
                            <div className="space-y-4">
                                <p className="text-gray-600 dark:text-gray-300">{link.description}</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                                        <div className="text-gray-500 dark:text-gray-400 font-medium">Category</div>
                                        <div className="text-gray-900 dark:text-white font-semibold">{getLabel(dictionaries.topics, link.topic)}</div>
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                                        <div className="text-gray-500 dark:text-gray-400 font-medium">Priority</div>
                                        <div className="text-gray-900 dark:text-white font-semibold">{getLabel(dictionaries.priorities, link.priority)}</div>
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                                        <div className="text-gray-500 dark:text-gray-400 font-medium">Status</div>
                                        <div className="text-gray-900 dark:text-white font-semibold">{getLabel(dictionaries.statuses, link.status)}</div>
                                    </div>
                                </div>
                                {link.image && <div className="pt-4">
                                    <img src={link.image} alt={link.title} className="w-full h-auto object-cover rounded-lg border border-gray-200 dark:border-gray-700"/>
                                </div>}
                            </div>
                        )}
                        {activeTab === 'notes' && (
                            <div>
                                {link.notes && <div className="mb-6"><h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Notes</h3><MarkdownRenderer content={link.notes} /></div>}
                                {link.fileAttachment && <div className="mb-6"><h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Attached File: {link.fileAttachment.name}</h3><div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg max-h-96 overflow-auto"><pre className="text-sm whitespace-pre-wrap">{link.fileAttachment.content}</pre></div></div>}
                                {!link.notes && !link.fileAttachment && <p className="text-gray-500 dark:text-gray-400">No notes or attached files for this resource.</p>}
                            </div>
                        )}
                        {activeTab === 'related' && (
                           <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Related Resources</h3>
                                    <div className="flex gap-2">
                                        <button onClick={handleFindRelatedClick} disabled={isFindingRelated} className="flex items-center gap-1.5 bg-primary/20 hover:bg-primary/30 text-primary font-semibold py-1.5 px-3 rounded-md text-sm transition disabled:opacity-50 disabled:cursor-not-allowed">
                                            <SparklesIcon className="w-4 h-4" />
                                            {isFindingRelated ? 'Finding...' : 'Find with AI'}
                                        </button>
                                        <button onClick={() => onAddRelated(link)} className="flex items-center gap-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-1.5 px-3 rounded-md transition text-sm">
                                            <PlusIcon className="w-4 h-4" />
                                            Add Manually
                                        </button>
                                    </div>
                                </div>
                                {relatedLinks.length > 0 ? (
                                    <ul className="space-y-2">
                                        {relatedLinks.map(related => (
                                            <li key={related.id} className="group flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800/50">
                                                <button onClick={() => onNavigate(related.id)} className="flex items-center gap-3 text-left">
                                                    <img src={related.favicon || `https://www.google.com/s2/favicons?domain=${related.url}&sz=16`} alt="" className="w-4 h-4 rounded-sm flex-shrink-0" />
                                                    <span className="text-gray-800 dark:text-gray-200 group-hover:text-primary">{related.title}</span>
                                                </button>
                                                <button onClick={() => handleRemoveRelated(related.id)} title="Remove link" className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 p-1 rounded-full">
                                                    <LinkIcon className="w-4 h-4 rotate-45"/>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">No related resources found.</p>
                                )}
                           </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ResourceDetailModal;
