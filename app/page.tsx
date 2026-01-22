import Link from "next/link";
import { FaCode, FaGithub, FaBrain, FaTrophy } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-gray-800 glass-panel sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20">
              <FaCode className="text-white text-xl" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
              CodeSensei
            </h1>
          </div>
          <Link
            href="/dashboard"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all font-medium shadow-lg shadow-blue-600/20 border border-blue-500/50"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-24 relative z-10">
        <div className="text-center max-w-5xl mx-auto mb-20">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full glass-panel border border-blue-500/30 text-blue-300 text-sm font-medium animate-fade-in">
            🚀 The Future of Code Learning
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight tracking-tight">
            Bridging the gap between{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-cyan-300">
              AI-generated code
            </span>{" "}
            and{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-green-400 to-emerald-300">
              human understanding
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            Platform edukasi pemrograman yang membedah dan menjelaskan proyek
            AI-generated agar developer tetap memiliki kendali penuh atas kode
            mereka.
          </p>
          <div className="flex gap-4 justify-center items-center">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-blue-600/20 hover:scale-105"
            >
              Start Learning
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 glass-card hover:bg-gray-800 text-white rounded-xl font-semibold text-lg transition-all flex items-center gap-3 border border-gray-700"
            >
              <FaGithub className="text-xl" /> View on GitHub
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="glass-card p-8 rounded-2xl group">
            <div className="w-14 h-14 rounded-xl bg-blue-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-blue-500/20">
              <FaGithub className="text-blue-400 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Smart Ingestion
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Import proyek dari GitHub dan visualisasi struktur folder secara
              interaktif
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl group">
            <div className="w-14 h-14 rounded-xl bg-green-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-green-500/20">
              <FaCode className="text-green-400 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Code Storytelling
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Pahami alur data aplikasi dengan narasi sederhana dari AI
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl group">
            <div className="w-14 h-14 rounded-xl bg-purple-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-purple-500/20">
              <FaBrain className="text-purple-400 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Deep-Dive Analysis
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Klik baris kode untuk penjelasan instant dengan analogi mudah
              dipahami
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl group">
            <div className="w-14 h-14 rounded-xl bg-yellow-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-yellow-500/20">
              <FaTrophy className="text-yellow-400 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Challenge Mode
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Uji pemahaman dengan challenge dan dapatkan evaluasi AI real-time
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="glass-panel rounded-3xl p-12 text-center relative overflow-hidden border border-blue-500/30">
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-r from-blue-600/10 to-purple-600/10 z-0" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Master Your Code?
            </h3>
            <p className="text-xl text-gray-300 mb-8">
              Dari &quot;Bisa Jalankan Kode&quot; menjadi &quot;Paham Logika
              Kode&quot;
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-10 py-4 bg-white hover:bg-gray-100 text-blue-900 rounded-lg font-bold text-lg transition-colors"
            >
              Mulai Sekarang - Gratis
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-400">
          <p>&copy; 2026 CodeSensei. PKM-KC Project.</p>
        </div>
      </footer>
    </div>
  );
}
