import React, { useState } from 'react';
import { Dictionaries } from '../types';

interface BatchActionsToolbarProps {
  selectedCount: number;
  onUpdate: (update: { status?: string; priority?: string }) => void;
  onClear: () => void;
  dictionaries: Dictionaries;
}

const BatchActionsToolbar: React.FC<BatchActionsToolbarProps> = ({ selectedCount, onUpdate, onClear, dictionaries }) => {
  const [newStatus, setNewStatus] = useState<string>('');
  const [newPriority, setNewPriority] = useState<string>('');

  const handleApply = () => {
    const update: { status?: string; priority?: string } = {};
    if (newStatus) update.status = newStatus;
    if (newPriority) update.priority = newPriority;

    if (Object.keys(update).length > 0) {
      onUpdate(update);
    }
  };

  return (
    <div className="my-4 p-3 bg-blue-50 dark:bg-gray-700 rounded-lg flex flex-wrap items-center justify-between gap-4 border border-blue-200 dark:border-blue-500/50">
      <div className="flex items-center gap-4">
        <span className="font-semibold text-gray-800 dark:text-white">{selectedCount} items selected</span>
        
        <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="form-input text-sm">
            <option value="">Change Status</option>
            {dictionaries.statuses.map(opt => <option key={opt.id} value={opt.value}>{opt.value}</option>)}
        </select>
        
        <select value={newPriority} onChange={e => setNewPriority(e.target.value)} className="form-input text-sm">
            <option value="">Change Priority</option>
            {dictionaries.priorities.map(opt => <option key={opt.id} value={opt.value}>{opt.value}</option>)}
        </select>
        
        <button onClick={handleApply} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1 px-3 rounded-md text-sm transition">
            Apply
        </button>
      </div>
      
      <button onClick={onClear} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-sm font-semibold">
        Clear Selection
      </button>
      <style>{`.form-input { display: block; border-radius: 0.375rem; border: 1px solid #d1d5db; background-color: #f3f4f6; padding: 0.25rem 0.5rem; color: #1f2937; } .dark .form-input { border-color: #444; background-color: #2d2d2d; color: #e0e0e0; } .form-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); }`}</style>
    </div>
  );
};

export default BatchActionsToolbar;