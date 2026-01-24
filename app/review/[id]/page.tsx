"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaArrowLeft,
  FaRedo,
  FaTrophy,
  FaCode,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { Button, LoadingSpinner, CodeDiff } from "@/components/ui";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import { getSubmissionById } from "@/lib/supabase/client";

interface SubmissionData {
  id: string;
  user_code: string;
  score: number;
  feedback: string;
  comparison: string;
  challenges: {
    level: string;
    original_code: string;
    modified_code: string;
    file_path: string;
    projects: {
      name: string;
    };
  };
}

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id as string;

  const [submission, setSubmission] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSubmission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId]);

  const loadSubmission = async () => {
    try {
      const data = await getSubmissionById(submissionId);
      setSubmission(data);
    } catch (err) {
      console.error("Failed to load submission:", err);
      setError(
        "Failed to load challenge result. The submission may not exist.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gray-950 flex items-center justify-center">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gray-900 flex items-center justify-center p-4">
        {/* Background Glow Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />

        <div className="max-w-md w-full glass-panel border border-red-500/30 rounded-2xl p-8 text-center relative z-10">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/20">
            <FaExclamationTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Submission Not Found
          </h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const differences = submission.comparison
    ? JSON.parse(submission.comparison)
    : [];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80)
      return "bg-green-500/10 border-green-500/30 shadow-green-500/20";
    if (score >= 60)
      return "bg-yellow-500/10 border-yellow-500/30 shadow-yellow-500/20";
    return "bg-red-500/10 border-red-500/30 shadow-red-500/20";
  };

  const scoreColor = getScoreColor(submission.score);
  const scoreBg = getScoreBg(submission.score);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-950 selection:bg-blue-500/30">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/4 w-125 h-125 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div
        className="absolute bottom-0 right-1/4 w-125 h-125 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"
        style={{ animationDelay: "1s" }}
      />

      {/* Header */}
      <header className="border-b border-white/5 glass-panel sticky top-0 z-50 backdrop-blur-xl bg-gray-900/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <div className="p-2 rounded-lg group-hover:bg-white/5 transition-all">
              <FaArrowLeft />
            </div>
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FaTrophy className="text-white text-sm" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
              Challenge Review
            </h1>
          </div>
          <div className="w-40 flex justify-end">
            <Button
              size="sm"
              onClick={() => router.push("/dashboard")}
              icon={<FaRedo />}
              variant="secondary"
              className="border-white/10 hover:bg-white/5"
            >
              Try Another
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-5xl mx-auto space-y-8 animate-slide-up-fade">
          {/* Top Stats Card */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl bg-gray-900/40 relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="space-y-4 text-center md:text-left">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400 mb-3">
                    <FaCode className="text-blue-400" />
                    {submission.challenges.file_path}
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">
                    {submission.challenges.projects.name}
                  </h2>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <div
                    className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider border
                    ${
                      submission.challenges.level === "easy"
                        ? "bg-green-500/10 border-green-500/30 text-green-400"
                        : submission.challenges.level === "medium"
                          ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                          : "bg-red-500/10 border-red-500/30 text-red-400"
                    }`}
                  >
                    {submission.challenges.level} Level
                  </div>
                </div>
              </div>

              <div className="relative group/score">
                <div
                  className={`w-32 h-32 rounded-full flex items-center justify-center border-4 ${scoreBg} backdrop-blur-md transition-all duration-300 transform group-hover/score:scale-105 shadow-2xl`}
                >
                  <div className="text-center">
                    <span
                      className={`text-4xl font-black ${scoreColor} drop-shadow-lg`}
                    >
                      {submission.score}
                    </span>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mt-1">
                      Score
                    </p>
                  </div>
                </div>
                {/* Glow behind score */}
                <div
                  className={`absolute inset-0 rounded-full blur-2xl opacity-20 -z-10 ${
                    submission.score >= 80
                      ? "bg-green-500"
                      : submission.score >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Feedback Card */}
          <div className="glass-panel p-6 rounded-2xl border border-blue-500/20 shadow-lg shadow-blue-500/5 bg-gray-900/40">
            <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <FaTrophy className="text-sm" />
              </span>
              AI Feedback
            </h3>
            <div className="text-gray-300 text-sm leading-relaxed prose prose-invert max-w-none">
              <MarkdownRenderer content={submission.feedback} />
            </div>
          </div>

          {/* Code Comparison */}
          <div className="glass-panel p-1 rounded-2xl border border-white/10 bg-gray-900/60 shadow-xl overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
              <h3 className="font-bold text-gray-200 flex items-center gap-2">
                <FaCode className="text-blue-400" />
                Code Comparison
              </h3>
              <span className="text-xs text-gray-500 font-mono bg-black/30 px-2 py-1 rounded">
                {submission.challenges.file_path}
              </span>
            </div>
            <div className="min-h-125">
              <CodeDiff
                originalCode={submission.challenges.original_code}
                modifiedCode={submission.user_code}
                fileName={submission.challenges.file_path}
              />
            </div>
          </div>

          {/* Observations Card */}
          {differences.length > 0 && (
            <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-gray-900/40">
              <h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <FaCheckCircle className="text-purple-400 text-sm" />
                </span>
                Key Observations
              </h3>
              <div className="space-y-3">
                {differences.map((diff: string, index: number) => (
                  <div
                    key={index}
                    className="flex gap-3 text-sm bg-black/20 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <span className="text-purple-400 font-bold shrink-0 mt-0.5">
                      •
                    </span>
                    <span className="text-gray-400">{diff}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex gap-4 justify-center pt-8 pb-12">
            <Link href="/dashboard">
              <Button
                variant="secondary"
                size="lg"
                className="glass-panel border-white/10 hover:bg-white/5 text-gray-300 px-8"
              >
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/dashboard?activeTab=challenges">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 px-8"
                icon={<FaRedo />}
              >
                Try Another Challenge
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
