-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON projects;
DROP POLICY IF EXISTS "Enable insert for all users" ON projects;
DROP POLICY IF EXISTS "Enable update for all users" ON projects;

DROP POLICY IF EXISTS "Enable read access for all users" ON challenges;
DROP POLICY IF EXISTS "Enable insert for all users" ON challenges;

DROP POLICY IF EXISTS "Enable read access for all users" ON challenge_submissions;
DROP POLICY IF EXISTS "Enable insert for all users" ON challenge_submissions;

DROP POLICY IF EXISTS "Enable read access for all users" ON user_progress;
DROP POLICY IF EXISTS "Enable insert for all users" ON user_progress;
DROP POLICY IF EXISTS "Enable update for all users" ON user_progress;

-- Projects: Users can only see their own projects
CREATE POLICY "Users can view own projects" 
    ON projects FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" 
    ON projects FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" 
    ON projects FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" 
    ON projects FOR DELETE 
    USING (auth.uid() = user_id);

-- Challenges: Users can see challenges from their projects
CREATE POLICY "Users can view challenges from own projects" 
    ON challenges FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM projects 
        WHERE projects.id = challenges.project_id 
        AND projects.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert challenges to own projects" 
    ON challenges FOR INSERT 
    WITH CHECK (EXISTS (
        SELECT 1 FROM projects 
        WHERE projects.id = challenges.project_id 
        AND projects.user_id = auth.uid()
    ));

-- Challenge Submissions: Users can only see their own submissions
CREATE POLICY "Users can view own submissions" 
    ON challenge_submissions FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own submissions" 
    ON challenge_submissions FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- User Progress: Users can only see and update their own progress
CREATE POLICY "Users can view own progress" 
    ON user_progress FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" 
    ON user_progress FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" 
    ON user_progress FOR UPDATE 
    USING (auth.uid() = user_id);
