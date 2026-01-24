"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaTrophy,
  FaChartLine,
  FaFolderOpen,
  FaClock,
  FaArrowLeft,
  FaCheck,
} from "react-icons/fa";
import { LoadingSpinner } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import {
  getUserProgress,
  getChallengeSubmissions,
} from "@/lib/supabase/client";

interface UserProgress {
  user_id: string;
  projects_analyzed: number;
  challenges_completed: number;
  average_score: number;
}

interface SubmissionFromDB {
  id: string;
  user_id: string;
  user_code: string;
  score: number;
  feedback: string;
  comparison: string;
  challenge_id: string;
  challenges: {
    level: "easy" | "medium" | "hard";
    file_path: string;
    created_at: string;
    projects: {
      name: string;
    };
  };
}

export default function HistoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionFromDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState<
    "all" | "easy" | "medium" | "hard"
  >("all");

  useEffect(() => {
    if (user) {
      loadHistoryData();
    } else {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadHistoryData = async () => {
    try {
      setIsLoading(true);
      const [progressData, submissionsData] = await Promise.all([
        getUserProgress(user?.id || ""),
        getChallengeSubmissions(user?.id || ""),
      ]);

      setProgress(progressData);
      // Transform data - Supabase returns single object for one-to-one relations
      const transformedSubmissions = (submissionsData || []).map(
        (sub: Record<string, unknown>) => ({
          ...sub,
          challenges: Array.isArray(sub.challenges)
            ? sub.challenges[0]
            : sub.challenges,
        }),
      ) as SubmissionFromDB[];
      setSubmissions(transformedSubmissions);
    } catch (error) {
      console.error("Failed to load history data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    if (!sub.challenges) return false; // Skip if no challenge data
    if (filterLevel === "all") return true;
    return sub.challenges.level === filterLevel;
  });

  const getRelativeTime = (dateString: string | undefined) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getLevelColor = (level: "easy" | "medium" | "hard") => {
    switch (level) {
      case "easy":
        return "bg-green-900/20 text-green-400 border-green-500/30";
      case "medium":
        return "bg-yellow-900/20 text-yellow-400 border-yellow-500/30";
      case "hard":
        return "bg-red-900/20 text-red-400 border-red-500/30";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-950">
      {/* Background Glow Effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-gray-800 glass-panel sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <FaArrowLeft />
                <span className="text-sm">Back to Dashboard</span>
              </Link>
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
              Your Progress
            </h1>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 relative z-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Challenges */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-700/50 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-blue-900/30 flex items-center justify-center border border-blue-500/20">
                <FaTrophy className="text-blue-400 text-2xl" />
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Challenges</p>
                <p className="text-3xl font-bold text-white">
                  {progress?.challenges_completed || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Average Score */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-700/50 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-green-900/30 flex items-center justify-center border border-green-500/20">
                <FaChartLine className="text-green-400 text-2xl" />
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Average Score</p>
                <p className="text-3xl font-bold text-white">
                  {progress?.average_score?.toFixed(1) || "0.0"}
                  <span className="text-lg text-gray-400">/100</span>
                </p>
              </div>
            </div>
          </div>

          {/* Projects Analyzed */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-700/50 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-purple-900/30 flex items-center justify-center border border-purple-500/20">
                <FaFolderOpen className="text-purple-400 text-2xl" />
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Projects Analyzed</p>
                <p className="text-3xl font-bold text-white">
                  {progress?.projects_analyzed || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="glass-panel rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Challenge History
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterLevel("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterLevel === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterLevel("easy")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterLevel === "easy"
                      ? "bg-green-600 text-white"
                      : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"
                  }`}
                >
                  Easy
                </button>
                <button
                  onClick={() => setFilterLevel("medium")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterLevel === "medium"
                      ? "bg-yellow-600 text-white"
                      : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"
                  }`}
                >
                  Medium
                </button>
                <button
                  onClick={() => setFilterLevel("hard")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterLevel === "hard"
                      ? "bg-red-600 text-white"
                      : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"
                  }`}
                >
                  Hard
                </button>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-700/50">
            {filteredSubmissions.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
                  <FaTrophy className="text-gray-600 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  No Challenges Yet
                </h3>
                <p className="text-gray-400 mb-6">
                  {filterLevel === "all"
                    ? "Start your first challenge to track your progress!"
                    : `No ${filterLevel} challenges found. Try a different filter.`}
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all font-medium shadow-lg shadow-blue-600/20"
                >
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              filteredSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="p-6 hover:bg-gray-800/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {submission.challenges?.projects?.name ||
                            "Unknown Project"}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getLevelColor(
                            submission.challenges?.level || "easy",
                          )}`}
                        >
                          {(
                            submission.challenges?.level || "easy"
                          ).toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 font-mono mb-2">
                        {submission.challenges?.file_path || "Unknown file"}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <FaClock />
                        <span>
                          {getRelativeTime(submission.challenges?.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-400 mb-1">Score</p>
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-3xl font-bold ${getScoreColor(
                              submission.score,
                            )}`}
                          >
                            {submission.score}
                          </p>
                          {submission.score === 100 && (
                            <FaCheck className="text-green-400" />
                          )}
                        </div>
                      </div>
                      <Link
                        href={`/review/${submission.id}`}
                        className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg border border-blue-500/30 transition-all text-sm font-medium"
                      >
                        View Review
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20 py-8 glass-panel z-10 relative">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            CodeSensei &copy; {new Date().getFullYear()} - Track your learning
            journey
          </p>
        </div>
      </footer>
    </div>
  );
}
