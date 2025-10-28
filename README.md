# AI Nexus

An intelligent web application to manage, classify, and analyze your AI-related web links and resources. AI Nexus uses the Gemini API to automatically extract metadata, making it effortless to build your personal knowledge base.

## ✨ Key Features

- **🤖 AI-Powered Classification:** Automatically fetches the title, description, and suggests a category for any URL you add.
- **🚀 Browser Extension:** A companion extension to quickly clip and save web pages to your knowledge base with a single click.
- **🖼️ Multiple Views:** Browse your resources in a detailed **List View** or a visually-appealing **Gallery View**.
- **✏️ Dynamic Metadata:** Edit all resource attributes, including titles, descriptions, priorities, and statuses.
- **📚 Digital Dictionary:** Dynamically manage your own set of categories, priorities, and statuses on the Settings page.
- **⚡ Batch Processing:** Select multiple items to update their status or priority all at once.
- **🔍 Powerful Search & Filtering:** Quickly find resources with full-text search and filter by category.
- **📊 Statistics Dashboard:** Get an at-a-glance overview of your collection with an analytics dashboard.
- **↔️ Data Portability:** Easily import and export your entire collection as a CSV file.
- **🌐 Offline First:** All data is stored locally in your browser's IndexedDB, making the app fast and available offline.

## 🚀 Getting Started

This is a static web application that runs entirely in the browser.

1.  An `API_KEY` for the Gemini API must be available as an environment variable (`process.env.API_KEY`).
2.  Serve the `index.html` file using any static file server.
3.  Open the served URL in your web browser.

### Using the Browser Extension

This project includes a browser extension to make saving links effortless.

1.  Navigate to `chrome://extensions` in your Chromium-based browser.
2.  Enable "Developer Mode".
3.  Click "Load unpacked" and select this project's root folder.
4.  Pin the extension to your toolbar for easy access.

Now, when you're on a page you want to save, just click the extension icon!

**For detailed instructions, see the [User Manual](MANUAL.md).**

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript
- **Styling:** Tailwind CSS
- **AI:** Google Gemini API (`@google/genai`)
- **Data Persistence:** Browser IndexedDB
- **Charts:** Recharts
- **Extension:** Browser Extension (Manifest V3)

---

*This project was built with the assistance of a world-class AI agent.*