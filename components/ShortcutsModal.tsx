'use client';

import React from 'react';
import { Keyboard, X } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '⌘ K / Ctrl K', desc: 'Focus Tech Stack Search input' },
    { key: '⌘ C / Ctrl Shift C', desc: 'Copy generated .gitignore to clipboard' },
    { key: '⌘ D / Ctrl D', desc: 'Download .gitignore file directly' },
    { key: '⌘ S / Ctrl S', desc: 'Open Save Custom Preset dialog' },
    { key: '? / ⌘ /', desc: 'Open Keyboard Shortcuts cheat sheet' },
    { key: 'Esc', desc: 'Close any active modal or clear search field' },
    { key: 'Tab / Shift+Tab', desc: 'Navigate between stacks and controls' },
    { key: 'Space / Enter', desc: 'Toggle selection of focused tech stack card' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
    >
      <div className="bg-white dark:bg-[#0f0f0f] text-slate-900 dark:text-[#e5e5e5] rounded-xl border border-slate-200 dark:border-[#1f1f1f] max-w-md w-full p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1f1f1f]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#141414] border border-slate-200 dark:border-[#222] text-[#3b82f6] flex items-center justify-center">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 id="shortcuts-modal-title" className="text-base font-bold text-slate-900 dark:text-[#e5e5e5]">
                Keyboard Shortcuts
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#888]">
                Fast keyboard navigation &amp; control
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:text-[#888] dark:hover:text-[#e5e5e5] rounded-md hover:bg-slate-100 dark:hover:bg-[#1a1a1a]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {shortcuts.map((sc) => (
            <div
              key={sc.key}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#222] text-xs"
            >
              <span className="text-slate-700 dark:text-[#bbb]">{sc.desc}</span>
              <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-[#0a0a0a] border border-slate-300 dark:border-[#262626] text-slate-900 dark:text-[#e5e5e5] font-mono text-[11px] font-semibold">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-[#1a1a1a] dark:hover:bg-[#222] text-slate-800 dark:text-[#e5e5e5] border border-slate-200 dark:border-[#333] transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
