"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { FileNode, CodeExplanation } from "@/types";

interface ProjectContextType {
  projectId: string | null;
  projectName: string | null;
  repoOwner: string | null;
  repoName: string | null;
  files: FileNode[];
  selectedFile: FileNode | null;
  fileContent: string;
  isLoadingFile: boolean;
  explanation: CodeExplanation | null;
  isLoadingExplanation: boolean;
  setProject: (
    id: string,
    name: string,
    owner: string,
    repo: string,
    files: FileNode[],
  ) => void;
  setSelectedFile: (file: FileNode) => void;
  setFileContent: (content: string) => void;
  setIsLoadingFile: (loading: boolean) => void;
  setExplanation: (explanation: CodeExplanation | null) => void;
  setIsLoadingExplanation: (loading: boolean) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string | null>(null);
  const [repoOwner, setRepoOwner] = useState<string | null>(null);
  const [repoName, setRepoName] = useState<string | null>(null);
  const [files, setFiles] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFileState] = useState<FileNode | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [explanation, setExplanation] = useState<CodeExplanation | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  const setProject = (
    id: string,
    name: string,
    owner: string,
    repo: string,
    projectFiles: FileNode[],
  ) => {
    setProjectId(id);
    setProjectName(name);
    setRepoOwner(owner);
    setRepoName(repo);
    setFiles(projectFiles);
  };

  const setSelectedFile = (file: FileNode) => {
    setSelectedFileState(file);
    setExplanation(null); // Clear previous explanation
  };

  return (
    <ProjectContext.Provider
      value={{
        projectId,
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
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
