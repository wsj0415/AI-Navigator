# AI Navigator - TODO & Roadmap

This document outlines the planned features and improvements for the AI Navigator application.

---

### 🟥 P0: High Priority - Foundational Enhancements

*These items are prerequisites for many upcoming features and address core architecture.*

-   **[ ] Architecture: Refactor Data Dictionaries**
    -   **Goal:** Transition from the current simple `DictionaryItem` (`{id, value}`) to a more robust, professional model based on best practices.
    -   **Implementation:**
        -   Update the `DictionaryItem` interface in `types.ts` to include `code` (for stable internal reference), `value` (for display), `sortOrder`, and `isEnabled`.
        -   Refactor the Settings page to provide a full management UI for each dictionary type (Categories, Priorities, Statuses).
        -   Update all components that use dictionaries to work with the new data structure.

-   **[ ] UI/UX: Enhance Theme Settings**
    -   **Goal:** Provide a more intelligent and flexible theme experience.
    -   **Implementation:**
        -   On application startup, automatically detect and apply the user's operating system theme (light/dark).
        -   Provide a three-way toggle in the UI: "Light", "Dark", and "Follow System".
        -   Persist the user's explicit choice in local storage.

-   **[ ] Data Model: Extend Resource Properties**
    -   **Goal:** Add new fields to the `LinkItem` data model to support upcoming visual features.
    -   **Implementation:**
        -   Add an optional `faviconUrl: string` field to store the website's icon (as a Base64 Data URL).
        -   Add an optional `coverImageUrl: string` field to store a page screenshot (as a Base64 Data URL).

---

### 🟧 P1: Medium Priority - Core Feature Implementation

*Building upon the new foundation to deliver major user-facing features.*

-   **[ ] Feature: Browser Extension v2 - Visual Capture**
    -   **Goal:** Upgrade the browser extension to capture the page's favicon and a screenshot.
    -   **Implementation:**
        -   Use a content script to extract the favicon URL from the page's `<head>`.
        -   Use the `chrome.tabs.captureVisibleTab` API to generate a screenshot.
        -   Pass the URL, favicon, and screenshot data to the AI Navigator application when creating a new resource.

-   **[ ] UI/UX: Resource Detail View**
    -   **Goal:** Create a dedicated, information-rich view for each resource.
    -   **Implementation:**
        -   Design a modal or a separate page that prominently displays the resource's `coverImageUrl`.
        -   Clearly list all metadata (title, description, URL, category, priority, status, dates).
        -   Integrate management of related links and attachments.
        -   **New:** Add a "Notes" section allowing users to add custom Markdown-formatted comments to each resource.

-   **[ ] UI/UX: Gallery View v2 - Visual Showcase**
    -   **Goal:** Transform the gallery view into a true visual-first browsing experience.
    -   **Implementation:**
        -   Update gallery cards to use the `coverImageUrl` as their primary visual element.
        -   Implement a stylish default placeholder for resources that do not have a cover image.

---

### 🟦 P2: Low Priority & Future Ideas

*Long-term enhancements and "nice-to-have" features.*

-   **[ ] Feature: Settings Page v2 - Advanced Functionality**
    -   **Goal:** Expand the Settings page into a central hub for application management.
    -   **Implementation:**
        -   **Data Management:** Add "Export to JSON" and "Import from JSON" for complete data backups (including attachments).
        -   **Danger Zone:** Implement "Reset to Initial Data" and "Clear All Data" functions with robust confirmation dialogs.

-   **[ ] Architecture: Hierarchical Dictionaries**
    -   **Goal:** Allow for more complex organization, such as nested categories.
    -   **Implementation:** Add a `parentId` field to the `DictionaryItem` model to support tree-like structures.

-   **[ ] Intelligence: AI Auto-Tagging**
    -   **Goal:** Leverage the Gemini API to further automate content organization.
    -   **Implementation:** During the "AI Analyze" process, request 3-5 relevant keywords (tags) in addition to the existing metadata.

-   **[ ] Search: Enhanced Attachment Content Search**
    -   **Goal:** Extend full-text search capabilities beyond `.txt` files.
    -   **Implementation:** Investigate and integrate a client-side library (like `pdf.js`) to extract text content from uploaded PDF files.

---

## ✅ Completed Features

-   **Core: AI Classification:** Automatically analyze and classify URLs.
-   **Core: CRUD Operations:** Add, view, edit, and delete resources.
-   **UI: Multiple Views:** Switch between List and Gallery views.
-   **UI: Dynamic Dictionaries:** User-configurable categories, priorities, etc.
-   **Data: CSV Import/Export:** Portability for your resource list.
-   **UI: Batch Actions:** Update multiple items at once.
-   **UI: Search & Sort:** Full-text search and multiple sort options.
-   **Core: Relational Linking:** Connect related resources together.
-   **Core: File Attachments:** Attach files directly to resources.
-   **UI: Advanced Filtering:** Implemented combined filtering capabilities.
-   **UI: Theme Toggle:** Add a light/dark mode switcher.
-   **Technical: Migrate to IndexedDB:** Moved from localStorage to IndexedDB for more robust, scalable storage.
-   **Feature: Full-text search in attachments:** For supported file types (e.g., .txt), the content is indexed and searchable.
-   **UI: Onboarding / Walkthrough:** A simple guide for first-time users is now included.
-   **Feature: Browser Extension:** Created a simple browser extension to quickly add the current page to AI Navigator.
