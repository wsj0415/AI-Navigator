# AI Navigator

An intelligent web application to manage, classify, and analyze your AI-related web links and resources. AI Navigator uses the Gemini API to automatically extract metadata, making it effortless to build your personal knowledge base.

## ✨ Key Features

- **🤖 AI-Powered Classification:** Automatically fetches the title, description, and suggests a category for any URL you add.
- **🖼️ Multiple Views:** Browse your resources in a detailed **List View** or a visually-appealing **Gallery View**.
- **✏️ Dynamic Metadata:** Edit all resource attributes, including titles, descriptions, priorities, and statuses.
- **📚 Digital Dictionary:** Dynamically manage your own set of categories, priorities, and statuses on the Settings page.
- **⚡ Batch Processing:** Select multiple items to update their status or priority all at once.
- **🔍 Powerful Search & Filtering:** Quickly find resources with full-text search and filter by category.
- **📊 Statistics Dashboard:** Get an at-a-glance overview of your collection with an analytics dashboard.
- **↔️ Data Portability:** Easily import and export your entire collection as a CSV file.
- **🌐 Offline First:** All data is stored locally in your browser, making the app fast and available offline.

## 🚀 Getting Started

This is a static web application that runs entirely in the browser.

1.  An `API_KEY` for the Gemini API must be available as an environment variable (`process.env.API_KEY`).
2.  Serve the `index.html` file using any static file server.
3.  Open the served URL in your web browser.

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript
- **Styling:** Tailwind CSS
- **AI:** Google Gemini API (`@google/genai`)
- **Data Persistence:** Browser Local Storage
- **Charts:** Recharts

---

*This project was built with the assistance of a world-class AI agent.*
