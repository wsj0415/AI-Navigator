import React, { useState, useEffect } from 'react';
import { LinkItem, Dictionaries } from '../types';
import { ExternalLinkIcon, AttachmentIcon, NotesIcon, PencilIcon, EditIcon } from './Icons';
import MarkdownRenderer from './MarkdownRenderer';

interface ResourceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: LinkItem | null;
  dictionaries: Dictionaries;
  onEdit: (link: LinkItem) => void;
}

const getLabel = (items: {code: string, label: string}[], code: string) => items.find(i => i.code === code)?.label || code;

const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({ isOpen, onClose, link, dictionaries, onEdit }) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesContent, setNotesContent] = useState('');

  useEffect(() => {
    if (link) {
      setNotesContent(link.notes || '');
    }
  }, [link]);

  if (!isOpen || !link) return null;
  
  const handleSaveNotes = () => {
    // This is a temporary local save. The full save happens through the onSave prop in App.tsx
    // For a real app, this would be a direct API call or a more specific state update.
    // For now, let's assume the parent will handle the actual save through the edit modal.
    const updatedLink = { ...link, notes: notesContent };
    onEdit(updatedLink); // Re-open the edit modal with the updated notes
    setIsEditingNotes(false);
    onClose(); // Close this detail modal
  };

  const handleGoToEdit = () => {
      onClose();
      onEdit(link);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl m-4 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        {link.image && <img src={link.image} alt={link.title} className="w-full h-48 object-cover rounded-t-lg bg-gray-200" />}
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-start">
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white ">{link.title}</h2>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline flex items-center gap-1 truncate">
                    {link.url}
                    <ExternalLinkIcon className="w-4 h-4" />
                </a>
            </div>
            <button onClick={handleGoToEdit} className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ml-4 flex-shrink-0">
                <EditIcon className="w-5 h-5"/>
            </button>
        </div>
        <div className="p-6 overflow-y-auto flex-grow">
            <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                   Category: {getLabel(dictionaries.topics, link.topic)}
                </span>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
                   Priority: {getLabel(dictionaries.priorities, link.priority)}
                </span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                   Status: {getLabel(dictionaries.statuses, link.status)}
                </span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">{link.description}</p>
            
            <div className="mb-6">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2"><NotesIcon className="w-5 h-5" /> Notes</span>
                    {!isEditingNotes && (
                        <button onClick={() => setIsEditingNotes(true)} className="p-1 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-hover rounded-full text-xs flex items-center gap-1">
                            <PencilIcon className="w-4 h-4" /> Edit
                        </button>
                    )}
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md border dark:border-gray-700">
                    {isEditingNotes ? (
                        <div>
                            <textarea 
                                value={notesContent}
                                onChange={(e) => setNotesContent(e.target.value)}
                                className="form-input w-full"
                                rows={5}
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button onClick={() => setIsEditingNotes(false)} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-1 px-3 rounded-md text-sm">Cancel</button>
                                <button onClick={handleSaveNotes} className="bg-primary hover:bg-primary-hover text-white font-semibold py-1 px-3 rounded-md text-sm">Save & Edit</button>
                            </div>
                        </div>
                    ) : (
                        <MarkdownRenderer content={notesContent || 'No notes added yet.'} />
                    )}
                </div>
            </div>
            
            {link.fileAttachment && (
                <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2"><AttachmentIcon className="w-5 h-5" /> Attached File</h3>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md border dark:border-gray-700">
                        <p className="font-mono text-sm text-gray-700 dark:text-gray-300 mb-2">{link.fileAttachment.name}</p>
                        <pre className="text-xs text-gray-500 dark:text-gray-400 whitespace-pre-wrap max-h-48 overflow-y-auto">{link.fileAttachment.content}</pre>
                    </div>
                </div>
            )}

        </div>
        <div className="bg-gray-100 dark:bg-gray-800 px-6 py-3 flex justify-end gap-3 rounded-b-lg">
            <button type="button" onClick={onClose} className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-md transition duration-200 text-sm">Close</button>
        </div>
        <style>{`.form-input { display: block; width: 100%; border-radius: 0.375rem; border: 1px solid #d1d5db; background-color: #f9fafb; padding: 0.5rem 0.75rem; color: #1f2937; } .dark .form-input { border-color: #444; background-color: #2d2d2d; color: #e0e0e0; }`}</style>
      </div>
    </div>
  );
};

export default ResourceDetailModal;