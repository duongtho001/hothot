-- ============================================
-- Thêm thể loại mới cho ComicVerse
-- Chạy trong Supabase SQL Editor
-- ============================================

INSERT INTO genres (name, slug, icon) VALUES
  ('Đô Thị', 'urban', '🏙️'),
  ('Thương Trường', 'business', '💰'),
  ('Khoa Huyễn', 'scifantasy', '🔬'),
  ('Huyền Huyễn', 'xuanhuan', '🌌'),
  ('Hệ Thống', 'system', '📊'),
  ('Linh Dị', 'supernatural', '👁️'),
  ('Ma/Kinh Dị', 'ghost', '💀'),
  ('Tâm Linh/Phong Thủy', 'spiritual', '🧿'),
  ('Bựa/Hài Hước', 'comedy-parody', '🤣'),
  ('Chính Kịch', 'drama', '🎭'),
  ('Tu Tiên', 'xianxia', '☯️'),
  ('Võ Lâm', 'murim', '🥋'),
  ('Đời Thường', 'slice-of-life', '☕'),
  ('Thể Thao', 'sports', '⚽'),
  ('Robot', 'mecha', '🤖'),
  ('Game/Dungeon', 'litrpg', '🎮'),
  ('Quân Sự', 'military', '🎖️'),
  ('Giật Gân', 'thriller', '😰'),
  ('Lịch Sử', 'historical', '📜'),
  ('Học Đường', 'school-life', '🏫'),
  ('Siêu Anh Hùng', 'superhero', '🦸'),
  ('KHVT/Cyberpunk', 'scifi', '🚀'),
  ('Xuyên Không', 'isekai', '🔄'),
  ('Kiếm Hiệp', 'wuxia', '🗡️')
ON CONFLICT (slug) DO NOTHING;
