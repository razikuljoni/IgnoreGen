export interface GitignoreTemplate {
  id: string;
  name: string;
  category: 'languages' | 'frameworks' | 'package-managers' | 'operating-systems' | 'editors-ides' | 'tools-build' | 'security-secrets';
  description: string;
  tags: string[];
  popular?: boolean;
  content: string;
}

export interface PresetBundle {
  id: string;
  name: string;
  description: string;
  icon: string;
  templateIds: string[];
}

export interface RuleExplanation {
  pattern: string;
  summary: string;
  reason: string;
}

export const CATEGORIES = [
  { id: 'all', label: 'All Items' },
  { id: 'popular', label: '⭐ Popular' },
  { id: 'languages', label: 'Languages' },
  { id: 'frameworks', label: 'Frameworks' },
  { id: 'package-managers', label: 'Package Managers' },
  { id: 'editors-ides', label: 'Editors & IDEs' },
  { id: 'operating-systems', label: 'Operating Systems' },
  { id: 'tools-build', label: 'Tools & DevOps' },
  { id: 'security-secrets', label: 'Security & Secrets' },
] as const;

export const TEMPLATES: GitignoreTemplate[] = [
  // ================= LANGUAGES =================
  {
    id: 'node-js',
    name: 'Node.js / JavaScript',
    category: 'languages',
    description: 'Node modules, build outputs, npm/yarn logs, debug files',
    tags: ['node', 'javascript', 'js', 'npm', 'backend', 'frontend'],
    popular: true,
    content: `# Node.js / JavaScript
node_modules/
jspm_packages/
lerna-debug.log*
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
package-lock.json.bak
pnpm-lock.yaml.bak

# Diagnostic & coverage
.nyc_output/
coverage/
*.lcov
.clinic/
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# Build outputs & caches
dist/
build/
.cache/
.parcel-cache/
.turbo/
.eslintcache
.stylelintcache
ts-node/
`
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'languages',
    description: 'TypeScript build artifacts, declaration maps, tsbuildinfo',
    tags: ['ts', 'typescript', 'types', 'compilation'],
    popular: true,
    content: `# TypeScript
*.tsbuildinfo
*.d.ts.map
dist/
lib/
out/
`
  },
  {
    id: 'python',
    name: 'Python',
    category: 'languages',
    description: 'Bytecode, __pycache__, virtualenvs, pytest cache, eggs',
    tags: ['python', 'py', 'pip', 'django', 'fastapi', 'flask', 'ai', 'ml'],
    popular: true,
    content: `# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Virtual environments
.env/
.venv/
env/
venv/
ENV/
env.bak/
venv.bak/

# Testing & Coverage
.pytest_cache/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.py,cover
.hypothesis/
.mypy_cache/
.dmypy.json
dmypy.json
.pyre/
.pytype/
.ruff_cache/

# Jupyter Notebooks
.ipynb_checkpoints
*/.ipynb_checkpoints/*
`
  },
  {
    id: 'rust',
    name: 'Rust / Cargo',
    category: 'languages',
    description: 'Target directory, Cargo lock backups, debug symbols',
    tags: ['rust', 'cargo', 'wasm', 'systems'],
    popular: true,
    content: `# Rust
/target/
**/*.rs.bk
*.bk
Cargo.lock.bak
# Cargo.lock is tracked for binary projects, ignored for libraries
`
  },
  {
    id: 'go',
    name: 'Go (Golang)',
    category: 'languages',
    description: 'Compiled binaries, test outputs, vendor cache',
    tags: ['go', 'golang', 'backend', 'microservices'],
    popular: true,
    content: `# Go
bin/
pkg/
*.exe
*.exe~
*.dll
*.so
*.dylib
*.test
*.out
*.prof
vendor/
`
  },
  {
    id: 'java',
    name: 'Java',
    category: 'languages',
    description: 'Compiled class files, jar/war packaging, hs_err dumps',
    tags: ['java', 'jvm', 'spring', 'android'],
    popular: true,
    content: `# Java
*.class
*.log
*.ctxt
*.mtj.tmp/
*.jar
*.war
*.nar
*.ear
*.zip
*.tar.gz
*.rar
hs_err_pid*
replay_pid*
`
  },
  {
    id: 'c-cpp',
    name: 'C / C++',
    category: 'languages',
    description: 'Object files, compiled executables, cmake build folders',
    tags: ['c', 'c++', 'cpp', 'clang', 'gcc', 'cmake'],
    popular: true,
    content: `# C / C++
*.o
*.obj
*.so
*.a
*.lib
*.dylib
*.dll
*.exe
*.out
*.app
*.dSYM/

# Build dirs
build/
bin/
cmake-build-*/
CMakeCache.txt
CMakeFiles/
Makefile
`
  },
  {
    id: 'csharp-dotnet',
    name: 'C# / .NET',
    category: 'languages',
    description: 'bin, obj, user settings, publish output, NuGet packages',
    tags: ['c#', 'csharp', 'dotnet', '.net', 'aspnet', 'nuget', 'unity'],
    popular: true,
    content: `# .NET / C#
bin/
obj/
*.user
*.userosscache
*.sln.docstates
*.suo
*.userprefs
[Dd]ebug/
[Rr]elease/
_ReSharper*/
*.DotSettings.user
*.nupkg
packages/
publish/
`
  },
  {
    id: 'php',
    name: 'PHP',
    category: 'languages',
    description: 'Composer vendor, phpunit cache, xdebug profiling',
    tags: ['php', 'composer', 'laravel', 'symfony', 'wordpress'],
    content: `# PHP
vendor/
.phpunit.result.cache
.phpunit.cache/
.php-cs-fixer.cache
xdebug.log
trace.*.xt
`
  },
  {
    id: 'ruby',
    name: 'Ruby',
    category: 'languages',
    description: 'Bundler bundle, rspec results, yard doc, gem builds',
    tags: ['ruby', 'rails', 'gem', 'bundler'],
    content: `# Ruby
*.gem
*.rbc
/.config
/coverage/
/InstalledFiles
/pkg/
/spec/reports/
/spec/examples.txt
/test/tmp/
/test/version_tmp/
/tmp/
.bundle/
vendor/bundle/
`
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    category: 'languages',
    description: 'Kotlin incremental compilation, caches, Gradle outputs',
    tags: ['kotlin', 'android', 'jvm', 'mobile'],
    content: `# Kotlin
.kotlin/
.kotlinc/
*.class
*.kotlin_module
*.kotlin_metadata
`
  },
  {
    id: 'swift',
    name: 'Swift',
    category: 'languages',
    description: 'Swift package manager build directory, .build, project artefacts',
    tags: ['swift', 'ios', 'macos', 'apple', 'xcode'],
    content: `# Swift
.build/
Packages/
Package.pins
Package.resolved
*.xcodeproj
*.xcworkspace
xcuserdata/
`
  },
  {
    id: 'dart',
    name: 'Dart',
    category: 'languages',
    description: 'Dart tool caches, pub packages, doc builds',
    tags: ['dart', 'flutter', 'mobile', 'frontend'],
    content: `# Dart
.dart_tool/
.packages
build/
pubspec.lock
`
  },
  {
    id: 'elixir',
    name: 'Elixir / Phoenix',
    category: 'languages',
    description: '_build, deps, cover, mix archives',
    tags: ['elixir', 'phoenix', 'mix', 'erlang', 'functional'],
    content: `# Elixir
/_build/
/deps/
/*.ez
/cover/
erl_crash.dump
`
  },
  {
    id: 'scala',
    name: 'Scala / sbt',
    category: 'languages',
    description: 'target directory, project/boot, sbt caches',
    tags: ['scala', 'sbt', 'jvm', 'spark'],
    content: `# Scala
target/
project/boot/
project/target/
.bloop/
.metals/
`
  },
  {
    id: 'r-lang',
    name: 'R Language',
    category: 'languages',
    description: 'R history, RData, Renviron, Rproj user settings',
    tags: ['r', 'statistics', 'data-science', 'rstudio'],
    content: `# R
.Rhistory
.RData
.Ruserdata
.Renviron
*.Rproj.user/
`
  },
  {
    id: 'zig',
    name: 'Zig',
    category: 'languages',
    description: 'zig-cache, zig-out, binary outputs',
    tags: ['zig', 'systems', 'c', 'wasm'],
    content: `# Zig
zig-cache/
zig-out/
*.o
*.obj
`
  },
  {
    id: 'lua',
    name: 'Lua',
    category: 'languages',
    description: 'Lua compiled files, luarocks modules',
    tags: ['lua', 'game-dev', 'neovim', 'scripting'],
    content: `# Lua
luarocks/
lua_modules/
*.luac
*.so
`
  },

  // ================= FRAMEWORKS =================
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'frameworks',
    description: 'Next.js build folder (.next), out directory, Next telemetry',
    tags: ['next', 'nextjs', 'react', 'ssr', 'typescript', 'frontend', 'fullstack'],
    popular: true,
    content: `# Next.js
.next/
out/
next-env.d.ts.bak
`
  },
  {
    id: 'react',
    name: 'React (CRA / Vite / General)',
    category: 'frameworks',
    description: 'Build folders, static assets bundle, coverage',
    tags: ['react', 'spa', 'vite', 'frontend'],
    popular: true,
    content: `# React
build/
dist/
.cache/
coverage/
`
  },
  {
    id: 'vue-nuxt',
    name: 'Vue.js & Nuxt',
    category: 'frameworks',
    description: 'Nuxt build directory (.nuxt), output (.output), dist',
    tags: ['vue', 'vuejs', 'nuxt', 'nuxtjs', 'frontend', 'ssr'],
    popular: true,
    content: `# Vue.js & Nuxt
.nuxt/
.output/
dist/
node_modules/.vite/
`
  },
  {
    id: 'angular',
    name: 'Angular',
    category: 'frameworks',
    description: 'Angular build outputs, .angular caches, karma results',
    tags: ['angular', 'typescript', 'frontend', 'spa'],
    content: `# Angular
/.angular/cache
/dist
/tmp
/out-tsc
/bazel-out
`
  },
  {
    id: 'svelte-sveltekit',
    name: 'Svelte & SvelteKit',
    category: 'frameworks',
    description: 'SvelteKit build artifacts (.svelte-kit), output directory',
    tags: ['svelte', 'sveltekit', 'frontend', 'ssr'],
    popular: true,
    content: `# Svelte & SvelteKit
.svelte-kit/
build/
package/
`
  },
  {
    id: 'astro',
    name: 'Astro',
    category: 'frameworks',
    description: 'Astro build directory (.astro), dist output',
    tags: ['astro', 'ssg', 'static', 'content', 'frontend'],
    content: `# Astro
dist/
.astro/
`
  },
  {
    id: 'remix',
    name: 'Remix',
    category: 'frameworks',
    description: 'Remix build outputs, server builds, cache',
    tags: ['remix', 'react', 'fullstack', 'ssr'],
    content: `# Remix
.cache/
build/
public/build/
`
  },
  {
    id: 'django',
    name: 'Django',
    category: 'frameworks',
    description: 'Local settings, static root, media uploads, SQLite db',
    tags: ['django', 'python', 'backend', 'fullstack'],
    popular: true,
    content: `# Django
*.log
local_settings.py
db.sqlite3
db.sqlite3-journal
media/
staticfiles/
`
  },
  {
    id: 'fastapi-flask',
    name: 'FastAPI / Flask',
    category: 'frameworks',
    description: 'Instance folder, uploaded files, local test databases',
    tags: ['fastapi', 'flask', 'python', 'api', 'backend'],
    popular: true,
    content: `# FastAPI / Flask
instance/
.webassets-cache
test.db
dev.db
*.sqlite3
`
  },
  {
    id: 'laravel',
    name: 'Laravel',
    category: 'frameworks',
    description: 'Vendor, public/storage, storage/*.key, bootstrap/cache',
    tags: ['laravel', 'php', 'backend', 'fullstack'],
    popular: true,
    content: `# Laravel
/vendor/
node_modules/
public/hot
public/storage
storage/*.key
/bootstrap/cache/
.phpunit.result.cache
`
  },
  {
    id: 'rails',
    name: 'Ruby on Rails',
    category: 'frameworks',
    description: 'Log, tmp, public/assets, storage, master key',
    tags: ['rails', 'ruby', 'backend', 'fullstack'],
    content: `# Ruby on Rails
/log/*
/tmp/*
!/log/.keep
!/tmp/.keep
/public/assets
/public/packs
/public/packs-test
/node_modules
/storage/*
!/storage/.keep
/config/master.key
`
  },
  {
    id: 'spring-boot',
    name: 'Spring Boot',
    category: 'frameworks',
    description: 'Target, build, .mvn caches, runtime logs',
    tags: ['spring', 'spring-boot', 'java', 'kotlin', 'backend', 'enterprise'],
    popular: true,
    content: `# Spring Boot
target/
build/
*.class
*.jar
*.war
.mvn/wrapper/maven-wrapper.jar
`
  },
  {
    id: 'express-nestjs',
    name: 'NestJS / Express',
    category: 'frameworks',
    description: 'Nest build outputs (dist), tsconfig builds, logs',
    tags: ['nestjs', 'express', 'node', 'typescript', 'backend'],
    popular: true,
    content: `# NestJS / Express
dist/
build/
*.tsbuildinfo
`
  },
  {
    id: 'flutter',
    name: 'Flutter',
    category: 'frameworks',
    description: 'Flutter build output, ephemeral engine files, generated plugins',
    tags: ['flutter', 'dart', 'mobile', 'ios', 'android', 'desktop'],
    popular: true,
    content: `# Flutter
.dart_tool/
.flutter-plugins
.flutter-plugins-dependencies
.packages
.pub-cache/
.pub/
/build/
ios/Flutter/.last_build_id
ios/Flutter/Generated.xcconfig
ios/Flutter/flutter_export_environment.sh
ios/Flutter/Flutter.framework
ios/Flutter/Flutter.podspec
ios/Flutter/App.framework
android/app/src/main/java/io/flutter/plugins/GeneratedPluginRegistrant.java
`
  },
  {
    id: 'react-native-expo',
    name: 'React Native & Expo',
    category: 'frameworks',
    description: 'Expo build outputs (.expo), metro cache, android/ios build artifacts',
    tags: ['react-native', 'expo', 'mobile', 'ios', 'android'],
    popular: true,
    content: `# React Native & Expo
.expo/
.expo-shared/
dist/
web-build/
metro-cache/

# Native builds
android/app/build/
android/app/debug/
android/app/release/
ios/Pods/
ios/build/
`
  },
  {
    id: 'electron-tauri',
    name: 'Electron & Tauri',
    category: 'frameworks',
    description: 'Electron release builds, Tauri target output and binaries',
    tags: ['electron', 'tauri', 'desktop', 'rust', 'node'],
    content: `# Electron & Tauri
dist/
dist-electron/
release/
src-tauri/target/
`
  },
  {
    id: 'unity',
    name: 'Unity 3D',
    category: 'frameworks',
    description: 'Library, Temp, Obj, Build, Unity user settings',
    tags: ['unity', 'game-dev', 'c#', '3d'],
    content: `# Unity
/[Ll]ibrary/
/[Tt]emp/
/[Oo]bj/
/[Bb]uild/
/[Bb]uilds/
/[Ll]ogs/
/[Uu]ser[Ss]ettings/
/[Mm]emoryCaptures/
/[Aa]ssets/AssetStoreTools*

# Autogenerated VS / MonoDevelop / Rider solution and project files
ExportedObj/
.consulo/
*.csproj
*.unityproj
*.sln
*.suo
*.tmp
*.user
*.userprefs
*.pidb
*.booproj
*.svd
*.pdb
*.opendb
*.VC.db
`
  },
  {
    id: 'godot',
    name: 'Godot Engine',
    category: 'frameworks',
    description: 'Godot import caches (.godot), mono builds, export outputs',
    tags: ['godot', 'game-dev', 'gdscript', 'c#'],
    content: `# Godot
.godot/
*.translation
export_presets.cfg
.mono/
`
  },
  {
    id: 'unreal-engine',
    name: 'Unreal Engine',
    category: 'frameworks',
    description: 'Intermediate, Saved, Binaries, DerivedDataCache',
    tags: ['unreal', 'ue', 'game-dev', 'c++', '3d'],
    content: `# Unreal Engine
Binaries/
DerivedDataCache/
Intermediate/
Saved/
Build/
*.VC.db
*.opendb
`
  },

  // ================= PACKAGE MANAGERS =================
  {
    id: 'pnpm-yarn-npm',
    name: 'pnpm / Yarn / Bun / npm',
    category: 'package-managers',
    description: 'Package manager caches, zero-installs, and integrity logs',
    tags: ['pnpm', 'yarn', 'npm', 'bun', 'lockfile'],
    popular: true,
    content: `# Package Managers
.pnpm-store/
.yarn/cache/
.yarn/unplugged/
.yarn/build-state.yml
.yarn/install-state.gz
.bun/
`
  },
  {
    id: 'pip-poetry-conda',
    name: 'Pip / Poetry / Conda / uv',
    category: 'package-managers',
    description: 'Pip cache, poetry virtualenv, conda environments, uv cache',
    tags: ['pip', 'poetry', 'conda', 'uv', 'python', 'packages'],
    popular: true,
    content: `# Python Package Managers
.venv/
.uv/
.poetry/
anaconda3/
miniconda3/
*.wheel
pip-wheel-metadata/
`
  },
  {
    id: 'maven-gradle',
    name: 'Maven & Gradle',
    category: 'package-managers',
    description: 'Maven target directory, Gradle .gradle cache, build output',
    tags: ['maven', 'gradle', 'java', 'kotlin', 'jvm'],
    popular: true,
    content: `# Maven & Gradle
target/
pom.xml.tag
pom.xml.releaseBackup
pom.xml.versionsBackup
pom.xml.next
release.properties

.gradle/
build/
!gradle/wrapper/gradle-wrapper.jar
`
  },
  {
    id: 'composer',
    name: 'Composer (PHP)',
    category: 'package-managers',
    description: 'Composer vendor folder and composer phar',
    tags: ['composer', 'php', 'packages'],
    content: `# Composer
/vendor/
composer.phar
`
  },
  {
    id: 'cocoapods-carthage',
    name: 'CocoaPods & Carthage',
    category: 'package-managers',
    description: 'Pods directory, Carthage build directory',
    tags: ['cocoapods', 'carthage', 'ios', 'swift', 'macos'],
    content: `# CocoaPods & Carthage
Pods/
Carthage/Build/
`
  },

  // ================= OPERATING SYSTEMS =================
  {
    id: 'macos',
    name: 'macOS',
    category: 'operating-systems',
    description: '.DS_Store, Spotlight index, AppleDouble, Trashes',
    tags: ['macos', 'apple', 'os', 'osx', 'desktop'],
    popular: true,
    content: `# macOS
.DS_Store
.AppleDouble
.LSOverride

# Icon must end with two \\r
Icon\r\r

# Thumbnails
._*

# Files that might appear in the root of a volume
.DocumentRevisions-V100
.fseventsd
.Spotlight-V100
.TemporaryItems
.Trashes
.VolumeIcon.icns
.com.apple.timemachine.donotpresent

# Directories potentially created on remote AFP and SMB shares
.AppleDB
.AppleDesktop
Network Trash Folder
Temporary Items
.apdisk
`
  },
  {
    id: 'windows',
    name: 'Windows',
    category: 'operating-systems',
    description: 'Thumbs.db, Desktop.ini, $RECYCLE.BIN, Windows shortcut lnk',
    tags: ['windows', 'microsoft', 'os', 'desktop'],
    popular: true,
    content: `# Windows
Thumbs.db
Thumbs.db:encryptable
ehthumbs.db
ehthumbs_vista.db
*.stackdump
[Dd]esktop.ini

# Recycle Bin
$RECYCLE.BIN/

# Windows shortcuts
*.lnk
`
  },
  {
    id: 'linux',
    name: 'Linux',
    category: 'operating-systems',
    description: 'Backup files (*~), .directory metadata, crash reports',
    tags: ['linux', 'ubuntu', 'debian', 'fedora', 'arch', 'os', 'server'],
    popular: true,
    content: `# Linux
*~
.fuse_hidden*
.directory
.Trash-*
.nfs*
`
  },

  // ================= EDITORS & IDES =================
  {
    id: 'vscode',
    name: 'Visual Studio Code',
    category: 'editors-ides',
    description: '.vscode settings, workspace state, history (except extensions.json/launch.json if desired)',
    tags: ['vscode', 'code', 'editor', 'ide', 'microsoft'],
    popular: true,
    content: `# Visual Studio Code
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
*.code-workspace
.history/
`
  },
  {
    id: 'jetbrains',
    name: 'JetBrains IDEs (IntelliJ, WebStorm, PyCharm, CLion, Rider)',
    category: 'editors-ides',
    description: '.idea directory, *.iml project files, shelf, dataSources',
    tags: ['jetbrains', 'intellij', 'webstorm', 'pycharm', 'clion', 'rider', 'ide'],
    popular: true,
    content: `# JetBrains (IntelliJ, WebStorm, PyCharm, etc.)
.idea/
*.iml
*.iws
*.ipr
out/
.idea_modules/
cmake-build-*/
`
  },
  {
    id: 'visual-studio',
    name: 'Visual Studio (Windows)',
    category: 'editors-ides',
    description: '.vs folder, *.suo, *.user, build logs, CodeAnalysis',
    tags: ['visualstudio', 'vs', 'ide', 'c#', 'c++'],
    content: `# Visual Studio
.vs/
*.suo
*.user
*.userosscache
*.sln.docstates
*.dbmdl
*.jfm
`
  },
  {
    id: 'xcode',
    name: 'Xcode',
    category: 'editors-ides',
    description: 'xcuserdata, xcdebugger, derived data, project user state',
    tags: ['xcode', 'apple', 'ios', 'macos', 'swift', 'objective-c'],
    content: `# Xcode
build/
*.pbxuser
!default.pbxuser
*.mode1v3
!default.mode1v3
*.mode2v3
!default.mode2v3
*.perspectivev3
!default.perspectivev3
xcuserdata/
*.xccheckout
*.moved-aside
DerivedData/
*.hmap
*.ipa
*.xcuserstate
`
  },
  {
    id: 'android-studio',
    name: 'Android Studio',
    category: 'editors-ides',
    description: '.idea, local.properties, captures, build outputs',
    tags: ['android', 'studio', 'ide', 'mobile', 'google'],
    popular: true,
    content: `# Android Studio
local.properties
.idea/caches
.idea/libraries
.idea/modules.xml
.idea/workspace.xml
.idea/navEditor.xml
.idea/assetWizardSettings.xml
.gradle/
build/
captures/
`
  },
  {
    id: 'vim-neovim',
    name: 'Vim / Neovim',
    category: 'editors-ides',
    description: 'Swap files (*.swp, *.swo), undo tree, session files',
    tags: ['vim', 'neovim', 'nvim', 'editor', 'terminal'],
    content: `# Vim / Neovim
[._]*.s[a-v][a-z]
!*.svg
[._]*.sw[a-p]
[._]s[a-rt-v][a-z]
[._]ss[a-gi-z]
[._]sw[a-p]
*~
*.un~
Session.vim
.netrwhist
`
  },
  {
    id: 'sublime-text',
    name: 'Sublime Text',
    category: 'editors-ides',
    description: 'Sublime workspace, project cache, session data',
    tags: ['sublime', 'editor'],
    content: `# Sublime Text
*.sublime-workspace
*.sublime-project.cache
`
  },
  {
    id: 'eclipse',
    name: 'Eclipse',
    category: 'editors-ides',
    description: '.project, .classpath, .settings, metadata',
    tags: ['eclipse', 'java', 'ide'],
    content: `# Eclipse
.metadata
bin/
tmp/
*.tmp
*.bak
*.emx
*.pooldat
*.jad
.settings/
.loadpath
.recommenders
`
  },

  // ================= TOOLS & DEVOPS =================
  {
    id: 'docker',
    name: 'Docker & Docker Compose',
    category: 'tools-build',
    description: 'docker-compose overrides, temporary container volumes',
    tags: ['docker', 'compose', 'containers', 'devops'],
    popular: true,
    content: `# Docker
docker-compose.override.yml
docker-compose.local.yml
.dockerignore.bak
`
  },
  {
    id: 'turborepo',
    name: 'Turborepo / Turbo',
    category: 'tools-build',
    description: '.turbo cache and build logs',
    tags: ['turborepo', 'turbo', 'monorepo', 'build'],
    content: `# Turborepo
.turbo/
`
  },
  {
    id: 'vite-webpack',
    name: 'Vite / Webpack / Bundlers',
    category: 'tools-build',
    description: '.vite cache, webpack stats, bundle analyzer reports',
    tags: ['vite', 'webpack', 'bundler', 'build'],
    content: `# Bundlers (Vite / Webpack)
.vite/
report.html
stats.json
`
  },
  {
    id: 'testing-coverage',
    name: 'Testing & Coverage (Jest / Vitest / Playwright / Cypress)',
    category: 'tools-build',
    description: 'Test results, playwright-report, test-results, coverage folder',
    tags: ['jest', 'vitest', 'playwright', 'cypress', 'testing', 'qa'],
    popular: true,
    content: `# Testing & Coverage
coverage/
.nyc_output/
test-results/
playwright-report/
blob-report/
playwright/.cache/
cypress/videos/
cypress/screenshots/
`
  },
  {
    id: 'terraform',
    name: 'Terraform',
    category: 'tools-build',
    description: '.terraform directory, tfstate files, tfvars secrets',
    tags: ['terraform', 'iac', 'cloud', 'devops', 'aws', 'gcp'],
    content: `# Terraform
**/.terraform/*
*.tfstate
*.tfstate.*
crash.log
crash.*.log
*.tfvars
*.tfvars.json
override.tf
override.tf.json
*_override.tf
*_override.tf.json
.terraformrc
terraform.rc
`
  },
  {
    id: 'kubernetes-helm',
    name: 'Kubernetes & Helm',
    category: 'tools-build',
    description: 'Helm charts packaged, local kubeconfig backups',
    tags: ['k8s', 'kubernetes', 'helm', 'cloud', 'devops'],
    content: `# Kubernetes & Helm
*.tgz
kubeconfig
kubeconfig.local
.kube/
`
  },
  {
    id: 'prisma-drizzle',
    name: 'Prisma & Drizzle ORM',
    category: 'tools-build',
    description: 'Prisma client generation artifacts, local sqlite migration dumps',
    tags: ['prisma', 'drizzle', 'database', 'orm', 'sql'],
    content: `# Database ORM (Prisma / Drizzle)
dev.db
dev.db-journal
drizzle/meta/_journal.json.bak
`
  },
  {
    id: 'storybook',
    name: 'Storybook',
    category: 'tools-build',
    description: 'Storybook build output (storybook-static)',
    tags: ['storybook', 'ui', 'components'],
    content: `# Storybook
storybook-static/
.storybook/out/
`
  },

  // ================= SECURITY & SECRETS =================
  {
    id: 'env-files',
    name: 'Environment Files (.env)',
    category: 'security-secrets',
    description: 'Local environment secrets, passwords, credentials',
    tags: ['env', 'dotenv', 'security', 'secrets', 'passwords', 'tokens'],
    popular: true,
    content: `# Environment Files (CRITICAL SECURITY)
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env*.local
*.env
!.env.example
!.env.template
`
  },
  {
    id: 'keys-certificates',
    name: 'Private Keys & Certificates',
    category: 'security-secrets',
    description: 'Private keys, keystores, PEM certificates, certificates',
    tags: ['keys', 'pem', 'pfx', 'keystore', 'ssl', 'tls', 'security'],
    popular: true,
    content: `# Private Keys & SSL Certificates
*.pem
*.key
*.pfx
*.p12
*.jks
*.keystore
id_rsa
id_ed25519
id_ecdsa
*.cer
*.crt
`
  },
  {
    id: 'logs-databases',
    name: 'Logs & Local Databases',
    category: 'security-secrets',
    description: 'Application runtime logs, SQLite databases, crash dumps',
    tags: ['logs', 'sqlite', 'db', 'database', 'crash'],
    popular: true,
    content: `# Logs and Databases
*.log
*.sqlite
*.sqlite3
*.db
*.db-journal
*.dump
`
  },
  {
    id: 'backup-temp',
    name: 'Temporary & Backup Files',
    category: 'security-secrets',
    description: 'Backup files, swap files, temporary folders',
    tags: ['temp', 'backup', 'bak', 'tmp'],
    content: `# Temporary & Backup Files
*.bak
*.backup
*.tmp
*.temp
*.orig
*~
`
  }
];

