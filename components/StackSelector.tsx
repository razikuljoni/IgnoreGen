'use client';

import React, { useState, useMemo } from 'react';
import { 
  TEMPLATES, 
  CATEGORIES, 
  PRESET_BUNDLES, 
  GitignoreTemplate, 
  PresetBundle 
} from '@/data/templates';
import { 
  Search, 
  X, 
  Check, 
  Layers, 
  SlidersHorizontal, 
  CheckCheck, 
  Eye, 
  ShieldCheck
} from 'lucide-react';

interface StackSelectorProps {
  selectedIds: string[];
  onToggleTemplate: (id: string) => void;
  onSelectMultiple: (ids: string[], replace?: boolean) => void;
  onClearAll: () => void;
  searchRef: React.RefObject<HTMLInputElement | null>;
}

// Get 2-letter badge code and theme color
const getStackBadge = (id: string, name: string, category: string) => {
  const codeMap: Record<string, { code: string; color: string }> = {
    'node-js': { code: 'JS', color: 'text-amber-600 dark:text-[#f7df1e]' },
    'typescript': { code: 'TS', color: 'text-blue-600 dark:text-[#3178c6]' },
    'python': { code: 'PY', color: 'text-emerald-600 dark:text-[#4ea94b]' },
    'react': { code: 'RX', color: 'text-sky-600 dark:text-[#61dafb]' },
    'nextjs': { code: 'NX', color: 'text-slate-900 dark:text-white' },
    'rust': { code: 'RS', color: 'text-amber-700 dark:text-[#dea584]' },
    'go': { code: 'GO', color: 'text-cyan-600 dark:text-[#00add8]' },
    'java': { code: 'JV', color: 'text-orange-600 dark:text-[#f89820]' },
    'cpp': { code: 'C+', color: 'text-blue-700 dark:text-[#659ad2]' },
    'csharp': { code: 'C#', color: 'text-purple-700 dark:text-[#9b4993]' },
    'php': { code: 'PH', color: 'text-indigo-600 dark:text-[#8892bf]' },
    'ruby': { code: 'RB', color: 'text-red-600 dark:text-[#cc342d]' },
    'swift': { code: 'SW', color: 'text-orange-600 dark:text-[#fa7343]' },
    'kotlin': { code: 'KT', color: 'text-purple-600 dark:text-[#7f52ff]' },
    'dart': { code: 'DT', color: 'text-sky-600 dark:text-[#0175c2]' },
    'docker': { code: 'DK', color: 'text-blue-600 dark:text-[#2496ed]' },
    'vscode': { code: 'VS', color: 'text-blue-600 dark:text-[#007acc]' },
    'jetbrains': { code: 'JT', color: 'text-red-600 dark:text-[#ea4335]' },
    'macos': { code: 'OS', color: 'text-slate-900 dark:text-white' },
    'windows': { code: 'WN', color: 'text-blue-600 dark:text-[#0078d7]' },
    'linux': { code: 'LX', color: 'text-amber-600 dark:text-[#fcc624]' },
    'env-files': { code: 'EV', color: 'text-red-600 dark:text-[#ef4444]' },
    'vue': { code: 'VU', color: 'text-emerald-600 dark:text-[#42b883]' },
    'angular': { code: 'NG', color: 'text-red-600 dark:text-[#dd0031]' },
    'svelte': { code: 'SV', color: 'text-orange-600 dark:text-[#ff3e00]' },
    'astro': { code: 'AS', color: 'text-orange-600 dark:text-[#ff5d01]' },
    'tailwind': { code: 'TW', color: 'text-sky-600 dark:text-[#38bdf8]' },
    'django': { code: 'DJ', color: 'text-emerald-800 dark:text-[#4ea94b]' },
    'fastapi': { code: 'FA', color: 'text-teal-600 dark:text-[#05998b]' },
    'flask': { code: 'FL', color: 'text-slate-900 dark:text-white' },
    'flutter': { code: 'FL', color: 'text-sky-600 dark:text-[#54c5f8]' },
    'react-native': { code: 'RN', color: 'text-sky-600 dark:text-[#61dafb]' },
    'unity': { code: 'UN', color: 'text-slate-900 dark:text-white' },
    'unreal-engine': { code: 'UE', color: 'text-slate-900 dark:text-sky-400' },
    'terraform': { code: 'TF', color: 'text-purple-600 dark:text-[#844fba]' },
    'prisma': { code: 'PR', color: 'text-slate-800 dark:text-slate-300' },
    'pnpm': { code: 'PN', color: 'text-amber-600 dark:text-[#f69220]' },
    'yarn': { code: 'YN', color: 'text-sky-700 dark:text-[#2c8ebb]' },
    'bun': { code: 'BN', color: 'text-amber-800 dark:text-[#fbf0df]' },
  };

  if (codeMap[id]) return codeMap[id];
  const cleanName = name.replace(/[^a-zA-Z]/g, '').toUpperCase();
  const code = cleanName.slice(0, 2) || id.slice(0, 2).toUpperCase();
  const color = category === 'security-secrets' ? 'text-[#ef4444]' : 'text-[#3b82f6]';
  return { code, color };
};

