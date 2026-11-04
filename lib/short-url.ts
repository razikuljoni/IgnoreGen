import { TEMPLATES } from '../data/templates';
import { GeneratorOptions } from './generator';

// Map common short names/aliases to canonical template IDs
export const TEMPLATE_ALIASES: Record<string, string> = {
  // Languages
  node: 'node-js',
  nodejs: 'node-js',
  js: 'node-js',
  javascript: 'node-js',
  ts: 'typescript',
  py: 'python',
  py3: 'python',
  rs: 'rust',
  go: 'go',
  golang: 'go',
  java: 'java',
  c: 'c-cpp',
  cpp: 'c-cpp',
  'c++': 'c-cpp',
  csharp: 'csharp-dotnet',
  dotnet: 'csharp-dotnet',
  '.net': 'csharp-dotnet',
  cs: 'csharp-dotnet',
  php: 'php',
  rb: 'ruby',
  ruby: 'ruby',
  kt: 'kotlin',
  kotlin: 'kotlin',
  swift: 'swift',
  dart: 'dart',
  elixir: 'elixir',
  scala: 'scala',
  r: 'r-lang',
  rlang: 'r-lang',
  'r-lang': 'r-lang',
  zig: 'zig',
  lua: 'lua',

  // Frameworks
  next: 'nextjs',
  nextjs: 'nextjs',
  react: 'react',
  vue: 'vue-nuxt',
  nuxt: 'vue-nuxt',
  'vue-nuxt': 'vue-nuxt',
  angular: 'angular',
  ng: 'angular',
  svelte: 'svelte-sveltekit',
  sveltekit: 'svelte-sveltekit',
  astro: 'astro',
  remix: 'remix',
  django: 'django',
  fastapi: 'fastapi-flask',
  flask: 'fastapi-flask',
  'fastapi-flask': 'fastapi-flask',
  laravel: 'laravel',
  rails: 'rails',
  spring: 'spring-boot',
  'spring-boot': 'spring-boot',
  express: 'express-nestjs',
  nestjs: 'express-nestjs',
  'express-nestjs': 'express-nestjs',
  flutter: 'flutter',
  rn: 'react-native-expo',
  expo: 'react-native-expo',
  'react-native': 'react-native-expo',
  'react-native-expo': 'react-native-expo',
  electron: 'electron-tauri',
  tauri: 'electron-tauri',
  'electron-tauri': 'electron-tauri',
  unity: 'unity',
  godot: 'godot',
  unreal: 'unreal-engine',
  'unreal-engine': 'unreal-engine',

  // Package Managers
  pnpm: 'pnpm-yarn-npm',
  yarn: 'pnpm-yarn-npm',
  npm: 'pnpm-yarn-npm',
  'pnpm-yarn-npm': 'pnpm-yarn-npm',
  pip: 'pip-poetry-conda',
  poetry: 'pip-poetry-conda',
  conda: 'pip-poetry-conda',
  'pip-poetry-conda': 'pip-poetry-conda',
  maven: 'maven-gradle',
  gradle: 'maven-gradle',
  'maven-gradle': 'maven-gradle',
  composer: 'composer',
  cocoapods: 'cocoapods-carthage',
  carthage: 'cocoapods-carthage',
  'cocoapods-carthage': 'cocoapods-carthage',

  // OS
  mac: 'macos',
  macos: 'macos',
  osx: 'macos',
  windows: 'windows',
  win: 'windows',
  linux: 'linux',

  // Editors & IDEs
  vscode: 'vscode',
  jetbrains: 'jetbrains',
  vs: 'visual-studio',
  'visual-studio': 'visual-studio',
  xcode: 'xcode',
  android: 'android-studio',
  'android-studio': 'android-studio',
  vim: 'vim-neovim',
  nvim: 'vim-neovim',
  neovim: 'vim-neovim',
  'vim-neovim': 'vim-neovim',
  sublime: 'sublime-text',
  'sublime-text': 'sublime-text',
  eclipse: 'eclipse',

  // Tools & DevOps
  docker: 'docker',
  turbo: 'turborepo',
  turborepo: 'turborepo',
  vite: 'vite-webpack',
  webpack: 'vite-webpack',
  'vite-webpack': 'vite-webpack',
  test: 'testing-coverage',
  testing: 'testing-coverage',
  coverage: 'testing-coverage',
  'testing-coverage': 'testing-coverage',
  terraform: 'terraform',
  tf: 'terraform',
  k8s: 'kubernetes-helm',
  kube: 'kubernetes-helm',
  helm: 'kubernetes-helm',
  'kubernetes-helm': 'kubernetes-helm',
  prisma: 'prisma-drizzle',
  drizzle: 'prisma-drizzle',
  'prisma-drizzle': 'prisma-drizzle',
  storybook: 'storybook',

  // Secrets & Config
  env: 'env-files',
  dotenv: 'env-files',
  'env-files': 'env-files',
  keys: 'keys-certificates',
  certs: 'keys-certificates',
  'keys-certificates': 'keys-certificates',
  logs: 'logs-databases',
  db: 'logs-databases',
  'logs-databases': 'logs-databases',
  backup: 'backup-temp',
  'backup-temp': 'backup-temp',
};

