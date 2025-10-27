import React, { useRef } from 'react';
import { Page } from '../types';
import { LogoIcon, SearchIcon, PlusIcon, UploadIcon, DownloadIcon, SunIcon, MoonIcon } from './Icons';

interface TopNavBarProps {
  page: Page;
  onPageChange: (page: Page) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddNew: () => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

const TopNavBar: React.FC<TopNavBarProps> = ({
  page,
  onPageChange,
  searchTerm,
  onSearchChange,
  onAddNew,
  onExport,
  onImport,
  theme,
  onThemeChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  
  const toggleTheme = () => {
    onThemeChange(theme === 'dark' ? 'light' : 'dark');
  };

  const NavButton: React.FC<{ targetPage: Page; children: React.ReactNode }> = ({ targetPage, children }) => (
    <button
      onClick={() => onPageChange(targetPage)}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        page === targetPage ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
      }`}
    >
      {children}
    </button>
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-white/70 dark:bg-gray-950/70 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 mb-6">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-primary">
              <LogoIcon className="w-6 h-6" />
              <span className="font-bold text-xl text-gray-900 dark:text-white">AI Navigator</span>
            </div>
            <nav className="hidden md:flex items-center gap-2">
              <NavButton targetPage="dashboard">Dashboard</NavButton>
              <NavButton targetPage="resources">Resources</NavButton>
              <NavButton targetPage="settings">Settings</NavButton>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {page === 'resources' && (
              <div className="relative hidden sm:block">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <SearchIcon className="h-5 w-5 text-gray-400 dark:text-gray-400" />
                </span>
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 dark:text-gray-200 text-sm"
                />
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <button onClick={toggleTheme} title="Toggle Theme" className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white transition-colors">
                {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>
              <input type="file" ref={fileInputRef} onChange={onImport} className="hidden" accept=".csv" />
              <button onClick={handleImportClick} title="Import CSV" className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white transition-colors">
                <UploadIcon className="w-5 h-5" />
              </button>
              <button onClick={onExport} title="Export CSV" className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white transition-colors">
                <DownloadIcon className="w-5 h-5" />
              </button>
              <button
                onClick={onAddNew}
                className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-md transition duration-200 text-sm"
              >
                <PlusIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Add New</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavBar;