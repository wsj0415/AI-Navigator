import React, { useState } from 'react';
import { DictionaryItem } from '../types';
import { PlusIcon, TrashIcon, EditIcon, CheckIcon } from './Icons';

interface DictionaryManagerProps {
  title: string;
  items: DictionaryItem[];
  onUpdate: (items: DictionaryItem[]) => void;
}

const DictionaryManager: React.FC<DictionaryManagerProps> = ({ title, items, onUpdate }) => {
  const [newItemValue, setNewItemValue] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const handleAdd = () => {
    if (newItemValue.trim() && !items.some(item => item.value === newItemValue.trim())) {
      const newItem: DictionaryItem = { id: crypto.randomUUID(), value: newItemValue.trim() };
      onUpdate([...items, newItem]);
      setNewItemValue('');
    }
  };

  const handleDelete = (id: string) => {
    onUpdate(items.filter(item => item.id !== id));
  };

  const handleStartEdit = (item: DictionaryItem) => {
    setEditingId(item.id);
    setEditingValue(item.value);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue('');
  };

  const handleSaveEdit = (id: string) => {
    if (editingValue.trim()) {
      onUpdate(items.map(item => item.id === id ? { ...item, value: editingValue.trim() } : item));
      handleCancelEdit();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="space-y-2 mb-4">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700/50 p-2 rounded-md group">
            {editingId === item.id ? (
              <input
                type="text"
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(item.id)}
                onBlur={() => handleSaveEdit(item.id)}
                className="form-input text-sm flex-grow bg-gray-200 dark:bg-gray-600 border-primary"
                autoFocus
              />
            ) : (
              <span className="text-gray-700 dark:text-gray-300">{item.value}</span>
            )}
            <div className="flex items-center gap-2">
              {editingId === item.id ? (
                <button onClick={() => handleSaveEdit(item.id)} className="text-green-600 dark:text-green-500 hover:text-green-500 dark:hover:text-green-400"><CheckIcon className="w-5 h-5"/></button>
              ) : (
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleStartEdit(item)} className="text-gray-500 dark:text-gray-400 hover:text-blue-500"><EditIcon className="w-4 h-4"/></button>
                  <button onClick={() => handleDelete(item.id)} className="text-gray-500 dark:text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4"/></button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <form action="." onSubmit={(e) => { e.preventDefault(); handleAdd(); }} className="flex gap-2">
        <input
          type="text"
          value={newItemValue}
          onChange={(e) => setNewItemValue(e.target.value)}
          placeholder={`Add new ${title.slice(0, -1)}`}
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