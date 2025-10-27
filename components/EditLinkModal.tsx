import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LinkItem, Dictionaries, Attachment } from '../types';
import { SparklesIcon, LinkIcon, PaperclipIcon, TrashIcon } from './Icons';
import { summarizeUrl } from '../services/geminiService';

interface EditLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (link: LinkItem) => void;
  linkToEdit: LinkItem | null;
  dictionaries: Dictionaries;
  allLinks: LinkItem[];
}

const RelatedLinksManager: React.FC<{
    allLinks: LinkItem[];
    currentLink: Omit<LinkItem, 'id' | 'createdAt'>;
    selectedIds: string[];
    setSelectedIds: (ids: string[]) => void;
}> = ({ allLinks, currentLink, selectedIds, setSelectedIds }) => {

    const availableLinks = useMemo(() => {
        return allLinks.filter(link => link.url !== currentLink.url);
    }, [allLinks, currentLink.url]);

    const handleToggle = (id: string) => {
        setSelectedIds(
            selectedIds.includes(id)
                ? selectedIds.filter(i => i !== id)
                : [...selectedIds, id]
        );
    };

    return (
        <div>
            <label className="form-label flex items-center gap-2"><LinkIcon className="w-4 h-4"/> Related Resources</label>
            <div className="max-h-32 overflow-y-auto bg-gray-100 dark:bg-gray-700/50 p-2 rounded-md border border-gray-300 dark:border-gray-600 space-y-1">
                {availableLinks.length > 0 ? availableLinks.map(link => (
                    <div key={link.id} className="flex items-center gap-2 p-1 rounded hover:bg-gray-200/50 dark:hover:bg-gray-600/50">
                        <input
                            type="checkbox"
                            id={`related-${link.id}`}
                            checked={selectedIds.includes(link.id)}
                            onChange={() => handleToggle(link.id)}
                            className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label htmlFor={`related-${link.id}`} className="text-sm text-gray-700 dark:text-gray-300 truncate cursor-pointer">{link.title}</label>
                    </div>
                )) : (
                    <p className="text-sm text-gray-400 dark:text-gray-500 text-center p-2">No other resources to link.</p>
                )}
            </div>
        </div>
    );
};

