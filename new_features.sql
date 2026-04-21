-- ============================================
-- ComicVerse - Tính Năng Mới
-- Chạy trong Supabase SQL Editor
-- ============================================

-- 1. Thêm contribution_points vào profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS contribution_points INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_checkin DATE;

-- 2. DAILY CHECK-IN (Điểm danh hàng ngày)
CREATE TABLE IF NOT EXISTS daily_checkins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  checked_at DATE DEFAULT CURRENT_DATE NOT NULL,
  points_earned INT DEFAULT 6,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, checked_at)
);

ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own checkins" ON daily_checkins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own checkins" ON daily_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. COMIC RATINGS (Đánh giá truyện)
CREATE TABLE IF NOT EXISTS comic_ratings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  comic_id UUID REFERENCES comics(id) ON DELETE CASCADE NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, comic_id)
);

ALTER TABLE comic_ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ratings are publicly readable" ON comic_ratings FOR SELECT USING (true);
CREATE POLICY "Users can manage own ratings" ON comic_ratings FOR ALL USING (auth.uid() = user_id);

-- 4. COMMENTS (Bình luận)
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  comic_id UUID REFERENCES comics(id) ON DELETE CASCADE NOT NULL,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) <= 1000),
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments are publicly readable" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- 5. COMIC SHARES (Chia sẻ truyện)
CREATE TABLE IF NOT EXISTS comic_shares (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  comic_id UUID REFERENCES comics(id) ON DELETE CASCADE NOT NULL,
  platform TEXT DEFAULT 'facebook' CHECK (platform IN ('facebook', 'twitter', 'telegram', 'other')),
  points_earned INT DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE comic_shares ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Shares are publicly readable" ON comic_shares FOR SELECT USING (true);
CREATE POLICY "Users can create shares" ON comic_shares FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. INDEXES
CREATE INDEX IF NOT EXISTS idx_checkins_user ON daily_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_comic ON comic_ratings(comic_id);
CREATE INDEX IF NOT EXISTS idx_comments_comic ON comments(comic_id);
CREATE INDEX IF NOT EXISTS idx_comments_chapter ON comments(chapter_id);
CREATE INDEX IF NOT EXISTS idx_shares_comic ON comic_shares(comic_id);

-- 7. Add share_count to comics
ALTER TABLE comics ADD COLUMN IF NOT EXISTS share_count INT DEFAULT 0;

-- 8. Function to update comic average rating
CREATE OR REPLACE FUNCTION update_comic_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE comics SET rating = (
    SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 0)
    FROM comic_ratings WHERE comic_id = COALESCE(NEW.comic_id, OLD.comic_id)
  ) WHERE id = COALESCE(NEW.comic_id, OLD.comic_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_rating_update ON comic_ratings;
CREATE TRIGGER tr_rating_update
  AFTER INSERT OR UPDATE OR DELETE ON comic_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_comic_rating();

-- 9. Function for daily check-in
CREATE OR REPLACE FUNCTION do_daily_checkin(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_already_checked BOOLEAN;
  v_points INT := 6;
BEGIN
  -- Check if already checked in today
  SELECT EXISTS(
    SELECT 1 FROM daily_checkins WHERE user_id = p_user_id AND checked_at = v_today
  ) INTO v_already_checked;
  
  IF v_already_checked THEN
    RETURN json_build_object('success', false, 'message', 'Đã điểm danh hôm nay rồi!');
  END IF;
  
  -- Insert check-in
  INSERT INTO daily_checkins (user_id, checked_at, points_earned)
  VALUES (p_user_id, v_today, v_points);
  
  -- Update profile points
  UPDATE profiles SET 
    contribution_points = COALESCE(contribution_points, 0) + v_points,
    last_checkin = v_today
  WHERE id = p_user_id;
  
  RETURN json_build_object(
    'success', true, 
    'points_earned', v_points,
    'message', 'Điểm danh thành công! +' || v_points || ' điểm cống hiến'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
