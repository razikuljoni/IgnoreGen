'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  GeneratedGitignore, 
  tokenizeGitignore, 
  LineToken 
} from '@/lib/generator';
import { 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  FileText, 
  Code2, 
  Sparkles,
  Info,
  X,
  FileCode,
  Share2
} from 'lucide-react';
import { getSmartCliCommand, getShareUrl } from '@/lib/short-url';

interface GitignorePreviewProps {
  generated: GeneratedGitignore;
  customRules: string;
  onCustomRulesChange: (rules: string) => void;
  includeComments: boolean;
  onToggleComments: () => void;
  sortSections: boolean;
  onToggleSort: () => void;
  autoDeduplicate: boolean;
  onToggleDeduplicate: () => void;
  includeLineNumbers: boolean;
  onToggleLineNumbers: () => void;
  onRemoveTemplate: (id: string) => void;
  onSaveAsPreset: () => void;
}

export const GitignorePreview: React.FC<GitignorePreviewProps> = ({
  generated,
  customRules,
  onCustomRulesChange,
  includeComments,
  onToggleComments,
  sortSections,
  onToggleSort,
  autoDeduplicate,
  onToggleDeduplicate,
  includeLineNumbers,
  onToggleLineNumbers,
  onRemoveTemplate,
  onSaveAsPreset,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'highlighted' | 'raw' | 'custom'>('highlighted');
  const [showCliModal, setShowCliModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const origin = mounted && typeof window !== 'undefined' ? window.location.origin : 'https://ignoregen.vercel.app';

  const handleCopy = async (key: string, text: string) => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2200);
      }
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const selectedTemplateIds = useMemo(() => {
    return generated.templatesUsed.map((t) => t.id);
  }, [generated.templatesUsed]);

  const generatorOptions = useMemo(() => ({
    includeComments,
    sortSections,
    autoDeduplicate,
    customRules,
  }), [includeComments, sortSections, autoDeduplicate, customRules]);

  const getCliDownloadCommand = () => {
    return getSmartCliCommand(origin, {
      selectedIds: selectedTemplateIds,
      options: generatorOptions,
      customRules,
    });
  };

  const getShareLink = () => {
    return getShareUrl(origin, {
      selectedIds: selectedTemplateIds,
      options: generatorOptions,
      customRules,
    });
  };

  const tokens = useMemo(() => {
    return tokenizeGitignore(generated.rawText);
  }, [generated.rawText]);



  const handleDownload = () => {
    try {
      const blob = new Blob([generated.rawText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = '.gitignore';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download .gitignore', e);
    }
  };

  const byteSize = new Blob([generated.rawText]).size;
  const formattedSize = byteSize > 1024 ? `${(byteSize / 1024).toFixed(1)} KB` : `${byteSize} B`;

  return (
    <section 
      className="flex flex-col h-full bg-white dark:bg-[#0c0c0c] text-slate-900 dark:text-[#e5e5e5] rounded-xl border border-slate-200 dark:border-[#1f1f1f] shadow-lg overflow-hidden transition-colors duration-300"
      aria-label="Generated .gitignore Preview and Actions"
    >
      {/* Top Action Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-[#1f1f1f] bg-slate-50 dark:bg-[#0f0f0f] flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* File Tab & View Modes */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#222] shadow-sm">
              <FileCode className="w-4 h-4 text-[#3b82f6]" />
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-[#e5e5e5]">.gitignore</span>
              <span suppressHydrationWarning className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-[#0a0a0a] text-slate-500 dark:text-[#888] border border-slate-200 dark:border-[#222] font-mono">
                {formattedSize}
              </span>
            </div>

            {/* View Mode Tabs */}
            <div className="flex items-center p-0.5 rounded-md bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#222] text-xs">
              <button
                type="button"
                onClick={() => setViewMode('highlighted')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  viewMode === 'highlighted'
                    ? 'bg-slate-100 dark:bg-[#222] text-slate-900 dark:text-[#e5e5e5] shadow-xs'
                    : 'text-slate-500 dark:text-[#888] hover:text-slate-900 dark:hover:text-[#e5e5e5]'
                }`}
              >
                Preview
              </button>
              <button
                type="button"
                onClick={() => setViewMode('custom')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  viewMode === 'custom'
                    ? 'bg-slate-100 dark:bg-[#222] text-slate-900 dark:text-[#e5e5e5] shadow-xs'
                    : 'text-slate-500 dark:text-[#888] hover:text-slate-900 dark:hover:text-[#e5e5e5]'
                }`}
              >
                Custom Rules {customRules.trim() ? '•' : ''}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('raw')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  viewMode === 'raw'
                    ? 'bg-slate-100 dark:bg-[#222] text-slate-900 dark:text-[#e5e5e5] shadow-xs'
                    : 'text-slate-500 dark:text-[#888] hover:text-slate-900 dark:hover:text-[#e5e5e5]'
                }`}
              >
                Raw Text
              </button>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Copy Button */}
            <button
              id="copy-gitignore-btn"
              type="button"
              onClick={() => handleCopy('main', generated.rawText)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all shadow-md shadow-blue-900/20 focus:outline-none ${
                copiedKey === 'main'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-[#3b82f6] hover:bg-[#2563eb] text-white active:scale-95'
              }`}
              aria-label={copiedKey === 'main' ? 'Copied to clipboard' : 'Copy .gitignore content to clipboard'}
            >
              {copiedKey === 'main' ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === 'main' ? 'Copied!' : 'Copy'}</span>
            </button>

            {/* Download Button */}
            <button
              id="download-gitignore-btn"
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-[#1a1a1a] dark:hover:bg-[#222] text-slate-800 dark:text-[#e5e5e5] border border-slate-200 dark:border-[#333] transition-all active:scale-95 focus:outline-none"
              aria-label="Download .gitignore file directly"
            >
              <Download className="w-4 h-4 text-slate-500 dark:text-[#888]" />
              <span>Download</span>
            </button>

            {/* CLI Snippet Modal Button */}
            <button
              id="cli-snippet-btn"
              type="button"
              onClick={() => setShowCliModal(true)}
              className="p-1.5 rounded-md border border-slate-200 dark:border-[#333] bg-slate-100 hover:bg-slate-200 dark:bg-[#141414] dark:hover:bg-[#1a1a1a] text-slate-600 dark:text-[#888] hover:text-slate-900 dark:hover:text-[#e5e5e5] transition-colors"
              title="CLI & Terminal Snippets"
              aria-label="View CLI command integration snippets"
            >
              <Terminal className="w-4 h-4" />
            </button>

            {/* Share Configuration Link */}
            <button
              id="share-link-btn"
              type="button"
              onClick={() => handleCopy('share', getShareLink())}
              className="p-1.5 rounded-md border border-slate-200 dark:border-[#333] bg-slate-100 hover:bg-slate-200 dark:bg-[#141414] dark:hover:bg-[#1a1a1a] text-slate-600 dark:text-[#888] hover:text-slate-900 dark:hover:text-[#e5e5e5] transition-colors"
              title={copiedKey === 'share' ? 'Copied link to clipboard!' : 'Share configuration link'}
              aria-label="Share configuration link"
            >
              {copiedKey === 'share' ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Selected Stack Badges & Controls Strip */}
        <div className="py-2 border-t border-slate-200 dark:border-[#1f1f1f]">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span suppressHydrationWarning className="text-[11px] font-medium text-slate-500 dark:text-[#888]">
              Active ({generated.templatesUsed.length}):
            </span>
            {generated.templatesUsed.length === 0 ? (
              <span className="text-xs text-slate-400 dark:text-[#555] italic">No stacks selected</span>
            ) : (
              generated.templatesUsed.map((template) => (
                <span
                  key={template.id}
                  className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-[#141414] text-slate-800 dark:text-[#e5e5e5] border border-slate-200 dark:border-[#262626]"
                >
                  {template.name}
                  <button
                    type="button"
                    onClick={() => onRemoveTemplate(template.id)}
                    className="p-0.5 text-slate-400 dark:text-[#666] hover:text-red-500 dark:hover:text-red-400 rounded transition-colors"
                    aria-label={`Remove ${template.name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Quick Option Toggles */}
          <div className="flex items-center gap-3 pt-2 -mb-4 text-xs text-slate-600 dark:text-[#888]">
            <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeComments}
                onChange={onToggleComments}
                className="ig-checkbox"
              />
              <span>Comments</span>
            </label>

            <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoDeduplicate}
                onChange={onToggleDeduplicate}
                className="ig-checkbox"
              />
              <span>Deduplicate</span>
            </label>

            <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sortSections}
                onChange={onToggleSort}
                className="ig-checkbox"
              />
              <span>Sort A-Z</span>
            </label>

            <label className="hidden sm:inline-flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeLineNumbers}
                onChange={onToggleLineNumbers}
                className="ig-checkbox"
              />
              <span>Line Numbers</span>
            </label>
          </div>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-hidden relative flex flex-col bg-slate-50 dark:bg-[#0a0a0a] text-slate-800 dark:text-[#abb2bf] font-mono text-xs transition-colors duration-300">
        {viewMode === 'custom' ? (
          /* Custom Rules Editor */
          <div className="p-4 flex-1 flex flex-col gap-3 bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-[#e5e5e5]">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#3b82f6]" />
                <span className="font-semibold text-slate-900 dark:text-[#e5e5e5]">Custom Project-Specific Rules</span>
              </div>
              <span className="text-slate-400 dark:text-[#666] text-[11px]">Appended directly to generated output</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#888]">
              Type custom patterns below (e.g. <code className="text-[#3b82f6]">/secrets/*.json</code>, <code className="text-emerald-500 dark:text-emerald-400">!important.env</code>, <code className="text-[#3b82f6]">/uploads/</code>).
            </p>
            <textarea
              id="custom-rules-textarea"
              value={customRules}
              onChange={(e) => onCustomRulesChange(e.target.value)}
              placeholder={`# Add custom ignore patterns here
/private-keys/
*.credentials.json
local-dev.sqlite
!keep-this-file.txt`}
              rows={12}
              className="w-full flex-1 p-3 rounded-md bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#222] text-slate-900 dark:text-[#e5e5e5] font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#3b82f6] resize-none leading-relaxed"
              aria-label="Custom .gitignore rules editor"
            />
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#666]">
              <span>{customRules.split('\n').filter((l) => l.trim()).length} custom rules defined</span>
              <button
                type="button"
                onClick={() => onCustomRulesChange('')}
                className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
              >
                Clear custom rules
              </button>
            </div>
          </div>
        ) : viewMode === 'raw' ? (
          /* Raw Text Area */
          <textarea
            readOnly
            value={generated.rawText}
            className="w-full h-full p-4 bg-slate-50 dark:bg-[#0a0a0a] text-slate-800 dark:text-[#abb2bf] font-mono text-xs resize-none focus:outline-none leading-relaxed selection:bg-[#3b82f6]/30 dark:selection:bg-[#3b82f6]/40 selection:text-slate-900 dark:selection:text-white"
            aria-label="Raw .gitignore text view"
          />
        ) : (
          /* Highlighted Preview Area */
          <div className="flex-1 overflow-y-auto p-4 space-y-0.5 select-text selection:bg-[#3b82f6]/30 dark:selection:bg-[#3b82f6]/40 max-h-[640px]">
            {tokens.length === 0 ? (
              <div className="text-center py-16 text-slate-400 dark:text-[#555]">
                <Code2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Select one or more tech stacks from the left to preview your .gitignore</p>
              </div>
            ) : (
              tokens.map((token) => {
                let colorClass = 'text-slate-800 dark:text-[#abb2bf]';
                if (token.type === 'header') colorClass = 'text-blue-600 dark:text-[#61afef] font-bold';
                else if (token.type === 'comment') colorClass = 'text-slate-400 dark:text-[#5c6370] italic';
                else if (token.type === 'negation') colorClass = 'text-emerald-600 dark:text-[#98c379] font-bold';
                else if (token.type === 'directory') colorClass = 'text-amber-700 dark:text-[#e5c07b]';
                else if (token.type === 'wildcard') colorClass = 'text-orange-600 dark:text-[#d19a66]';

                return (
                  <div
                    key={token.lineNumber}
                    className="group flex items-start gap-3 py-0.5 px-1 rounded hover:bg-slate-200/60 dark:hover:bg-[#141414] transition-colors"
                  >
                    {includeLineNumbers && (
                      <span className="w-8 text-right text-slate-400 dark:text-[#444] select-none text-[11px]">
                        {token.lineNumber}
                      </span>
                    )}

                    <div className="flex-1 flex items-center justify-between gap-2 overflow-hidden">
                      <span className={`${colorClass} break-all`}>
                        {token.text || '\u00A0'}
                      </span>

                      {token.explanation && (
                        <span
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#1f1f1f] text-slate-700 dark:text-[#888] select-none flex items-center gap-1 cursor-help whitespace-nowrap border border-slate-300 dark:border-[#333]"
                          title={`${token.explanation.summary}: ${token.explanation.reason}`}
                        >
                          <Info className="w-2.5 h-2.5 text-[#3b82f6]" />
                          <span>{token.explanation.summary}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Footer Info Bar */}
      <div className="px-4 py-2.5 bg-slate-100 dark:bg-[#0c0c0c] border-t border-slate-200 dark:border-[#1f1f1f] flex items-center justify-between text-xs text-slate-600 dark:text-[#888] transition-colors">
        <div className="flex items-center gap-3">
          <span>
            Total Rules: <strong className="text-slate-900 dark:text-[#e5e5e5]">{generated.ruleCount}</strong>
          </span>
          <span>•</span>
          <span>
            Lines: <strong className="text-slate-900 dark:text-[#e5e5e5]">{generated.totalLines}</strong>
          </span>
        </div>

        <button
          type="button"
          onClick={onSaveAsPreset}
          className="text-xs font-semibold text-[#3b82f6] hover:underline flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Save Preset
        </button>
      </div>

      {/* CLI & Terminal Snippets Dialog */}
      {showCliModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cli-modal-title"
        >
          <div className="bg-white dark:bg-[#0f0f0f] text-slate-900 dark:text-[#e5e5e5] rounded-xl border border-slate-200 dark:border-[#1f1f1f] max-w-lg w-full p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#3b82f6]" />
                <h3 id="cli-modal-title" className="text-base font-bold text-slate-900 dark:text-[#e5e5e5]">
                  CLI &amp; Terminal Commands
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCliModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:text-[#888] dark:hover:text-[#e5e5e5] rounded-md hover:bg-slate-100 dark:hover:bg-[#222]"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-600 dark:text-[#888]">
                    1. Download directly to current project directory:
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-medium">
                    Short URL
                  </span>
                </div>
                <div className="p-2.5 rounded-md bg-slate-100 dark:bg-[#000] border border-slate-200 dark:border-[#222] text-blue-600 dark:text-[#3b82f6] font-mono overflow-x-auto flex items-center justify-between gap-2">
                  <code className="break-all">{getCliDownloadCommand()}</code>
                  <button onClick={() => handleCopy('cli1', getCliDownloadCommand())} className="p-1 hover:bg-slate-200 dark:hover:bg-[#333] rounded shrink-0" title="Copy CLI Command">
                    {copiedKey === 'cli1' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-slate-600 dark:text-[#888]">
                  2. Shareable web configuration link:
                </span>
                <div className="p-2.5 rounded-md bg-slate-100 dark:bg-[#000] border border-slate-200 dark:border-[#222] text-blue-600 dark:text-[#3b82f6] font-mono overflow-x-auto flex items-center justify-between gap-2">
                  <code className="break-all">{getShareLink()}</code>
                  <button onClick={() => handleCopy('cli-share', getShareLink())} className="p-1 hover:bg-slate-200 dark:hover:bg-[#333] rounded shrink-0" title="Copy Share Link">
                    {copiedKey === 'cli-share' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-slate-600 dark:text-[#888]">
                  3. Untrack already committed ignored files:
                </span>
                <div className="p-2.5 rounded-md bg-slate-100 dark:bg-[#000] border border-slate-200 dark:border-[#222] text-blue-600 dark:text-[#3b82f6] font-mono overflow-x-auto flex items-center justify-between gap-2">
                  <code className="break-all">{'git rm -r --cached . && git add . && git commit -m "Clean ignored files"'}</code>
                  <button onClick={() => handleCopy('cli2', 'git rm -r --cached . && git add . && git commit -m "Clean ignored files"')} className="p-1 hover:bg-slate-200 dark:hover:bg-[#333] rounded shrink-0">
                    {copiedKey === 'cli2' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-slate-600 dark:text-[#888]">
                  3. Verify why a file is ignored:
                </span>
                <div className="p-2.5 rounded-md bg-slate-100 dark:bg-[#000] border border-slate-200 dark:border-[#222] text-blue-600 dark:text-[#3b82f6] font-mono overflow-x-auto flex items-center justify-between gap-2">
                  <code className="break-all">git check-ignore -v path/to/file</code>
                  <button onClick={() => handleCopy('cli3', 'git check-ignore -v path/to/file')} className="p-1 hover:bg-slate-200 dark:hover:bg-[#333] rounded shrink-0">
                    {copiedKey === 'cli3' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-[#1f1f1f] flex justify-end">
              <button
                type="button"
                onClick={() => setShowCliModal(false)}
                className="px-4 py-2 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-[#1a1a1a] dark:hover:bg-[#222] text-slate-800 dark:text-[#e5e5e5] border border-slate-200 dark:border-[#333]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
