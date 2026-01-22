"use client";

import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { Button, LoadingSpinner } from "@/components/ui";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatSidebar() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      // TODO: Implement AI chat endpoint
      // For now, just a placeholder response
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Chat feature coming soon! This will allow you to ask general questions about the project.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
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
      {/* Header removed as it is handled by the tabs or unnecessary in tight space */}
      {/* <div className="px-4 py-3 border-b border-gray-800 bg-[#161b22]">
        <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">AI Assistant</h3>
      </div> */}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-500/20">
              <FaPaperPlane className="text-blue-400 opacity-60" />
            </div>
            <p className="text-gray-400 text-sm font-medium">
              Start a conversation
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Ask about architecture, bugs, or how to implement features.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  message.role === "user"
                    ? "bg-blue-600/20 text-blue-100 border border-blue-500/30 rounded-br-none"
                    : "bg-gray-800/60 text-gray-200 border border-gray-700 rounded-bl-none"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </p>
                <p className="text-[10px] opacity-50 mt-1 text-right">
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
          <div className="flex justify-start">
            <div className="bg-gray-800/60 rounded-2xl rounded-bl-none p-3 border border-gray-700">
              <LoadingSpinner size="sm" />
            </div>
          </div>
        )}
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
