"use client";

import { useState } from "react";
import { useProject } from "@/lib/context/ProjectContext";
import { LoadingSpinner } from "@/components/ui";
import { FaLightbulb, FaBook } from "react-icons/fa";

export default function ExplanationPanel() {
  const { explanation, isLoadingExplanation, selectedFile } = useProject();
  const [activeTab, setActiveTab] = useState<"explanation" | "terms">(
    "explanation",
  );

  if (!selectedFile) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-sm text-center p-4">
        Select a file and highlight code to see explanations
      </div>
    );
  }

  if (isLoadingExplanation) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner text="Generating explanation..." />
      </div>
    );
  }

  if (!explanation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm text-center p-4">
        <FaLightbulb className="text-4xl mb-3 text-gray-600" />
        <p>Highlight code in the editor and right-click to explain</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#161b22]">
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab("explanation")}
          className={`flex-1 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
            activeTab === "explanation"
              ? "text-blue-400 bg-blue-900/10 border-b-2 border-blue-400"
              : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/30"
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab("terms")}
          className={`flex-1 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
            activeTab === "terms"
              ? "text-blue-400 bg-blue-900/10 border-b-2 border-blue-400"
              : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/30"
          }`}
        >
          Concepts
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === "explanation" ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold text-blue-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                <FaBook /> Logic Breakdown
              </h3>
              <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed space-y-2">
                {explanation.logika}
              </div>
            </div>

            {explanation.analogy && (
              <div className="glass-card p-4 rounded-xl border border-purple-500/20 bg-purple-900/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <FaLightbulb className="text-6xl text-purple-500" />
                </div>
                <h4 className="text-sm font-bold text-purple-300 mb-2 relative z-10 flex items-center gap-2">
                  <FaLightbulb className="text-purple-400" /> mental model
                </h4>
                <p className="text-gray-300 text-sm italic relative z-10 border-l-2 border-purple-500/30 pl-3">
                  &ldquo;{explanation.analogy}&rdquo;
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {explanation.keyTerms && explanation.keyTerms.length > 0 ? (
              explanation.keyTerms.map((term, index) => (
                <div
                  key={index}
                  className="bg-gray-800/40 rounded-lg p-3 border border-gray-700/50 hover:border-blue-500/30 transition-colors"
                >
                  <h4 className="font-bold text-blue-300 text-xs mb-1 uppercase tracking-wide">
                    {term.term}
                  </h4>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {term.definition}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-8">
                No key terms found
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
