import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Parse command line arguments for explicit bump type if provided
const args = process.argv.slice(2);
let explicitBump = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--type' && args[i + 1]) {
    explicitBump = args[i + 1];
  }
}

function run(cmd, { allowFail = false } = {}) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (e) {
    if (allowFail) {
      throw e;
    }
    console.error(`Command failed: ${cmd}`, e.message);
    process.exit(1);
  }
}

console.log('🚀 Starting Automated Production-Grade Release & Changelog Generation...');

// 1. Get last git tag
let lastTag = '';
try {
  lastTag = run('git describe --tags --abbrev=0', { allowFail: true });
} catch (e) {
  console.log('ℹ️ No previous git tags found. Treating all commits as part of initial release.');
}

// 2. Get commits since last tag
const gitLogCmd = lastTag
  ? `git log ${lastTag}..HEAD --pretty=format:"%H%x1f%s%x1f%b%x1f%an%x1f%ad%x1e" --date=short`
  : `git log --pretty=format:"%H%x1f%s%x1f%b%x1f%an%x1f%ad%x1e" --date=short`;

const rawLog = run(gitLogCmd);
if (!rawLog) {
  console.log('⚠️ No new commits found since the last tag. Nothing to release.');
  process.exit(0);
}

const commitRecords = rawLog.split('\x1e').map((r) => r.trim()).filter(Boolean);
const commits = commitRecords.map((record) => {
  const [hash, subject, body, author, date] = record.split('\x1f');
  return {
    hash: hash || '',
    subject: (subject || '').trim(),
    body: (body || '').trim(),
    author: (author || '').trim(),
    date: (date || '').trim(),
  };
});

// 3. Analyze conventional commits to determine bump type
let hasBreaking = false;
let hasFeature = false;
let hasFix = false;

const features = [];
const fixes = [];
const perf = [];
const breaking = [];
const others = [];

for (const c of commits) {
  const subject = c.subject;
  const body = c.body;
  const fullMessage = `${subject}\n${body}`;

  const cleanSubject = subject.replace(/^[\p{Extended_Pictographic}\p{Emoji}\s]+/u, '').trim();
  const isBreaking =
    /BREAKING[ -]CHANGE:/i.test(fullMessage) ||
    /^[a-z]+(\([^)]+\))?!:/i.test(cleanSubject) ||
    cleanSubject.includes('BREAKING CHANGE');

  if (isBreaking) {
    hasBreaking = true;
    breaking.push(c);
  } else if (/^feat(\(.+\))?:/i.test(cleanSubject)) {
    hasFeature = true;
    features.push(c);
  } else if (/^fix(\(.+\))?:/i.test(cleanSubject)) {
    hasFix = true;
    fixes.push(c);
  } else if (/^perf(\(.+\))?:/i.test(cleanSubject)) {
    perf.push(c);
  } else {
    others.push(c);
  }
}

let bumpType = explicitBump;
if (!bumpType) {
  if (hasBreaking) {
    bumpType = 'major';
  } else if (hasFeature) {
    bumpType = 'minor';
  } else {
    bumpType = 'patch';
  }
}

console.log(`📊 Release Analysis: Found ${commits.length} commit(s). Recommended Bump: [${bumpType.toUpperCase()}]`);

// 4. Read and bump package.json version
const pkgPath = path.resolve(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const currentVersion = pkg.version;
const [major, minor, patch] = currentVersion.split('.').map(Number);

let newMajor = major;
let newMinor = minor;
let newPatch = patch;

if (bumpType === 'major') {
  newMajor += 1;
  newMinor = 0;
  newPatch = 0;
} else if (bumpType === 'minor') {
  newMinor += 1;
  newPatch = 0;
} else {
  newPatch += 1;
}

const newVersion = `${newMajor}.${newMinor}.${newPatch}`;
pkg.version = newVersion;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log(`📦 Version bumped: v${currentVersion} ➔ v${newVersion}`);

// 5. Generate Changelog Entry
const today = new Date().toISOString().split('T')[0];
let changelogSection = `## [v${newVersion}] - ${today}\n\n`;

if (breaking.length > 0) {
  changelogSection += `### 💥 Breaking Changes\n`;
  for (const c of breaking) {
    changelogSection += `- ${c.subject} ([${c.hash.substring(0, 7)}](https://github.com/razikuljoni/IgnoreGen/commit/${c.hash})) - ${c.author}\n`;
  }
  changelogSection += `\n`;
}

if (features.length > 0) {
  changelogSection += `### ✨ Features\n`;
  for (const c of features) {
    changelogSection += `- ${c.subject} ([${c.hash.substring(0, 7)}](https://github.com/razikuljoni/IgnoreGen/commit/${c.hash})) - ${c.author}\n`;
  }
  changelogSection += `\n`;
}

if (fixes.length > 0) {
  changelogSection += `### 🐛 Bug Fixes\n`;
  for (const c of fixes) {
    changelogSection += `- ${c.subject} ([${c.hash.substring(0, 7)}](https://github.com/razikuljoni/IgnoreGen/commit/${c.hash})) - ${c.author}\n`;
  }
  changelogSection += `\n`;
}

if (perf.length > 0) {
  changelogSection += `### 🚀 Performance Improvements\n`;
  for (const c of perf) {
    changelogSection += `- ${c.subject} ([${c.hash.substring(0, 7)}](https://github.com/razikuljoni/IgnoreGen/commit/${c.hash})) - ${c.author}\n`;
  }
  changelogSection += `\n`;
}

if (others.length > 0) {
  changelogSection += `### 🔨 Other Changes\n`;
  for (const c of others) {
    changelogSection += `- ${c.subject} ([${c.hash.substring(0, 7)}](https://github.com/razikuljoni/IgnoreGen/commit/${c.hash})) - ${c.author}\n`;
  }
  changelogSection += `\n`;
}

// 6. Prepend to CHANGELOG.md
const changelogPath = path.resolve(process.cwd(), 'CHANGELOG.md');
let existingChangelog = '# 📝 Changelog\n\nAll notable changes to IgnoreGen will be documented in this file.\n\n';
if (fs.existsSync(changelogPath)) {
  existingChangelog = fs.readFileSync(changelogPath, 'utf8');
}

// Insert new release right after header
const headerMatch = existingChangelog.match(/(# 📝 Changelog[\s\S]*?\n\n)/);
let updatedChangelog = '';
if (headerMatch) {
  const header = headerMatch[0];
  const rest = existingChangelog.slice(header.length);
  updatedChangelog = header + changelogSection + '---\n\n' + rest;
} else {
  updatedChangelog = '# 📝 Changelog\n\n' + changelogSection + '---\n\n' + existingChangelog;
}

fs.writeFileSync(changelogPath, updatedChangelog, 'utf8');
console.log('📝 CHANGELOG.md updated successfully.');

console.log('🎉 Release preparation completed successfully!');
console.log(`Next step: git add . && git commit -m "chore(release): v${newVersion}" && git tag v${newVersion}`);
