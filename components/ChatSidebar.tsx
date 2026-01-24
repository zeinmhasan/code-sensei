"use client";

import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaRobot, FaUser } from "react-icons/fa";
import { Button, LoadingSpinner, MarkdownRenderer } from "@/components/ui";
import { useProject } from "@/lib/context/ProjectContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatSidebar() {
  const { projectName, repoOwner, repoName, files, selectedFile, fileContent } =
    useProject();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Build project context for AI
  const buildProjectContext = () => {
    const fileList = files
      .map((f) => f.name)
      .slice(0, 20)
      .join(", ");
    let context = `
Project: ${projectName || "Unknown"}
Repository: ${repoOwner}/${repoName}
File structure: ${fileList}${files.length > 20 ? ` ... dan ${files.length - 20} file lainnya` : ""}
`;

    if (selectedFile && fileContent) {
      context += `
Currently viewing: ${selectedFile.path}
File content (first 500 chars):
\`\`\`
${fileContent.slice(0, 500)}${fileContent.length > 500 ? "..." : ""}
\`\`\`
`;
    }

    return context.trim();
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          projectContext: buildProjectContext(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to get response");
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#161b22]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="text-center py-8 px-4">
            <div className="w-14 h-14 bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
              <FaRobot className="text-blue-400 text-xl" />
            </div>
            <p className="text-gray-300 text-sm font-medium mb-1">
              CodeSensei AI
            </p>
            <p className="text-gray-500 text-xs leading-relaxed">
              Tanya apa saja tentang project ini. AI sudah memahami struktur
              folder dan file yang sedang kamu lihat.
            </p>
            {projectName && (
              <div className="mt-4 p-2 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                  Context
                </p>
                <p className="text-xs text-gray-400">
                  {repoOwner}/{repoName}
                </p>
              </div>
            )}
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                  message.role === "user"
                    ? "bg-blue-600"
                    : "bg-gray-700 border border-gray-600"
                }`}
              >
                {message.role === "user" ? (
                  <FaUser className="text-white text-[10px]" />
                ) : (
                  <FaRobot className="text-gray-300 text-[10px]" />
                )}
              </div>

              {/* Message bubble */}
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  message.role === "user"
                    ? "bg-blue-600/20 text-blue-100 border border-blue-500/30 rounded-tr-sm"
                    : "bg-gray-800/60 text-gray-200 border border-gray-700/50 rounded-tl-sm"
                }`}
              >
                {message.role === "assistant" ? (
                  <div className="prose-sm">
                    <MarkdownRenderer content={message.content} />
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed text-xs">
                    {message.content}
                  </p>
                )}
                <p className="text-[10px] opacity-40 mt-1 text-right">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-2">
            <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-gray-700 border border-gray-600">
              <FaRobot className="text-gray-300 text-[10px]" />
            </div>
            <div className="bg-gray-800/60 rounded-2xl rounded-tl-sm px-3 py-2 border border-gray-700/50">
              <LoadingSpinner size="sm" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-gray-800 bg-[#161b22]">
        <div className="flex gap-2 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-[#0d1117] border border-gray-800 rounded-lg text-gray-200 text-xs placeholder-gray-600 focus:outline-none focus:border-blue-500/50 resize-none custom-scrollbar"
            rows={2}
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            icon={<FaPaperPlane className="text-xs" />}
            size="sm"
            className="h-full"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
