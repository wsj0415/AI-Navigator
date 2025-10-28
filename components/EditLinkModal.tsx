import React, { useState, useEffect, useRef } from 'react';
import { LinkItem, Dictionaries } from '../types';
import { summarizeUrl } from '../services/geminiService';
import { AttachmentIcon, TrashIcon } from './Icons';

interface EditLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (link: LinkItem) => void;
  linkToEdit: LinkItem | null;
  dictionaries: Dictionaries;
}

const EditLinkModal: React.FC<EditLinkModalProps> = ({ isOpen, onClose, onSave, linkToEdit, dictionaries }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topic, setTopic] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [fileAttachment, setFileAttachment] = useState<LinkItem['fileAttachment'] | undefined>(undefined);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (linkToEdit) {
      setUrl(linkToEdit.url);
      setTitle(linkToEdit.title);
      setDescription(linkToEdit.description);
      setTopic(linkToEdit.topic);
      setPriority(linkToEdit.priority);
      setStatus(linkToEdit.status);
      setNotes(linkToEdit.notes || '');
      setFileAttachment(linkToEdit.fileAttachment);
    } else {
      // Reset form for new link
      setUrl(linkToEdit?.url || '');
      setTitle(linkToEdit?.title || '');
      setDescription(linkToEdit?.description || '');
      setTopic(linkToEdit?.topic || dictionaries.topics.find(t => t.isEnabled)?.code || '');
      setPriority(linkToEdit?.priority || dictionaries.priorities.find(p => p.code === 'medium')?.code || dictionaries.priorities[0]?.code || '');
      setStatus(linkToEdit?.status || dictionaries.statuses.find(s => s.isEnabled)?.code || '');
      setNotes(linkToEdit?.notes || '');
      setFileAttachment(linkToEdit?.fileAttachment);
    }
  }, [linkToEdit, isOpen, dictionaries]);

  const handleSummarize = async () => {
    if (!url) return;
    setIsSummarizing(true);
    try {
      const summary = await summarizeUrl(url);
      setTitle(summary.title);
      setDescription(summary.description);
      const matchedTopic = dictionaries.topics.find(t => t.label.toLowerCase() === summary.topic.toLowerCase() && t.isEnabled);
      setTopic(matchedTopic?.code || 'other');
    } catch (error) {
      console.error("Failed to summarize URL:", error);
    } finally {
      setIsSummarizing(false);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFileAttachment({ name: file.name, content });
      };
      reader.readAsText(file);
    }
  };

  const handleRemoveAttachment = () => {
    setFileAttachment(undefined);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !title) return;

    const savedLink: LinkItem = {
      ...(linkToEdit || {}),
      id: linkToEdit?.id || crypto.randomUUID(),
      createdAt: linkToEdit?.createdAt || new Date().toISOString(),
      url,
      title,
      description,
      topic,
      priority,
      status,
      notes,
      fileAttachment,
    };
    onSave(savedLink);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg m-4 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="p-6 overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{linkToEdit ? 'Edit Resource' : 'Add New Resource'}</h2>
            <div className="space-y-4">
              <div className="flex items-end gap-2">
                <div className="flex-grow">
                  <label htmlFor="url" className="form-label">URL</label>
                  <input type="url" id="url" value={url} onChange={e => setUrl(e.target.value)} className="form-input" required />
                </div>
                <button type="button" onClick={handleSummarize} disabled={isSummarizing || !url} className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-md transition duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0">
                  {isSummarizing ? 'Analyzing...' : 'Auto-fill'}
                </button>
              </div>
              <div>
                <label htmlFor="title" className="form-label">Title</label>
                <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="form-input" required />
              </div>
              <div>
                <label htmlFor="description" className="form-label">Description</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} className="form-input" rows={2}></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="topic" className="form-label">Category</label>
                  <select id="topic" value={topic} onChange={e => setTopic(e.target.value)} className="form-input">
                    {dictionaries.topics.filter(t => t.isEnabled).map(t => <option key={t.id} value={t.code}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="priority" className="form-label">Priority</label>
                  <select id="priority" value={priority} onChange={e => setPriority(e.target.value)} className="form-input">
                    {dictionaries.priorities.filter(p => p.isEnabled).map(p => <option key={p.id} value={p.code}>{p.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="status" className="form-label">Status</label>
                  <select id="status" value={status} onChange={e => setStatus(e.target.value)} className="form-input">
                    {dictionaries.statuses.filter(s => s.isEnabled).map(s => <option key={s.id} value={s.code}>{s.label}</option>)}
                  </select>
                </div>
              </div>
               <div>
                <label htmlFor="notes" className="form-label">Notes</label>
                <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} className="form-input" rows={3} placeholder="Add any personal notes here... (Markdown supported)"></textarea>
              </div>
              <div>
                <label className="form-label">Attachment</label>
                {fileAttachment ? (
                    <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                        <div className="flex items-center gap-2">
                           <AttachmentIcon className="w-5 h-5 text-gray-500"/>
                           <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{fileAttachment.name}</span>
                        </div>
                        <button type="button" onClick={handleRemoveAttachment} title="Remove attachment" className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded-full">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <input 
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".txt,.md,.csv,.json,.html,.xml"
                        className="form-input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                )}
              </div>
            </div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 px-6 py-3 flex justify-end gap-3 rounded-b-lg mt-auto">
            <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-md transition duration-200 text-sm">Cancel</button>
            <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-md transition duration-200 text-sm">Save</button>
          </div>
        </form>
         <style>{`.form-label { display: block; margin-bottom: 0.25rem; font-medium; color: #374151; } .dark .form-label { color: #d1d5db; } .form-input { display: block; width: 100%; border-radius: 0.375rem; border: 1px solid #d1d5db; background-color: #f9fafb; padding: 0.5rem 0.75rem; color: #1f2937; transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; } .dark .form-input { border-color: #444; background-color: #2d2d2d; color: #e0e0e0; } .form-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); }`}</style>
      </div>
    </div>
  );
};

export default EditLinkModal;