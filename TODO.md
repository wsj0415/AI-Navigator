# AI Nexus Roadmap

This file tracks the development roadmap for the AI Nexus application.

## 🚀 Project Nexus (UI/UX Overhaul) - ✅ COMPLETE

A major initiative to rebuild the UI based on modern, professional mockups.

---

## ✅ Completed Features

- **Initial Scaffolding & Core UI:**
  - [x] Basic app layout with React and Tailwind CSS.
  - [x] IndexedDB setup for offline data persistence.
- **Resource Management (CRUD):**
  - [x] Add, edit, and delete web links.
  - [x] List and Gallery views for browsing resources.
- **AI-Powered Classification:**
  - [x] Use Gemini API to auto-fill title, description, and category from a URL.
  - [x] Companion browser extension for one-click resource saving.
- **Advanced UI Features:**
  - [x] Batch actions for updating multiple items.
  - [x] Data import/export via CSV.
  - [x] Onboarding guide for new users.
- **Data Dictionaries:**
  - [x] Settings page to manage custom categories, priorities, and statuses.
  - [x] Refactored data model to use stable codes instead of labels.
  - [x] Automatic data migration for existing users.
- **Theme Enhancement:**
  - [x] Theme switcher with Light, Dark, and System modes.
  - [x] Auto-detection of system preference on first load.
- **Project Nexus - Visual Upgrade:**
  - [x] **Branding & Data Model:** Renamed to "AI Nexus" and extended `LinkItem` to support `coverImageUrl` and `faviconUrl`.
  - [x] **Browser Extension v2:** Upgraded extension to capture screenshots and favicons.
  - [x] **Visual Redesign:** Overhauled List and Gallery views with favicons, cover images, and modern "pill" styling for metadata.
  - [x] **New Filtering System:** Implemented a persistent, multi-select filter panel for categories, priorities, and statuses.
- **Resource Detail View:**
  - [x] A modal to view all details of a single resource.
  - [x] Display cover image, all metadata, related links, and attachments.
  - [x] New **Markdown Notes** section for adding personal context.
- **File Attachments:**
  - [x] UI in the Add/Edit modal to upload a text-based file.
  - [x] Logic to store the file's content with the resource.
  - [x] **Searchable Content:** Main search bar also queries the full text of attached files.

## 🎯 Next Up / In Progress

- **Related Links:**
  - [ ] A UI to add/remove/view links between related resources.
  - [ ] Visualize these connections in the Resource Detail View.
  - [ ] AI-powered suggestions for related links.

## 📚 Backlog / Future Ideas

- **Advanced Search:**
  - [ ] Save common search queries and filter combinations.
  - [ ] Search by date range (created, last updated).
- **AI-Powered Insights:**
  - [ ] Dashboard widget to show trending topics in your collection.
  - [ ] AI-generated summaries for attached text files.
- **Global Hotkeys:**
  - [ ] Keyboard shortcuts for common actions (e.g., `Cmd+K` for search, `N` for new).
- **Multi-Device Sync:**
  - [ ] (Long-term) Explore options for syncing data between devices (e.g., using a cloud backend).
- **Sharing & Collaboration:**
  - [ ] (Long-term) Share a curated collection of resources with others.
- **Tagging System:**
  - [ ] Add a free-form tagging system in addition to the structured categories.
