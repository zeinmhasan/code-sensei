"use client";

import { useState } from "react";
import Modal from "./Modal";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import {
  FaFolder,
  FaLink,
  FaPaperPlane,
  FaSpinner,
  FaUser,
  FaRobot,
} from "react-icons/fa";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface FolderExplanation {
  role: string;
  relation: string;
}

interface FolderExplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderName: string;
  explanation: FolderExplanation | null;
  isLoading?: boolean;
}

export default function FolderExplainModal({
  isOpen,
  onClose,
  folderName,
  explanation,
  isLoading,
}: FolderExplainModalProps) {
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [isAskingFollowUp, setIsAskingFollowUp] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);

  const handleAskFollowUp = async () => {
    if (!followUpQuestion.trim() || !explanation) return;

    const question = followUpQuestion.trim();
    setFollowUpQuestion("");
    setIsAskingFollowUp(true);

    // Add user message to conversation
    const newConversation: Message[] = [
      ...conversation,
      { role: "user", content: question },
    ];
    setConversation(newConversation);

    try {
      // Build original context from explanation
      const originalContext = `
Folder: ${folderName}
Role: ${explanation.role}
Relation: ${explanation.relation}
      `.trim();

      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "followup",
          question,
          originalContext,
          conversationHistory: conversation,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to get answer");
      }

      // Add assistant response to conversation
      setConversation([
        ...newConversation,
        { role: "assistant", content: result.data.answer },
      ]);
    } catch (error) {
      console.error("Failed to ask follow-up:", error);
      setConversation([
        ...newConversation,
        {
          role: "assistant",
          content: "Maaf, gagal memproses pertanyaan. Silakan coba lagi.",
        },
      ]);
    } finally {
      setIsAskingFollowUp(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAskFollowUp();
    }
  };

  const handleClose = () => {
    setConversation([]);
    setFollowUpQuestion("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`📁 ${folderName || "Folder Explanation"}`}
      size="lg"
    >
      <div className="max-h-[70vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-600 border-t-purple-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaFolder className="text-purple-400 text-xl" />
              </div>
            </div>
            <p className="mt-4 text-gray-400 animate-pulse">
              Menganalisis struktur folder...
            </p>
          </div>
        ) : explanation ? (
          <div className="space-y-6">
            {/* Role Section */}
            <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                <FaFolder className="text-blue-400" />
                Role
              </h3>
              <div className="text-gray-200 relative z-10">
                <MarkdownRenderer content={explanation.role} />
              </div>
            </div>

            {/* Relations Section */}
            {explanation.relation && (
              <div className="bg-purple-900/10 border border-purple-500/20 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                  <FaLink className="text-purple-400" />
                  Relations
                </h3>
                <div className="text-gray-200 relative z-10">
                  <MarkdownRenderer content={explanation.relation} />
                </div>
              </div>
            )}

            {/* Conversation History */}
            {conversation.length > 0 && (
              <div className="border-t border-gray-700/50 pt-6">
                <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wide">
                  💬 Follow-up Discussion
                </h3>
                <div className="space-y-4">
                  {conversation.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        msg.role === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          msg.role === "user"
                            ? "bg-purple-600 shadow-lg shadow-purple-900/20"
                            : "bg-gray-700 border border-gray-600"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <FaUser className="text-white text-xs" />
                        ) : (
                          <FaRobot className="text-gray-300 text-xs" />
                        )}
                      </div>
                      <div
                        className={`flex-1 rounded-2xl p-4 text-sm ${
                          msg.role === "user"
                            ? "bg-purple-600/10 border border-purple-500/20 text-purple-100 ml-8 rounded-tr-none"
                            : "bg-gray-800/60 border border-gray-700/50 text-gray-200 mr-8 rounded-tl-none"
                        }`}
                      >
                        <MarkdownRenderer content={msg.content} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Follow-up Question Input */}
            <div className="border-t border-gray-700/50 pt-6">
              <h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wide">
                🤔 Ada pertanyaan lanjutan?
              </h3>
              <div className="relative">
                <textarea
                  value={followUpQuestion}
                  onChange={(e) => setFollowUpQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tanyakan sesuatu tentang folder ini... (Enter untuk kirim)"
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-3 pr-12 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 resize-none transition-all shadow-inner custom-scrollbar"
                  rows={2}
                  disabled={isAskingFollowUp}
                />
                <button
                  onClick={handleAskFollowUp}
                  disabled={!followUpQuestion.trim() || isAskingFollowUp}
                  className="absolute right-3 bottom-3 p-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
                >
                  {isAskingFollowUp ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaPaperPlane className="text-xs" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Tekan Enter untuk mengirim, Shift+Enter untuk baris baru
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-500 text-6xl mb-4">📭</div>
            <p className="text-gray-400">Tidak ada penjelasan tersedia</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
