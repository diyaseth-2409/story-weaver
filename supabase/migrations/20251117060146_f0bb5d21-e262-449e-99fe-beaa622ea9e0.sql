-- Articles table for storing news articles
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT,
  keywords TEXT[],
  category TEXT,
  published_at TIMESTAMPTZ,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Video projects table
CREATE TABLE public.video_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id UUID REFERENCES public.articles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  keywords TEXT[],
  aspect_ratio TEXT NOT NULL DEFAULT '16:9' CHECK (aspect_ratio IN ('16:9', '9:16', '1:1')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'ready', 'rendering', 'completed', 'failed')),
  template_id UUID,
  duration INTEGER DEFAULT 30,
  fps INTEGER DEFAULT 30,
  output_url TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Video slides table
CREATE TABLE public.video_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.video_projects(id) ON DELETE CASCADE,
  slide_order INTEGER NOT NULL,
  text_content TEXT,
  image_url TEXT,
  duration REAL DEFAULT 3.0,
  transition_type TEXT DEFAULT 'fade',
  animation_effect TEXT,
  background_color TEXT,
  text_style JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, slide_order)
);

-- Video templates table
CREATE TABLE public.video_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  category TEXT,
  default_settings JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Assets library table (images, videos, audio)
CREATE TABLE public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('image', 'video', 'audio', 'logo')),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  file_size INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Themes table
CREATE TABLE public.themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  colors JSONB DEFAULT '{}'::jsonb,
  fonts JSONB DEFAULT '{}'::jsonb,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Audio tracks table
CREATE TABLE public.audio_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  duration REAL,
  category TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Render jobs queue
CREATE TABLE public.render_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.video_projects(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  progress INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.render_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for articles (public read)
CREATE POLICY "Articles are viewable by everyone"
  ON public.articles FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create articles"
  ON public.articles FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for video_projects
CREATE POLICY "Users can view their own projects"
  ON public.video_projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
  ON public.video_projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON public.video_projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON public.video_projects FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for video_slides
CREATE POLICY "Users can view slides of their projects"
  ON public.video_slides FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.video_projects
    WHERE video_projects.id = video_slides.project_id
    AND video_projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create slides in their projects"
  ON public.video_slides FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.video_projects
    WHERE video_projects.id = video_slides.project_id
    AND video_projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update slides in their projects"
  ON public.video_slides FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.video_projects
    WHERE video_projects.id = video_slides.project_id
    AND video_projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete slides in their projects"
  ON public.video_slides FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.video_projects
    WHERE video_projects.id = video_slides.project_id
    AND video_projects.user_id = auth.uid()
  ));

-- RLS Policies for templates (public read)
CREATE POLICY "Templates are viewable by everyone"
  ON public.video_templates FOR SELECT
  USING (is_active = true);

-- RLS Policies for assets
CREATE POLICY "Users can view their own assets"
  ON public.assets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assets"
  ON public.assets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assets"
  ON public.assets FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for themes (public read)
CREATE POLICY "Themes are viewable by everyone"
  ON public.themes FOR SELECT
  USING (true);

-- RLS Policies for audio_tracks (public read)
CREATE POLICY "Audio tracks are viewable by everyone"
  ON public.audio_tracks FOR SELECT
  USING (true);

-- RLS Policies for render_jobs
CREATE POLICY "Users can view their own render jobs"
  ON public.render_jobs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.video_projects
    WHERE video_projects.id = render_jobs.project_id
    AND video_projects.user_id = auth.uid()
  ));

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_projects_updated_at BEFORE UPDATE ON public.video_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_slides_updated_at BEFORE UPDATE ON public.video_slides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX idx_articles_category ON public.articles(category);
CREATE INDEX idx_video_projects_user_id ON public.video_projects(user_id);
CREATE INDEX idx_video_projects_status ON public.video_projects(status);
CREATE INDEX idx_video_slides_project_id ON public.video_slides(project_id);
CREATE INDEX idx_video_slides_order ON public.video_slides(project_id, slide_order);
CREATE INDEX idx_assets_user_id ON public.assets(user_id);
CREATE INDEX idx_assets_type ON public.assets(asset_type);
CREATE INDEX idx_render_jobs_project_id ON public.render_jobs(project_id);
CREATE INDEX idx_render_jobs_status ON public.render_jobs(status);

-- Insert sample templates
INSERT INTO public.video_templates (name, description, thumbnail_url, category, default_settings) VALUES
  ('News Breaking', 'Bold breaking news style with red accents', 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400', 'news', '{"transition": "slide", "duration": 5}'::jsonb),
  ('Classic Report', 'Traditional news reporting format', 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400', 'news', '{"transition": "fade", "duration": 4}'::jsonb),
  ('Modern Minimal', 'Clean and minimal design', 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400', 'minimal', '{"transition": "fade", "duration": 6}'::jsonb),
  ('Dynamic Sports', 'High-energy sports template', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400', 'sports', '{"transition": "zoom", "duration": 3}'::jsonb);

-- Insert sample audio tracks
INSERT INTO public.audio_tracks (name, url, duration, category, is_premium) VALUES
  ('Corporate Background', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 30, 'corporate', false),
  ('News Intro', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 15, 'news', false),
  ('Upbeat Energy', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 30, 'energetic', false);

-- Insert sample themes
INSERT INTO public.themes (name, colors, fonts, is_default) VALUES
  ('Times of India', '{"primary": "#C8102E", "secondary": "#1A1A1A", "accent": "#D4AF37"}'::jsonb, '{"heading": "Merriweather", "body": "Open Sans"}'::jsonb, true),
  ('Modern Blue', '{"primary": "#0066CC", "secondary": "#333333", "accent": "#00AAFF"}'::jsonb, '{"heading": "Roboto", "body": "Inter"}'::jsonb, false),
  ('Dark Elegant', '{"primary": "#8B0000", "secondary": "#000000", "accent": "#FFD700"}'::jsonb, '{"heading": "Playfair Display", "body": "Lato"}'::jsonb, false);