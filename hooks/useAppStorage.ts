import { useState, useEffect, useCallback } from 'react';
import * as db from '../utils/db';
import { LinkItem, Dictionaries } from '../types';
import { INITIAL_LINKS, INITIAL_DICTIONARIES } from '../constants';

export function useAppStorage() {
    const [isInitialized, setIsInitialized] = useState(false);
    const [links, setLinks] = useState<LinkItem[]>([]);
    const [dictionaries, setDictionaries] = useState<Dictionaries>(INITIAL_DICTIONARIES);

    useEffect(() => {
        const loadData = async () => {
            try {
                await db.initDB();
                let [dbLinks, dbDicts] = await Promise.all([
                    db.getAllLinks(),
                    db.getDictionaries()
                ]);
                
                // Check if the old format { value: '...' } exists, indicating migration is needed.
                const dictionariesNeedMigration = dbDicts && dbDicts.topics.length > 0 && (dbDicts.topics[0] as any).value !== undefined;

                if (dictionariesNeedMigration) {
                    console.log("Running data migration for dictionaries and links...");
                    
                    const valueToCodeMaps = { topics: new Map(), priorities: new Map(), statuses: new Map() };
                    
                    const migrateDict = (items: any[], map: Map<string, string>) => items.map((item, index) => {
                        const code = item.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        map.set(item.value, code);
                        return {
                            id: item.id,
                            code: code,
                            label: item.value,
                            sortOrder: index,
                            isEnabled: true,
                        };
                    });

                    const newTopics = migrateDict(dbDicts.topics, valueToCodeMaps.topics);
                    const newPriorities = migrateDict(dbDicts.priorities, valueToCodeMaps.priorities);
                    const newStatuses = migrateDict(dbDicts.statuses, valueToCodeMaps.statuses);
                    
                    const migratedDicts = { topics: newTopics, priorities: newPriorities, statuses: newStatuses };
                    
                    const migratedLinks = dbLinks.map(link => ({
                        ...link,
                        topic: valueToCodeMaps.topics.get(link.topic) || 'other',
                        priority: valueToCodeMaps.priorities.get(link.priority) || 'low',
                        status: valueToCodeMaps.statuses.get(link.status) || 'to-read',
                    }));

                    await Promise.all([
                        db.putDictionaries(migratedDicts),
                        db.clearAndBulkPutLinks(migratedLinks)
                    ]);
                    
                    setLinks(migratedLinks);
                    setDictionaries(migratedDicts);

                } else {
                    setLinks(dbLinks || []);
                    setDictionaries(dbDicts || INITIAL_DICTIONARIES);
                }

            } catch (error) {
                console.error("Failed to initialize DB:", error);
                // Fallback to constants if DB fails to init
                setLinks(INITIAL_LINKS);
                setDictionaries(INITIAL_DICTIONARIES);
            } finally {
                setIsInitialized(true);
            }
        };
        loadData();
    }, []);

    const setAndPersistLinks = useCallback(async (value: LinkItem[] | ((prev: LinkItem[]) => LinkItem[])) => {
        const linksToStore = value instanceof Function ? value(links) : value;
        setLinks(linksToStore); // Optimistic UI update
        try {
            await db.clearAndBulkPutLinks(linksToStore);
        } catch (err) {
            console.error("Failed to persist links", err);
        }
    }, [links]);

    const setAndPersistDictionaries = useCallback(async (value: Dictionaries | ((prev: Dictionaries) => Dictionaries)) => {
        const dictsToStore = value instanceof Function ? value(dictionaries) : value;
        setDictionaries(dictsToStore); // Optimistic UI update
        try {
            await db.putDictionaries(dictsToStore);
        } catch (err) {
            console.error("Failed to persist dictionaries", err);
        }
    }, [dictionaries]);

    return { 
        isInitialized, 
        links, 
        setLinks: setAndPersistLinks, 
        dictionaries, 
        setDictionaries: setAndPersistDictionaries 
    };
}