const AttachmentsManager: React.FC<{
    attachments: Attachment[];
    onAttachmentsChange: (attachments: Attachment[]) => void;
}> = ({ attachments, onAttachmentsChange }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (files: FileList | null) => {
        if (!files) return;
        
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newAttachment: Attachment = {
                    id: crypto.randomUUID(),
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    dataUrl: e.target?.result as string,
                };
                onAttachmentsChange([...attachments, newAttachment]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileChange(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    }, [onAttachmentsChange, attachments, handleFileChange]);

    const removeAttachment = (id: string) => {
        onAttachmentsChange(attachments.filter(att => att.id !== id));
    };

    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return (
        <div>
            <label className="form-label flex items-center gap-2"><PaperclipIcon className="w-4 h-4"/> Attachments</label>
            <div 
                onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
                className={`p-4 border-2 border-dashed rounded-md text-center cursor-pointer transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-400 dark:border-gray-600 hover:border-gray-500'}`}
            >
                <input type="file" multiple className="hidden" id="file-upload" onChange={e => handleFileChange(e.target.files)} />
                <label htmlFor="file-upload" className="cursor-pointer">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Drag & drop files here, or click to select files</p>
                </label>
            </div>
            {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                    {attachments.map(att => (
                        <div key={att.id} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700/50 p-2 rounded-md text-sm">
                            <span className="text-gray-700 dark:text-gray-300 truncate">{att.name} <span className="text-gray-400 dark:text-gray-500">({formatBytes(att.size)})</span></span>
                            <button type="button" onClick={() => removeAttachment(att.id)} className="text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4"/></button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const EditLinkModal: React.FC<EditLinkModalProps> = ({ isOpen, onClose, onSave, linkToEdit, dictionaries, allLinks }) => {
  const getInitialState = () => ({
    url: '',
    title: '',
    description: '',
    topic: dictionaries.topics[0]?.value || '',
    priority: dictionaries.priorities[0]?.value || '',
    status: dictionaries.statuses[0]?.value || '',
    relatedLinkIds: [],
    attachments: [],
  });

  const [linkData, setLinkData] = useState<Omit<LinkItem, 'id' | 'createdAt'>>(getInitialState());
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (linkToEdit) {
        setLinkData({
          ...linkToEdit,
          relatedLinkIds: linkToEdit.relatedLinkIds || [],
          attachments: linkToEdit.attachments || [],
        });
      } else {
        setLinkData(getInitialState());
      }
      setError('');
    }
  }, [isOpen, linkToEdit, dictionaries]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setLinkData({ ...linkData, [e.target.name]: e.target.value });
  };
  
  const setRelatedIds = (ids: string[]) => {
       setLinkData(prev => ({...prev, relatedLinkIds: ids }));
  };
  
  const setAttachments = (attachments: Attachment[]) => {
    setLinkData(prev => ({ ...prev, attachments }));
  };

  const handleSummarize = async () => {
    if (!linkData.url) {
        setError('Please enter a URL first.');
        return;
    }
    setError('');
    setIsSummarizing(true);
    try {
        const result = await summarizeUrl(linkData.url);
        setLinkData(prev => ({
            ...prev,
            title: result.title,
            description: result.description,
            topic: dictionaries.topics.some(t => t.value === result.topic) ? result.topic : 'Other'
        }));
    } catch (e) {
        setError('Failed to summarize the URL.');
    } finally {
        setIsSummarizing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkData.url || !linkData.title) {
        setError('URL and Title are required.');
        return;
    }
    const finalLink: LinkItem = {
      id: linkToEdit?.id || crypto.randomUUID(),
      createdAt: linkToEdit?.createdAt || new Date().toISOString(),
      ...linkData,
    };
    onSave(finalLink);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{linkToEdit ? 'Edit Resource' : 'Add New Resource'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="url" className="form-label">URL</label>
                <div className="flex gap-2">
                    <input type="url" id="url" name="url" value={linkData.url} onChange={handleChange} required className="form-input flex-grow" placeholder="https://example.com" />
                    <button type="button" onClick={handleSummarize} disabled={isSummarizing} className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-md flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        <SparklesIcon className={`w-5 h-5 ${isSummarizing ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">{isSummarizing ? 'Analyzing...' : 'AI Analyze'}</span>
                    </button>
                </div>
              </div>
              <div>
                <label htmlFor="title" className="form-label">Title</label>
                <input type="text" id="title" name="title" value={linkData.title} onChange={handleChange} required className="form-input" />
              </div>
              <div>
                <label htmlFor="description" className="form-label">Description</label>
                <textarea id="description" name="description" value={linkData.description} onChange={handleChange} rows={3} className="form-input"></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                      <label htmlFor="topic" className="form-label">Category</label>
                      <select id="topic" name="topic" value={linkData.topic} onChange={handleChange} className="form-input">
                          {dictionaries.topics.map(opt => <option key={opt.id} value={opt.value}>{opt.value}</option>)}
                      </select>
                  </div>
                  <div>
                      <label htmlFor="priority" className="form-label">Priority</label>
                      <select id="priority" name="priority" value={linkData.priority} onChange={handleChange} className="form-input">
                           {dictionaries.priorities.map(opt => <option key={opt.id} value={opt.value}>{opt.value}</option>)}
                      </select>
                  </div>
                  <div>
                      <label htmlFor="status" className="form-label">Status</label>
                      <select id="status" name="status" value={linkData.status} onChange={handleChange} className="form-input">
                           {dictionaries.statuses.map(opt => <option key={opt.id} value={opt.value}>{opt.value}</option>)}
                      </select>
                  </div>
              </div>

              <RelatedLinksManager
                  allLinks={allLinks}
                  currentLink={linkData}
                  selectedIds={linkData.relatedLinkIds}
                  setSelectedIds={setRelatedIds}
              />

              <AttachmentsManager
                attachments={linkData.attachments}
                onAttachmentsChange={setAttachments}
              />

            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 flex justify-end gap-3 rounded-b-lg">
            {error && <p className="text-sm text-red-500 self-center mr-auto">{error}</p>}
            <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white font-semibold py-2 px-4 rounded-md transition">Cancel</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition">Save</button>
          </div>
        </form>
      </div>
      <style>{`.form-label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; color: #374151; } .dark .form-label { color: #d1d5db; } .form-input { display: block; width: 100%; border-radius: 0.375rem; border: 1px solid #d1d5db; background-color: #f9fafb; padding: 0.5rem 0.75rem; color: #1f2937; } .dark .form-input { border-color: #4b5563; background-color: #374151; color: #e5e7eb; } .form-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); }`}</style>
    </div>
  );
};

export default EditLinkModal;