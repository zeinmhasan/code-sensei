import Link from "next/link";
import { FaCode, FaGithub, FaBrain, FaTrophy } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaCode className="text-blue-400 text-2xl" />
            <h1 className="text-2xl font-bold text-white">CodeSensei</h1>
          </div>
          <Link
            href="/dashboard"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Bridging the gap between{" "}
            <span className="text-blue-400">AI-generated code</span> and{" "}
            <span className="text-green-400">human understanding</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Platform edukasi pemrograman yang membedah dan menjelaskan proyek
            AI-generated agar developer tetap memiliki kendali penuh atas kode
            mereka.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors"
            >
              Start Learning
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold text-lg transition-colors flex items-center gap-2"
            >
              <FaGithub /> View on GitHub
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <FaGithub className="text-blue-400 text-3xl mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Smart Ingestion
            </h3>
            <p className="text-gray-400">
              Import proyek dari GitHub dan visualisasi struktur folder secara
              interaktif
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <FaCode className="text-green-400 text-3xl mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Code Storytelling
            </h3>
            <p className="text-gray-400">
              Pahami alur data aplikasi dengan narasi sederhana dari AI
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <FaBrain className="text-purple-400 text-3xl mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Deep-Dive Analysis
            </h3>
            <p className="text-gray-400">
              Klik baris kode untuk penjelasan instant dengan analogi mudah
              dipahami
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <FaTrophy className="text-yellow-400 text-3xl mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Challenge Mode
            </h3>
            <p className="text-gray-400">
              Uji pemahaman dengan challenge dan dapatkan evaluasi AI real-time
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Master Your Code?
          </h3>
          <p className="text-xl text-gray-300 mb-8">
            Dari "Bisa Jalankan Kode" menjadi "Paham Logika Kode"
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-10 py-4 bg-white hover:bg-gray-100 text-blue-900 rounded-lg font-bold text-lg transition-colors"
          >
            Mulai Sekarang - Gratis
          </Link>
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
