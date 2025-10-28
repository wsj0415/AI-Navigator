import React, { useState, useEffect, useMemo } from 'react';
import TopNavBar from './components/TopNavBar';
import Dashboard from './components/Dashboard';
import FilterPanel from './components/FilterPanel';
import Header from './components/Header';
import LinkList from './components/LinkList';
import LinkGallery from './components/LinkGallery';
import EditLinkModal from './components/EditLinkModal';
import SettingsPage from './components/SettingsPage';
import BatchActionsToolbar from './components/BatchActionsToolbar';
import OnboardingGuide from './components/OnboardingGuide';
import ResourceDetailModal from './components/ResourceDetailModal';
import { useAppStorage } from './hooks/useAppStorage';
import useLocalStorage from './hooks/useLocalStorage';
import { LinkItem, Page, ViewType, SortOption, ThemeSetting } from './types';
import { exportLinksToCsv, importLinksFromCsv } from './utils/csvHelper';

const App: React.FC = () => {
  const { isInitialized, links, setLinks, dictionaries, setDictionaries } = useAppStorage();
  const [page, setPage] = useLocalStorage<Page>('app-page', 'dashboard');
  const [theme, setTheme] = useLocalStorage<ThemeSetting>('app-theme', 'system');
  const [view, setView] = useLocalStorage<ViewType>('app-view', 'list');
  const [sortOption, setSortOption] = useLocalStorage<SortOption>('app-sort', 'default');
  const [showOnboarding, setShowOnboarding] = useLocalStorage('show-onboarding', true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [linkToEdit, setLinkToEdit] = useState<LinkItem | null>(null);
  const [linkToView, setLinkToView] = useState<LinkItem | null>(null);
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const handleOpenFromExtension = (event: Event) => {
        const customEvent = event as CustomEvent;
        const { url, title, description, topic, image, favicon } = customEvent.detail;
        const newLink: LinkItem = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            url,
            title,
            description,
            topic: dictionaries.topics.find(t => t.label.toLowerCase() === topic?.toLowerCase() && t.isEnabled)?.code || 'other',
            priority: 'medium',
            status: 'to-read',
            image,
            favicon,
        };
        setLinkToEdit(newLink);
        setIsEditModalOpen(true);
    };

    window.addEventListener('ai-nexus:add-resource', handleOpenFromExtension);
    return () => {
        window.removeEventListener('ai-nexus:add-resource', handleOpenFromExtension);
    };

  }, [theme, dictionaries.topics]);

  const handleAddNew = () => {
    setLinkToEdit(null);
    setIsEditModalOpen(true);
  };

  const handleEdit = (link: LinkItem) => {
    setLinkToEdit(link);
    setIsEditModalOpen(true);
  };
  
  const handleViewDetails = (link: LinkItem) => {
    setLinkToView(link);
    setIsDetailModalOpen(true);
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
        setLinks(prev => prev.filter(link => link.id !== id));
    }
  };

  const handleSave = (link: LinkItem) => {
    setLinks(prev => {
        const existing = prev.find(l => l.id === link.id);
        if (existing) {
            return prev.map(l => l.id === link.id ? link : l);
        }
        return [link, ...prev];
    });
    setIsEditModalOpen(false);
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        return newSet;
    });
  };

  const handleBatchUpdate = (update: { status?: string; priority?: string }) => {
    setLinks(prev => prev.map(link => selectedIds.has(link.id) ? { ...link, ...update } : link));
    setSelectedIds(new Set());
  };
  
  const handleExport = () => {
      exportLinksToCsv(links, dictionaries);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const text = await file.text();
      try {
          const newLinks = await importLinksFromCsv(text, dictionaries);
          setLinks(prev => [...newLinks, ...prev.filter(pl => !newLinks.some(nl => nl.id === pl.id))]);
          alert(`${newLinks.length} links imported successfully!`);
      } catch (error) {
          console.error("Failed to import CSV", error);
          alert("Failed to import CSV. Please check the file format and console for errors.");
      }
      event.target.value = ''; // Reset file input
  };
  
  const handleToggleFilter = (codes: string[], setCodes: React.Dispatch<React.SetStateAction<string[]>>) => (code: string) => {
      setCodes(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
  }

  const filteredLinks = useMemo(() => {
    return links
      .filter(link => {
        const searchLower = searchTerm.toLowerCase();
        return (
          (link.title.toLowerCase().includes(searchLower) ||
          link.description.toLowerCase().includes(searchLower) ||
          link.url.toLowerCase().includes(searchLower) ||
          link.fileAttachment?.content?.toLowerCase().includes(searchLower)) &&
          (selectedTopics.length === 0 || selectedTopics.includes(link.topic)) &&
          (selectedStatuses.length === 0 || selectedStatuses.includes(link.status)) &&
          (selectedPriorities.length === 0 || selectedPriorities.includes(link.priority))
        );
      })
      .sort((a, b) => {
        if (sortOption === 'title') return a.title.localeCompare(b.title);
        if (sortOption === 'priority') {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return (priorityOrder[a.priority as keyof typeof priorityOrder] ?? 99) - (priorityOrder[b.priority as keyof typeof priorityOrder] ?? 99);
        }
        // default sort (createdAt)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [links, searchTerm, selectedTopics, selectedStatuses, selectedPriorities, sortOption]);

  if (!isInitialized) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">Loading...</div>;
  }
  
  const renderPage = () => {
      switch (page) {
          case 'dashboard':
              return <Dashboard links={links} dictionaries={dictionaries} />;
          case 'settings':
              return <SettingsPage dictionaries={dictionaries} onDictionariesUpdate={setDictionaries} />;
          case 'resources':
          default:
              return (
                 <div className="flex gap-6">
                    <FilterPanel 
                        dictionaries={dictionaries}
                        selectedTopics={selectedTopics} onTopicToggle={handleToggleFilter(selectedTopics, setSelectedTopics)}
                        selectedStatuses={selectedStatuses} onStatusToggle={handleToggleFilter(selectedStatuses, setSelectedStatuses)}
                        selectedPriorities={selectedPriorities} onPriorityToggle={handleToggleFilter(selectedPriorities, setSelectedPriorities)}
                    />
                    <main className="flex-grow">
                        <Header 
                            view={view} 
                            onViewChange={setView} 
                            sortOption={sortOption}
                            onSortChange={setSortOption}
                            itemCount={filteredLinks.length}
                        />
                        {selectedIds.size > 0 && <BatchActionsToolbar selectedCount={selectedIds.size} onUpdate={handleBatchUpdate} onClear={() => setSelectedIds(new Set())} dictionaries={dictionaries} />}
                        {view === 'list' ? (
                            <LinkList links={filteredLinks} dictionaries={dictionaries} onEdit={handleEdit} onDelete={handleDelete} onSelect={handleSelect} selectedIds={selectedIds} onViewDetails={handleViewDetails} />
                        ) : (
                            <LinkGallery links={filteredLinks} dictionaries={dictionaries} onEdit={handleEdit} onDelete={handleDelete} onSelect={handleSelect} selectedIds={selectedIds} onViewDetails={handleViewDetails}/>
                        )}
                    </main>
                 </div>
              );
      }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200">
      <TopNavBar
        page={page}
        onPageChange={setPage}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddNew={handleAddNew}
        onExport={handleExport}
        onImport={handleImport}
        theme={theme}
        onThemeChange={setTheme}
      />
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderPage()}
      </div>
      <EditLinkModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleSave} linkToEdit={linkToEdit} dictionaries={dictionaries} />
      <ResourceDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} link={linkToView} dictionaries={dictionaries} onEdit={handleEdit} />
      {showOnboarding && page === 'resources' && <OnboardingGuide onComplete={() => setShowOnboarding(false)} />}
    </div>
  );
};

export default App;