export const PRESET_BUNDLES: PresetBundle[] = [
  {
    id: 'nextjs-fullstack',
    name: 'Next.js 15 Fullstack (App Router)',
    description: 'Next.js, TypeScript, Node.js, Tailwind, Jest/Vitest, VS Code, macOS/Windows, .env',
    icon: 'Layers',
    templateIds: ['nextjs', 'typescript', 'node-js', 'env-files', 'vscode', 'macos', 'windows', 'testing-coverage']
  },
  {
    id: 'python-ai-ml',
    name: 'Python AI / Machine Learning',
    description: 'Python, PyTorch/TensorFlow, Pip/Poetry/Conda, Jupyter Notebooks, VS Code, .env',
    icon: 'BrainCircuit',
    templateIds: ['python', 'pip-poetry-conda', 'env-files', 'vscode', 'macos', 'logs-databases']
  },
  {
    id: 'django-fastapi-backend',
    name: 'Django & FastAPI Cloud Backend',
    description: 'Python, Django/FastAPI, Docker, PostgreSQL/SQLite, Terraform, Linux/macOS, .env',
    icon: 'Server',
    templateIds: ['python', 'django', 'fastapi-flask', 'docker', 'env-files', 'keys-certificates', 'linux', 'macos']
  },
  {
    id: 'rust-cli-wasm',
    name: 'Rust Systems & WASM',
    description: 'Rust, Cargo target, VS Code, Linux, macOS, .env',
    icon: 'Cog',
    templateIds: ['rust', 'env-files', 'vscode', 'linux', 'macos']
  },
  {
    id: 'mobile-flutter',
    name: 'Flutter Mobile (iOS & Android)',
    description: 'Flutter, Dart, Xcode, Android Studio, macOS, CocoaPods',
    icon: 'Smartphone',
    templateIds: ['flutter', 'dart', 'xcode', 'android-studio', 'cocoapods-carthage', 'macos']
  },
  {
    id: 'react-native-expo-stack',
    name: 'React Native & Expo App',
    description: 'React Native, Expo, TypeScript, Node.js, iOS/Android builds, VS Code',
    icon: 'TabletSmartphone',
    templateIds: ['react-native-expo', 'typescript', 'node-js', 'env-files', 'vscode', 'macos']
  },
  {
    id: 'go-microservice',
    name: 'Go Microservice & Docker',
    description: 'Golang, Docker, Kubernetes/Helm, VS Code, Linux, .env',
    icon: 'Box',
    templateIds: ['go', 'docker', 'kubernetes-helm', 'env-files', 'vscode', 'linux']
  },
  {
    id: 'java-spring-enterprise',
    name: 'Java Spring Boot Enterprise',
    description: 'Java, Spring Boot, Maven & Gradle, JetBrains IntelliJ, Docker, .env',
    icon: 'Coffee',
    templateIds: ['java', 'spring-boot', 'maven-gradle', 'jetbrains', 'docker', 'env-files']
  },
  {
    id: 'game-development',
    name: 'Game Dev (Unity / Godot / Unreal)',
    description: 'Unity, Godot, Visual Studio, JetBrains Rider, Windows/macOS',
    icon: 'Gamepad2',
    templateIds: ['unity', 'godot', 'visual-studio', 'jetbrains', 'windows', 'macos']
  }
];

