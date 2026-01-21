import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are not set");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}
