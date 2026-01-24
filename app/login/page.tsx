"use client";

import { useState, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { FaCode } from "react-icons/fa";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      router.refresh();
      window.location.href = redirect;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />

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
          <p className="text-gray-400">Welcome back! Sign in to continue.</p>
        </div>

        {/* Login Card */}
        <div className="glass-panel p-8 rounded-2xl border border-gray-700/50 shadow-xl backdrop-blur-xl bg-gray-900/40">
          <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <Button
              type="submit"
              isLoading={loading}
              className="w-full py-3 mt-6 bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20"
            >
              Sign In
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign up
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
