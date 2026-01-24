"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaCode, FaArrowLeft, FaPlay, FaLightbulb } from "react-icons/fa";
import { ProjectProvider, useProject } from "@/lib/context/ProjectContext";
import FileTree from "@/components/tree-view/FileTree";
import CodeEditor from "@/components/editor/CodeEditor";
import ExplanationPanel from "@/components/ExplanationPanel";
import ChatSidebar from "@/components/ChatSidebar";
import ExplainModal from "@/components/modals/ExplainModal";
import FolderExplainModal from "@/components/modals/FolderExplainModal";
import ChallengeModal from "@/components/modals/ChallengeModal";
import ContextMenu from "@/components/ui/ContextMenu";
import { LoadingSpinner, Button } from "@/components/ui";
import { FileNode } from "@/types";
import { getFileLanguage } from "@/lib/utils/helpers";
import { getProjectById } from "@/lib/supabase/client";
import axios from "axios";

function ProjectWorkspace() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const {
    projectName,
    repoOwner,
    repoName,
    files,
    selectedFile,
    fileContent,
    isLoadingFile,
    explanation,
    isLoadingExplanation,
    setProject,
    setSelectedFile,
    setFileContent,
    setIsLoadingFile,
    setExplanation,
    setIsLoadingExplanation,
  } = useProject();

  const [showExplainModal, setShowExplainModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [folderExplanation, setFolderExplanation] = useState<{
    role: string;
    relation: string;
  } | null>(null);
  const [isLoadingFolder, setIsLoadingFolder] = useState(false);
  const [activeTab, setActiveTab] = useState<"explanation" | "chat">(
    "explanation",
  );
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    node: FileNode;
  } | null>(null);

  // Load project data from Supabase
  useEffect(() => {
    const loadProject = async () => {
      try {
        const project = await getProjectById(projectId);

        if (!project) {
          router.push("/dashboard");
          return;
        }

        // Extract owner and repo from repo_url
        const match = project.repo_url.match(/github\.com\/([^/]+)\/([^/]+)/);
        const owner = match ? match[1] : "";
        const repo = match ? match[2].replace(/\.git$/, "") : project.name;

        setProject(project.id, project.name, owner, repo, project.files);
      } catch (error) {
        console.error("Failed to load project:", error);
        router.push("/dashboard");
      } finally {
        setIsLoadingProject(false);
      }
    };

    loadProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, router]);

  // Fetch file content when file is selected
  const handleFileClick = async (file: FileNode) => {
    if (file.type === "folder") return;

    setSelectedFile(file);
    setIsLoadingFile(true);
    setFileContent("");

    try {
      const response = await axios.get(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${file.path}`,
        {
          headers: {
            Accept: "application/vnd.github.v3.raw",
            ...(process.env.NEXT_PUBLIC_GITHUB_TOKEN && {
              Authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            }),
          },
        },
      );

      setFileContent(response.data);
    } catch (error) {
      console.error("Failed to fetch file content:", error);
      setFileContent("// Failed to load file content");
    } finally {
      setIsLoadingFile(false);
    }
  };

  // Handle code explanation
  const handleExplainCode = async (code: string) => {
    setIsLoadingExplanation(true);
    setShowExplainModal(true);
    setActiveTab("explanation"); // Switch to explanation tab

    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "code", code }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to explain code");
      }

      setExplanation(result.data);
    } catch (error) {
      console.error("Failed to explain code:", error);
      setExplanation({
        logika: "Failed to generate explanation. Please try again.",
        keyTerms: [],
      });
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  // Handle folder/file explanation
  const handleExplainNode = async (node: FileNode) => {
    setIsLoadingFolder(true);
    setShowFolderModal(true);
    setFolderExplanation(null);

    try {
      const childrenNames = node.children?.map((c) => c.name) || [];

      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "folder",
          folderName: node.name,
          files: childrenNames,
          projectContext: `${projectName} - ${node.path}`,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to explain folder");
      }

      setFolderExplanation(result.data);
    } catch (error) {
      console.error("Failed to explain folder:", error);
      setFolderExplanation({
        role: "Failed to generate explanation. Please try again.",
        relation: "",
      });
    } finally {
      setIsLoadingFolder(false);
    }
  };

  // Handle right-click on tree node
  const handleNodeRightClick = (node: FileNode, event: React.MouseEvent) => {
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      node,
    });
  };

  // Listen for explain code event from CodeEditor
  useEffect(() => {
    const handleExplainEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.code) {
        handleExplainCode(customEvent.detail.code);
      }
    };

    window.addEventListener("explain-code", handleExplainEvent);
    return () => window.removeEventListener("explain-code", handleExplainEvent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoadingProject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading project..." />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#0d1117] text-gray-300">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0d1117] h-14 shrink-0 flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              icon={<FaArrowLeft />}
              className="text-gray-400 hover:text-white"
            >
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-3 border-l border-gray-800 pl-4 h-6">
            <div className="w-6 h-6 rounded bg-blue-900/30 flex items-center justify-center border border-blue-500/20">
              <FaCode className="text-blue-400 text-xs" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-200 leading-none">
                {projectName}
              </h1>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                {repoOwner}/{repoName}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<FaPlay className="text-xs" />}
            className="text-xs px-3 h-8 bg-green-900/20 text-green-400 hover:bg-green-900/30 border border-green-500/20"
            onClick={() => {
              if (!selectedFile || !fileContent) {
                alert("Pilih file terlebih dahulu untuk memulai challenge!");
                return;
              }
              setShowChallengeModal(true);
            }}
            disabled={!selectedFile || !fileContent}
          >
            Start Challenge
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - File Tree */}
        <div className="w-64 border-r border-gray-800 bg-[#0d1117] flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-800 flex items-center justify-between bg-[#161b22]">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Explorer
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 file-tree-container">
            <FileTree
              nodes={files}
              onFileClick={handleFileClick}
              onNodeRightClick={handleNodeRightClick}
            />
          </div>
        </div>

        {/* Center - Code Editor */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117]">
          {selectedFile ? (
            <>
              <div className="h-10 border-b border-gray-800 bg-[#161b22] flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-blue-900/20 text-blue-300 border border-blue-500/10 font-mono">
                    TS
                  </span>
                  <span className="text-sm text-gray-300 font-medium truncate">
                    {selectedFile.path}
                  </span>
                </div>
              </div>
              <div className="flex-1 overflow-hidden relative">
                {isLoadingFile ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0d1117] z-10">
                    <LoadingSpinner text="Loading file..." />
                  </div>
                ) : (
                  <CodeEditor
                    value={fileContent}
                    language={getFileLanguage(selectedFile.name)}
                    readOnly={true}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-[#0d1117] text-gray-500">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-700/50">
                  <FaCode className="text-4xl opacity-40" />
                </div>
                <p className="text-gray-400 font-medium">No file selected</p>
                <p className="text-sm text-gray-600 mt-2">
                  Select a file from the explorer to view its contents
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Explanation & Chat */}
        <div className="w-80 border-l border-gray-800 bg-[#161b22] flex flex-col shrink-0">
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => setActiveTab("explanation")}
              className={`flex-1 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                activeTab === "explanation"
                  ? "text-blue-400 border-blue-400 bg-blue-900/5"
                  : "text-gray-500 border-transparent hover:text-gray-300 hover:bg-gray-800/50"
              }`}
            >
              Explanation
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                activeTab === "chat"
                  ? "text-blue-400 border-blue-400 bg-blue-900/5"
                  : "text-gray-500 border-transparent hover:text-gray-300 hover:bg-gray-800/50"
              }`}
            >
              Chat
            </button>
          </div>

          <div className="flex-1 overflow-hidden p-0">
            {activeTab === "explanation" ? (
              <ExplanationPanel />
            ) : (
              <ChatSidebar />
            )}
          </div>
        </div>
      </div>

      {/* Explain Modal */}
      <ExplainModal
        isOpen={showExplainModal}
        onClose={() => setShowExplainModal(false)}
        explanation={explanation}
        isLoading={isLoadingExplanation}
      />

      {/* Folder Explanation Modal */}
      <FolderExplainModal
        isOpen={showFolderModal}
        onClose={() => setShowFolderModal(false)}
        folderName={contextMenu?.node?.name || ""}
        explanation={folderExplanation}
        isLoading={isLoadingFolder}
      />

      {/* Challenge Modal */}
      <ChallengeModal
        isOpen={showChallengeModal}
        onClose={() => setShowChallengeModal(false)}
        originalCode={fileContent}
        fileName={selectedFile?.name || ""}
        language={getFileLanguage(selectedFile?.name || "")}
      />

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={[
            {
              label: "Explain Role",
              icon: <FaLightbulb />,
              onClick: () => handleExplainNode(contextMenu.node),
            },
          ]}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}

export default function ProjectPage() {
  return (
    <ProjectProvider>
      <ProjectWorkspace />
    </ProjectProvider>
  );
}
