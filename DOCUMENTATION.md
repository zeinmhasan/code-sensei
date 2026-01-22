# CodeSensei - Project Documentation

> **Tanggal Update:** 22 Januari 2026  
> **Status:** Development Phase  
> **Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, Google Gemini AI

---

## 📋 Daftar Isi

1. [Overview](#-overview)
2. [Tech Stack](#-tech-stack)
3. [Struktur Folder](#-struktur-folder)
4. [Fitur yang Sudah Selesai](#-fitur-yang-sudah-selesai)
5. [Fitur yang Belum Selesai](#-fitur-yang-belum-selesai)
6. [Setup & Installation](#-setup--installation)
7. [Environment Variables](#-environment-variables)
8. [API Routes](#-api-routes)
9. [Komponen Utama](#-komponen-utama)
10. [Database Schema](#-database-schema)
11. [Rencana Pengembangan Selanjutnya](#-rencana-pengembangan-selanjutnya)

---

## 🎯 Overview

**CodeSensei** adalah platform edukasi berbasis AI yang membantu developer memahami kode yang dihasilkan oleh AI (vibe coding). Platform ini mengambil repository GitHub dan memberikan penjelasan mendalam tentang struktur kode, fungsi, dan hubungan antar komponen.

### Tujuan Utama

- Membantu developer pemula memahami kode AI-generated
- Menyediakan penjelasan kode dalam bahasa Indonesia yang mudah dipahami
- Mode tantangan untuk menguji pemahaman user
- Review dan feedback untuk pembelajaran

---

## 🛠 Tech Stack

| Teknologi        | Versi                | Keterangan                        |
| ---------------- | -------------------- | --------------------------------- |
| Next.js          | 15.x                 | App Router, Server Components     |
| TypeScript       | 5.x                  | Type safety                       |
| Tailwind CSS     | 4.x                  | Styling dengan @theme syntax baru |
| Google Gemini AI | gemini-2.5-flash     | AI untuk generate penjelasan      |
| Monaco Editor    | @monaco-editor/react | Code editor (VS Code-like)        |
| Supabase         | -                    | Database (belum terintegrasi)     |
| React Icons      | -                    | Icon library                      |
| Axios            | -                    | HTTP client                       |
| react-markdown   | -                    | Markdown rendering                |

---

## 📁 Struktur Folder

```
codesensei-app/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── challenge/            # Challenge mode API
│   │   │   └── route.ts
│   │   ├── explain/              # Explain code/folder API
│   │   │   └── route.ts
│   │   └── github/               # GitHub repo import API
│   │       └── route.ts
│   ├── dashboard/                # Dashboard page
│   │   └── page.tsx
│   ├── project/                  # Project workspace
│   │   └── [id]/
│   │       └── page.tsx
│   ├── globals.css               # Global styles + Tailwind
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
│
├── components/                   # React Components
│   ├── editor/
│   │   └── CodeEditor.tsx        # Monaco Editor wrapper
│   ├── modals/
│   │   ├── ExplainModal.tsx      # Code explanation modal
│   │   ├── FolderExplainModal.tsx # Folder explanation modal
│   │   └── Modal.tsx             # Base modal component
│   ├── tree-view/
│   │   └── FileTree.tsx          # File tree component
│   ├── ui/                       # Reusable UI components
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ContextMenu.tsx
│   │   ├── index.ts
│   │   ├── Input.tsx
│   │   ├── LoadingStates.tsx
│   │   └── MarkdownRenderer.tsx
│   ├── ChatSidebar.tsx           # Chat sidebar (placeholder)
│   └── ExplanationPanel.tsx      # Explanation panel (placeholder)
│
├── lib/                          # Library & utilities
│   ├── ai/
│   │   └── gemini.ts             # Gemini AI functions
│   ├── context/
│   │   └── ProjectContext.tsx    # React Context for project state
│   ├── supabase/
│   │   ├── client.ts             # Supabase client
│   │   └── schema.sql            # Database schema
│   └── utils/
│       └── helpers.ts            # Helper functions
│
├── scripts/                      # Utility scripts
│   ├── list-models.ts            # List available Gemini models
│   └── test-gemini.ts            # Test Gemini API connection
│
├── types/
│   └── index.ts                  # TypeScript type definitions
│
├── .env.local                    # Environment variables
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

---

## ✅ Fitur yang Sudah Selesai

### 1. Landing Page (`/`)

- [x] Hero section dengan branding CodeSensei
- [x] CTA button ke dashboard
- [x] Responsive design

### 2. Dashboard (`/dashboard`)

- [x] Input URL GitHub repository
- [x] Import repository dan fetch struktur file
- [x] Daftar project yang sudah diimport
- [x] Hapus project dari daftar
- [x] Penyimpanan ke localStorage (temporary)

### 3. Project Workspace (`/project/[id]`)

- [x] 3-panel layout (File Tree | Code Editor | Sidebar)
- [x] File tree navigation dengan expand/collapse
- [x] Fetch konten file dari GitHub API
- [x] Monaco Editor untuk menampilkan kode
- [x] Syntax highlighting berdasarkan ekstensi file
- [x] Tab Explanation & Chat di sidebar (UI ready)

### 4. Context Menu & Explain Feature

- [x] Right-click pada file/folder → "Explain Role"
- [x] Right-click di code editor → "Explain Code with AI"
- [x] Modal penjelasan dengan section:
  - Logika Kerja
  - Key Terms
  - Analogi
- [x] Modal penjelasan folder dengan section:
  - Role
  - Relations
- [x] **Follow-up Question** - input untuk tanya lanjutan
- [x] Conversation history dalam modal
- [x] Markdown rendering untuk output AI

### 5. AI Integration (Gemini)

- [x] `explainCode()` - menjelaskan kode
- [x] `explainFolder()` - menjelaskan peran folder
- [x] `followUpQuestion()` - menjawab pertanyaan lanjutan
- [x] `generateChallenge()` - generate tantangan (ready, belum ada UI)
- [x] `generateHint()` - generate hint (ready, belum ada UI)
- [x] `evaluateCode()` - evaluasi kode user (ready, belum ada UI)

### 6. API Routes

- [x] `POST /api/github` - Import repository dari GitHub
- [x] `POST /api/explain` - Explain code/folder/followup
- [x] `POST /api/challenge` - Generate/hint/evaluate challenge

### 7. UI Components

- [x] Button (primary, secondary, ghost, danger variants)
- [x] Card (header, title, content)
- [x] Input
- [x] Badge
- [x] LoadingSpinner, ErrorMessage, EmptyState
- [x] ContextMenu
- [x] Modal (sm, md, lg, xl sizes)
- [x] MarkdownRenderer (full markdown support)

---

## ❌ Fitur yang Belum Selesai

### 1. Challenge Mode

- [ ] UI untuk memilih level tantangan (Easy/Medium/Hard)
- [ ] Tampilkan kode dengan TODO placeholders
- [ ] Input area untuk user menulis kode
- [ ] Tombol "Get Hint"
- [ ] Tombol "Submit" untuk evaluasi
- [ ] Progress tracking per file

### 2. Review Page (`/review/[id]`)

- [ ] Halaman review setelah submit challenge
- [ ] Side-by-side diff (kode asli vs kode user)
- [ ] Skor dan feedback dari AI
- [ ] List perbedaan utama
- [ ] Tombol untuk retry atau lanjut ke challenge berikutnya

### 3. Database Integration (Supabase)

- [ ] Koneksi ke Supabase (saat ini pakai localStorage)
- [ ] Tabel `users` - data pengguna
- [ ] Tabel `projects` - project yang diimport
- [ ] Tabel `explanations` - cache penjelasan AI
- [ ] Tabel `challenges` - progress challenge user
- [ ] Tabel `submissions` - hasil submit challenge

### 4. Authentication

- [ ] Login/Register dengan Supabase Auth
- [ ] GitHub OAuth integration
- [ ] Protected routes
- [ ] User profile

### 5. Sidebar Features

- [ ] Explanation Panel - tampilkan penjelasan file yang dipilih
- [ ] Chat Sidebar - chat bebas dengan AI tentang project

### 6. Additional Features

- [ ] Search dalam file tree
- [ ] Bookmark/favorite file penting
- [ ] Export penjelasan ke PDF
- [ ] Share project dengan tim
- [ ] Dark/Light mode toggle

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js 18+
- npm atau yarn
- Google Gemini API Key
- (Optional) Supabase account

### Installation Steps

```bash
# 1. Clone repository
git clone https://github.com/zeinmhasan/code-sensei.git
cd code-sensei/codesensei-app

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env.local

# 4. Edit .env.local dengan API keys

# 5. Run development server
npm run dev

# 6. Open http://localhost:3000
```

---

## 🔐 Environment Variables

Buat file `.env.local` di root project:

```env
# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase (optional - belum terintegrasi)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# GitHub Token (optional - untuk rate limit lebih tinggi)
NEXT_PUBLIC_GITHUB_TOKEN=your_github_token
```

### Cara Mendapatkan Gemini API Key

1. Buka https://aistudio.google.com/app/apikey
2. Klik "Create API Key"
3. Copy key dan paste ke `.env.local`

**Catatan:** Model yang digunakan adalah `gemini-2.5-flash`. Model lama seperti `gemini-pro` dan `gemini-1.5-flash` sudah deprecated (404 Not Found).

---

## 🔌 API Routes

### POST `/api/github`

Import repository dari GitHub.

**Request:**

```json
{
  "repoUrl": "https://github.com/owner/repo"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "name": "repo-name",
    "owner": "owner",
    "files": [
      /* file tree structure */
    ]
  }
}
```

### POST `/api/explain`

Generate penjelasan kode/folder/followup.

**Request (code):**

```json
{
  "type": "code",
  "code": "const x = 1;"
}
```

**Request (folder):**

```json
{
  "type": "folder",
  "folderName": "components",
  "files": ["Button.tsx", "Card.tsx"],
  "projectContext": "React project"
}
```

**Request (followup):**

```json
{
  "type": "followup",
  "question": "Apa itu state?",
  "originalContext": "penjelasan sebelumnya...",
  "conversationHistory": []
}
```

### POST `/api/challenge`

Challenge mode operations.

**Request (generate):**

```json
{
  "action": "generate",
  "code": "original code",
  "level": "easy" | "medium" | "hard"
}
```

**Request (hint):**

```json
{
  "action": "hint",
  "code": "code with TODOs",
  "missingPart": "description"
}
```

**Request (evaluate):**

```json
{
  "action": "evaluate",
  "originalCode": "...",
  "userCode": "..."
}
```

---

## 🧩 Komponen Utama

### CodeEditor

Monaco Editor wrapper dengan custom context menu.

```tsx
<CodeEditor
  value={code}
  language="typescript"
  readOnly={true}
  onChange={(value) => setValue(value)}
/>
```

### FileTree

Recursive file tree dengan right-click support.

```tsx
<FileTree
  nodes={files}
  onFileClick={(file) => handleFileClick(file)}
  onNodeRightClick={(node, event) => handleRightClick(node, event)}
/>
```

### ExplainModal

Modal untuk menampilkan penjelasan kode dengan follow-up chat.

```tsx
<ExplainModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  explanation={explanationData}
  isLoading={isLoading}
/>
```

### MarkdownRenderer

Render markdown dengan styling untuk dark mode.

```tsx
<MarkdownRenderer content="**Bold** dan *italic*" />
```

---

## 🗄 Database Schema

File: `lib/supabase/schema.sql`

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  github_url TEXT NOT NULL,
  files JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Explanations cache
CREATE TABLE explanations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  file_path TEXT,
  explanation JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Challenges
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  file_path TEXT,
  level VARCHAR(20),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Submissions
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES challenges(id),
  user_code TEXT,
  score INTEGER,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Status:** Schema sudah dibuat, tapi belum dijalankan di Supabase dan belum terintegrasi dengan aplikasi.

---

## 📅 Rencana Pengembangan Selanjutnya

### Sprint 1: Challenge Mode (Priority: HIGH)

1. Buat UI untuk tombol "Start Challenge" di header workspace
2. Modal pemilihan level (Easy/Medium/Hard)
3. Tampilkan kode yang sudah dimodifikasi dengan TODO
4. Input area dengan Monaco Editor (editable)
5. Tombol "Get Hint" yang memanggil `/api/challenge` dengan action `hint`
6. Tombol "Submit" yang memanggil `/api/challenge` dengan action `evaluate`

### Sprint 2: Review Page (Priority: HIGH)

1. Buat halaman `/review/[challengeId]`
2. Tampilkan side-by-side diff menggunakan library seperti `react-diff-viewer`
3. Tampilkan skor dalam bentuk progress bar atau gauge
4. Tampilkan feedback AI dengan MarkdownRenderer
5. List perbedaan utama
6. Tombol "Try Again" atau "Next Challenge"

### Sprint 3: Supabase Integration (Priority: MEDIUM)

1. Jalankan schema.sql di Supabase
2. Ganti localStorage dengan Supabase untuk menyimpan projects
3. Implement caching untuk explanations
4. Track progress challenge per user

### Sprint 4: Authentication (Priority: MEDIUM)

1. Setup Supabase Auth
2. Halaman Login/Register
3. GitHub OAuth
4. Protected routes dengan middleware
5. User profile page

### Sprint 5: Polish & Additional Features (Priority: LOW)

1. Explanation Panel di sidebar (tampilkan penjelasan tanpa modal)
2. Chat bebas dengan AI di Chat Sidebar
3. Search dalam file tree
4. Bookmark file penting
5. Export penjelasan ke PDF
6. Responsive design improvements

---

## 🐛 Known Issues

1. **Rate Limit Gemini** - Jika menggunakan free tier, ada limit request per menit. Pertimbangkan caching atau upgrade plan.

2. **Large Repositories** - GitHub API memiliki limit untuk repo besar. Perlu implement pagination atau selective loading.

3. **Private Repositories** - Belum support private repo. Perlu GitHub OAuth dan token handling.

---

## 👥 Tim Development

- Repository: https://github.com/zeinmhasan/code-sensei
- Branch utama: `main`

---

## 📝 Catatan Penting

1. **Model Gemini**: Gunakan `gemini-2.5-flash`. Model lama sudah tidak available.

2. **Test API**: Gunakan script `npx tsx scripts/test-gemini.ts` untuk memastikan API key bekerja.

3. **localStorage**: Saat ini data project disimpan di localStorage browser. Jika ganti browser atau clear storage, data hilang.

4. **Tailwind v4**: Project ini menggunakan Tailwind v4 dengan syntax `@theme` yang baru. Beberapa class seperti `bg-gradient-to-r` akan ada warning untuk menggunakan `bg-linear-to-r` (keduanya tetap berfungsi).

---

_Dokumentasi ini terakhir diupdate: 22 Januari 2026_
