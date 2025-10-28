import React, { useState, useEffect, useRef } from 'react';
import { LinkItem, Dictionaries, FileAttachment } from '../types';
import { summarizeUrl } from '../services/geminiService';
import { CloseIcon, SparklesIcon, SpinnerIcon } from './Icons';
import MarkdownRenderer from './MarkdownRenderer';
import { useNotification } from '../contexts/NotificationContext';


interface EditLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (link: LinkItem) => void;
  linkToEdit: LinkItem | null;
  dictionaries: Dictionaries;
  links: LinkItem[];
}

const EditLinkModal: React.FC<EditLinkModalProps> = ({ isOpen, onClose, onSave, linkToEdit, dictionaries, links }) => {
  const initialFormState: Partial<LinkItem> = {
    url: '',
    title: '',
    description: '',
    topic: dictionaries.topics.find(t => t.isEnabled)?.code || '',
    priority: dictionaries.priorities.find(p => p.code === 'medium')?.code || '',
    status: dictionaries.statuses.find(s => s.isEnabled)?.code || '',
    notes: '',
  };

  const [formData, setFormData] = useState<Partial<LinkItem>>(initialFormState);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addNotification } = useNotification();


  const validate = (data: Partial<LinkItem>) => {
      const newErrors: { [key: string]: string } = {};
      if (!data.url) newErrors.url = 'URL is required.';
      else {
          try {
              new URL(data.url);
          } catch (_) {
              newErrors.url = 'Please enter a valid URL.';
          }
      }
      if (!data.title) newErrors.title = 'Title is required.';

      // Check for duplicate URL on add, but not when editing the same item
      if (links.some(link => link.url === data.url && link.id !== data.id)) {
          newErrors.url = 'A resource with this URL already exists.';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (isOpen) {
      if (linkToEdit) {
        setFormData(linkToEdit);
      } else {
        setFormData(initialFormState);
      }
      setErrors({});
    } else {
        setFormData(initialFormState);
    }
  }, [isOpen, linkToEdit, dictionaries]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    validate(newFormData);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const fileName = selectedFile.name.toLowerCase();

      if (fileName.endsWith('.csv') || fileName.endsWith('.md')) {
        addNotification('CSV and Markdown files are not supported for attachments.', 'error');
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (readEvent) => {
        const fileAttachment: FileAttachment = {
          name: selectedFile.name,
          type: selectedFile.type,
          content: readEvent.target?.result as string, // For text files
        };
        setFormData(prev => ({ ...prev, fileAttachment }));
      };

      if (selectedFile.type.startsWith('text/')) {
        reader.readAsText(selectedFile);
      } else {
          addNotification("Only text-based files (.txt, .json, etc.) can be attached.", 'info');
          if(fileInputRef.current) fileInputRef.current.value = "";
          setFormData(prev => ({...prev, fileAttachment: undefined}));
      }
    }
  };
  
  const handleSummarize = async () => {
    if (!formData.url || !formData.url.startsWith('http')) {
      addNotification("Please enter a valid URL to summarize.", "error");
      return;
    }
    setIsSummarizing(true);
    try {
      const { title, description, topic } = await summarizeUrl(formData.url);
      const topicCode = dictionaries.topics.find(t => t.label.toLowerCase() === topic.toLowerCase())?.code || 'other';
      const newFormData = { ...formData, title, description, topic: topicCode };
      setFormData(newFormData);
      validate(newFormData);
    } catch (error) {
      console.error("Summarization failed:", error);
      addNotification("Failed to summarize the URL. Check console for details.", "error");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(formData)) return;

    setIsSaving(true);
    const linkToSave: LinkItem = {
      id: linkToEdit?.id || crypto.randomUUID(),
      createdAt: linkToEdit?.createdAt || new Date().toISOString(),
      ...initialFormState,
      ...formData,
    } as LinkItem;

    // Simulate async save for spinner visibility
    await new Promise(res => setTimeout(res, 300));

    onSave(linkToSave);
    setIsSaving(false);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl m-4 h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{linkToEdit ? 'Edit Resource' : 'Add New Resource'}</h2>
          <button onClick={onClose} title="Close" className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><CloseIcon className="w-5 h-5" /></button>
        </header>
        
        <form id="edit-link-form" onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
            <div className="relative">
                <label htmlFor="url" className="form-label">URL</label>
                <input type="url" id="url" name="url" value={formData.url} onChange={handleChange} className={`form-input pr-28 ${errors.url ? 'border-red-500' : ''}`} placeholder="https://example.com" required />
                <button type="button" onClick={handleSummarize} disabled={isSummarizing || !formData.url} className="absolute right-1.5 top-7 flex items-center gap-1.5 bg-primary/20 hover:bg-primary/30 text-primary font-semibold py-1.5 px-3 rounded-md text-sm transition disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSummarizing ? <SpinnerIcon className="w-4 h-4 animate-spin"/> : <SparklesIcon className="w-4 h-4" />}
                    {isSummarizing ? 'Analyzing...' : 'AI Fill'}
                </button>
                 {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url}</p>}
            </div>
            <div>
                <label htmlFor="title" className="form-label">Title</label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className={`form-input ${errors.title ? 'border-red-500' : ''}`} required />
                 {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>
            <div>
                <label htmlFor="description" className="form-label">Description</label>
                <textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} className="form-input" rows={2}></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="topic" className="form-label">Category</label>
                    <select id="topic" name="topic" value={formData.topic} onChange={handleChange} className="form-input">
                        {dictionaries.topics.filter(t=>t.isEnabled).map(t => <option key={t.id} value={t.code}>{t.label}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="priority" className="form-label">Priority</label>
                    <select id="priority" name="priority" value={formData.priority} onChange={handleChange} className="form-input">
                        {dictionaries.priorities.filter(p=>p.isEnabled).map(p => <option key={p.id} value={p.code}>{p.label}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="status" className="form-label">Status</label>
                    <select id="status" name="status" value={formData.status} onChange={handleChange} className="form-input">
                        {dictionaries.statuses.filter(s=>s.isEnabled).map(s => <option key={s.id} value={s.code}>{s.label}</option>)}
                    </select>
                </div>
            </div>
             <div>
                <label htmlFor="notes" className="form-label">Notes (Markdown supported)</label>
                <textarea id="notes" name="notes" value={formData.notes || ''} onChange={handleChange} className="form-input" rows={5}></textarea>
            </div>
             <div>
                <label className="form-label">Attach Text File</label>
                 <div className="flex items-center gap-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-grow text-sm text-gray-600 dark:text-gray-300 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-3 text-center hover:border-primary hover:text-primary transition">
                        {formData.fileAttachment ? `Attached: ${formData.fileAttachment.name}` : 'Click to select a file'}
                    </button>
                    {formData.fileAttachment && <button type="button" onClick={() => setFormData(p => ({...p, fileAttachment: undefined}))} className="text-red-500 hover:text-red-700 text-sm font-semibold">Remove</button>}
                 </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="text/*,.json,.xml,.html,.js,.css" />
            </div>

            {formData.notes && (
                <div>
                    <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Notes Preview</h4>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md max-h-48 overflow-y-auto">
                        <MarkdownRenderer content={formData.notes} />
                    </div>
                </div>
            )}
        </form>
        
        <footer className="bg-gray-100 dark:bg-gray-800/50 px-6 py-3 flex justify-end gap-3 rounded-b-lg flex-shrink-0">
            <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-md transition duration-200 text-sm">Cancel</button>
            <button type="submit" form="edit-link-form" disabled={Object.keys(errors).length > 0 || isSaving} className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-md transition duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                {isSaving && <SpinnerIcon className="w-4 h-4 animate-spin"/>}
                {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
        </footer>
        <style>{`.form-label { display: block; font-weight: 500; font-size: 0.875rem; color: #374151; margin-bottom: 0.25rem; } .dark .form-label { color: #d1d5db; } .form-input { display: block; width: 100%; border-radius: 0.375rem; border: 1px solid #d1d5db; background-color: #f9fafb; padding: 0.5rem 0.75rem; color: #1f2937; transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; } .dark .form-input { border-color: #4b5563; background-color: #1f2937; color: #f3f4f6; } .form-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); } .form-input.border-red-500 { border-color: #ef4444; } .form-input.border-red-500:focus { border-color: #ef4444; box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.5); }`}</style>
      </div>
    </div>
  );
};

export default EditLinkModal;