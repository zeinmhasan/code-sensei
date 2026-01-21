"use client";

import Editor, { OnMount } from "@monaco-editor/react";
import { useRef } from "react";

interface CodeEditorProps {
  value: string;
  language?: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
  onSelectionChange?: (
    selectedText: string,
    startLine: number,
    endLine: number,
  ) => void;
}

export default function CodeEditor({
  value,
  language = "javascript",
  onChange,
  readOnly = false,
  onSelectionChange,
}: CodeEditorProps) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;

    // Listen for selection changes
    if (onSelectionChange) {
      editor.onDidChangeCursorSelection(() => {
        const selection = editor.getSelection();
        if (selection && !selection.isEmpty()) {
          const selectedText =
            editor.getModel()?.getValueInRange(selection) || "";
          const startLine = selection.startLineNumber;
          const endLine = selection.endLineNumber;
          onSelectionChange(selectedText, startLine, endLine);
        }
      });
    }

    // Add custom context menu actions
    editor.addAction({
      id: "explain-code",
      label: "Explain Code",
      contextMenuGroupId: "codesensei",
      contextMenuOrder: 1,
      run: (ed) => {
        const selection = ed.getSelection();
        if (selection && !selection.isEmpty()) {
          const selectedText = ed.getModel()?.getValueInRange(selection) || "";
          // Trigger custom event for parent component to handle
          window.dispatchEvent(
            new CustomEvent("explain-code", {
              detail: { code: selectedText },
            }),
          );
        }
      },
    });
  };

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          readOnly,
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          contextmenu: true,
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
}
