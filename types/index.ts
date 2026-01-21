// Core Types for CodeSensei

export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  path: string;
  children?: FileNode[];
  content?: string;
  language?: string;
}

export interface ProjectStructure {
  id: string;
  name: string;
  repoUrl: string;
  files: FileNode[];
  createdAt: Date;
  userId?: string;
}

export interface CodeExplanation {
  logika: string;
  keyTerms: KeyTerm[];
  analogy?: string;
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface FolderExplanation {
  role: string;
  relation: string;
}

export interface Challenge {
  id: string;
  projectId: string;
  level: "easy" | "medium" | "hard";
  originalCode: string;
  modifiedCode: string;
  filePath: string;
  createdAt: Date;
}

export interface ChallengeSubmission {
  id: string;
  challengeId: string;
  userCode: string;
  score: number;
  feedback: string;
  comparison: string;
  submittedAt: Date;
}

export interface UserProgress {
  userId: string;
  projectsAnalyzed: number;
  challengesCompleted: number;
  averageScore: number;
}
