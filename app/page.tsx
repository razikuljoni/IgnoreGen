'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { StackSelector } from '@/components/StackSelector';
import { GitignorePreview } from '@/components/GitignorePreview';
import { PresetManagerModal } from '@/components/PresetManagerModal';
import { DocsModal } from '@/components/DocsModal';
import { ShortcutsModal } from '@/components/ShortcutsModal';
import { AiAssistantDrawer } from '@/components/AiAssistantDrawer';
import { 
  StorageService, 
  UserPreferences, 
  DEFAULT_PREFERENCES 
} from '@/lib/storage';
import { generateGitignore } from '@/lib/generator';
import { decodeConfigToken, resolveTemplateIdOrAlias, DEFAULT_OPTIONS } from '@/lib/short-url';
import { Check, Sparkles, SlidersHorizontal, Eye } from 'lucide-react';

function getInitialUrlConfig() {
  if (typeof window === 'undefined') return null;
  const search = window.location.search;
  if (!search) return null;
  try {
    const params = new URLSearchParams(search);
    const token = params.get('s') || params.get('c');
    if (token) {
      const config = decodeConfigToken(token);
      if (config.selectedIds.length > 0 || config.customRules || token.startsWith('c.')) {
        return config;
      }
    }
    const templatesParam = params.get('templates');
    if (templatesParam) {
      const rawIds = templatesParam.split(',').filter(Boolean);
      const resolvedIds = rawIds
        .map((id) => resolveTemplateIdOrAlias(id))
        .filter((id): id is string => Boolean(id));
      if (resolvedIds.length > 0) {
        return {
          selectedIds: resolvedIds,
          options: { ...DEFAULT_OPTIONS },
          customRules: '',
        };
      }
    }
  } catch {
    // Ignore invalid url params
  }
  return null;
}

