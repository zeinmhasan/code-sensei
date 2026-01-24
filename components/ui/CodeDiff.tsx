"use client";

import { useMemo } from "react";

interface CodeDiffProps {
  originalCode: string;
  modifiedCode: string;
  fileName?: string;
}

interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  oldLineNumber: number | null;
  newLineNumber: number | null;
}

function computeDiff(original: string, modified: string): DiffLine[] {
  const originalLines = original.split("\n");
  const modifiedLines = modified.split("\n");
  const result: DiffLine[] = [];

  // Simple LCS-based diff algorithm
  const lcs = computeLCS(originalLines, modifiedLines);

  let oldIdx = 0;
  let newIdx = 0;
  let lcsIdx = 0;

  while (oldIdx < originalLines.length || newIdx < modifiedLines.length) {
    if (lcsIdx < lcs.length) {
      // Output removed lines (in original but not in LCS)
      while (
        oldIdx < originalLines.length &&
        originalLines[oldIdx] !== lcs[lcsIdx]
      ) {
        result.push({
          type: "removed",
          content: originalLines[oldIdx],
          oldLineNumber: oldIdx + 1,
          newLineNumber: null,
        });
        oldIdx++;
      }

      // Output added lines (in modified but not in LCS)
      while (
        newIdx < modifiedLines.length &&
        modifiedLines[newIdx] !== lcs[lcsIdx]
      ) {
        result.push({
          type: "added",
          content: modifiedLines[newIdx],
          oldLineNumber: null,
          newLineNumber: newIdx + 1,
        });
        newIdx++;
      }

      // Output unchanged line
      if (oldIdx < originalLines.length && newIdx < modifiedLines.length) {
        result.push({
          type: "unchanged",
          content: originalLines[oldIdx],
          oldLineNumber: oldIdx + 1,
          newLineNumber: newIdx + 1,
        });
        oldIdx++;
        newIdx++;
        lcsIdx++;
      }
    } else {
      // Output remaining removed lines
      while (oldIdx < originalLines.length) {
        result.push({
          type: "removed",
          content: originalLines[oldIdx],
          oldLineNumber: oldIdx + 1,
          newLineNumber: null,
        });
        oldIdx++;
      }

      // Output remaining added lines
      while (newIdx < modifiedLines.length) {
        result.push({
          type: "added",
          content: modifiedLines[newIdx],
          oldLineNumber: null,
          newLineNumber: newIdx + 1,
        });
        newIdx++;
      }
    }
  }

  return result;
}

function computeLCS(original: string[], modified: string[]): string[] {
  const m = original.length;
  const n = modified.length;

  // Create DP table
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  // Fill DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (original[i - 1] === modified[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find LCS
  const lcs: string[] = [];
  let i = m;
  let j = n;

  while (i > 0 && j > 0) {
    if (original[i - 1] === modified[j - 1]) {
      lcs.unshift(original[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return lcs;
}

export default function CodeDiff({
  originalCode,
  modifiedCode,
  fileName,
}: CodeDiffProps) {
  const diffLines = useMemo(
    () => computeDiff(originalCode, modifiedCode),
    [originalCode, modifiedCode],
  );

  const stats = useMemo(() => {
    const added = diffLines.filter((l) => l.type === "added").length;
    const removed = diffLines.filter((l) => l.type === "removed").length;
    return { added, removed };
  }, [diffLines]);

  return (
    <div className="rounded-xl overflow-hidden border border-gray-700 bg-gray-900">
      {/* File Header - GitHub Style */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800/80 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <svg
            className="w-4 h-4 text-gray-400"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z" />
          </svg>
          <span className="text-sm font-mono text-gray-300">
            {fileName || "code"}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs font-medium">
          <span className="text-green-400">+{stats.added}</span>
          <span className="text-red-400">-{stats.removed}</span>
        </div>
      </div>

      {/* Diff View */}
      <div className="overflow-x-auto max-h-100 overflow-y-auto custom-scrollbar">
        <table className="w-full text-sm font-mono">
          <tbody>
            {diffLines.map((line, index) => (
              <tr
                key={index}
                className={`
                  ${line.type === "added" ? "bg-green-900/20" : ""}
                  ${line.type === "removed" ? "bg-red-900/20" : ""}
                  hover:bg-white/5 transition-colors
                `}
              >
                {/* Old Line Number */}
                <td className="w-12 text-right pr-2 py-0 select-none text-gray-500 text-xs border-r border-gray-800">
                  {line.oldLineNumber || ""}
                </td>
                {/* New Line Number */}
                <td className="w-12 text-right pr-2 py-0 select-none text-gray-500 text-xs border-r border-gray-800">
                  {line.newLineNumber || ""}
                </td>
                {/* Diff Indicator */}
                <td
                  className={`w-6 text-center py-0 select-none font-bold ${
                    line.type === "added"
                      ? "text-green-400 bg-green-900/30"
                      : line.type === "removed"
                        ? "text-red-400 bg-red-900/30"
                        : "text-gray-600"
                  }`}
                >
                  {line.type === "added"
                    ? "+"
                    : line.type === "removed"
                      ? "-"
                      : " "}
                </td>
                {/* Code Content */}
                <td
                  className={`py-0.5 pl-2 pr-4 whitespace-pre ${
                    line.type === "added"
                      ? "text-green-300"
                      : line.type === "removed"
                        ? "text-red-300"
                        : "text-gray-400"
                  }`}
                >
                  {line.content || " "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="px-4 py-2 bg-gray-800/50 border-t border-gray-700 flex items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-green-500/30 border border-green-500"></div>
          <span>{stats.added} additions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-red-500/30 border border-red-500"></div>
          <span>{stats.removed} deletions</span>
        </div>
      </div>
    </div>
  );
}
