# AI Nexus Roadmap

This document outlines the development roadmap for AI Nexus.

---

## 🚀 Project Phoenix: The Interactive Dashboard

With the core application complete, this next phase focuses on transforming the dashboard from a static report into a dynamic, personalized, and actionable command center.

-   [ ] **Interactive Dashboard (Phase 1):** Make all dashboard statistics and charts interactive. Clicking on a stat card or chart element will navigate to the resources page and apply the relevant filters.
-   [ ] **Personalized "For You" Center:** Implement an intelligent action center that suggests next steps, such as reviewing stale items, highlighting unlinked resources, and surfacing high-priority items that are ready to be started.
-   [ ] **Advanced Data Visualizations:** Add richer charts, like a topic distribution pie chart, to provide deeper insights into the user's collection.
-   [ ] **UI/UX Polish:** Implement elegant empty states for the dashboard and ensure all icons are consistent with the component library.

---

## ✅ Phase 1 Completed Features

-   **🚀 Foundational Setup:**
    -   [x] Initial project scaffolding with React and TypeScript.
    -   [x] Setup IndexedDB for local, offline-first data persistence.
    -   [x] Basic UI layout with placeholder components.
-   **🎨 Intelligent Theming:**
    -   [x] Implement Light/Dark mode.
    -   [x] Add a "System" theme option that respects OS-level preferences.
-   **📚 Digital Dictionaries v2:**
    -   [x] Refactor dictionaries (Topics, Priorities, Statuses) to a more robust data model (`code`, `label`, `sortOrder`, `isEnabled`).
    -   [x] Implement one-time automatic data migration for existing users.
    -   [x] Overhaul Settings page for full dictionary management (reorder, toggle, edit).
-   **🖼️ Project Nexus: UI/UX Overhaul:**
    -   [x] **Branding & Data Model:** Rename to "AI Nexus" and extend `LinkItem` to include `coverImageUrl` and `faviconUrl`.
    -   [x] **Browser Extension v2:** Upgrade extension to capture screenshots and favicons.
    -   [x] **Visual Redesign:** Overhaul List and Gallery views to be visual-first, with cover images and metadata "pills".
    -   [x] **New Filtering System:** Implement a persistent, multi-select filter panel, replacing the old sidebar and header dropdowns.
-   **📖 Resource Detail & Notes:**
    -   [x] Create a "Resource Detail" modal to view all information for a single item.
    -   [x] Add a `notes` field to resources, with support for Markdown.
-   **📎 File Attachments & Search:**
    -   [x] Add UI to attach text-based files to resources.
    -   [x] Make the content of attached files searchable via the main search bar.
-   **🔗 Related Links (Knowledge Graph):**
    -   [x] Implement data model and UI to view, add, and remove manual links between resources.
    -   [x] Add AI-powered suggestions for related links using the Gemini API.
-   **⚡ Batch Actions v2:**
    -   [x] Add Bulk Delete functionality to the batch actions toolbar.
-   **🔍 Advanced Search:**
    -   [x] Implement field-specific search syntax (e.g., `topic:Design`, `priority:high`).
-   **🚀 Browser Extension v3:**
    -   [x] Create a new popup UI for the browser extension.
    -   [x] Allow in-extension classification (setting category, priority, status) and note-taking.
-   **🔒 Data Validation:**
    -   [x] Implement robust validation in the Add/Edit modal (required fields, valid URL, duplicate URL check).
-   **⚡ Performance & Scalability:**
    -   [x] Implement pagination for the resources list to handle large collections.
-   **✨ Final Polish:**
    -   [x] Add loading indicators (spinners) for asynchronous actions (AI calls, saving).
    -   [x] Implement a global, non-intrusive "toast" notification system for errors and success messages.
    -   [x] Final code cleanup, refactoring, and UI consistency pass.

---

**Phase 1 of planned features has been implemented!**
