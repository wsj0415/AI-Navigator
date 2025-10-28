import React, { useState } from 'react';
import { DictionaryItem } from '../types';
// Fix: Use relative path for component imports.
import { PlusIcon, TrashIcon, EditIcon, CheckIcon, ArrowUpIcon, ArrowDownIcon } from './Icons';

interface DictionaryManagerProps {
  title: string;
  items: DictionaryItem[];
  onUpdate: (items: DictionaryItem[]) => void;
}

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`${checked ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
    >
        <span
            aria-hidden="true"
            className={`${checked ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
    </button>
);

const DictionaryManager: React.FC<DictionaryManagerProps> = ({ title, items, onUpdate }) => {
  const [newItemLabel, setNewItemLabel] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState('');
  
  const sortedItems = [...items].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleAdd = () => {
    if (newItemLabel.trim() && !items.some(item => item.label.toLowerCase() === newItemLabel.trim().toLowerCase())) {
      const newItem: DictionaryItem = { 
        id: crypto.randomUUID(), 
        label: newItemLabel.trim(),
        code: newItemLabel.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        sortOrder: items.length,
        isEnabled: true,
      };
      onUpdate([...items, newItem]);
      setNewItemLabel('');
    }
  };

  const handleDelete = (id: string) => {
    onUpdate(items.filter(item => item.id !== id));
  };

  const handleStartEdit = (item: DictionaryItem) => {
    setEditingId(item.id);
    setEditingLabel(item.label);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingLabel('');
  };

  const handleSaveEdit = (id: string) => {
    if (editingLabel.trim()) {
      onUpdate(items.map(item => item.id === id ? { ...item, label: editingLabel.trim() } : item));
      handleCancelEdit();
    }
  };
  
  const handleToggleEnabled = (id: string, isEnabled: boolean) => {
      onUpdate(items.map(item => item.id === id ? { ...item, isEnabled } : item));
  };
  
  const handleMove = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= sortedItems.length) return;
    
    const reorderedItems = [...sortedItems];
    const [movedItem] = reorderedItems.splice(fromIndex, 1);
    reorderedItems.splice(toIndex, 0, movedItem);
    
    const finalItems = reorderedItems.map((item, index) => ({ ...item, sortOrder: index }));
    onUpdate(finalItems);
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="space-y-2 mb-4">
        {sortedItems.map((item, index) => (
          <div key={item.id} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700/50 p-2 rounded-md group">
            <div className="flex items-center gap-3 flex-grow">
                <ToggleSwitch checked={item.isEnabled} onChange={(checked) => handleToggleEnabled(item.id, checked)} />
                {editingId === item.id ? (
                  <input
                    type="text"
                    value={editingLabel}
                    onChange={(e) => setEditingLabel(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(item.id)}
                    onBlur={() => handleSaveEdit(item.id)}
                    className="form-input text-sm flex-grow bg-gray-200 dark:bg-gray-600 border-primary"
                    autoFocus
                  />
                ) : (
                  <span className={`text-gray-700 dark:text-gray-300 ${!item.isEnabled ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>{item.label}</span>
                )}
            </div>
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleMove(index, index - 1)} disabled={index === 0} className="p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"><ArrowUpIcon className="w-4 h-4" /></button>
                    <button onClick={() => handleMove(index, index + 1)} disabled={index === sortedItems.length - 1} className="p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"><ArrowDownIcon className="w-4 h-4" /></button>
                    <button onClick={() => handleStartEdit(item)} className="p-1 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"><EditIcon className="w-4 h-4"/></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"><TrashIcon className="w-4 h-4"/></button>
                </div>
            </div>
          </div>
        ))}
      </div>
      <form action="." onSubmit={(e) => { e.preventDefault(); handleAdd(); }} className="flex gap-2">
        <input
          type="text"
          value={newItemLabel}
          onChange={(e) => setNewItemLabel(e.target.value)}
          placeholder={`Add new ${title.slice(0, -1)} label`}
          className="form-input flex-grow"
        />
        <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-semibold p-2 rounded-md flex items-center justify-center">
          <PlusIcon className="w-5 h-5" />
        </button>
      </form>
       <style>{`.form-input { display: block; width: 100%; border-radius: 0.375rem; border: 1px solid #d1d5db; background-color: #f9fafb; padding: 0.5rem 0.75rem; color: #1f2937; transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; } .dark .form-input { border-color: #444; background-color: #2d2d2d; color: #e0e0e0; } .form-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); }`}</style>
    </div>
  );
};

export default DictionaryManager;
