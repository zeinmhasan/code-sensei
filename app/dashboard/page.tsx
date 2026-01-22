"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaGithub, FaCode, FaPlus, FaClock, FaTrash } from "react-icons/fa";
import { Button, Input, LoadingSpinner, EmptyState } from "@/components/ui";

interface Project {
  id: string;
  name: string;
  repo_url: string;
  owner: string;
  files: unknown;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Load projects from localStorage
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    try {
      const stored = localStorage.getItem("codesensei_projects");
      if (stored) {
        setProjects(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleImport = async () => {
    if (!repoUrl.trim()) {
      setError("Please enter a GitHub repository URL");
      return;
    }

    // Validate GitHub URL format
    if (!repoUrl.match(/github\.com\/[\w-]+\/[\w.-]+/)) {
      setError(
        "Invalid GitHub URL format. Use: https://github.com/username/repository",
      );
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Fetch repository structure from API
      const response = await fetch("/api/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to import repository");
      }

      // Create new project
      const projectId = crypto.randomUUID();
      const newProject: Project = {
        id: projectId,
        name: result.data.repo,
        repo_url: repoUrl,
        files: result.data.files,
        owner: result.data.owner,
        created_at: new Date().toISOString(),
      };

      // Save to localStorage
      const existingProjects = JSON.parse(
        localStorage.getItem("codesensei_projects") || "[]",
      );
      existingProjects.unshift(newProject);
      localStorage.setItem(
        "codesensei_projects",
        JSON.stringify(existingProjects),
      );

      // Navigate to project workspace
      router.push(`/project/${projectId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to import repository",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/project/${projectId}`);
  };

  const handleDeleteProject = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation(); // Prevent navigation when clicking delete

    if (confirm("Are you sure you want to delete this project?")) {
      const updated = projects.filter((p) => p.id !== projectId);
      setProjects(updated);
      localStorage.setItem("codesensei_projects", JSON.stringify(updated));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleImport();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-gray-800 glass-panel sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20">
              <FaCode className="text-white text-md" />
            </div>
            <h1 className="text-xl font-bold text-white">CodeSensei</h1>
          </Link>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/20 text-blue-300 text-sm font-medium">
              Dashboard
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 relative z-10">
        {/* Import Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="glass-panel p-8 rounded-2xl border border-blue-500/20 shadow-xl shadow-blue-900/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-900/30 flex items-center justify-center border border-blue-500/20">
                <FaGithub className="text-2xl text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Import Repository
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Analyze any public GitHub repository with AI-powered
                  explanations
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <Input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="https://github.com/username/repository"
                  className="bg-gray-900/50 border-gray-700 h-12 pl-4 focus:ring-blue-500 focus:border-blue-500 transition-all rounded-xl"
                  error={error}
                  disabled={isLoading}
                />
              </div>

              <Button
                onClick={handleImport}
                isLoading={isLoading}
                icon={<FaPlus />}
                className="w-full h-12 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium shadow-lg shadow-blue-600/20"
                size="lg"
              >
                Import & Analyze
              </Button>

              <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
                <span className="text-xl">💡</span>
                <p className="text-sm text-blue-300">
                  <strong>Tip:</strong> Make sure the repository is public. For
                  private repos, configure your GitHub token in settings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Projects Section */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Your Projects</h2>
              <p className="text-gray-400 text-sm mt-1">
                {projects.length}{" "}
                {projects.length === 1 ? "project" : "projects"} imported
              </p>
            </div>
            <Button
              onClick={loadProjects}
              variant="ghost"
              size="sm"
              className="hover:bg-gray-800 rounded-lg"
            >
              Refresh
            </Button>
          </div>

          {loadingProjects ? (
            <div className="py-20 flex justify-center">
              <LoadingSpinner text="Loading projects..." />
            </div>
          ) : projects.length === 0 ? (
            <div className="glass-panel border-dashed border-2 border-gray-700 rounded-2xl p-12">
              <EmptyState
                icon={<FaCode size={48} />}
                title="No Projects Yet"
                description="Import your first GitHub repository to start analyzing code with AI-powered explanations"
                action={{
                  label: "Import Your First Project",
                  onClick: () =>
                    window.scrollTo({ top: 0, behavior: "smooth" }),
                }}
              />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project.id)}
                  className="glass-card rounded-xl p-6 cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-blue-900/30 group-hover:text-blue-400 transition-colors border border-gray-700 group-hover:border-blue-500/30">
                      <FaGithub className="text-xl text-gray-400 group-hover:text-blue-400" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded bg-gray-800 border border-gray-700 text-xs text-gray-400 flex items-center gap-1 group-hover:border-gray-600">
                        <FaClock size={10} />
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                      <button
                        onClick={(e) => handleDeleteProject(e, project.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors p-1.5 hover:bg-red-900/20 rounded-md"
                        title="Delete project"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors truncate">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3 truncate flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-gray-600 group-hover:bg-blue-500 transition-colors"></span>
                    {project.owner}
                  </p>
                  <p className="text-xs text-gray-500 truncate font-mono opacity-60">
                    {project.repo_url.replace("https://github.com/", "")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20 py-8 glass-panel z-10 relative">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            CodeSensei &copy; {new Date().getFullYear()} - Bridging the gap
            between AI-generated code and human understanding
          </p>
        </div>
      </footer>
    </div>
  );
}
