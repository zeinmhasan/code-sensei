import axios from "axios";
import { FileNode } from "@/types";

interface GitHubTreeItem {
  path: string;
  type: string;
  sha: string;
}

interface GitHubApiResponse {
  data: {
    tree: GitHubTreeItem[];
  };
}

interface TreeNode {
  id?: string;
  name: string;
  type: "file" | "folder";
  path?: string;
  children: TreeNode[];
}

export async function fetchGitHubRepo(repoUrl: string) {
  // Extract owner and repo name from URL
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) {
    throw new Error("Invalid GitHub URL");
  }

  const [, owner, repo] = match;
  const repoName = repo.replace(".git", "");

  // Fetch repository tree
  const treeUrl = `https://api.github.com/repos/${owner}/${repoName}/git/trees/main?recursive=1`;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };

  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const response: GitHubApiResponse = await axios.get(treeUrl, { headers });
    return {
      owner,
      repo: repoName,
      tree: response.data.tree,
    };
  } catch (error) {
    // Try with master branch if main fails
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      const masterTreeUrl = `https://api.github.com/repos/${owner}/${repoName}/git/trees/master?recursive=1`;
      const response: GitHubApiResponse = await axios.get(masterTreeUrl, {
        headers,
      });
      return {
        owner,
        repo: repoName,
        tree: response.data.tree,
      };
    }
    throw error;
  }
}

export async function fetchFileContent(
  owner: string,
  repo: string,
  path: string,
): Promise<string> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3.raw",
  };

  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
  }

  const response = await axios.get<string>(url, { headers });
  return response.data;
}

export function buildFileTree(files: GitHubTreeItem[]): FileNode[] {
  const root: TreeNode = {
    name: "root",
    type: "folder",
    children: [],
  };

  files.forEach((file) => {
    if (file.type === "tree") return; // Skip folders for now

    const parts = file.path.split("/");
    let current = root;

    parts.forEach((part: string, index: number) => {
      if (index === parts.length - 1) {
        // It's a file
        current.children.push({
          id: file.sha,
          name: part,
          type: "file",
          path: file.path,
          children: [],
        });
      } else {
        // It's a folder
        let folder = current.children.find(
          (c: TreeNode) => c.name === part && c.type === "folder",
        );
        if (!folder) {
          folder = {
            id: `folder-${part}`,
            name: part,
            type: "folder",
            path: parts.slice(0, index + 1).join("/"),
            children: [],
          };
          current.children.push(folder);
        }
        current = folder;
      }
    });
  });

  return root.children as FileNode[];
}
