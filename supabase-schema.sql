-- ============================================
-- MAKETH VISION — Supabase Database Schema
-- Created by: Joshua Amuthanilavan
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || LEFT(NEW.id::text, 8)),
    NEW.email,
    NEW.phone
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT
  USING (true);

-- Seed categories
INSERT INTO public.categories (name, slug, icon, color) VALUES
  ('Fantasy', 'fantasy', '🐉', '#8B5CF6'),
  ('Horror', 'horror', '👻', '#EF4444'),
  ('Love', 'love', '❤️', '#EC4899'),
  ('Motivation', 'motivation', '🔥', '#F59E0B'),
  ('Adventure', 'adventure', '⚔️', '#10B981'),
  ('Sci-Fi', 'sci-fi', '🚀', '#3B82F6'),
  ('Kids', 'kids', '🧸', '#F97316'),
  ('Mystery', 'mystery', '🔍', '#6366F1')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 3. STORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category_id INT REFERENCES public.categories(id),
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'doc', 'docx', 'ppt', 'pptx')),
  file_name TEXT,
  file_size BIGINT CHECK (file_size <= 10485760), -- 10MB max
  thumbnail_url TEXT NOT NULL,
  likes_count INT DEFAULT 0,
  views_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- Anyone can view stories
CREATE POLICY "Stories are viewable by everyone"
  ON public.stories FOR SELECT
  USING (true);

-- Authenticated users can insert (with 12-story limit enforced in API)
CREATE POLICY "Authenticated users can insert stories"
  ON public.stories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own stories
CREATE POLICY "Users can update their own stories"
  ON public.stories FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own stories
CREATE POLICY "Users can delete their own stories"
  ON public.stories FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 4. LIKES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, story_id)
);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes are viewable by everyone"
  ON public.likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert likes"
  ON public.likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON public.likes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 5. SAVED STORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.saved_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, story_id)
);

ALTER TABLE public.saved_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved stories"
  ON public.saved_stories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can save stories"
  ON public.saved_stories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave stories"
  ON public.saved_stories FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 6. FUNCTIONS
-- ============================================

-- Function to increment view count
CREATE OR REPLACE FUNCTION public.increment_view_count(story_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.stories
  SET views_count = views_count + 1
  WHERE id = story_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update likes count
CREATE OR REPLACE FUNCTION public.update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.stories SET likes_count = likes_count + 1 WHERE id = NEW.story_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.stories SET likes_count = likes_count - 1 WHERE id = OLD.story_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_like_change ON public.likes;
CREATE TRIGGER on_like_change
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.update_likes_count();

-- Function to get user story count
CREATE OR REPLACE FUNCTION public.get_user_story_count(user_uuid UUID)
RETURNS INT AS $$
DECLARE
  count INT;
BEGIN
  SELECT COUNT(*) INTO count FROM public.stories WHERE user_id = user_uuid;
  RETURN count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_stories_user_id ON public.stories(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_category_id ON public.stories(category_id);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON public.stories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_likes_user_story ON public.likes(user_id, story_id);
CREATE INDEX IF NOT EXISTS idx_saved_user_story ON public.saved_stories(user_id, story_id);

-- ============================================
-- 8. STORAGE BUCKETS (run via Supabase Dashboard)
-- ============================================
-- Create these buckets in Supabase Dashboard > Storage:
-- 1. "stories" bucket (public access for reading)
-- 2. "thumbnails" bucket (public access for reading)
--
-- Or via SQL:
INSERT INTO storage.buckets (id, name, public) VALUES ('stories', 'stories', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('thumbnails', 'thumbnails', true) ON CONFLICT DO NOTHING;

-- Storage policies for 'stories' bucket
CREATE POLICY "Anyone can view story files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'stories');

CREATE POLICY "Authenticated users can upload story files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'stories' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own story files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'stories' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for 'thumbnails' bucket
CREATE POLICY "Anyone can view thumbnails"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'thumbnails');

CREATE POLICY "Authenticated users can upload thumbnails"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'thumbnails' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own thumbnails"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'thumbnails' AND auth.uid()::text = (storage.foldername(name))[1]);