// Canonical shortest name to prefer in readable CLI URLs
export const CANONICAL_SHORT_NAME: Record<string, string> = {
  'node-js': 'node',
  typescript: 'ts',
  python: 'py',
  rust: 'rs',
  go: 'go',
  'c-cpp': 'cpp',
  'csharp-dotnet': 'dotnet',
  ruby: 'rb',
  kotlin: 'kt',
  'r-lang': 'r',
  nextjs: 'next',
  'vue-nuxt': 'vue',
  'svelte-sveltekit': 'svelte',
  'fastapi-flask': 'fastapi',
  'spring-boot': 'spring',
  'express-nestjs': 'express',
  'react-native-expo': 'rn',
  'electron-tauri': 'electron',
  'unreal-engine': 'unreal',
  'pnpm-yarn-npm': 'pnpm',
  'pip-poetry-conda': 'pip',
  'maven-gradle': 'gradle',
  'cocoapods-carthage': 'cocoapods',
  macos: 'mac',
  windows: 'win',
  'visual-studio': 'vs',
  'android-studio': 'android',
  'vim-neovim': 'vim',
  'sublime-text': 'sublime',
  turborepo: 'turbo',
  'vite-webpack': 'vite',
  'testing-coverage': 'test',
  terraform: 'tf',
  'kubernetes-helm': 'k8s',
  'prisma-drizzle': 'prisma',
  'env-files': 'env',
  'keys-certificates': 'keys',
  'logs-databases': 'logs',
  'backup-temp': 'backup',
};

export const DEFAULT_OPTIONS: GeneratorOptions = {
  includeComments: true,
  sortSections: false,
  autoDeduplicate: true,
  customRules: '',
};

export interface CompactConfig {
  selectedIds: string[];
  options: GeneratorOptions;
  customRules: string;
}

// Maps template ID to stable bit index (0..64)
const idToIndexMap = new Map<string, number>();
const indexToIdMap = new Map<number, string>();
TEMPLATES.forEach((template, index) => {
  idToIndexMap.set(template.id, index);
  indexToIdMap.set(index, template.id);
});

