import React, { useState, useMemo, useEffect } from 'react';
import { Page, LinkItem, Dictionaries, ViewType, SortOption } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import { INITIAL_LINKS, INITIAL_DICTIONARIES } from './constants';
import { parseCSV, exportCSV } from './utils/csvHelper';
import TopNavBar from './components/TopNavBar';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LinkList from './components/LinkList';
import LinkGallery from './components/LinkGallery';
import EditLinkModal from './components/EditLinkModal';
import SettingsPage from './components/SettingsPage';
import Dashboard from './components/Dashboard';
import BatchActionsToolbar from './components/BatchActionsToolbar';

const App: React.FC = () => {
  const [links, setLinks] = useLocalStorage<LinkItem[]>('links', INITIAL_LINKS);
  const [dictionaries, setDictionaries] = useLocalStorage<Dictionaries>('dictionaries', INITIAL_DICTIONARIES);
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
  }, [theme]);
  
  const [page, setPage] = useState<Page>('resources');
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<ViewType>('list');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLinkIds, setSelectedLinkIds] = useState<string[]>([]);

  const handleTopicToggle = (topicValue: string) => {
    if (topicValue === 'all') {
      setSelectedTopics([]);
      return;
    }
    setSelectedTopics(prev =>
      prev.includes(topicValue)
        ? prev.filter(t => t !== topicValue)
        : [...prev, topicValue]
    );
  };

  const filteredLinks = useMemo(() => {
    return links
      .filter(link => {
        const topicMatch = selectedTopics.length === 0 || selectedTopics.includes(link.topic);
        const statusMatch = selectedStatus === 'all' || link.status === selectedStatus;
        const priorityMatch = selectedPriority === 'all' || link.priority === selectedPriority;
        const searchMatch = !searchTerm ||
          link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          link.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          link.url.toLowerCase().includes(searchTerm.toLowerCase());
        return topicMatch && searchMatch && statusMatch && priorityMatch;
      });
  }, [links, selectedTopics, searchTerm, selectedStatus, selectedPriority]);

  const sortedLinks = useMemo(() => {
    const sorted = [...filteredLinks];
    const priorityValues = Object.fromEntries(dictionaries.priorities.map((p, i) => [p.value, dictionaries.priorities.length - i]));

    if (sortOption === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'priority') {
      sorted.sort((a, b) => (priorityValues[b.priority] || 0) - (priorityValues[a.priority] || 0));
    } else { // default sort (by creation date)
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return sorted;
  }, [filteredLinks, sortOption, dictionaries.priorities]);

  const handleSaveLink = (link: LinkItem) => {
    const index = links.findIndex(l => l.id === link.id);
    if (index > -1) {
      setLinks(prev => prev.map(l => l.id === link.id ? link : l));
    } else {
      setLinks(prev => [link, ...prev]);
    }
  };

  const handleDeleteLink = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      // Also remove this id from any other links that relate to it
      setLinks(prev => {
        const updated = prev.filter(l => l.id !== id);
        return updated.map(l => ({
          ...l,
          relatedLinkIds: l.relatedLinkIds.filter(relatedId => relatedId !== id)
        }));
      });
    }
  };

  const openModalForEdit = (link: LinkItem) => {
    setEditingLink(link);
    setIsModalOpen(true);
  };

  const openModalForNew = () => {
    setEditingLink(null);
    setIsModalOpen(true);
  };
  
  const handleExport = () => {
    const csv = exportCSV(links);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'ai_navigator_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const newLinks = parseCSV(text);
        if (newLinks.length > 0) {
            setLinks(prev => [...prev, ...newLinks.filter(nl => !prev.some(pl => pl.id === nl.id))]);
            alert(`${newLinks.length} items imported successfully!`);
        } else {
            alert('Could not import any items. Please check the CSV format.');
        }
      };
      reader.readAsText(file);
    }
    if (event.target) {
        event.target.value = '';
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedLinkIds(prev =>
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedLinkIds.length === sortedLinks.length) {
      setSelectedLinkIds([]);
    } else {
      setSelectedLinkIds(sortedLinks.map(link => link.id));
    }
  };
  
  const handleBatchUpdate = (update: { status?: string; priority?: string }) => {
    setLinks(prev => prev.map(link => 
        selectedLinkIds.includes(link.id) ? { ...link, ...update } : link
    ));
    setSelectedLinkIds([]);
  };

  const renderContent = () => {
    if (page === 'dashboard') {
      return <Dashboard links={links} dictionaries={dictionaries} />;
    }
    if (page === 'settings') {
      return <SettingsPage dictionaries={dictionaries} onDictionariesUpdate={setDictionaries} />;
    }
    return (
      <div className="flex gap-8">
        <Sidebar selectedTopics={selectedTopics} onTopicToggle={handleTopicToggle} topics={dictionaries.topics} />
        <main className="flex-1">
          <Header
            view={view}
            onViewChange={setView}
            sortOption={sortOption}
            onSortChange={setSortOption}
            itemCount={sortedLinks.length}
            dictionaries={dictionaries}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedPriority={selectedPriority}
            onPriorityChange={setSelectedPriority}
          />
          {selectedLinkIds.length > 0 && (
            <BatchActionsToolbar 
              selectedCount={selectedLinkIds.length}
              onUpdate={handleBatchUpdate}
              onClear={() => setSelectedLinkIds([])}
              dictionaries={dictionaries}
            />
          )}
          {view === 'list' ? (
            <LinkList
              links={sortedLinks}
              allLinks={links}
              onEdit={openModalForEdit}
              onDelete={handleDeleteLink}
              selectedIds={selectedLinkIds}
              onToggleSelect={handleToggleSelect}
              onToggleSelectAll={handleToggleSelectAll}
            />
          ) : (
            <LinkGallery
              links={sortedLinks}
              allLinks={links}
              onEdit={openModalForEdit}
              onDelete={handleDeleteLink}
              selectedIds={selectedLinkIds}
              onToggleSelect={handleToggleSelect}
            />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TopNavBar
        page={page}
        onPageChange={setPage}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddNew={openModalForNew}
        onExport={handleExport}
        onImport={handleImport}
        theme={theme}
        onThemeChange={setTheme}
      />
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </div>
      <EditLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLink}
        linkToEdit={editingLink}
        dictionaries={dictionaries}
        allLinks={links}
      />
    </div>
  );
};

export default App;