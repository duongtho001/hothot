-- ============================================
-- ComicVerse Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========== GENRES ==========
CREATE TABLE IF NOT EXISTS genres (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT '📖',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== COMICS ==========
CREATE TABLE IF NOT EXISTS comics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  cover_url TEXT DEFAULT '',
  author TEXT DEFAULT 'Unknown',
  status TEXT DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed', 'hiatus')),
  view_count BIGINT DEFAULT 0,
  rating NUMERIC(3,1) DEFAULT 0,
  free_chapters INT DEFAULT 5,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== COMIC_GENRES (junction) ==========
CREATE TABLE IF NOT EXISTS comic_genres (
  comic_id UUID REFERENCES comics(id) ON DELETE CASCADE,
  genre_id UUID REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (comic_id, genre_id)
);

-- ========== CHAPTERS ==========
CREATE TABLE IF NOT EXISTS chapters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  comic_id UUID REFERENCES comics(id) ON DELETE CASCADE NOT NULL,
  chapter_number INT NOT NULL,
  title TEXT DEFAULT '',
  pages JSONB DEFAULT '[]'::jsonb,
  is_free BOOLEAN DEFAULT TRUE,
  view_count BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comic_id, chapter_number)
);

-- ========== USERS PROFILE ==========
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'vip')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== VIP SUBSCRIPTIONS ==========
CREATE TABLE IF NOT EXISTS vip_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('7d', '30d', '90d', 'lifetime')),
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  activation_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== VIP CODES ==========
CREATE TABLE IF NOT EXISTS vip_codes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  plan TEXT NOT NULL CHECK (plan IN ('7d', '30d', '90d', 'lifetime')),
  is_used BOOLEAN DEFAULT FALSE,
  used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ
);

-- ========== BOOKMARKS ==========
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  comic_id UUID REFERENCES comics(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, comic_id)
);

-- ========== READING HISTORY ==========
CREATE TABLE IF NOT EXISTS reading_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  comic_id UUID REFERENCES comics(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  chapter_number INT DEFAULT 0,
  scroll_position INT DEFAULT 0,
  last_read TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, comic_id)
);

-- ========== INDEXES ==========
CREATE INDEX IF NOT EXISTS idx_comics_slug ON comics(slug);
CREATE INDEX IF NOT EXISTS idx_comics_updated ON comics(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_comics_views ON comics(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_chapters_comic ON chapters(comic_id, chapter_number);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_user ON reading_history(user_id);

-- ========== UPDATED_AT TRIGGER ==========
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_comics_updated ON comics;
CREATE TRIGGER tr_comics_updated
  BEFORE UPDATE ON comics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ========== RLS POLICIES ==========
-- Comics: public read, admin write
ALTER TABLE comics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comics are publicly readable" ON comics FOR SELECT USING (true);
CREATE POLICY "Admin can manage comics" ON comics FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Chapters: public read, admin write
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Chapters are publicly readable" ON chapters FOR SELECT USING (true);
CREATE POLICY "Admin can manage chapters" ON chapters FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Genres: public read
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Genres are publicly readable" ON genres FOR SELECT USING (true);
CREATE POLICY "Admin can manage genres" ON genres FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Profiles: own read, admin all
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User can read own profile" ON profiles FOR SELECT USING (true);
CREATE POLICY "User can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin can manage profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Bookmarks: own only
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User manages own bookmarks" ON bookmarks FOR ALL USING (auth.uid() = user_id);

-- ========== SEED GENRES ==========
INSERT INTO genres (name, slug, icon) VALUES
  ('Action', 'action', '⚔️'),
  ('Romance', 'romance', '💕'),
  ('Fantasy', 'fantasy', '🧙'),
  ('Comedy', 'comedy', '😂'),
  ('Horror', 'horror', '👻'),
  ('Phiêu Lưu', 'adventure', '🗺️'),
  ('Võ Thuật', 'martial-arts', '🥋'),
  ('Shounen', 'shounen', '💪'),
  ('Manhua', 'manhua', '📖'),
  ('Manhwa', 'manhwa', '🇰🇷'),
  ('Webtoon', 'webtoon', '📱'),
  ('Chuyển Sinh', 'chuyen-sinh', '🔄'),
  ('Drama', 'drama', '🎭'),
  ('Trinh Thám', 'mystery', '🔍'),
  ('School Life', 'school-life', '🏫'),
  ('Siêu Nhiên', 'supernatural', '✨')
ON CONFLICT (slug) DO NOTHING;

-- ========== STORAGE BUCKET ==========
-- Create storage bucket for comic images (run in Supabase Dashboard > Storage)
-- Bucket name: comics
-- Public: true
