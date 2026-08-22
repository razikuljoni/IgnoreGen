'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  Terminal, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle, 
  Copy, 
  Check, 
  ExternalLink,
  Code,
  AlertTriangle
} from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = async (text: string, id: string) => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(text);
        setCopiedSnippet(id);
        setTimeout(() => setCopiedSnippet(null), 2000);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 transition-colors duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="docs-modal-title"
    >
      <div className="bg-white dark:bg-[#0f0f0f] text-slate-900 dark:text-[#e5e5e5] rounded-xl border border-slate-200 dark:border-[#1f1f1f] max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-[#1f1f1f] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#141414] border border-slate-200 dark:border-[#222] text-[#3b82f6] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 id="docs-modal-title" className="text-base font-bold text-slate-900 dark:text-[#e5e5e5]">
                Developer Documentation &amp; Gitignore Cheat Sheet
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#888]">
                Complete guide to syntax rules, git commands, troubleshooting, and security best practices
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:text-[#888] dark:hover:text-[#e5e5e5] rounded-md hover:bg-slate-100 dark:hover:bg-[#1a1a1a]"
            aria-label="Close docs modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-600 dark:text-[#bbb] leading-relaxed">
          {/* Section 1: How .gitignore Works */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-[#e5e5e5] flex items-center gap-2">
              <Code className="w-4 h-4 text-[#3b82f6]" />
              1. How .gitignore Works
            </h4>
            <p>
              A <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#141414] text-[#3b82f6] font-mono text-[11px] border border-slate-200 dark:border-[#222]">.gitignore</code> file specifies intentionally untracked files that Git should ignore. Files already tracked by Git are <strong className="text-slate-900 dark:text-[#e5e5e5]">not affected</strong> by rules added later.
            </p>
          </section>

          {/* Section 2: Pattern Matching Syntax Table */}
          <section className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-[#e5e5e5]">
              2. Pattern Matching Syntax Rules
            </h4>
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-[#1f1f1f]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 dark:bg-[#141414] text-slate-900 dark:text-[#e5e5e5] font-semibold border-b border-slate-200 dark:border-[#1f1f1f]">
                  <tr>
                    <th className="p-2.5">Pattern</th>
                    <th className="p-2.5">Behavior</th>
                    <th className="p-2.5">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-[#1f1f1f] font-mono text-[11px]">
                  <tr>
                    <td className="p-2.5 text-[#3b82f6] font-bold">*</td>
                    <td className="p-2.5 font-sans text-xs text-slate-700 dark:text-[#bbb]">Matches zero or more characters (except /)</td>
                    <td className="p-2.5 text-slate-500 dark:text-[#888]">*.log ignores app.log, error.log</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-[#3b82f6] font-bold">**</td>
                    <td className="p-2.5 font-sans text-xs text-slate-700 dark:text-[#bbb]">Matches nested subdirectories recursively</td>
                    <td className="p-2.5 text-slate-500 dark:text-[#888]">**/build/ ignores build in any subfolder</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-[#3b82f6] font-bold">?</td>
                    <td className="p-2.5 font-sans text-xs text-slate-700 dark:text-[#bbb]">Matches exactly one character</td>
                    <td className="p-2.5 text-slate-500 dark:text-[#888]">test?.js matches test1.js, testA.js</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">!</td>
                    <td className="p-2.5 font-sans text-xs text-slate-700 dark:text-[#bbb]">Negation: re-includes an ignored file</td>
                    <td className="p-2.5 text-slate-500 dark:text-[#888]">*.env + !.env.example</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-sky-600 dark:text-sky-400 font-bold">/ (Leading)</td>
                    <td className="p-2.5 font-sans text-xs text-slate-700 dark:text-[#bbb]">Anchors pattern to repo root only</td>
                    <td className="p-2.5 text-slate-500 dark:text-[#888]">/temp only ignores root temp, not src/temp</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-sky-600 dark:text-sky-400 font-bold">/ (Trailing)</td>
                    <td className="p-2.5 font-sans text-xs text-slate-700 dark:text-[#bbb]">Restricts match to directories only</td>
                    <td className="p-2.5 text-slate-500 dark:text-[#888]">node_modules/ ignores folder, not file</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-orange-600 dark:text-orange-400 font-bold">[abc]</td>
                    <td className="p-2.5 font-sans text-xs text-slate-700 dark:text-[#bbb]">Matches any single character in brackets</td>
                    <td className="p-2.5 text-slate-500 dark:text-[#888]">log[0-9].txt matches log1.txt</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-slate-500 dark:text-[#666] font-bold">\#</td>
                    <td className="p-2.5 font-sans text-xs text-slate-700 dark:text-[#bbb]">Escapes literal hash character (not comment)</td>
                    <td className="p-2.5 text-slate-500 dark:text-[#888]">\#file.txt ignores file named &ldquo;#file.txt&rdquo;</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Essential Git Commands */}
          <section className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-[#e5e5e5] flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#3b82f6]" />
              3. Critical Git Commands for .gitignore
            </h4>

            {/* Snippet A: Untrack cached files */}
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#222] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 dark:text-[#e5e5e5]">
                  A. Fix: &quot;Why isn&apos;t my .gitignore rule working?&quot; (Untrack cached files)
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('git rm -r --cached . && git add . && git commit -m "Untrack ignored files"', 'untrack')}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:text-[#888] dark:hover:text-[#e5e5e5] rounded"
                  title="Copy command"
                >
                  {copiedSnippet === 'untrack' ? <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#888]">
                If a file was committed BEFORE adding it to .gitignore, Git still tracks it. Run this to remove all cached files and re-index according to your fresh .gitignore:
              </p>
              <pre className="p-2.5 rounded-md bg-slate-100 dark:bg-[#000] border border-slate-200 dark:border-[#222] text-blue-600 dark:text-[#3b82f6] font-mono text-[11px] overflow-x-auto">
                git rm -r --cached . &amp;&amp; git add . &amp;&amp; git commit -m &quot;Untrack ignored files&quot;
              </pre>
            </div>

            {/* Snippet B: Test ignore rule */}
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#222] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 dark:text-[#e5e5e5]">
                  B. Debug: Test which rule is ignoring a file
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('git check-ignore -v path/to/file', 'check')}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:text-[#888] dark:hover:text-[#e5e5e5] rounded"
                  title="Copy command"
                >
                  {copiedSnippet === 'check' ? <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <pre className="p-2.5 rounded-md bg-slate-100 dark:bg-[#000] border border-slate-200 dark:border-[#222] text-blue-600 dark:text-[#3b82f6] font-mono text-[11px] overflow-x-auto">
                git check-ignore -v path/to/file
              </pre>
            </div>

            {/* Snippet C: Global gitignore */}
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#222] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 dark:text-[#e5e5e5]">
                  C. Best Practice: Set up a Global .gitignore
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('git config --global core.excludesfile ~/.gitignore_global', 'global')}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:text-[#888] dark:hover:text-[#e5e5e5] rounded"
                  title="Copy command"
                >
                  {copiedSnippet === 'global' ? <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#888]">
                Keep OS files (.DS_Store, Thumbs.db) and your personal IDE settings (.vscode, .idea) in your global excludes file instead of cluttering every team repo:
              </p>
              <pre className="p-2.5 rounded-md bg-slate-100 dark:bg-[#000] border border-slate-200 dark:border-[#222] text-blue-600 dark:text-[#3b82f6] font-mono text-[11px] overflow-x-auto">
                git config --global core.excludesfile ~/.gitignore_global
              </pre>
            </div>
          </section>

          {/* Section 4: Security & Lockfile Checklist */}
          <section className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 space-y-2">
            <h4 className="text-sm font-bold text-red-800 dark:text-red-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" />
              4. Security Checklist &amp; What NOT to Ignore
            </h4>
            <ul className="space-y-1.5 text-xs text-red-700 dark:text-red-300/90 list-disc list-inside">
              <li>
                <strong className="text-red-900 dark:text-red-200">NEVER commit secrets:</strong> Always ignore <code className="font-mono bg-red-100 dark:bg-red-950/80 px-1 rounded border border-red-200 dark:border-red-900/50">.env</code>, <code className="font-mono bg-red-100 dark:bg-red-950/80 px-1 rounded border border-red-200 dark:border-red-900/50">*.pem</code>, <code className="font-mono bg-red-100 dark:bg-red-950/80 px-1 rounded border border-red-200 dark:border-red-900/50">id_rsa</code>, and credential files.
              </li>
              <li>
                <strong className="text-red-900 dark:text-red-200">DO commit lockfiles:</strong> Never ignore <code className="font-mono bg-red-100 dark:bg-red-950/80 px-1 rounded border border-red-200 dark:border-red-900/50">package-lock.json</code>, <code className="font-mono bg-red-100 dark:bg-red-950/80 px-1 rounded border border-red-200 dark:border-red-900/50">pnpm-lock.yaml</code>, <code className="font-mono bg-red-100 dark:bg-red-950/80 px-1 rounded border border-red-200 dark:border-red-900/50">yarn.lock</code>, or <code className="font-mono bg-red-100 dark:bg-red-950/80 px-1 rounded border border-red-200 dark:border-red-900/50">Cargo.lock</code> (for applications) to guarantee deterministic builds.
              </li>
              <li>
                <strong className="text-red-900 dark:text-red-200">DO commit example configs:</strong> Include <code className="font-mono bg-red-100 dark:bg-red-950/80 px-1 rounded border border-red-200 dark:border-red-900/50">.env.example</code> or <code className="font-mono bg-red-100 dark:bg-red-950/80 px-1 rounded border border-red-200 dark:border-red-900/50">.env.template</code> using negation (<code className="font-mono bg-red-100 dark:bg-red-950/80 px-1 rounded border border-red-200 dark:border-red-900/50">!.env.example</code>).
              </li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-[#1f1f1f] bg-slate-50 dark:bg-[#0c0c0c] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-[#1a1a1a] dark:hover:bg-[#222] text-slate-800 dark:text-[#e5e5e5] border border-slate-200 dark:border-[#333] transition-colors"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
