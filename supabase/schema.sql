-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    repo_url TEXT NOT NULL,
    user_id UUID,
    files JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Challenges table
CREATE TABLE IF NOT EXISTS challenges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    level TEXT NOT NULL CHECK (level IN ('easy', 'medium', 'hard')),
    original_code TEXT NOT NULL,
    modified_code TEXT NOT NULL,
    file_path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Challenge submissions table
CREATE TABLE IF NOT EXISTS challenge_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    user_id UUID,
    user_code TEXT NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    feedback TEXT,
    comparison TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL,
    projects_analyzed INTEGER DEFAULT 0,
    challenges_completed INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_project_id ON challenges(project_id);
CREATE INDEX IF NOT EXISTS idx_submissions_challenge_id ON challenge_submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON challenge_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON user_progress(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies (basic public access for now)
CREATE POLICY "Enable read access for all users" ON projects FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON projects FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON challenges FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON challenges FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON challenge_submissions FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON challenge_submissions FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON user_progress FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON user_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON user_progress FOR UPDATE USING (true);
