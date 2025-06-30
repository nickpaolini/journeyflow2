# JourneyFlow Deployment Guide

## Prerequisites

Before deploying to Vercel, you'll need to set up the following services:

### 1. Supabase Setup
1. Go to [Supabase](https://supabase.com) and create a new project
2. Get your project URL and anon key from Settings > API
3. Create the following tables in your Supabase database:

```sql
-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_public BOOLEAN DEFAULT false
);

-- Journey steps table
CREATE TABLE journey_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  step_type TEXT,
  step_color TEXT,
  custom_color_override BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Connections table
CREATE TABLE connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  from_step_id UUID REFERENCES journey_steps(id) ON DELETE CASCADE,
  to_step_id UUID REFERENCES journey_steps(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- Similar policies for journey_steps and connections
CREATE POLICY "Users can view steps in their projects" ON journey_steps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = journey_steps.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert steps in their projects" ON journey_steps
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = journey_steps.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update steps in their projects" ON journey_steps
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = journey_steps.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete steps in their projects" ON journey_steps
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = journey_steps.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view connections in their projects" ON connections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = connections.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert connections in their projects" ON connections
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = connections.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update connections in their projects" ON connections
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = connections.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete connections in their projects" ON connections
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = connections.project_id 
      AND projects.user_id = auth.uid()
    )
  );
```

### 2. OpenAI Setup
1. Go to [OpenAI](https://platform.openai.com) and create an account
2. Generate an API key from the API Keys section

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
```

## Vercel Deployment

### 1. Push to Git
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin your-github-repo-url
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to [Vercel](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Add the environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
5. Deploy!

### 3. Configure Supabase Auth
1. In your Supabase dashboard, go to Authentication > URL Configuration
2. Add your Vercel domain to the Site URL
3. Add your Vercel domain to the Redirect URLs (e.g., `https://your-app.vercel.app/auth/callback`)

## Post-Deployment

1. Test the authentication flow
2. Test creating and saving projects
3. Test the AI journey generation feature
4. Monitor the Vercel function logs for any errors

## Troubleshooting

### Common Issues:
1. **CORS errors**: Make sure your Supabase project allows your Vercel domain
2. **Authentication errors**: Check that your Supabase auth URLs are configured correctly
3. **Database errors**: Ensure your Supabase tables and policies are set up correctly
4. **AI generation errors**: Verify your OpenAI API key is valid and has sufficient credits

### Local Development:
```bash
npm run dev
```

### Build for Production:
```bash
npm run build
npm start
``` 