export const StackSelector: React.FC<StackSelectorProps> = ({
  selectedIds,
  onToggleTemplate,
  onSelectMultiple,
  onClearAll,
  searchRef,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<GitignoreTemplate | null>(null);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let list = TEMPLATES;

    // Filter by category
    if (activeCategory === 'popular') {
      list = list.filter((t) => t.popular);
    } else if (activeCategory !== 'all') {
      list = list.filter((t) => t.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          t.category.toLowerCase().includes(q)
      );
    }

    return list;
  }, [activeCategory, searchQuery]);

  const selectedCount = selectedIds.length;

  const handleApplyPreset = (preset: PresetBundle) => {
    onSelectMultiple(preset.templateIds, true);
  };

  const filteredIds = useMemo(() => filteredTemplates.map((t) => t.id), [filteredTemplates]);
  const allVisibleSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedIds.includes(id));

  const handleToggleAllFiltered = () => {
    if (allVisibleSelected) {
      const visibleSet = new Set(filteredIds);
      const remaining = selectedIds.filter((id) => !visibleSet.has(id));
      onSelectMultiple(remaining, true);
    } else {
      const merged = Array.from(new Set([...selectedIds, ...filteredIds]));
      onSelectMultiple(merged, true);
    }
  };

  const handleSelectRecommended = () => {
    const recommended = ['node-js', 'typescript', 'env-files', 'vscode', 'macos', 'windows'];
    onSelectMultiple(recommended, true);
  };

  return (
    <section 
      className="flex flex-col h-full bg-white dark:bg-[#0c0c0c] text-slate-900 dark:text-[#e5e5e5] rounded-xl border border-slate-200 dark:border-[#1f1f1f] shadow-lg overflow-hidden transition-colors duration-300"
      aria-label="Technology Stack Selector"
    >
      {/* Top Search & Presets Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-[#1f1f1f] space-y-3.5 bg-slate-50 dark:bg-[#0f0f0f]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-[#e5e5e5] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#3b82f6]" />
              Select Technologies & Stacks
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#888] mt-0.5">
              Choose languages, frameworks, operating systems, and IDE tools
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 flex-wrap">
            <button
              id="select-recommended-btn"
              type="button"
              onClick={handleSelectRecommended}
              className="text-xs font-medium px-2.5 py-1 rounded bg-slate-200 dark:bg-[#1a1a1a] hover:bg-slate-300 dark:hover:bg-[#222] text-[#3b82f6] border border-[#3b82f6]/30 transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-[#3b82f6]"
            >
              ⭐ Recommended Defaults
            </button>
              <button
                id="clear-all-stacks-btn"
                type="button"
                suppressHydrationWarning
                onClick={onClearAll}
                disabled={!selectedCount}
                className={`text-xs font-medium px-2.5 py-1 rounded transition-all focus:outline-none ${
                  !selectedCount
                    ? 'text-slate-300 dark:text-[#444] border border-slate-200 dark:border-[#222] cursor-not-allowed opacity-60'
                    : 'text-red-500 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/40'
                }`}
              >
                Clear all ({selectedCount})
              </button>
       
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-[#555]">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="stack-search-input"
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 120+ stacks (e.g. Next.js, Python, Docker, VS Code, macOS, .env)..."
            className="w-full pl-9 pr-9 py-2 bg-white dark:bg-[#1a1a1a] border border-slate-300 dark:border-[#333] rounded-md text-xs text-slate-900 dark:text-[#e5e5e5] placeholder-slate-400 dark:placeholder-[#555] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6] transition-all"
            aria-label="Search tech stack"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 dark:text-[#666] dark:hover:text-[#e5e5e5]"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Popular Preset Bundles Carousel */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-[#555] uppercase tracking-wider">
            <span>⚡ Quick Stacks</span>
            <span>Click to auto-configure</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {PRESET_BUNDLES.map((preset) => {
              const isFullySelected = preset.templateIds.every((id) => selectedIds.includes(id));
              return (
                <button
                  key={preset.id}
                  id={`preset-bundle-${preset.id}`}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-all border ${
                    isFullySelected
                      ? 'bg-[#3b82f6] text-white border-[#2563eb] shadow-md shadow-blue-900/20'
                      : 'bg-white dark:bg-[#141414] text-slate-600 dark:text-[#888] hover:text-slate-900 dark:hover:text-[#e5e5e5] border-slate-200 dark:border-[#262626] hover:border-[#3b82f6]/40'
                  }`}
                  title={preset.description}
                >
                  <Layers className="w-3 h-3" />
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-thin">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`category-tab-${cat.id}`}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-md text-xs transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-[#1a1a1a] text-[#3b82f6] font-medium border border-[#3b82f6]/30 shadow-xs'
                    : 'text-slate-600 dark:text-[#888] hover:bg-slate-200 dark:hover:bg-[#1a1a1a] hover:text-slate-900 dark:hover:text-[#e5e5e5] border border-transparent'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#3b82f6]' : 'bg-slate-300 dark:bg-[#333]'}`}></span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Counter & Bulk Actions Sub-header */}
      <div className="px-4 py-2 bg-slate-100 dark:bg-[#0a0a0a] border-b border-slate-200 dark:border-[#1f1f1f] flex items-center justify-between text-xs text-slate-600 dark:text-[#888]">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-slate-900 dark:text-[#e5e5e5]">{filteredTemplates.length}</strong> items
          </span>
          {selectedCount > 0 && (
            <span suppressHydrationWarning className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-white dark:bg-[#1a1a1a] text-[#3b82f6] border border-[#3b82f6]/30">
              <Check className="w-3 h-3" /> {selectedCount} active
            </span>
          )}
        </div>

        {filteredTemplates.length > 0 && (
          <button
            id="toggle-all-filtered-btn"
            type="button"
            onClick={handleToggleAllFiltered}
            className={`text-xs font-medium hover:underline flex items-center gap-1 transition-colors ${
              allVisibleSelected ? 'text-red-500 hover:text-red-600 dark:text-red-400' : 'text-[#3b82f6]'
            }`}
          >
            {allVisibleSelected ? (
              <>
                <X className="w-3.5 h-3.5" />
                Unselect all visible
              </>
            ) : (
              <>
                <CheckCheck className="w-3.5 h-3.5" />
                Select all visible
              </>
            )}
          </button>
        )}
      </div>

      {/* Templates Grid List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-h-[730px] focus:outline-none border-b border-slate-200 dark:border-[#1f1f1f]">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-14 px-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#141414] border border-slate-200 dark:border-[#222] flex items-center justify-center mx-auto text-slate-400 dark:text-[#555]">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-[#e5e5e5]">
              No matching stacks found
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#888] max-w-sm mx-auto">
              Try searching with another keyword (e.g. &ldquo;Node&rdquo;, &ldquo;React&rdquo;, &ldquo;VS Code&rdquo;) or check our AI Assistant to generate custom rules.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="text-xs text-[#3b82f6] font-semibold hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredTemplates.map((template) => {
              const isSelected = selectedIds.includes(template.id);
              const badge = getStackBadge(template.id, template.name, template.category);

              return (
                <div
                  key={template.id}
                  id={`stack-item-${template.id}`}
                  onClick={() => onToggleTemplate(template.id)}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      onToggleTemplate(template.id);
                    }
                  }}
                  tabIndex={0}
                  role="checkbox"
                  aria-checked={isSelected}
                  aria-label={`${template.name}: ${template.description}`}
                  className={`group relative p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between select-none focus:outline-none ${
                    isSelected
                      ? 'bg-blue-50/50 dark:bg-[#141414] border-[#3b82f6]/50 ring-1 ring-[#3b82f6]/20 hover:bg-blue-50 dark:hover:bg-[#1a1a1a]'
                      : 'bg-white dark:bg-[#141414] border-slate-200 dark:border-[#222] hover:border-slate-300 dark:hover:border-[#333] hover:bg-slate-50 dark:hover:bg-[#1a1a1a]'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {/* 2-Letter Tech Badge */}
                        <div className={`p-1.5 px-2 bg-slate-100 dark:bg-[#000] rounded-md border border-slate-200 dark:border-[#333] ${badge.color} font-mono font-bold text-xs shadow-xs`}>
                          {badge.code}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium text-slate-900 dark:text-[#e5e5e5] group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
                              {template.name}
                            </span>
                            {template.popular && (
                              <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-[#1a1a1a] text-slate-600 dark:text-[#888] border border-slate-200 dark:border-[#333]">
                                Popular
                              </span>
                            )}
                          </div>
                          {template.category === 'security-secrets' && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-red-500 dark:text-red-400">
                              <ShieldCheck className="w-2.5 h-2.5" /> Security
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Native Accent Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        aria-label={`Select ${template.name}`}
                        className="ig-checkbox"
                      />
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-[#666] line-clamp-2 leading-relaxed">
                      {template.description}
                    </p>
                  </div>

                  {/* Footer tags and preview action */}
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-[#1f1f1f] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 overflow-hidden">
                      {template.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#111] border border-slate-200 dark:border-[#222] text-slate-500 dark:text-[#888]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewTemplate(template);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:text-[#666] dark:hover:text-[#e5e5e5] rounded hover:bg-slate-200 dark:hover:bg-[#222] transition-colors"
                      title="Inspect template rules"
                      aria-label={`Inspect ${template.name} gitignore rules`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Template Quick View Modal */}
      {previewTemplate && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="template-preview-title"
        >
          <div className="bg-white dark:bg-[#0f0f0f] text-slate-900 dark:text-[#e5e5e5] rounded-xl border border-slate-200 dark:border-[#1f1f1f] max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-200 dark:border-[#1f1f1f] flex items-center justify-between bg-slate-50 dark:bg-[#141414]">
              <div>
                <h3 id="template-preview-title" className="text-base font-bold text-slate-900 dark:text-[#e5e5e5]">
                  {previewTemplate.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-[#888] mt-0.5">
                  Standard template patterns included in this module
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:text-[#888] dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-[#222]"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs text-slate-800 dark:text-[#abb2bf] bg-slate-50 dark:bg-[#0a0a0a] leading-relaxed whitespace-pre">
              {previewTemplate.content}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-[#1f1f1f] flex items-center justify-between bg-slate-50 dark:bg-[#141414]">
              <span className="text-xs text-slate-500 dark:text-[#888]">
                {previewTemplate.content.split('\n').filter((l) => l.trim() && !l.startsWith('#')).length} rules in this module
              </span>
              <button
                type="button"
                onClick={() => {
                  if (!selectedIds.includes(previewTemplate.id)) {
                    onToggleTemplate(previewTemplate.id);
                  }
                  setPreviewTemplate(null);
                }}
                className="px-4 py-2 rounded-md text-xs font-semibold bg-[#3b82f6] hover:bg-[#2563eb] text-white shadow-lg shadow-blue-900/20 transition-all"
              >
                {selectedIds.includes(previewTemplate.id) ? 'Included in Selection' : 'Add to .gitignore'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
