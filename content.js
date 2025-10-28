// This script is injected into the main AI Nexus web page.
// It acts as a bridge between the extension (popup/background) and the page's own scripts.

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'get-dictionaries') {
        const listener = (event) => {
            // Got the dictionaries from the page, now send them back to the extension
            sendResponse({ success: true, data: event.detail });
            document.removeEventListener('ai-nexus:dictionaries-response', listener);
        };
        document.addEventListener('ai-nexus:dictionaries-response', listener);
        
        // Ask the page for its dictionaries
        document.dispatchEvent(new CustomEvent('ai-nexus:get-dictionaries'));
        
        // Return true to indicate an asynchronous response
        return true;
    }
    
    if (request.type === 'save-link') {
        document.dispatchEvent(new CustomEvent('ai-nexus:save-link-from-extension', {
            detail: request.payload
        }));
        // We don't need a response for this one
    }
});
