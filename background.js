// This is the background service worker for the extension.

// The URL where your AI Navigator application is hosted.
// IMPORTANT: You MUST replace this with the actual URL where you deploy your app.
const APP_URL = 'https://ai-resource-navigator-273197415019.us-west1.run.app/';

// Listen for when the user clicks on the browser action (the extension's icon).
chrome.action.onClicked.addListener(async (tab) => {
  // The 'tab' object contains information about the tab that was active when the icon was clicked.
  if (tab.url && !tab.url.startsWith('chrome://')) {
    // Construct the new URL with the 'addUrl' query parameter.
    const newUrl = `${APP_URL}?addUrl=${encodeURIComponent(tab.url)}`;

    // Create a new tab and navigate to the constructed URL.
    chrome.tabs.create({ url: newUrl });
  }
});