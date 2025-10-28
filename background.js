// background.js

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'get-page-data') {
    // This needs to be async to handle all the chrome API calls
    (async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab || !tab.id) {
          throw new Error("Could not get active tab.");
        }

        const favicon = await getFavicon(tab.id, tab.url);
        const screenshot = await chrome.tabs.captureVisibleTab(tab.windowId, { format: 'jpeg', quality: 80 });

        sendResponse({
          success: true,
          data: {
            url: tab.url,
            title: tab.title,
            favicon: favicon,
            image: screenshot,
          },
        });
      } catch (error) {
        console.error('Error getting page data:', error);
        sendResponse({ success: false, error: error.message });
      }
    })();
    
    // Return true to indicate you wish to send a response asynchronously
    return true; 
  }
});

async function getFavicon(tabId, tabUrl) {
    try {
        const results = await chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['getFavicon.js'],
        });

        if (results && results[0] && results[0].result) {
            return results[0].result;
        }
    } catch (e) {
        console.log("Could not get favicon from script, falling back to Google proxy", e);
        // Fallback for sites that block scripting (e.g., chrome web store)
        return `https://www.google.com/s2/favicons?domain=${new URL(tabUrl).hostname}&sz=32`;
    }
    return null;
}
