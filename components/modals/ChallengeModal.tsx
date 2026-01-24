"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { Button, LoadingSpinner } from "@/components/ui";
import CodeEditor from "@/components/editor/CodeEditor";
import {
  FaTrophy,
  FaLightbulb,
  FaPaperPlane,
  FaCode,
  FaChevronRight,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaRedo,
} from "react-icons/fa";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import CodeDiff from "@/components/ui/CodeDiff";
import { useAuth } from "@/contexts/AuthContext";
import { useProject } from "@/lib/context/ProjectContext";
import {
  saveChallenge,
  saveChallengeSubmission,
  getUserProgress,
  updateUserProgress,
} from "@/lib/supabase/client";

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalCode: string;
  fileName: string;
  language: string;
}

type ChallengeLevel = "easy" | "medium" | "hard";
type ChallengeStage = "select" | "challenge" | "result";

interface ChallengeData {
  modifiedCode: string;
  originalCode: string;
  challengeId?: string;
}

interface EvaluationResult {
  score: number;
  feedback: string;
  differences: string[];
}

export default function ChallengeModal({
  isOpen,
  onClose,
  originalCode,
  fileName,
  language,
}: ChallengeModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { projectId } = useProject();
  const [stage, setStage] = useState<ChallengeStage>("select");
  const [level, setLevel] = useState<ChallengeLevel>("easy");
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(
    null,
  );
  const [userCode, setUserCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGettingHint, setIsGettingHint] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [hint, setHint] = useState("");
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const handleStartChallenge = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          code: originalCode,
          level,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate challenge");
      }

      // Save challenge to database
      if (!projectId) {
        throw new Error("Project ID not found");
      }

      const challengeRecord = await saveChallenge({
        project_id: projectId,
        level,
        original_code: originalCode,
        modified_code: data.data.modifiedCode,
        file_path: fileName,
      });

      setChallengeData({
        ...data.data,
        challengeId: challengeRecord.id,
      });
      setUserCode(data.data.modifiedCode);
      setStage("challenge");
    } catch (error) {
      console.error("Error generating challenge:", error);
      alert("Gagal membuat challenge. Silakan coba lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGetHint = async () => {
    if (!challengeData) return;

    setIsGettingHint(true);
    try {
      // Extract TODO comments from modified code to describe missing parts
      const todoMatches = challengeData.modifiedCode.match(/\/\/ TODO:.*$/gm);
      const missingPartDescription = todoMatches
        ? `Bagian yang ditandai dengan: ${todoMatches.slice(0, 3).join(", ")}`
        : "Bagian kode yang dihilangkan";

      const response = await fetch("/api/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "hint",
          code: originalCode,
          missingPart: missingPartDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get hint");
      }

      setHint(data.data.hint);
    } catch (error) {
      console.error("Error getting hint:", error);
      alert("Gagal mendapatkan hint. Silakan coba lagi.");
    } finally {
      setIsGettingHint(false);
    }
  };

  const handleSubmit = async () => {
    if (!challengeData?.challengeId) {
      alert("Challenge ID not found");
      return;
    }

    setIsEvaluating(true);
    try {
      const response = await fetch("/api/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluate",
          originalCode,
          userCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to evaluate code");
      }

      // Save submission to database
      const submission = await saveChallengeSubmission({
        challenge_id: challengeData.challengeId,
        user_id: user?.id,
        user_code: userCode,
        score: data.data.score,
        feedback: data.data.feedback,
        comparison: JSON.stringify(data.data.differences),
      });

      // Update user progress
      const progress = await getUserProgress(user?.id || "");
      const newChallengesCompleted = (progress?.challenges_completed || 0) + 1;
      const newAvgScore = progress
        ? (progress.average_score * (newChallengesCompleted - 1) +
            data.data.score) /
          newChallengesCompleted
        : data.data.score;

      await updateUserProgress(user?.id || "", {
        challenges_completed: newChallengesCompleted,
        average_score: Math.round(newAvgScore * 100) / 100,
      });

      // Redirect to review page
      onClose();
      router.push(`/review/${submission.id}`);
    } catch (error) {
      console.error("Error evaluating code:", error);
      alert("Gagal mengevaluasi kode. Silakan coba lagi.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = () => {
    setStage("select");
    setLevel("easy");
    setChallengeData(null);
    setUserCode("");
    setHint("");
    setResult(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`🎯 Challenge: ${fileName}`}
      size="xl"
    >
      <div className="max-h-[80vh] overflow-y-auto bg-gray-950/50">
        {/* Stage 1: Level Selection */}
        {stage === "select" && (
          <div className="p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-blue-500/5 to-transparent pointer-events-none" />

            <div className="text-center mb-10 relative z-10">
              <div className="inline-block p-3 rounded-2xl bg-blue-500/10 mb-4 border border-blue-500/20">
                <FaTrophy className="text-3xl text-blue-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">
                Choose Your Challenge Level
              </h3>
              <p className="text-gray-400 max-w-lg mx-auto">
                Select a difficulty based on your confidence. Higher levels
                remove more code but offer greater learning rewards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative z-10">
              {/* Easy */}
              <button
                onClick={() => setLevel("easy")}
                className={`group p-6 rounded-2xl border transition-all text-left relative overflow-hidden ${
                  level === "easy"
                    ? "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-green-500/50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-2xl border ${
                    level === "easy"
                      ? "bg-green-500/20 border-green-500/30"
                      : "bg-white/5 border-white/10 group-hover:border-green-500/30"
                  }`}
                >
                  🌱
                </div>
                <h4
                  className={`text-xl font-bold mb-2 ${level === "easy" ? "text-green-400" : "text-gray-200 group-hover:text-green-400"}`}
                >
                  Easy
                </h4>
                <p className="text-sm text-gray-500 group-hover:text-gray-400 leading-relaxed">
                  Removes small snippets. Perfect for getting started and
                  understanding basic syntax.
                </p>
                {level === "easy" && (
                  <div className="absolute top-3 right-3 text-green-500">
                    <FaCheckCircle />
                  </div>
                )}
              </button>

              {/* Medium */}
              <button
                onClick={() => setLevel("medium")}
                className={`group p-6 rounded-2xl border transition-all text-left relative overflow-hidden ${
                  level === "medium"
                    ? "border-yellow-500 bg-yellow-500/10 shadow-lg shadow-yellow-500/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-yellow-500/50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-2xl border ${
                    level === "medium"
                      ? "bg-yellow-500/20 border-yellow-500/30"
                      : "bg-white/5 border-white/10 group-hover:border-yellow-500/30"
                  }`}
                >
                  🔥
                </div>
                <h4
                  className={`text-xl font-bold mb-2 ${level === "medium" ? "text-yellow-400" : "text-gray-200 group-hover:text-yellow-400"}`}
                >
                  Medium
                </h4>
                <p className="text-sm text-gray-500 group-hover:text-gray-400 leading-relaxed">
                  Removes key logic & functions. Requires understanding of how
                  components interact.
                </p>
                {level === "medium" && (
                  <div className="absolute top-3 right-3 text-yellow-500">
                    <FaCheckCircle />
                  </div>
                )}
              </button>

              {/* Hard */}
              <button
                onClick={() => setLevel("hard")}
                className={`group p-6 rounded-2xl border transition-all text-left relative overflow-hidden ${
                  level === "hard"
                    ? "border-red-500 bg-red-500/10 shadow-lg shadow-red-500/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-red-500/50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-2xl border ${
                    level === "hard"
                      ? "bg-red-500/20 border-red-500/30"
                      : "bg-white/5 border-white/10 group-hover:border-red-500/30"
                  }`}
                >
                  ⚡
                </div>
                <h4
                  className={`text-xl font-bold mb-2 ${level === "hard" ? "text-red-400" : "text-gray-200 group-hover:text-red-400"}`}
                >
                  Hard
                </h4>
                <p className="text-sm text-gray-500 group-hover:text-gray-400 leading-relaxed">
                  Rebuilds core implementations. For experts ready to test deep
                  knowledge.
                </p>
                {level === "hard" && (
                  <div className="absolute top-3 right-3 text-red-500">
                    <FaCheckCircle />
                  </div>
                )}
              </button>
            </div>

            <Button
              onClick={handleStartChallenge}
              disabled={isGenerating}
              className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/20 rounded-xl font-bold tracking-wide"
            >
              {isGenerating ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Crafting Challenge...</span>
                </>
              ) : (
                <>
                  <span className="mr-2">Start Challenge</span>
                  <FaChevronRight className="text-sm" />
                </>
              )}
            </Button>
          </div>
        )}

        {/* Stage 2: Challenge */}
        {stage === "challenge" && challengeData && (
          <div className="flex flex-col h-[70vh]">
            <div className="px-6 py-4 border-b border-white/5 bg-gray-900/50 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                    <FaCode className="text-blue-400" />
                    Complete the Code
                  </h3>
                  <p className="text-sm text-gray-400">
                    Locate{" "}
                    <code className="text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded font-mono text-xs border border-red-400/20">{`// TODO`}</code>{" "}
                    markers and implement the missing logic.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleGetHint}
                    disabled={isGettingHint}
                    icon={
                      <FaLightbulb
                        className={
                          isGettingHint ? "animate-pulse" : "text-yellow-400"
                        }
                      />
                    }
                    className="border-yellow-500/20 hover:bg-yellow-500/10 hover:border-yellow-500/40 text-yellow-200"
                  >
                    {isGettingHint ? "Thinking..." : "Get Hint"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={isEvaluating}
                    icon={<FaPaperPlane />}
                    className="bg-blue-600 hover:bg-blue-500 shadow-blue-600/20"
                  >
                    {isEvaluating ? "Evaluating..." : "Submit Solution"}
                  </Button>
                </div>
              </div>
            </div>

            {hint && (
              <div className="mx-6 mt-4 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0 border border-yellow-500/20">
                    <FaLightbulb className="text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-yellow-400 uppercase tracking-wider">
                        AI Hint
                      </h4>
                      <button
                        onClick={() => setHint("")}
                        className="text-gray-500 hover:text-white transition-colors p-1"
                        title="Close hint"
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <div className="text-sm text-gray-300 prose prose-invert max-w-none">
                      <MarkdownRenderer content={hint} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-hidden p-4 bg-gray-950/30">
              <div className="h-full rounded-xl overflow-hidden border border-white/10 shadow-inner">
                <CodeEditor
                  value={userCode}
                  language={language}
                  onChange={(value) => setUserCode(value || "")}
                  readOnly={false}
                />
              </div>
            </div>
          </div>
        )}

        {/* Stage 3: Result */}
        {stage === "result" && result && (
          <div className="p-8">
            <div className="text-center mb-10">
              <div className="relative inline-block">
                <div
                  className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center border-4 backdrop-blur-xl ${
                    result.score >= 80
                      ? "bg-green-500/10 border-green-500 text-green-400"
                      : result.score >= 60
                        ? "bg-yellow-500/10 border-yellow-500 text-yellow-400"
                        : "bg-red-500/10 border-red-500 text-red-400"
                  }`}
                >
                  <span className="text-5xl font-black">{result.score}</span>
                </div>
                <div
                  className={`absolute inset-0 blur-2xl opacity-40 ${
                    result.score >= 80
                      ? "bg-green-500"
                      : result.score >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                />
              </div>

              <h3 className="text-3xl font-bold text-white mt-6 mb-2">
                {result.score >= 80
                  ? "🎉 Outstanding!"
                  : result.score >= 60
                    ? "👍 Good Job!"
                    : "💪 Keep Learning!"}
              </h3>
              <p className="text-gray-400">
                You have completed the challenge. Here is how you did.
              </p>
            </div>

            {/* Feedback & Diff Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Feedback */}
              <div className="glass-panel p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5">
                <h4 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
                  <FaTrophy /> AI Feedback
                </h4>
                <div className="text-gray-300 text-sm leading-relaxed max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  <MarkdownRenderer content={result.feedback} />
                </div>
              </div>

              {/* Differences Summary */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-gray-900/40">
                <h4 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2">
                  <FaExclamationTriangle className="text-yellow-500" /> Key
                  Differences
                </h4>
                {result.differences && result.differences.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {result.differences.map((diff, index) => (
                      <div
                        key={index}
                        className="flex gap-3 text-sm bg-black/20 p-3 rounded-xl border border-white/5"
                      >
                        <span className="text-purple-400 font-bold shrink-0 mt-0.5">
                          •
                        </span>
                        <span className="text-gray-400">{diff}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 italic text-center py-8">
                    No significant differences found.
                  </div>
                )}
              </div>
            </div>

            {/* Code Diff View */}
            <div className="mb-8 rounded-2xl overflow-hidden border border-white/10 glass-panel">
              <div className="bg-white/5 px-6 py-4 border-b border-white/5">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <FaCode /> Code Comparison
                </h4>
              </div>
              <div className="max-h-125 overflow-auto">
                <CodeDiff
                  originalCode={originalCode}
                  modifiedCode={userCode}
                  fileName={fileName}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                variant="secondary"
                size="lg"
                onClick={handleReset}
                className="flex-1 border-white/10 text-gray-300 hover:bg-white/5"
                icon={<FaRedo />}
              >
                Try Another
              </Button>
              <Button
                onClick={handleClose}
                className="flex-1 bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20"
                size="lg"
              >
                Finish Review
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
