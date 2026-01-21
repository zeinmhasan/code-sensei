import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubRepo, buildFileTree } from "@/lib/utils/github";

export async function POST(request: NextRequest) {
  try {
    const { repoUrl } = await request.json();

    if (!repoUrl) {
      return NextResponse.json(
        { error: "Repository URL is required" },
        { status: 400 },
      );
    }

    // Fetch GitHub repository data
    const repoData = await fetchGitHubRepo(repoUrl);

    // Build file tree structure
    const fileTree = buildFileTree(repoData.tree);

    return NextResponse.json({
      success: true,
      data: {
        owner: repoData.owner,
        repo: repoData.repo,
        files: fileTree,
      },
    });
  } catch (error: any) {
    console.error("Error fetching GitHub repo:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch repository" },
      { status: 500 },
    );
  }
}
