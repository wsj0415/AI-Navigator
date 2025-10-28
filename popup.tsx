// Fix: The triple-slash directive for 'chrome' fails because type definitions are not available.
// Declaring 'chrome' as 'any' to resolve compilation errors and allow usage of Chrome extension APIs.
declare const chrome: any;

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { LinkItem, Dictionaries } from './types';

const Popup = () => {
    const [pageData, setPageData] = useState<Partial<LinkItem>>({});
    const [dictionaries, setDictionaries] = useState<Dictionaries | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Get current page data (title, url, screenshot, favicon)
                const pageResponse = await chrome.runtime.sendMessage({ type: 'get-page-data' });
                if (!pageResponse.success) throw new Error(pageResponse.error || 'Could not get page data.');
                setPageData(pageResponse.data);

                // 2. Find the AI Nexus tab to get dictionaries
                const tabs = await chrome.tabs.query({ url: "*://*/*" }); // A bit broad, but needed
                const appTab = tabs.find(t => t.title && t.title.includes('AI Nexus'));
                
                if (!appTab || !appTab.id) {
                    throw new Error("AI Nexus app not open. Please open it in a tab.");
                }

                // 3. Send message to content script in that tab
                const dictResponse = await chrome.tabs.sendMessage(appTab.id, { type: 'get-dictionaries' });
                if (!dictResponse || !dictResponse.success) throw new Error(dictResponse.error || "Could not fetch dictionaries.");
                
                setDictionaries(dictResponse.data);

            } catch (e: any) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);
    
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        try {
            const newLink: LinkItem = {
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
                url: pageData.url || '',
                title: pageData.title || '',
                description: pageData.description || '',
                topic: pageData.topic || dictionaries?.topics.find(t=>t.isEnabled)?.code || '',
                priority: pageData.priority || dictionaries?.priorities.find(p=>p.code==='medium')?.code || '',
                status: pageData.status || dictionaries?.statuses.find(s=>s.isEnabled)?.code || '',
                favicon: pageData.favicon,
                image: pageData.image,
                notes: pageData.notes,
            };

            const tabs = await chrome.tabs.query({ url: "*://*/*" });
            const appTab = tabs.find(t => t.title && t.title.includes('AI Nexus'));

            if (!appTab || !appTab.id) {
                throw new Error("Could not find AI Nexus tab to save to.");
            }
            
            await chrome.tabs.sendMessage(appTab.id, { type: 'save-link', payload: newLink });

            setSaveSuccess(true);
            setTimeout(() => window.close(), 1500);

        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPageData(prev => ({ ...prev, [name]: value }));
    };

    if (isLoading) {
        return <div className="loader"><p>Loading...</p></div>;
    }
    
    if (error) {
        return <div className="loader"><p style={{color: 'red'}}>{error}</p></div>;
    }
    
    if (saveSuccess) {
        return <div className="success-message"><p>✅ Saved Successfully!</p></div>;
    }

    return (
        <div className="container">
            <form onSubmit={handleSave}>
                <div className="form-group">
                    <label className="form-label">Title</label>
                    <input type="text" name="title" value={pageData.title || ''} onChange={handleChange} className="form-input" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Category</label>
                    <select name="topic" value={pageData.topic || dictionaries?.topics.find(t=>t.isEnabled)?.code || ''} onChange={handleChange} className="form-input">
                        {dictionaries?.topics.filter(t => t.isEnabled).map(t => <option key={t.id} value={t.code}>{t.label}</option>)}
                    </select>
                </div>
                 <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select name="priority" value={pageData.priority || dictionaries?.priorities.find(p=>p.code==='medium')?.code || ''} onChange={handleChange} className="form-input">
                        {dictionaries?.priorities.filter(t => t.isEnabled).map(t => <option key={t.id} value={t.code}>{t.label}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Notes</label>
                    <textarea name="notes" value={pageData.notes || ''} onChange={handleChange} className="form-input" placeholder="Add a quick note..."></textarea>
                </div>
                <button type="submit" className="button button-primary" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Resource'}
                </button>
            </form>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<Popup />);