export const RULE_EXPLANATIONS: Record<string, RuleExplanation> = {
  'node_modules/': {
    pattern: 'node_modules/',
    summary: 'Third-party dependencies',
    reason: 'Installed automatically via npm/yarn/pnpm from package.json; committing them creates bloated repositories and cross-OS binary conflicts.'
  },
  '.next/': {
    pattern: '.next/',
    summary: 'Next.js build cache & serverless functions',
    reason: 'Generated dynamically during `next build` and `next dev`. Must never be versioned.'
  },
  '.env': {
    pattern: '.env',
    summary: 'Environment secrets and API credentials',
    reason: 'Contains database credentials, secret tokens, and API keys. Committing this causes catastrophic security leaks.'
  },
  '.env.local': {
    pattern: '.env.local',
    summary: 'Local environment overrides',
    reason: 'Overrides environment values on the developer machine only.'
  },
  '.DS_Store': {
    pattern: '.DS_Store',
    summary: 'macOS desktop folder metadata',
    reason: 'Created silently by Apple Finder to store view options and icon positions.'
  },
  'Thumbs.db': {
    pattern: 'Thumbs.db',
    summary: 'Windows thumbnail cache',
    reason: 'Generated by Windows Explorer to cache image previews.'
  },
  '__pycache__/': {
    pattern: '__pycache__/',
    summary: 'Python bytecode cache',
    reason: 'Compiled .pyc and .pyo files generated by Python CPython runtime for execution speed.'
  },
  'target/': {
    pattern: 'target/',
    summary: 'Rust / Maven / Scala compiled artifacts',
    reason: 'Binary build directory generated by `cargo build` or `mvn compile`.'
  },
  'dist/': {
    pattern: 'dist/',
    summary: 'Distribution / bundle output',
    reason: 'Final web/library package built for production deployment.'
  },
  'build/': {
    pattern: 'build/',
    summary: 'Build output directory',
    reason: 'Intermediary and final compilation artifacts.'
  },
  '*.log': {
    pattern: '*.log',
    summary: 'Runtime and debug log files',
    reason: 'Generated dynamically during server runs, error events, or testing.'
  },
  '*.pem': {
    pattern: '*.pem',
    summary: 'SSL / TLS private certificates',
    reason: 'Sensitive cryptographic private keys. Committing these compromises system encryption.'
  },
  '.vscode/*': {
    pattern: '.vscode/*',
    summary: 'Visual Studio Code editor state',
    reason: 'Local editor cache and workbench state (launch.json/settings.json can optionally be tracked).'
  },
  '.idea/': {
    pattern: '.idea/',
    summary: 'JetBrains IntelliJ workspace config',
    reason: 'Project caches and user layout options for JetBrains IDEs.'
  },
  'coverage/': {
    pattern: 'coverage/',
    summary: 'Unit test code coverage reports',
    reason: 'HTML and LCOV coverage summaries generated by test runners (Jest, Pytest, Vitest).'
  }
};
