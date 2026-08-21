'use client';

import React, { useState, useMemo } from 'react';
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
  FileCode
} from 'lucide-react';

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
  const [copied, setCopied] = useState(false);
  const [showCliModal, setShowCliModal] = useState(false);
  const [viewMode, setViewMode] = useState<'highlighted' | 'raw' | 'custom'>('highlighted');

  const tokens = useMemo(() => {
    return tokenizeGitignore(generated.rawText);
  }, [generated.rawText]);

  const handleCopy = async () => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(generated.rawText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    } catch {
      // Fallback
    }
  };

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
      className="flex flex-col h-full bg-[#0c0c0c] text-[#e5e5e5] rounded-xl border border-[#1f1f1f] shadow-lg overflow-hidden"
      aria-label="Generated .gitignore Preview and Actions"
    >
      {/* Top Action Bar */}
      <div className="p-4 sm:p-5 border-b border-[#1f1f1f] bg-[#0f0f0f] flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* File Tab & View Modes */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#141414] border border-[#222] shadow-sm">
              <FileCode className="w-4 h-4 text-[#3b82f6]" />
              <span className="font-mono text-xs font-bold text-[#e5e5e5]">.gitignore</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0a0a0a] text-[#888] border border-[#222] font-mono">
                {formattedSize}
              </span>
            </div>

            {/* View Mode Tabs */}
            <div className="flex items-center p-0.5 rounded-md bg-[#141414] border border-[#222] text-xs">
              <button
                type="button"
                onClick={() => setViewMode('highlighted')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  viewMode === 'highlighted'
                    ? 'bg-[#222] text-[#e5e5e5] shadow-xs'
                    : 'text-[#888] hover:text-[#e5e5e5]'
                }`}
              >
                Preview
              </button>
              <button
                type="button"
                onClick={() => setViewMode('custom')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  viewMode === 'custom'
                    ? 'bg-[#222] text-[#e5e5e5] shadow-xs'
                    : 'text-[#888] hover:text-[#e5e5e5]'
                }`}
              >
                Custom Rules {customRules.trim() ? '•' : ''}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('raw')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  viewMode === 'raw'
                    ? 'bg-[#222] text-[#e5e5e5] shadow-xs'
                    : 'text-[#888] hover:text-[#e5e5e5]'
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
              onClick={handleCopy}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all shadow-md shadow-blue-900/20 focus:outline-none ${
                copied
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-[#3b82f6] hover:bg-[#2563eb] text-white active:scale-95'
              }`}
              aria-label={copied ? 'Copied to clipboard' : 'Copy .gitignore content to clipboard'}
            >
              {copied ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            {/* Download Button */}
            <button
              id="download-gitignore-btn"
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[#1a1a1a] hover:bg-[#222] text-[#e5e5e5] border border-[#333] transition-all active:scale-95 focus:outline-none"
              aria-label="Download .gitignore file directly"
            >
              <Download className="w-4 h-4 text-[#888]" />
              <span>Download</span>
            </button>

            {/* CLI Snippet Modal Button */}
            <button
              id="cli-snippet-btn"
              type="button"
              onClick={() => setShowCliModal(true)}
              className="p-1.5 rounded-md border border-[#333] bg-[#141414] hover:bg-[#1a1a1a] text-[#888] hover:text-[#e5e5e5] transition-colors"
              title="CLI & Terminal Snippets"
              aria-label="View CLI command integration snippets"
            >
              <Terminal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Selected Stack Badges & Controls Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1f1f1f]">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-medium text-[#888]">
              Active ({generated.templatesUsed.length}):
            </span>
            {generated.templatesUsed.length === 0 ? (
              <span className="text-xs text-[#555] italic">No stacks selected</span>
            ) : (
              generated.templatesUsed.map((template) => (
                <span
                  key={template.id}
                  className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded text-[10px] font-medium bg-[#141414] text-[#e5e5e5] border border-[#262626]"
                >
                  {template.name}
                  <button
                    type="button"
                    onClick={() => onRemoveTemplate(template.id)}
                    className="p-0.5 text-[#666] hover:text-red-400 rounded"
                    aria-label={`Remove ${template.name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Quick Option Toggles */}
          <div className="flex items-center gap-3 text-xs text-[#888]">
            <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeComments}
                onChange={onToggleComments}
                className="w-3.5 h-3.5 accent-[#3b82f6] rounded"
              />
              <span>Comments</span>
            </label>

            <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoDeduplicate}
                onChange={onToggleDeduplicate}
                className="w-3.5 h-3.5 accent-[#3b82f6] rounded"
              />
              <span>Deduplicate</span>
            </label>

            <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sortSections}
                onChange={onToggleSort}
                className="w-3.5 h-3.5 accent-[#3b82f6] rounded"
              />
              <span>Sort A-Z</span>
            </label>

            <label className="hidden sm:inline-flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeLineNumbers}
                onChange={onToggleLineNumbers}
                className="w-3.5 h-3.5 accent-[#3b82f6] rounded"
              />
              <span>Line Numbers</span>
            </label>
          </div>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-hidden relative flex flex-col bg-[#0a0a0a] text-[#abb2bf] font-mono text-xs">
        {viewMode === 'custom' ? (
          /* Custom Rules Editor */
          <div className="p-4 flex-1 flex flex-col gap-3 bg-[#0a0a0a] text-[#e5e5e5]">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#3b82f6]" />
                <span className="font-semibold text-[#e5e5e5]">Custom Project-Specific Rules</span>
              </div>
              <span className="text-[#666] text-[11px]">Appended directly to generated output</span>
            </div>
            <p className="text-xs text-[#888]">
              Type custom patterns below (e.g. <code className="text-[#3b82f6]">/secrets/*.json</code>, <code className="text-emerald-400">!important.env</code>, <code className="text-[#3b82f6]">/uploads/</code>).
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
              className="w-full flex-1 p-3 rounded-md bg-[#141414] border border-[#222] text-[#e5e5e5] font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#3b82f6] resize-none leading-relaxed"
              aria-label="Custom .gitignore rules editor"
            />
            <div className="flex items-center justify-between text-xs text-[#666]">
              <span>{customRules.split('\n').filter((l) => l.trim()).length} custom rules defined</span>
              <button
                type="button"
                onClick={() => onCustomRulesChange('')}
                className="text-red-400 hover:text-red-300 transition-colors"
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
            className="w-full h-full p-4 bg-[#0a0a0a] text-[#abb2bf] font-mono text-xs resize-none focus:outline-none leading-relaxed selection:bg-[#3b82f6]/40 selection:text-white"
            aria-label="Raw .gitignore text view"
          />
        ) : (
          /* Highlighted Preview Area */
          <div className="flex-1 overflow-y-auto p-4 space-y-0.5 select-text selection:bg-[#3b82f6]/40 max-h-[640px]">
            {tokens.length === 0 ? (
              <div className="text-center py-16 text-[#555]">
                <Code2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Select one or more tech stacks from the left to preview your .gitignore</p>
              </div>
            ) : (
              tokens.map((token) => {
                let colorClass = 'text-[#abb2bf]';
                if (token.type === 'header') colorClass = 'text-[#61afef] font-bold';
                else if (token.type === 'comment') colorClass = 'text-[#5c6370] italic';
                else if (token.type === 'negation') colorClass = 'text-[#98c379] font-bold';
                else if (token.type === 'directory') colorClass = 'text-[#e5c07b]';
                else if (token.type === 'wildcard') colorClass = 'text-[#d19a66]';

                return (
                  <div
                    key={token.lineNumber}
                    className="group flex items-start gap-3 py-0.5 px-1 rounded hover:bg-[#141414] transition-colors"
                  >
                    {includeLineNumbers && (
                      <span className="w-8 text-right text-[#444] select-none text-[11px]">
                        {token.lineNumber}
                      </span>
                    )}

                    <div className="flex-1 flex items-center justify-between gap-2 overflow-hidden">
                      <span className={`${colorClass} break-all`}>
                        {token.text || '\u00A0'}
                      </span>

                      {token.explanation && (
                        <span
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] px-1.5 py-0.5 rounded bg-[#1f1f1f] text-[#888] select-none flex items-center gap-1 cursor-help whitespace-nowrap border border-[#333]"
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
      <div className="px-4 py-2.5 bg-[#0c0c0c] border-t border-[#1f1f1f] flex items-center justify-between text-xs text-[#888]">
        <div className="flex items-center gap-3">
          <span>
            Total Rules: <strong className="text-[#e5e5e5]">{generated.ruleCount}</strong>
          </span>
          <span>•</span>
          <span>
            Lines: <strong className="text-[#e5e5e5]">{generated.totalLines}</strong>
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
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cli-modal-title"
        >
          <div className="bg-[#0f0f0f] rounded-xl border border-[#1f1f1f] max-w-lg w-full p-5 space-y-4 shadow-2xl text-[#e5e5e5] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#3b82f6]" />
                <h3 id="cli-modal-title" className="text-base font-bold text-[#e5e5e5]">
                  CLI & Terminal Commands
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCliModal(false)}
                className="p-1.5 text-[#888] hover:text-[#e5e5e5] rounded-md hover:bg-[#222]"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-[#888]">
                  1. Download directly to current project directory:
                </span>
                <div className="p-2.5 rounded-md bg-[#000] border border-[#222] text-[#3b82f6] font-mono overflow-x-auto flex items-center justify-between gap-2">
                  <code>curl -sL &quot;https://gitignore.io/api/node,macos,visualstudiocode&quot; -o .gitignore</code>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-[#888]">
                  2. Untrack already committed ignored files:
                </span>
                <div className="p-2.5 rounded-md bg-[#000] border border-[#222] text-[#3b82f6] font-mono overflow-x-auto">
                  <code>git rm -r --cached . && git add . && git commit -m &quot;Clean ignored files&quot;</code>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-[#888]">
                  3. Verify why a file is ignored:
                </span>
                <div className="p-2.5 rounded-md bg-[#000] border border-[#222] text-[#3b82f6] font-mono overflow-x-auto">
                  <code>git check-ignore -v path/to/file</code>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1f1f1f] flex justify-end">
              <button
                type="button"
                onClick={() => setShowCliModal(false)}
                className="px-4 py-2 rounded-md text-xs font-semibold bg-[#1a1a1a] hover:bg-[#222] text-[#e5e5e5] border border-[#333]"
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
