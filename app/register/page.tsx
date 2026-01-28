"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { FaCode, FaCheck } from "react-icons/fa";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password, name);
      setSuccess(true);
      setTimeout(() => {
        router.push("/login"); // Redirect to login after successful registration
      }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      if (!success) setLoading(false); // keep loading state if success to prevent flicker before redirect
    }
  };

  if (success) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
        {/* Background Glow Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10 glass-panel p-8 rounded-2xl border border-gray-700/50 shadow-xl backdrop-blur-xl bg-gray-900/40 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
            <FaCheck className="text-green-400 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Account Created!
          </h2>
          <p className="text-gray-400 mb-4">Akun Anda telah berhasil dibuat.</p>
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 mb-4">
            <p className="text-blue-300 text-sm font-medium mb-2">
              Cek Email Anda!
            </p>
            <p className="text-gray-300 text-sm">
              Kami telah mengirimkan email verifikasi ke{" "}
              <strong>{email}</strong>. Silakan klik link verifikasi untuk
              mengaktifkan akun Anda.
            </p>
          </div>
          <p className="text-gray-400 text-sm">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Glow Effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 mb-4 hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20">
              <FaCode className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
              CodeSensei
            </h1>
          </Link>
          <p className="text-gray-400">Create your account to get started.</p>
        </div>

        {/* Register Card */}
        <div className="glass-panel p-8 rounded-2xl border border-gray-700/50 shadow-xl backdrop-blur-xl bg-gray-900/40">
          <h2 className="text-2xl font-bold text-white mb-6">Sign Up</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="John Doe"
              className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
            />

            <Input
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
            />

            <Input
              label="Password"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
            />

            <Input
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
            />

            <Button
              type="submit"
              isLoading={loading}
              className="w-full py-3 mt-6 bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20"
            >
              Create Account
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-gray-500 hover:text-white text-sm transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