// Binary / Base64URL conversions safe in both browser (Webpack Buffer polyfill / window) and Node.js
export function bytesToBase64Url(bytes: Uint8Array): string {
  let base64 = '';
  if (typeof Buffer !== 'undefined') {
    try {
      base64 = Buffer.from(bytes).toString('base64');
    } catch {
      // Fallback to window.btoa if Buffer fails
    }
  }
  if (!base64) {
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    base64 = typeof btoa !== 'undefined' ? btoa(binary) : '';
  }
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function base64UrlToBytes(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  if (typeof Buffer !== 'undefined') {
    try {
      return new Uint8Array(Buffer.from(base64, 'base64'));
    } catch {
      // Fallback to window.atob if Buffer fails
    }
  }
  const binary = typeof atob !== 'undefined' ? atob(base64) : '';
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function stringToBase64Url(str: string): string {
  const bytes = typeof TextEncoder !== 'undefined'
    ? new TextEncoder().encode(str)
    : (typeof Buffer !== 'undefined' ? new Uint8Array(Buffer.from(str, 'utf8')) : new Uint8Array());
  return bytesToBase64Url(bytes);
}

export function base64UrlToString(str: string): string {
  const bytes = base64UrlToBytes(str);
  if (typeof TextDecoder !== 'undefined') {
    return new TextDecoder().decode(bytes);
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('utf8');
  }
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return decodeURIComponent(escape(binary));
}

/**
 * Resolves a template string (which might be an alias, abbreviation, or ID) to a valid template ID.
 */
export function resolveTemplateIdOrAlias(input: string): string | null {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return null;

  if (idToIndexMap.has(normalized)) {
    return normalized;
  }

  if (TEMPLATE_ALIASES[normalized]) {
    return TEMPLATE_ALIASES[normalized];
  }

  return null;
}

/**
 * Encodes selected template IDs into a compact 9-byte bitmask encoded as Base64URL.
 */
export function encodeTemplateBitmask(selectedIds: string[]): string {
  const bytes = new Uint8Array(9);
  let hasBits = false;

  for (const id of selectedIds) {
    const idx = idToIndexMap.get(id);
    if (idx !== undefined && idx < 72) {
      const byteIndex = Math.floor(idx / 8);
      const bitOffset = idx % 8;
      bytes[byteIndex] |= (1 << bitOffset);
      hasBits = true;
    }
  }

  if (!hasBits) return '';

  let end = bytes.length;
  while (end > 0 && bytes[end - 1] === 0) {
    end--;
  }

  return bytesToBase64Url(bytes.subarray(0, end));
}

/**
 * Decodes a Base64URL-encoded bitmask back into template IDs (in catalog order).
 */
export function decodeTemplateBitmask(token: string): string[] {
  if (!token) return [];
  try {
    const bytes = base64UrlToBytes(token);
    const result: string[] = [];

    for (let i = 0; i < TEMPLATES.length; i++) {
      const byteIndex = Math.floor(i / 8);
      const bitOffset = i % 8;
      if (byteIndex < bytes.length && (bytes[byteIndex] & (1 << bitOffset)) !== 0) {
        result.push(TEMPLATES[i].id);
      }
    }
    return result;
  } catch {
    return [];
  }
}

/**
 * Packs options into a 3-bit flag number. Only records differences from defaults.
 */
export function packOptionFlags(options: Partial<GeneratorOptions>): number {
  let flags = 0;
  if (options.includeComments === false) flags |= 1;
  if (options.sortSections === true) flags |= 2;
  if (options.autoDeduplicate === false) flags |= 4;
  return flags;
}

/**
 * Unpacks a 3-bit flag number back into GeneratorOptions.
 */
export function unpackOptionFlags(flags: number, customRules = ''): GeneratorOptions {
  return {
    includeComments: (flags & 1) === 0,
    sortSections: (flags & 2) !== 0,
    autoDeduplicate: (flags & 4) === 0,
    customRules,
  };
}

/**
 * Encodes full configuration (templates, options, customRules) into a short stateless token.
 */
export function encodeConfigToken(config: {
  selectedIds: string[];
  options?: Partial<GeneratorOptions>;
  customRules?: string;
}): string {
  const { selectedIds, options = {}, customRules = '' } = config;
  const bitmask = encodeTemplateBitmask(selectedIds);
  const flags = packOptionFlags(options);
  const trimmedRules = customRules.trim();

  // If default options and no custom rules, return simple bitmask token: "m.<bitmask>"
  if (flags === 0 && !trimmedRules) {
    return bitmask ? `m.${bitmask}` : '';
  }

  // If options or custom rules are specified, return compact JSON token: "c.<b64>"
  const payload: { t?: string; o?: number; r?: string } = {};
  if (bitmask) payload.t = bitmask;
  if (flags !== 0) payload.o = flags;
  if (trimmedRules) payload.r = trimmedRules;

  return `c.${stringToBase64Url(JSON.stringify(payload))}`;
}

/**
 * Decodes a token back into { selectedIds, options, customRules }.
 */
export function decodeConfigToken(token: string): CompactConfig {
  if (!token) {
    return {
      selectedIds: [],
      options: { ...DEFAULT_OPTIONS },
      customRules: '',
    };
  }

  // Handle bitmask prefix "m."
  if (token.startsWith('m.')) {
    const bitmask = token.slice(2);
    return {
      selectedIds: decodeTemplateBitmask(bitmask),
      options: { ...DEFAULT_OPTIONS },
      customRules: '',
    };
  }

  // Handle full compact prefix "c."
  if (token.startsWith('c.')) {
    try {
      const jsonStr = base64UrlToString(token.slice(2));
      const payload = JSON.parse(jsonStr);
      const selectedIds = payload.t ? decodeTemplateBitmask(payload.t) : [];
      const customRules = payload.r || '';
      const options = unpackOptionFlags(payload.o || 0, customRules);
      return { selectedIds, options, customRules };
    } catch {
      return {
        selectedIds: [],
        options: { ...DEFAULT_OPTIONS },
        customRules: '',
      };
    }
  }

  // Fallback: raw bitmask without prefix
  return {
    selectedIds: decodeTemplateBitmask(token),
    options: { ...DEFAULT_OPTIONS },
    customRules: '',
  };
}

/**
 * Builds smart, minimal CLI download snippet:
 * - 0 stacks: curl -sL "${baseUrl}/api/g" -o .gitignore
 * - 1-3 stacks with default options & no custom rules: curl -sL "${baseUrl}/api/g/node,react" -o .gitignore
 * - 4+ stacks or custom rules / flags: curl -sL "${baseUrl}/api/g?s=${token}" -o .gitignore
 */
export function getSmartCliCommand(
  baseUrl: string,
  config: {
    selectedIds: string[];
    options: GeneratorOptions;
    customRules: string;
  }
): string {
  const { selectedIds, options, customRules } = config;
  const flags = packOptionFlags(options);
  const hasCustomRules = Boolean(customRules.trim());

  // Clean baseUrl without trailing slash
  const host = baseUrl.replace(/\/+$/, '');

  // 1-3 stacks with default options and no custom rules -> clean readable path
  if (!hasCustomRules && flags === 0 && selectedIds.length > 0 && selectedIds.length <= 3) {
    const readableNames = selectedIds.map(
      (id) => CANONICAL_SHORT_NAME[id] || id
    );
    return `curl -sL "${host}/api/g/${readableNames.join(',')}" -o .gitignore`;
  }

  // 0 stacks with default options and no custom rules
  if (!hasCustomRules && flags === 0 && selectedIds.length === 0) {
    return `curl -sL "${host}/api/g" -o .gitignore`;
  }

  // 4+ stacks or custom rules / non-default options -> compact token
  const token = encodeConfigToken({ selectedIds, options, customRules });
  return `curl -sL "${host}/api/g?s=${token}" -o .gitignore`;
}

/**
 * Generates a shareable URL to open IgnoreGen with the exact configuration loaded.
 */
export function getShareUrl(
  baseUrl: string,
  config: {
    selectedIds: string[];
    options: GeneratorOptions;
    customRules: string;
  }
): string {
  const host = baseUrl.replace(/\/+$/, '');
  const token = encodeConfigToken(config);
  return token ? `${host}/?s=${token}` : host;
}