export default function Home() {
  const [toastMessage, setToastMessage] = useState<string | null>(() => {
    return getInitialUrlConfig() ? 'Loaded configuration from share link!' : null;
  });

  const showToast = React.useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Get initial state
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>(() => {
    const fromUrl = getInitialUrlConfig();
    if (fromUrl) {
      StorageService.saveSelectedTemplates(fromUrl.selectedIds);
      return fromUrl.selectedIds;
    }
    const saved = StorageService.getSelectedTemplates();
    return saved.length === 0 ? [] : saved;
  });

  const [customRules, setCustomRules] = useState<string>(() => {
    const fromUrl = getInitialUrlConfig();
    if (fromUrl) {
      const rules = fromUrl.customRules || '';
      StorageService.saveCustomRules(rules);
      return rules;
    }
    return StorageService.getCustomRules();
  });

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const fromUrl = getInitialUrlConfig();
    const saved = StorageService.getPreferences();
    if (fromUrl) {
      const next = {
        ...saved,
        includeComments: fromUrl.options.includeComments,
        sortSections: fromUrl.options.sortSections,
        autoDeduplicate: fromUrl.options.autoDeduplicate,
      };
      StorageService.savePreferences(next);
      return next;
    }
    return saved;
  });

  // Modals state
  const [docsOpen, setDocsOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [presetsOpen, setPresetsOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  // Mobile active tab ('selector' | 'preview')
  const [mobileTab, setMobileTab] = useState<'selector' | 'preview'>('selector');

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Track client hydration and theme dynamic sync safely
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateThemeClass = () => {
      const isDark =
        preferences.theme === 'dark' ||
        (preferences.theme === 'system' && mediaQuery.matches);

      root.classList.add('theme-transitioning');
      window.setTimeout(() => root.classList.remove('theme-transitioning'), 400);

      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
    };

    updateThemeClass();

    const handleSystemChange = () => {
      if (preferences.theme === 'system') {
        updateThemeClass();
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange);
    } else {
      mediaQuery.addListener(handleSystemChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemChange);
      } else {
        mediaQuery.removeListener(handleSystemChange);
      }
    };
  }, [preferences.theme]);

  // Persist selections
  const handleToggleTemplate = (id: string) => {
    setSelectedTemplateIds((prev) => {
      // If adding, just add. If removing, just remove.
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      StorageService.saveSelectedTemplates(next);
      return next;
    });
  };

  const handleSelectMultiple = (ids: string[], replace = false) => {
    setSelectedTemplateIds((prev) => {
      const next = replace ? ids : Array.from(new Set([...prev, ...ids]));
      StorageService.saveSelectedTemplates(next);
      return next;
    });
  };

  const handleClearAll = () => {
    setSelectedTemplateIds([]);
    StorageService.saveSelectedTemplates([]);
  };

  const handleCustomRulesChange = (rules: string) => {
    setCustomRules(rules);
    StorageService.saveCustomRules(rules);
  };

  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...newPrefs };
      StorageService.savePreferences(updated);
      return updated;
    });
  };

  // Generate output
  const generated = useMemo(() => {
    // If no templates selected, only use custom rules (generator will handle defaults)
    const activeTemplates = selectedTemplateIds.length === 0 ? [] : selectedTemplateIds;
    return generateGitignore(activeTemplates, {
      includeComments: preferences.includeComments,
      sortSections: preferences.sortSections,
      autoDeduplicate: preferences.autoDeduplicate,
      customRules,
    });
  }, [selectedTemplateIds, preferences, customRules]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in textarea or input (unless it's Cmd+K or Cmd+S or Esc)
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setPresetsOpen(true);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        const blob = new Blob([generated.rawText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = '.gitignore';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('Downloaded .gitignore file');
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        navigator.clipboard.writeText(generated.rawText);
        showToast('Copied .gitignore to clipboard!');
        return;
      }

      if (e.key === '?' && !isInput) {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
        return;
      }

      if (e.key === 'Escape') {
        if (docsOpen || shortcutsOpen || presetsOpen || aiOpen) {
          setDocsOpen(false);
          setShortcutsOpen(false);
          setPresetsOpen(false);
          setAiOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [generated.rawText, docsOpen, shortcutsOpen, presetsOpen, aiOpen, showToast]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-[#e5e5e5] transition-colors duration-300 antialiased">
      {/* Screen Reader Live Region for Accessibility Announcements */}
      <div 
        role="status" 
        aria-live="polite" 
        className="sr-only"
      >
        {toastMessage}
      </div>

      {/* Top Navbar */}
      <Navbar
        selectedCount={selectedTemplateIds.length}
        theme={preferences.theme}
        onThemeChange={(theme) => updatePreferences({ theme })}
        onOpenDocs={() => setDocsOpen(true)}
        onOpenShortcuts={() => setShortcutsOpen(true)}
        onOpenPresets={() => setPresetsOpen(true)}
        onOpenAi={() => setAiOpen(true)}
        onFocusSearch={() => searchInputRef.current?.focus()}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 flex flex-col gap-4">
        {/* Mobile Tab Switcher */}
        <div className="lg:hidden flex items-center p-1 rounded-lg bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#222]">
          <button
            type="button"
            onClick={() => setMobileTab('selector')}
            className={`flex-1 py-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === 'selector'
                ? 'bg-slate-100 dark:bg-[#222] text-slate-900 dark:text-[#e5e5e5] shadow-xs'
                : 'text-slate-500 dark:text-[#888] hover:text-slate-900 dark:hover:text-[#e5e5e5]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span>Select Tech Stacks ({selectedTemplateIds.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === 'preview'
                ? 'bg-slate-100 dark:bg-[#222] text-slate-900 dark:text-[#e5e5e5] shadow-xs'
                : 'text-slate-500 dark:text-[#888] hover:text-slate-900 dark:hover:text-[#e5e5e5]'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span>Preview & Download ({generated.ruleCount} rules)</span>
          </button>
        </div>

        {/* 2-Column Responsive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
          {/* Left Column: Stack Selector */}
          <div className={`lg:col-span-6 xl:col-span-6 h-full ${mobileTab === 'selector' ? 'block' : 'hidden lg:block'}`}>
            <StackSelector
              selectedIds={selectedTemplateIds}
              onToggleTemplate={handleToggleTemplate}
              onSelectMultiple={handleSelectMultiple}
              onClearAll={handleClearAll}
              searchRef={searchInputRef}
            />
          </div>

          {/* Right Column: Interactive Gitignore Preview */}
          <div className={`lg:col-span-6 xl:col-span-6 h-full ${mobileTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
            <GitignorePreview
              generated={generated}
              customRules={customRules}
              onCustomRulesChange={handleCustomRulesChange}
              includeComments={preferences.includeComments}
              onToggleComments={() => updatePreferences({ includeComments: !preferences.includeComments })}
              sortSections={preferences.sortSections}
              onToggleSort={() => updatePreferences({ sortSections: !preferences.sortSections })}
              autoDeduplicate={preferences.autoDeduplicate}
              onToggleDeduplicate={() => updatePreferences({ autoDeduplicate: !preferences.autoDeduplicate })}
              includeLineNumbers={preferences.includeLineNumbers}
              onToggleLineNumbers={() => updatePreferences({ includeLineNumbers: !preferences.includeLineNumbers })}
              onRemoveTemplate={(id) => handleToggleTemplate(id)}
              onSaveAsPreset={() => setPresetsOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Accessible Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-lg bg-[#141414] text-[#e5e5e5] border border-[#262626] text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals & Drawers */}
      <PresetManagerModal
        isOpen={presetsOpen}
        onClose={() => setPresetsOpen(false)}
        selectedTemplateIds={selectedTemplateIds}
        customRules={customRules}
        preferences={preferences}
        onApplyPreset={(ids, rules) => {
          setSelectedTemplateIds(ids);
          StorageService.saveSelectedTemplates(ids);
          setCustomRules(rules);
          StorageService.saveCustomRules(rules);
          showToast('Preset loaded successfully!');
        }}
        onImportData={(data) => {
          setSelectedTemplateIds(data.selectedTemplateIds);
          setCustomRules(data.customRules);
          setPreferences(data.preferences);
          showToast('Backup imported successfully!');
        }}
        onResetDefaults={() => {
          setSelectedTemplateIds(DEFAULT_PREFERENCES.defaultTemplateIds);
          StorageService.saveSelectedTemplates(DEFAULT_PREFERENCES.defaultTemplateIds);
          setCustomRules('');
          StorageService.saveCustomRules('');
          setPreferences(DEFAULT_PREFERENCES);
          StorageService.savePreferences(DEFAULT_PREFERENCES);
          showToast('Reset to default recommended configuration');
        }}
      />

      <DocsModal
        isOpen={docsOpen}
        onClose={() => setDocsOpen(false)}
      />

      <ShortcutsModal
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />

      <AiAssistantDrawer
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
        onApplyRecommendations={(templateIds, extraRules) => {
          setSelectedTemplateIds((prev) => {
            const next = Array.from(new Set([...prev, ...templateIds]));
            StorageService.saveSelectedTemplates(next);
            return next;
          });
          if (extraRules) {
            // Replace or smartly update custom rules instead of blindly appending
            setCustomRules((prev) => {
              if (!prev) {
                StorageService.saveCustomRules(extraRules);
                return extraRules;
              }
              // If the new rules are already in the old rules, don't append
              if (prev.includes(extraRules.trim())) return prev;
              
              // Remove old fallback messages if they exist to prevent duplication
              const fallbackMsg = "AI service was temporarily unavailable";
              let cleanedPrev = prev;
              if (prev.includes(fallbackMsg)) {
                cleanedPrev = prev.split('\n')
                  .filter(line => !line.includes(fallbackMsg) && !line.includes("Standard templates were selected"))
                  .join('\n')
                  .trim();
              }
              
              const combined = cleanedPrev ? `${cleanedPrev}\n\n${extraRules}` : extraRules;
              StorageService.saveCustomRules(combined);
              return combined;
            });
          }
          showToast('Applied AI stack recommendations!');
        }}
      />
    </div>
  );
}
