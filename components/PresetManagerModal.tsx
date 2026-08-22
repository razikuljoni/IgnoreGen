'use client';

import React, { useState, useRef } from 'react';
import { 
  StorageService, 
  UserCustomPreset, 
  UserPreferences,
  DEFAULT_PREFERENCES 
} from '@/lib/storage';
import { 
  Bookmark, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  RefreshCw, 
  Check, 
  X, 
  AlertCircle,
  FileJson,
  Layers
} from 'lucide-react';

interface PresetManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplateIds: string[];
  customRules: string;
  preferences: UserPreferences;
  onApplyPreset: (templateIds: string[], customRules: string) => void;
  onImportData: (data: { selectedTemplateIds: string[]; customRules: string; preferences: UserPreferences }) => void;
  onResetDefaults: () => void;
}

export const PresetManagerModal: React.FC<PresetManagerModalProps> = ({
  isOpen,
  onClose,
  selectedTemplateIds,
  customRules,
  preferences,
  onApplyPreset,
  onImportData,
  onResetDefaults,
}) => {
  const [presets, setPresets] = useState<UserCustomPreset[]>(() => StorageService.getSavedPresets());
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDesc, setNewPresetDesc] = useState('');
  const [activeTab, setActiveTab] = useState<'presets' | 'sync'>('presets');
  const [importJsonText, setImportJsonText] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const refreshPresets = () => {
    setPresets(StorageService.getSavedPresets());
  };

  const handleSaveCurrentPreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) return;

    StorageService.savePreset({
      name: newPresetName.trim(),
      description: newPresetDesc.trim() || `${selectedTemplateIds.length} stacks configured`,
      templateIds: selectedTemplateIds,
      customRules: customRules,
    });

    setNewPresetName('');
    setNewPresetDesc('');
    refreshPresets();
    setStatusMessage({ type: 'success', text: 'Custom preset saved successfully!' });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleDeletePreset = (id: string) => {
    StorageService.deletePreset(id);
    refreshPresets();
  };

  const handleExportJson = () => {
    const jsonStr = StorageService.exportFullBackup(selectedTemplateIds, customRules, preferences);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gitignore-config-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatusMessage({ type: 'success', text: 'Configuration exported as JSON!' });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const data = StorageService.importBackup(text);
        onImportData({
          selectedTemplateIds: data.selectedTemplateIds,
          customRules: data.customRules,
          preferences: data.preferences || DEFAULT_PREFERENCES,
        });
        refreshPresets();
        setStatusMessage({ type: 'success', text: 'Backup imported successfully!' });
        setTimeout(() => setStatusMessage(null), 3000);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Invalid JSON file format';
        setStatusMessage({ type: 'error', text: `Import failed: ${msg}` });
      }
    };
    reader.readAsText(file);
  };

  const handleImportJsonText = () => {
    if (!importJsonText.trim()) return;
    try {
      const data = StorageService.importBackup(importJsonText);
      onImportData({
        selectedTemplateIds: data.selectedTemplateIds,
        customRules: data.customRules,
        preferences: data.preferences || DEFAULT_PREFERENCES,
      });
      setImportJsonText('');
      refreshPresets();
      setStatusMessage({ type: 'success', text: 'Configuration imported successfully!' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON string';
      setStatusMessage({ type: 'error', text: `Import failed: ${msg}` });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 transition-colors duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="presets-modal-title"
    >
      <div className="bg-white dark:bg-[#0f0f0f] text-slate-900 dark:text-[#e5e5e5] rounded-xl border border-slate-200 dark:border-[#1f1f1f] max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-[#1f1f1f] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#141414] border border-slate-200 dark:border-[#222] text-[#3b82f6] flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 id="presets-modal-title" className="text-base font-bold text-slate-900 dark:text-[#e5e5e5]">
                Presets & Machine Sync
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#888]">
                Save personalized stack bundles & sync across development environments
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

        {/* Tab switch */}
        <div className="px-5 pt-3 border-b border-slate-200 dark:border-[#1f1f1f] flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'presets'
                ? 'border-[#3b82f6] text-[#3b82f6]'
                : 'border-transparent text-slate-500 dark:text-[#888] hover:text-slate-900 dark:hover:text-[#e5e5e5]'
            }`}
          >
            Saved Custom Presets ({presets.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sync')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'sync'
                ? 'border-[#3b82f6] text-[#3b82f6]'
                : 'border-transparent text-slate-500 dark:text-[#888] hover:text-slate-900 dark:hover:text-[#e5e5e5]'
            }`}
          >
            Export & Import (Local Sync)
          </button>
        </div>

        {/* Status Alert Banner */}
        {statusMessage && (
          <div
            className={`mx-5 mt-3 p-2.5 rounded-lg text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                : 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60'
            }`}
          >
            {statusMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'presets' ? (
            <>
              {/* Form to save current active selection */}
              <form onSubmit={handleSaveCurrentPreset} className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#222] space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-[#e5e5e5]">
                  <span className="flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-[#3b82f6]" />
                    Save Active Selection as New Preset
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-[#888] font-normal">
                    {selectedTemplateIds.length} stacks + {customRules ? 'custom rules' : '0 custom rules'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    placeholder="Preset name (e.g. My Next.js SaaS)"
                    className="px-3 py-1.5 rounded-md border border-slate-200 dark:border-[#262626] bg-white dark:bg-[#0c0c0c] text-slate-900 dark:text-[#e5e5e5] text-xs focus:ring-1 focus:ring-[#3b82f6] focus:outline-none placeholder:text-slate-400 dark:placeholder:text-[#555]"
                  />
                  <input
                    type="text"
                    value={newPresetDesc}
                    onChange={(e) => setNewPresetDesc(e.target.value)}
                    placeholder="Short description (optional)"
                    className="px-3 py-1.5 rounded-md border border-slate-200 dark:border-[#262626] bg-white dark:bg-[#0c0c0c] text-slate-900 dark:text-[#e5e5e5] text-xs focus:ring-1 focus:ring-[#3b82f6] focus:outline-none placeholder:text-slate-400 dark:placeholder:text-[#555]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-1.5 rounded-md text-xs font-semibold bg-[#3b82f6] hover:bg-[#2563eb] text-white transition-colors shadow-md shadow-blue-900/20"
                >
                  Save Preset
                </button>
              </form>

              {/* List of user saved presets */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-[#888]">
                  Your Saved Presets
                </span>

                {presets.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 dark:text-[#555] text-xs border border-dashed border-slate-200 dark:border-[#222] rounded-lg p-4">
                    <Bookmark className="w-6 h-6 mx-auto mb-1 opacity-40 text-[#3b82f6]" />
                    <p>No custom presets saved yet.</p>
                    <p className="text-[11px] text-slate-500 dark:text-[#666] mt-0.5">
                      Configure your desired tech stacks and save them using the form above.
                    </p>
                  </div>
                ) : (
                  presets.map((preset) => (
                    <div
                      key={preset.id}
                      className="p-3 rounded-lg border border-slate-200 dark:border-[#222] bg-slate-50 dark:bg-[#141414] flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-[#e5e5e5] truncate">
                          {preset.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-[#888] truncate">
                          {preset.description}
                        </p>
                        <span className="text-[10px] text-[#3b82f6] font-mono">
                          {preset.templateIds.length} stacks {preset.customRules ? '+ custom rules' : ''}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            onApplyPreset(preset.templateIds, preset.customRules);
                            onClose();
                          }}
                          className="px-2.5 py-1 rounded-md text-xs font-medium bg-white hover:bg-slate-100 dark:bg-[#1a1a1a] dark:hover:bg-[#222] text-slate-800 dark:text-[#e5e5e5] border border-slate-200 dark:border-[#333] transition-colors"
                        >
                          Apply
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePreset(preset.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 dark:text-[#666] dark:hover:text-red-400 rounded-md hover:bg-slate-200 dark:hover:bg-[#222]"
                          aria-label={`Delete ${preset.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            /* Sync / Export / Import Tab */
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#222] space-y-2">
                <span className="font-semibold text-slate-900 dark:text-[#e5e5e5] flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-[#3b82f6]" />
                  1. Export Configuration to File
                </span>
                <p className="text-slate-500 dark:text-[#888] text-[11px]">
                  Download all your active stack selections, custom rules, preferences, and saved presets into a portable JSON backup file.
                </p>
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="w-full py-2 rounded-md text-xs font-semibold bg-white hover:bg-slate-100 dark:bg-[#1a1a1a] dark:hover:bg-[#222] text-slate-800 dark:text-[#e5e5e5] border border-slate-200 dark:border-[#333] flex items-center justify-center gap-1.5 transition-all"
                >
                  <FileJson className="w-3.5 h-3.5 text-[#3b82f6]" />
                  Download Backup JSON
                </button>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#222] space-y-2.5">
                <span className="font-semibold text-slate-900 dark:text-[#e5e5e5] flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-[#3b82f6]" />
                  2. Import Configuration from Backup
                </span>
                <p className="text-slate-500 dark:text-[#888] text-[11px]">
                  Upload a JSON backup file or paste the JSON text below to instantly restore all settings on this machine.
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImportJsonFile}
                  accept=".json,application/json"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 rounded-md text-xs font-semibold border border-slate-200 dark:border-[#333] bg-white hover:bg-slate-100 dark:bg-[#0c0c0c] dark:hover:bg-[#1a1a1a] text-slate-800 dark:text-[#e5e5e5] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-[#3b82f6]" />
                  Choose JSON File from Device
                </button>

                <div className="pt-2 border-t border-slate-200 dark:border-[#222] space-y-1.5">
                  <span className="text-[11px] text-slate-500 dark:text-[#888]">Or paste raw JSON:</span>
                  <textarea
                    value={importJsonText}
                    onChange={(e) => setImportJsonText(e.target.value)}
                    placeholder='{"version":1, "selectedTemplateIds": [...], ...}'
                    rows={3}
                    className="w-full p-2 rounded-md bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#222] font-mono text-[11px] text-slate-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                  />
                  {importJsonText.trim() && (
                    <button
                      type="button"
                      onClick={handleImportJsonText}
                      className="w-full py-1.5 rounded-md text-xs font-semibold bg-[#3b82f6] text-white hover:bg-[#2563eb] transition-colors"
                    >
                      Apply Pasted JSON
                    </button>
                  )}
                </div>
              </div>

              {/* Reset defaults */}
              <div className="pt-2 flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-[#666]">Need to start fresh?</span>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset all stacks and preferences to default recommended settings?')) {
                      onResetDefaults();
                      refreshPresets();
                      onClose();
                    }
                  }}
                  className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset to Defaults
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
