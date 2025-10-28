import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TopNavBar from './components/TopNavBar';
import FilterPanel from './components/FilterPanel';
import Header from './components/Header';
import LinkList from './components/LinkList';
import LinkGallery from './components/LinkGallery';
import BatchActionsToolbar from './components/BatchActionsToolbar';
import EditLinkModal from './components/EditLinkModal';
import Dashboard from './components/Dashboard';
import SettingsPage from './components/SettingsPage';
import ResourceDetailModal from './components/ResourceDetailModal';
import AddRelatedLinkModal from './components/AddRelatedLinkModal';
import SuggestedLinksModal from './components/SuggestedLinksModal';
import Pagination from './components/Pagination';
import OnboardingGuide from './components/OnboardingGuide';

import { useAppStorage } from './hooks/useAppStorage';
import useLocalStorage from './hooks/useLocalStorage';
import { findRelatedLinks } from './services/geminiService';
import { exportLinksToCsv, importLinksFromCsv } from './utils/csvHelper';

import { NotificationProvider, useNotification } from './contexts/NotificationContext';
import { LinkItem, Dictionaries, ViewType, SortOption, Page, ThemeSetting } from './types';

const ITEMS_PER_PAGE = 20;

const AppContent: React.FC = () => {
    const { isInitialized, links, setLinks, dictionaries, setDictionaries } = useAppStorage();
    const { addNotification } = useNotification();

    // UI State
    const [page, setPage] = useLocalStorage<Page>('app-page', 'dashboard');
    const [theme, setTheme] = useLocalStorage<ThemeSetting>('app-theme', 'system');
    const [viewType, setViewType] = useLocalStorage<ViewType>('view-type', 'list');
    const [sortOption, setSortOption] = useLocalStorage<SortOption>('sort-option', 'default');
    const [showOnboarding, setShowOnboarding] = useLocalStorage('show-onboarding', true);

    // Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [linkToEdit, setLinkToEdit] = useState<LinkItem | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [linkToView, setLinkToView] = useState<LinkItem | null>(null);
    const [isAddRelatedModalOpen, setIsAddRelatedModalOpen] = useState(false);
    const [isSuggestedLinksModalOpen, setIsSuggestedLinksModalOpen] = useState(false);
    const [suggestedLinkIds, setSuggestedLinkIds] = useState<string[]>([]);
    
    // Filtering & Search State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

    // Selection & Pagination State
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);

    // Theme effect
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
    }, [theme]);
    
     // Event listeners for chrome extension
    useEffect(() => {
        const getDictionariesListener = (event: Event) => {
            document.dispatchEvent(new CustomEvent('ai-nexus:dictionaries-response', { detail: dictionaries }));
        };
        const saveLinkListener = (event: Event) => {
            const customEvent = event as CustomEvent;
            handleSaveLink(customEvent.detail);
            addNotification('Resource saved from extension!', 'success');
        };

        document.addEventListener('ai-nexus:get-dictionaries', getDictionariesListener);
        document.addEventListener('ai-nexus:save-link-from-extension', saveLinkListener);

        return () => {
            document.removeEventListener('ai-nexus:get-dictionaries', getDictionariesListener);
            document.removeEventListener('ai-nexus:save-link-from-extension', saveLinkListener);
        };
    }, [dictionaries, links]);


    // Filtering and Sorting Logic
    const filteredAndSortedLinks = useMemo(() => {
        let filtered = links;

        // Search
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            const fieldRegex = /(topic|priority|status|in):("([^"]*)"|(\w+))/g;
            
            const fieldFilters: { [key: string]: string } = {};
            let match;
            while((match = fieldRegex.exec(lowerCaseSearch)) !== null) {
                fieldFilters[match[1]] = match[3] || match[4];
            }

            const normalSearchTerm = lowerCaseSearch.replace(fieldRegex, '').trim();

            const getCode = (dict: keyof Dictionaries, value: string) => 
                dictionaries[dict].find(i => i.code.toLowerCase() === value || i.label.toLowerCase() === value)?.code;

            filtered = filtered.filter(link => {
                if (fieldFilters.topic) {
                    const code = getCode('topics', fieldFilters.topic);
                    if (!code || link.topic !== code) return false;
                }
                if (fieldFilters.priority) {
                    const code = getCode('priorities', fieldFilters.priority);
                    if (!code || link.priority !== code) return false;
                }
                if (fieldFilters.status) {
                    const code = getCode('statuses', fieldFilters.status);
                    if (!code || link.status !== code) return false;
                }

                if(normalSearchTerm) {
                    const searchInNotes = fieldFilters.in === 'notes' || fieldFilters.in === 'note';
                    const searchInFile = fieldFilters.in === 'file' || fieldFilters.in === 'attachment';

                    const inTitle = link.title.toLowerCase().includes(normalSearchTerm);
                    const inDesc = (link.description || '').toLowerCase().includes(normalSearchTerm);
                    const inUrl = link.url.toLowerCase().includes(normalSearchTerm);
                    const inNotes = (link.notes || '').toLowerCase().includes(normalSearchTerm);
                    const inFile = (link.fileAttachment?.content || '').toLowerCase().includes(normalSearchTerm);

                    if (searchInNotes) return inNotes;
                    if (searchInFile) return inFile;

                    return inTitle || inDesc || inUrl || inNotes || inFile;
                }
                
                return true; // Return true if only field filters were present
            });
        }
        
        // Multi-select filters
        if (selectedTopics.length > 0) filtered = filtered.filter(link => selectedTopics.includes(link.topic));
        if (selectedPriorities.length > 0) filtered = filtered.filter(link => selectedPriorities.includes(link.priority));
        if (selectedStatuses.length > 0) filtered = filtered.filter(link => selectedStatuses.includes(link.status));
        
        // Sorting
        const sorted = [...filtered];
        if (sortOption === 'title') {
            sorted.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortOption === 'priority') {
            const priorityOrder = dictionaries.priorities.reduce((acc, p, i) => ({...acc, [p.code]: p.sortOrder}), {} as Record<string, number>);
            sorted.sort((a, b) => (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99));
        } else { // default (newest first)
            sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        return sorted;
    }, [links, searchTerm, selectedTopics, selectedPriorities, selectedStatuses, sortOption, dictionaries]);
    
    // Pagination Logic
    const paginatedLinks = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAndSortedLinks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredAndSortedLinks, currentPage]);
    
    const totalPages = Math.ceil(filteredAndSortedLinks.length / ITEMS_PER_PAGE);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        } else if (currentPage === 0 && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);


    // Handlers
    const handleAddNew = () => {
        setLinkToEdit(null);
        setIsEditModalOpen(true);
    };

    const handleEdit = (link: LinkItem) => {
        setLinkToEdit(link);
        setIsEditModalOpen(true);
        setIsDetailModalOpen(false); // Close detail if editing from there
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            setLinks(prev => prev.filter(l => l.id !== id));
            addNotification('Resource deleted.', 'success');
        }
    };
    
    const handleSaveLink = (linkToSave: LinkItem) => {
        setLinks(prev => {
            const index = prev.findIndex(l => l.id === linkToSave.id);
            if (index > -1) {
                const newLinks = [...prev];
                newLinks[index] = linkToSave;
                return newLinks;
            }
            return [linkToSave, ...prev];
        });
        setIsEditModalOpen(false);
        addNotification(linkToEdit ? 'Resource updated!' : 'Resource added!', 'success');
    };
    
    const handleToggleFilter = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (code: string) => {
        setter(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
        setCurrentPage(1);
    }
    
    const handleSelect = (id: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };
    
    const handleBatchDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedIds.size} items?`)) {
            setLinks(prev => prev.filter(l => !selectedIds.has(l.id)));
            setSelectedIds(new Set());
            addNotification(`${selectedIds.size} resources deleted.`, 'success');
        }
    };

    const handleBatchUpdate = (update: { status?: string; priority?: string }) => {
        setLinks(prev => prev.map(l => selectedIds.has(l.id) ? { ...l, ...update } : l));
        setSelectedIds(new Set());
        addNotification(`${selectedIds.size} resources updated.`, 'success');
    };
    
    const handleExport = () => {
        exportLinksToCsv(links, dictionaries);
        addNotification('Data exported successfully!', 'success');
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const text = event.target?.result as string;
                try {
                    const importedLinks = await importLinksFromCsv(text, dictionaries);
                    const newLinkIds = new Set(importedLinks.map(l => l.id));
                    // Filter out existing links before adding new ones
                    const uniqueNewLinks = importedLinks.filter(il => !links.some(l => l.id === il.id));
                    setLinks(prev => [...uniqueNewLinks, ...prev]);
                    addNotification(`${uniqueNewLinks.length} new resources imported.`, 'success');
                } catch (error) {
                    console.error("CSV Import Error:", error);
                    addNotification('Failed to import CSV.', 'error');
                }
            };
            reader.readAsText(file);
            e.target.value = ''; // Reset file input
        }
    };
    
    const handleViewDetails = (link: LinkItem) => {
        setLinkToView(link);
        setIsDetailModalOpen(true);
    };

    const handleUpdateLinkFromDetail = (updatedLink: LinkItem) => {
        setLinks(prev => prev.map(l => l.id === updatedLink.id ? updatedLink : l));
        setLinkToView(updatedLink); // Keep modal updated
    };
    
    const handleAddRelated = (link: LinkItem) => {
        setLinkToView(link);
        setIsAddRelatedModalOpen(true);
    };
    
    const handleSaveRelated = (selectedIds: string[]) => {
        if(linkToView) {
            const updatedLink = {
                ...linkToView,
                relatedLinkIds: [...new Set([...(linkToView.relatedLinkIds || []), ...selectedIds])]
            };
            handleUpdateLinkFromDetail(updatedLink);
            addNotification('Related links added.', 'success');
        }
        setIsAddRelatedModalOpen(false);
    };

    const handleFindRelatedWithAI = useCallback(async (sourceLink: LinkItem) => {
        const candidateLinks = links.filter(l => l.id !== sourceLink.id && !(sourceLink.relatedLinkIds || []).includes(l.id));
        if (candidateLinks.length === 0) {
            addNotification("No other resources available to compare.", 'info');
            return [];
        }
        try {
            const relatedIds = await findRelatedLinks(sourceLink, candidateLinks);
            if (relatedIds.length > 0) {
                setSuggestedLinkIds(relatedIds);
                setIsSuggestedLinksModalOpen(true);
            } else {
                addNotification("AI couldn't find any new related links.", 'info');
            }
            return relatedIds;
        } catch(e) {
            addNotification("AI analysis failed. Please check your API key.", 'error');
            return [];
        }
    }, [links, addNotification]);
    
    const handleSaveAISuggestions = (selectedIds: string[]) => {
        if(linkToView) {
             const updatedLink = {
                ...linkToView,
                relatedLinkIds: [...new Set([...(linkToView.relatedLinkIds || []), ...selectedIds])]
            };
            handleUpdateLinkFromDetail(updatedLink);
            addNotification('AI suggested links added.', 'success');
        }
        setIsSuggestedLinksModalOpen(false);
    };
    
    const handleNavigateFromDetail = (linkId: string) => {
        const link = links.find(l => l.id === linkId);
        if (link) {
            setLinkToView(link);
        }
    };
    
    const handleNavigateAndFilter = useCallback((filters: { topic?: string; priority?: string; status?: string }) => {
        setPage('resources');
        setSearchTerm('');
        setSelectedTopics(filters.topic ? [filters.topic] : []);
        setSelectedPriorities(filters.priority ? [filters.priority] : []);
        setSelectedStatuses(filters.status ? [filters.status] : []);
        setCurrentPage(1);
    }, [setPage, setSearchTerm, setSelectedTopics, setSelectedPriorities, setSelectedStatuses, setCurrentPage]);

    if (!isInitialized) {
        return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900"><p className="text-lg">Loading AI Nexus...</p></div>;
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-950 min-h-screen font-sans text-gray-800 dark:text-gray-200">
            <TopNavBar 
                page={page} onPageChange={setPage}
                searchTerm={searchTerm} onSearchChange={setSearchTerm}
                onAddNew={handleAddNew} onExport={handleExport} onImport={handleImport}
                theme={theme} onThemeChange={setTheme}
            />
            
            <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                {page === 'dashboard' && <Dashboard links={links} dictionaries={dictionaries} onNavigateAndFilter={handleNavigateAndFilter} />}
                
                {page === 'settings' && <SettingsPage dictionaries={dictionaries} onDictionariesUpdate={setDictionaries} />}

                {page === 'resources' && (
                    <div className="flex gap-8">
                        <FilterPanel 
                            dictionaries={dictionaries}
                            selectedTopics={selectedTopics} onTopicToggle={handleToggleFilter(setSelectedTopics)}
                            selectedStatuses={selectedStatuses} onStatusToggle={handleToggleFilter(setSelectedStatuses)}
                            selectedPriorities={selectedPriorities} onPriorityToggle={handleToggleFilter(setSelectedPriorities)}
                        />
                        <div className="flex-grow">
                            <Header 
                                linkCount={filteredAndSortedLinks.length}
                                sortOption={sortOption} onSortChange={setSortOption}
                                viewType={viewType} onViewChange={setViewType}
                            />
                            {selectedIds.size > 0 && (
                                <BatchActionsToolbar 
                                    selectedCount={selectedIds.size}
                                    onDelete={handleBatchDelete}
                                    onUpdate={handleBatchUpdate}
                                    onClear={() => setSelectedIds(new Set())}
                                    dictionaries={dictionaries}
                                />
                            )}
                            {viewType === 'list' ? (
                                <LinkList links={paginatedLinks} dictionaries={dictionaries} onEdit={handleEdit} onDelete={handleDelete} onSelect={handleSelect} selectedIds={selectedIds} onViewDetails={handleViewDetails} />
                            ) : (
                                <LinkGallery links={paginatedLinks} dictionaries={dictionaries} onEdit={handleEdit} onDelete={handleDelete} onSelect={handleSelect} selectedIds={selectedIds} onViewDetails={handleViewDetails} />
                            )}
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                        </div>
                    </div>
                )}
            </main>
            
            <EditLinkModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveLink}
                linkToEdit={linkToEdit}
                dictionaries={dictionaries}
                links={links}
            />
            <ResourceDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                link={linkToView}
                dictionaries={dictionaries}
                allLinks={links}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onUpdateLink={handleUpdateLinkFromDetail}
                onAddRelated={handleAddRelated}
                onFindRelated={handleFindRelatedWithAI}
                onNavigate={handleNavigateFromDetail}
            />
            <AddRelatedLinkModal 
                isOpen={isAddRelatedModalOpen}
                onClose={() => setIsAddRelatedModalOpen(false)}
                onSave={handleSaveRelated}
                allLinks={links}
                currentLink={linkToView}
            />
            <SuggestedLinksModal
                isOpen={isSuggestedLinksModalOpen}
                onClose={() => setIsSuggestedLinksModalOpen(false)}
                onSave={handleSaveAISuggestions}
                allLinks={links}
                suggestedIds={suggestedLinkIds}
            />
            {showOnboarding && <OnboardingGuide onComplete={() => setShowOnboarding(false)} />}
        </div>
    );
};

const App: React.FC = () => (
    <NotificationProvider>
        <AppContent />
    </NotificationProvider>
);


export default App;