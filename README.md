# CodeSensei - Platform Edukasi Pemrograman AI-Powered

Platform edukasi pemrograman berbasis web yang membedah dan menjelaskan proyek pemrograman yang dihasilkan AI untuk memastikan developer memiliki pemahaman mendalam atas kode mereka.

## 🚀 Fitur Utama

### 1. Smart Ingestion & Structural Mapping

- Import proyek dari GitHub
- Visualisasi struktur folder interaktif
- Penjelasan otomatis peran setiap folder/file

### 2. Code Storytelling

- Analisis alur data aplikasi
- Narasi sederhana hubungan antar-file
- Penjelasan journey data dalam aplikasi

### 3. Interactive Deep-Dive Sidebar

- Klik baris kode untuk penjelasan instant
- Analogi dunia nyata untuk konsep teknis
- Definisi key terms on-demand

### 4. Knowledge Validation (Sensei's Quiz)

- Challenge mode dengan 3 level kesulitan
- AI-generated hints
- Evaluasi kode otomatis dengan feedback detail

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 + TypeScript
- **Styling**: Tailwind CSS
- **Code Editor**: Monaco Editor (VS Code Engine)
- **AI**: Google Gemini AI
- **Database**: Supabase (PostgreSQL)
- **Version Control**: Git/GitHub

## 📦 Instalasi

1. Clone repository

```bash
git clone <repo-url>
cd codesensei-app
```

2. Install dependencies

```bash
npm install
```

3. Setup environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` dan isi dengan kredensial Anda:

- `NEXT_PUBLIC_SUPABASE_URL`: URL Supabase project
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key
- `GEMINI_API_KEY`: Google Gemini API key
- `GITHUB_TOKEN`: (Optional) GitHub personal access token untuk rate limit lebih tinggi

4. Setup Supabase Database

- Buat project baru di [Supabase](https://supabase.com)
- Jalankan SQL schema dari file `supabase/schema.sql` di SQL Editor

5. Run development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 📁 Struktur Proyek

```
codesensei-app/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── github/          # GitHub integration endpoints
│   │   ├── explain/         # AI explanation endpoints
│   │   └── challenge/       # Challenge generation & evaluation
│   ├── page.tsx             # Landing page
│   └── layout.tsx           # Root layout
├── components/              # React Components
│   ├── editor/             # Monaco Editor wrapper
│   ├── tree-view/          # File tree visualization
│   └── modals/             # Modal components
├── lib/                     # Utility libraries
│   ├── ai/                 # Gemini AI integration
│   ├── supabase/           # Supabase client & helpers
│   └── utils/              # Helper functions
├── types/                   # TypeScript type definitions
└── public/                  # Static assets
```

## 🎯 Cara Penggunaan

### Mode Belajar (Learning Mode)

1. Masukkan URL GitHub repository
2. Eksplorasi struktur proyek dengan tree view
3. Klik kanan pada folder/file untuk "Explain Role"
4. Buka file di editor dan highlight kode untuk "Explain Code"
5. Gunakan Chat Sidebar untuk pertanyaan umum

### Mode Latihan (Challenge Mode)

1. Klik "Start Challenge" di header
2. Pilih level kesulitan (Easy/Medium/Hard)
3. Lengkapi kode yang hilang
4. Request "Hint" jika kesulitan
5. Submit untuk mendapat evaluasi AI

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
