import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are not set");
}

// Use createBrowserClient for proper cookie-based session handling
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Database helper functions

interface ProjectData {
  name: string;
  repo_url: string;
  user_id?: string;
  files?: unknown;
}

export async function saveProject(project: ProjectData) {
  const { data, error } = await supabase
    .from("projects")
    .insert([project])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getProjects(userId?: string) {
  let query = supabase.from("projects").select("*");

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

interface ChallengeData {
  project_id: string;
  level: "easy" | "medium" | "hard";
  original_code: string;
  modified_code: string;
  file_path: string;
}

export async function saveChallenge(challenge: ChallengeData) {
  const { data, error } = await supabase
    .from("challenges")
    .insert([challenge])
    .select()
    .single();

  if (error) throw error;
  return data;
}

interface SubmissionData {
  challenge_id: string;
  user_id?: string;
  user_code: string;
  score: number;
  feedback?: string;
  comparison?: string;
}

export async function saveChallengeSubmission(submission: SubmissionData) {
  const { data, error } = await supabase
    .from("challenge_submissions")
    .insert([submission])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserProgress(userId: string) {
  // First try to get existing progress
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  // If table doesn't exist or no data, return default values
  if (error) {
    console.warn("user_progress table error:", error.message);
    return {
      user_id: userId,
      projects_analyzed: 0,
      challenges_completed: 0,
      average_score: 0,
    };
  }

  // If no data exists yet for this user, return defaults
  if (!data) {
    return {
      user_id: userId,
      projects_analyzed: 0,
      challenges_completed: 0,
      average_score: 0,
    };
  }

  return data;
}

export async function deleteProject(projectId: string) {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) throw error;
}

export async function getProjectById(projectId: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error) throw error;
  return data;
}

export async function getChallengeSubmissions(userId: string) {
  const { data, error } = await supabase
    .from("challenge_submissions")
    .select(
      `
      id,
      user_id,
      user_code,
      score,
      feedback,
      comparison,
      challenge_id,
      challenges (
        level,
        file_path,
        created_at,
        projects (
          name
        )
      )
    `,
    )
    .eq("user_id", userId);

  if (error) throw error;
  return data;
}

export async function getSubmissionById(submissionId: string) {
  const { data, error } = await supabase
    .from("challenge_submissions")
    .select(
      `
      *,
      challenges (
        level,
        original_code,
        modified_code,
        file_path,
        projects (
          name
        )
      )
    `,
    )
    .eq("id", submissionId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserProgress(
  userId: string,
  updates: {
    projects_analyzed?: number;
    challenges_completed?: number;
    average_score?: number;
  },
) {
  const { error } = await supabase
    .from("user_progress")
    .upsert([{ user_id: userId, ...updates }], {
      onConflict: "user_id",
    });

  if (error) throw error;
}
