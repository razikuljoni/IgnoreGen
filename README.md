# IgnoreGen - AI-Powered .gitignore Generator

[![Live App](https://img.shields.io/badge/Live_App-ignoregen.vercel.app-3b82f6?style=for-the-badge&logo=vercel)](https://ignoregen.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

**IgnoreGen** is a modern, fast, and customizable `.gitignore` file generator supporting **120+ languages, frameworks, operating systems, and IDEs**. Powered by Next.js 15, Tailwind CSS, and Google Gemini AI for smart stack detection.

🌐 **Live Demo:** [https://ignoregen.vercel.app](https://ignoregen.vercel.app)

---

## ✨ Features

- ⚡ **120+ Tech Stack Templates**: Instant access to `.gitignore` rules for Node, Python, React, Go, Rust, macOS, Windows, VSCode, JetBrains, Docker, and more.
- 🤖 **AI Stack Assistant**: Describe your tech stack or paste `package.json` / build files, and Gemini AI selects the optimal templates automatically.
- 🎨 **Syntax Highlighting & Live Preview**: Real-time combined `.gitignore` output preview with syntax highlighting.
- 💾 **Preset Management**: Save custom rule sets and load them in one click. Local storage sync enabled.
- 📋 **One-Click Copy & Download**: Copy generated rules to clipboard or download directly as `.gitignore`.
- 🔍 **Instant Search & Categorization**: Fast search with category filters (Languages, Frameworks, IDEs, OS, Tools).
- ⌨️ **Keyboard Shortcuts**: Built-in shortcut navigation (`⌘K` for quick search, `⌘C` to copy, `⌘D` to download).
- 🌙 **Dark / Light / System Mode**: Seamless theme matching for developer preference.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI & Styling**: React 19, Tailwind CSS 4, Lucide Icons, Framer Motion
- **AI Integration**: `@google/genai` (Google Gemini API)
- **Type Safety**: TypeScript 5.9
- **Deployment**: Vercel

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/razikuljoni/IgnoreGen.git
cd IgnoreGen
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run local development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💻 Building for Production

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```text
IgnoreGen/
├── app/                    # Next.js App Router (pages, layout, metadata)
│   ├── api/                # API routes (Gemini AI integration)
│   ├── globals.css         # Tailwind & custom CSS styles
│   ├── layout.tsx          # Root layout & SEO OpenGraph metadata
│   ├── manifest.ts         # Web App Manifest generator
│   ├── robots.ts           # Search Engine Robots generator
│   ├── sitemap.ts          # Search Engine Sitemap generator
│   └── page.tsx            # Main application interface
├── components/             # Reusable UI components
├── data/                   # Gitignore template database (120+ templates)
├── hooks/                  # Custom React hooks
├── lib/                    # Storage, generator engine, types
├── public/                 # Static assets, icons, open-graph imagery
├── package.json
└── README.md
```

---

## 👤 Author

**MD Razikul Islam Joni**
- Website / App: [ignoregen.vercel.app](https://ignoregen.vercel.app)
- GitHub: [@razikuljoni](https://github.com/razikuljoni)
- Email: razikuljoni@gmail.com

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details. Anyone can freely use, modify, and distribute this project.
