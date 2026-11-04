export interface UserCustomPreset {
  id: string;
  name: string;
  description: string;
  templateIds: string[];
  customRules: string;
  createdAt: string;
}

export interface UserPreferences {
  theme: 'system' | 'light' | 'dark';
  includeComments: boolean;
  sortSections: boolean;
  autoDeduplicate: boolean;
  includeLineNumbers: boolean;
  defaultTemplateIds: string[];
}

export interface AppSyncData {
  version: number;
  exportedAt: string;
  selectedTemplateIds: string[];
  customRules: string;
  preferences: UserPreferences;
  savedPresets: UserCustomPreset[];
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  includeComments: true,
  sortSections: false,
  autoDeduplicate: true,
  includeLineNumbers: true,
  defaultTemplateIds: [], // Start with an empty selection
};

const STORAGE_KEYS = {
  SELECTED_TEMPLATES: 'gitignore_generator_selected_templates',
  CUSTOM_RULES: 'gitignore_generator_custom_rules',
  PREFERENCES: 'gitignore_generator_preferences',
  SAVED_PRESETS: 'gitignore_generator_saved_presets',
  ACTIVE_PRESET: 'gitignore_generator_active_preset',
};

export const StorageService = {
  getSelectedTemplates(): string[] {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES.defaultTemplateIds;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SELECTED_TEMPLATES);
      // If it exists but is an empty array string "[]", we should return []
      // If it doesn't exist at all (null), we return defaults
      return stored !== null ? JSON.parse(stored) : DEFAULT_PREFERENCES.defaultTemplateIds;
    } catch {
      return DEFAULT_PREFERENCES.defaultTemplateIds;
    }
  },

  saveSelectedTemplates(templateIds: string[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_TEMPLATES, JSON.stringify(templateIds));
    } catch (e) {
      console.error('Failed to save templates to localStorage', e);
    }
  },

  getCustomRules(): string {
    if (typeof window === 'undefined') return '';
    try {
      return localStorage.getItem(STORAGE_KEYS.CUSTOM_RULES) || '';
    } catch {
      return '';
    }
  },

  saveCustomRules(rules: string) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_RULES, rules);
    } catch (e) {
      console.error('Failed to save custom rules', e);
    }
  },

  getPreferences(): UserPreferences {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return stored ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  },

  savePreferences(prefs: UserPreferences) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
    } catch (e) {
      console.error('Failed to save preferences', e);
    }
  },

  getSavedPresets(): UserCustomPreset[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SAVED_PRESETS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  savePreset(preset: Omit<UserCustomPreset, 'id' | 'createdAt'>): UserCustomPreset {
    const presets = this.getSavedPresets();
    const newPreset: UserCustomPreset = {
      ...preset,
      id: `custom-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newPreset, ...presets];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SAVED_PRESETS, JSON.stringify(updated));
    }
    return newPreset;
  },

  deletePreset(id: string) {
    const presets = this.getSavedPresets();
    const updated = presets.filter((p) => p.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SAVED_PRESETS, JSON.stringify(updated));
    }
  },

  exportFullBackup(selectedTemplateIds: string[], customRules: string, prefs: UserPreferences): string {
    const data: AppSyncData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      selectedTemplateIds,
      customRules,
      preferences: prefs,
      savedPresets: this.getSavedPresets(),
    };
    return JSON.stringify(data, null, 2);
  },

  importBackup(jsonString: string): AppSyncData {
    const data: AppSyncData = JSON.parse(jsonString);
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid JSON structure');
    }
    if (!Array.isArray(data.selectedTemplateIds)) {
      throw new Error('Missing selectedTemplateIds array');
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SELECTED_TEMPLATES, JSON.stringify(data.selectedTemplateIds));
      localStorage.setItem(STORAGE_KEYS.CUSTOM_RULES, data.customRules || '');
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(data.preferences || DEFAULT_PREFERENCES));
      if (Array.isArray(data.savedPresets)) {
        localStorage.setItem(STORAGE_KEYS.SAVED_PRESETS, JSON.stringify(data.savedPresets));
      }
    }
    return data;
  },
};
