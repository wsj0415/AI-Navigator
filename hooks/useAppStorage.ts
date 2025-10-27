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
                const [dbLinks, dbDicts] = await Promise.all([
                    db.getAllLinks(),
                    db.getDictionaries()
                ]);
                
                setLinks(dbLinks || []);
                setDictionaries(dbDicts || INITIAL_DICTIONARIES);

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