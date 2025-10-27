import React from 'react';
import { Dictionaries, DictionaryItem } from '../types';
import DictionaryManager from './DictionaryManager';

interface SettingsPageProps {
  dictionaries: Dictionaries;
  onDictionariesUpdate: (newDictionaries: Dictionaries) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ dictionaries, onDictionariesUpdate }) => {

  const handleUpdate = (key: keyof Dictionaries) => (items: DictionaryItem[]) => {
    onDictionariesUpdate({
      ...dictionaries,
      [key]: items,
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
      
      <div className="max-w-4xl mx-auto space-y-8">
        <DictionaryManager
          title="Categories"
          items={dictionaries.topics}
          onUpdate={handleUpdate('topics')}
        />
        <DictionaryManager
          title="Priorities"
          items={dictionaries.priorities}
          onUpdate={handleUpdate('priorities')}
        />
        <DictionaryManager
          title="Statuses"
          items={dictionaries.statuses}
          onUpdate={handleUpdate('statuses')}
        />
      </div>
    </div>
  );
};

export default SettingsPage;