'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Loader2, 
  Check, 
  ShieldCheck, 
  Layers, 
  FileCode, 
  AlertCircle 
} from 'lucide-react';
import { Toast } from './ui/Toast';

interface AiResult {
  detectedStackSummary: string;
  recommendedTemplateIds: string[];
  customRules: string;
  securityInsights: string[];
}

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRecommendations: (templateIds: string[], customRules: string) => void;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  onApplyRecommendations,
}) => {
  const [prompt, setPrompt] = useState('');
  const [repoTree, setRepoTree] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  if (!isOpen) return null;

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() && !repoTree.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, repoTree }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze technology stack');
      }

      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error connecting to AI service';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!result) return;
    onApplyRecommendations(result.recommendedTemplateIds, result.customRules);
    setShowToast(true);
    onClose();
  };

  return (
    <>
      {showToast && (
        <Toast 
          message="Recommendations applied successfully!" 
          onClose={() => setShowToast(false)} 
        />
      )}
      <div 
        className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-end animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-drawer-title"
      >
      <div className="bg-white dark:bg-[#0f0f0f] text-slate-900 dark:text-[#e5e5e5] border-l border-slate-200 dark:border-[#1f1f1f] w-full max-w-xl h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-[#1f1f1f] flex items-center justify-between bg-slate-50 dark:bg-[#141414]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#3b82f6] text-white flex items-center justify-center shadow-md shadow-blue-900/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 id="ai-drawer-title" className="text-base font-bold text-slate-900 dark:text-[#e5e5e5] flex items-center gap-1.5">
                AI Stack Analyzer
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#888]">
                Describe your project or paste directory output for smart recommendations
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:text-[#888] dark:hover:text-[#e5e5e5] rounded-md hover:bg-slate-200 dark:hover:bg-[#1a1a1a]"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          <form onSubmit={handleAnalyze} className="space-y-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-900 dark:text-[#e5e5e5] flex items-center justify-between">
                <span>Describe your tech stack:</span>
                <span className="text-[11px] font-normal text-slate-500 dark:text-[#888]">e.g. Next.js 15, Prisma, Rust worker, Docker, macOS</span>
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="I'm building a monorepo with Next.js 15, FastAPI Python backend, Tailwind, Docker Compose, on macOS and Linux."
                rows={3}
                className="w-full p-3 rounded-md border border-slate-200 dark:border-[#222] bg-white dark:bg-[#0c0c0c] text-slate-900 dark:text-[#e5e5e5] text-xs focus:ring-1 focus:ring-[#3b82f6] focus:outline-none placeholder:text-slate-400 dark:placeholder:text-[#555]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-900 dark:text-[#e5e5e5] flex items-center justify-between">
                <span>Or paste file tree / directory list (optional):</span>
                <span className="text-[11px] font-normal text-slate-500 dark:text-[#888]">e.g. tree output or package list</span>
              </label>
              <textarea
                value={repoTree}
                onChange={(e) => setRepoTree(e.target.value)}
                placeholder={`package.json
src/
prisma/schema.prisma
backend/
  main.py
  requirements.txt
Dockerfile
docker-compose.yml`}
                rows={4}
                className="w-full p-3 rounded-md border border-slate-200 dark:border-[#222] bg-white dark:bg-[#0c0c0c] text-slate-900 dark:text-[#e5e5e5] font-mono text-[11px] focus:ring-1 focus:ring-[#3b82f6] focus:outline-none placeholder:text-slate-400 dark:placeholder:text-[#555]"
              />
            </div>

            <button
              type="submit"
              disabled={loading || (!prompt.trim() && !repoTree.trim())}
              className="w-full py-2.5 rounded-md font-bold bg-[#3b82f6] hover:bg-[#2563eb] text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Stack &amp; Security Needs...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze &amp; Generate Tailored .gitignore</span>
                </>
              )}
            </button>
          </form>

          {/* Error display */}
          {error && (
            <div className="p-3 rounded-md bg-red-950/60 border border-red-800/60 text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Results display */}
          {result && (
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#222] space-y-4 animate-in fade-in duration-150">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#3b82f6]">
                  Detected Architecture
                </span>
                <p className="font-semibold text-slate-900 dark:text-[#e5e5e5] text-xs">
                  {result.detectedStackSummary}
                </p>
              </div>

              {/* Recommended templates */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-600 dark:text-[#bbb] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#3b82f6]" />
                  Recommended Standard Templates ({result.recommendedTemplateIds.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.recommendedTemplateIds.map((id) => (
                    <span
                      key={id}
                      className="px-2 py-0.5 rounded bg-white dark:bg-[#0c0c0c] text-[#3b82f6] font-mono text-[11px] border border-slate-200 dark:border-[#262626]"
                    >
                      {id}
                    </span>
                  ))}
                </div>
              </div>

              {/* Custom Tailored Rules */}
              {result.customRules && (
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600 dark:text-[#bbb] flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-[#3b82f6]" />
                    Custom Tailored Ignore Rules:
                  </span>
                  <pre className="p-2.5 rounded-md bg-slate-100 dark:bg-black border border-slate-200 dark:border-[#222] text-[#3b82f6] font-mono text-[11px] overflow-x-auto max-h-36">
                    {result.customRules}
                  </pre>
                </div>
              )}

              {/* Security Insights */}
              {result.securityInsights?.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600 dark:text-[#bbb] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Security &amp; Git Advice:
                  </span>
                  <ul className="space-y-1 list-disc list-inside text-slate-500 dark:text-[#888] text-[11px]">
                    {result.securityInsights.map((insight, idx) => (
                      <li key={idx}>{insight}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Apply Button */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onApplyRecommendations(result.recommendedTemplateIds, result.customRules);
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-md font-bold bg-slate-100 hover:bg-slate-200 dark:bg-[#1a1a1a] dark:hover:bg-[#222] text-slate-800 dark:text-[#e5e5e5] border border-slate-200 dark:border-[#333] flex items-center justify-center gap-2 transition-all"
                >
                  <FileCode className="w-4 h-4" />
                  <span>Preview .gitignore</span>
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="flex-1 py-2.5 rounded-md font-bold bg-[#3b82f6] hover:bg-[#2563eb] text-white flex items-center justify-center gap-2 shadow-md shadow-blue-900/20 transition-all"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Apply</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </>
);
};
