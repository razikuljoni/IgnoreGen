'use client';

import React from 'react';
import pkg from '../package.json';
import { 
  Search, 
  BookOpen, 
  Sparkles, 
  Bookmark, 
  Keyboard, 
  Sun, 
  Moon, 
  Laptop, 
  Share2,
  Check,
  Sliders
} from 'lucide-react';

interface NavbarProps {
  selectedCount: number;
  theme: 'system' | 'light' | 'dark';
  onThemeChange: (theme: 'system' | 'light' | 'dark') => void;
  onOpenDocs: () => void;
  onOpenShortcuts: () => void;
  onOpenPresets: () => void;
  onOpenAi: () => void;
  onFocusSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCount,
  theme,
  onThemeChange,
  onOpenDocs,
  onOpenShortcuts,
  onOpenPresets,
  onOpenAi,
  onFocusSearch,
}) => {
  const [copiedLink, setCopiedLink] = React.useState(false);

  const cycleTheme = () => {
    if (theme === 'system') onThemeChange('dark');
    else if (theme === 'dark') onThemeChange('light');
    else onThemeChange('system');
  };

  const handleShare = async () => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 dark:border-[#1f1f1f] bg-white/90 dark:bg-[#0f0f0f]/90 text-slate-900 dark:text-[#e5e5e5] backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#3b82f6] to-[#2dd4bf] rounded-lg flex items-center justify-center font-bold text-black text-sm shadow-md shadow-blue-500/20">
            .g
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 dark:text-[#e5e5e5]">
                IgnoreGen<span className="text-[#3b82f6]">.io</span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 dark:bg-[#1a1a1a] text-slate-600 dark:text-[#888] border border-slate-200 dark:border-[#333]">
                v{pkg.version}
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-500 dark:text-[#888]">
              Automated, secure .gitignore generator for any tech stack
            </p>
          </div>
        </div>

        {/* Center Quick Search Trigger */}
        {/** <div className="hidden lg:flex items-center relative w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-[#555]">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="nav-quick-search-input"
            type="text"
            readOnly
            onClick={onFocusSearch}
            placeholder="Search languages, frameworks, IDEs..."
            className="block w-full pl-9 pr-12 py-1.5 bg-slate-100 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] rounded-md text-xs text-slate-900 dark:text-[#e5e5e5] placeholder-slate-400 dark:placeholder-[#666] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] cursor-pointer transition-all"
            aria-label="Search tech stack (Press Ctrl or Cmd + K)"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <span className="text-[10px] bg-slate-200 dark:bg-[#262626] border border-slate-300 dark:border-[#383838] px-1.5 py-0.5 rounded text-slate-600 dark:text-[#888] font-mono">
              ⌘K
            </span>
          </div>
        </div> */}

        {/* Right Navigation Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* AI Smart Assistant */}
          <button
            id="nav-ai-btn"
            type="button"
            onClick={onOpenAi}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-[#1a1a1a] dark:hover:bg-[#222] text-slate-900 dark:text-[#e5e5e5] border border-slate-200 dark:border-[#333] hover:border-[#3b82f6]/50 transition-all active:scale-95"
            aria-label="Open AI Stack Analyzer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span className="hidden sm:inline">AI Assistant</span>
            <span className="sm:hidden">AI</span>
          </button>

          {/* Presets & Sync */}
          <button
            id="nav-presets-btn"
            type="button"
            onClick={onOpenPresets}
            className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 dark:border-[#333] bg-white hover:bg-slate-100 dark:bg-[#141414] dark:hover:bg-[#1a1a1a] text-slate-600 dark:text-[#888] hover:text-slate-900 dark:hover:text-[#e5e5e5] text-xs font-medium transition-all"
            aria-label="Manage saved presets and cloud export/import"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span className="hidden md:inline">Presets</span>
            <span 
              suppressHydrationWarning
              className="inline-flex items-center justify-center px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#3b82f6] text-white"
            >
              {selectedCount}
            </span>
          </button>

          {/* Documentation */}
          <button
            id="nav-docs-btn"
            type="button"
            onClick={onOpenDocs}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-[#333] bg-white hover:bg-slate-100 dark:bg-[#141414] dark:hover:bg-[#1a1a1a] text-slate-600 dark:text-[#888] hover:text-slate-900 dark:hover:text-[#e5e5e5] text-xs font-medium transition-all"
            aria-label="Open documentation and gitignore syntax rules cheat sheet"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500 dark:text-[#888]" />
            <span className="hidden md:inline">Docs</span>
          </button>

          {/* Shortcuts Modal */}
          <button
            id="nav-shortcuts-btn"
            type="button"
            onClick={onOpenShortcuts}
            className="p-1.5 text-slate-600 dark:text-[#888] hover:text-slate-900 dark:hover:text-[#e5e5e5] bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#333] hover:bg-slate-100 dark:hover:bg-[#1a1a1a] rounded-md transition-all active:scale-95"
            title="Keyboard shortcuts (?)"
            aria-label="View keyboard shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Share button */}
          <button
            id="nav-share-btn"
            type="button"
            onClick={handleShare}
            className="p-1.5 text-slate-600 dark:text-[#888] hover:text-slate-900 dark:hover:text-[#e5e5e5] bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#333] hover:bg-slate-100 dark:hover:bg-[#1a1a1a] rounded-md transition-all active:scale-95"
            title="Copy share link"
            aria-label="Copy website link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Theme switcher with fixed width and smooth transition */}
          <button
            id="nav-theme-toggle-btn"
            type="button"
            onClick={cycleTheme}
            className="w-[88px] sm:w-[94px] h-8 p-1.5 text-slate-600 dark:text-[#888] hover:text-slate-900 dark:hover:text-[#e5e5e5] bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#333] hover:bg-slate-100 dark:hover:bg-[#1a1a1a] rounded-md transition-all active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
            title={`Current theme preference: ${theme}. Click to toggle (system -> dark -> light -> system).`}
            aria-label="Toggle theme mode"
          >
            <span className="transition-transform duration-300 transform scale-100">
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-[#3b82f6] animate-in spin-in-90 duration-200" />
              ) : theme === 'light' ? (
                <Sun className="w-4 h-4 text-amber-500 animate-in spin-in-90 duration-200" />
              ) : (
                <Laptop className="w-4 h-4 text-slate-500 dark:text-[#888] animate-in fade-in duration-200" />
              )}
            </span>
            <span className="hidden sm:inline text-[11px] font-mono capitalize text-slate-600 dark:text-[#888] w-11 text-left">
              {theme}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
