"use client";

import Modal from "./Modal";
import { CodeExplanation } from "@/types";

interface ExplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  explanation: CodeExplanation | null;
  isLoading?: boolean;
}

export default function ExplainModal({
  isOpen,
  onClose,
  explanation,
  isLoading,
}: ExplainModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Code Explanation" size="lg">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : explanation ? (
        <div className="space-y-6">
          {/* Logika Kerja */}
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              📖 Logika Kerja
            </h3>
            <p className="text-gray-300 whitespace-pre-wrap">
              {explanation.logika}
            </p>
          </div>

          {/* Key Terms */}
          {explanation.keyTerms && explanation.keyTerms.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">
                🔑 Key Terms
              </h3>
              <div className="space-y-3">
                {explanation.keyTerms.map((term, index) => (
                  <div key={index} className="bg-gray-700 rounded p-3">
                    <h4 className="font-semibold text-white mb-1">
                      {term.term}
                    </h4>
                    <p className="text-gray-300 text-sm">{term.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analogy */}
          {explanation.analogy && (
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-2">
                💡 Analogi
              </h3>
              <p className="text-gray-300 italic">{explanation.analogy}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          No explanation available
        </div>
      )}
    </Modal>
  );
}
