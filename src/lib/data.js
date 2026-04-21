// Truyện Tranh AI — Genres matched from ComicGenius tool
// COMICS array is empty — all data comes from Supabase

export const GENRES = [
  { id: 'action', name: 'Hành Động/Phiêu Lưu', icon: '⚔️', slug: 'action' },
  { id: 'chuyen-sinh', name: 'Tái Sinh/Hồi Quy', icon: '🔄', slug: 'chuyen-sinh' },
  { id: 'mature', name: 'Người Lớn/Tâm Lý', icon: '🧠', slug: 'mature' },
  { id: 'kodomo', name: 'Kodomo', icon: '🧒', slug: 'kodomo' },
  { id: 'wuxia', name: 'Cổ Trang Võ Hiệp', icon: '🥋', slug: 'wuxia' },
  { id: 'fantasy', name: 'Phép Thuật', icon: '🧙', slug: 'fantasy' },
  { id: 'superhero', name: 'Siêu Anh Hùng', icon: '🦸', slug: 'superhero' },
  { id: 'sci-fi', name: 'Công Nghệ Tương Lai', icon: '🚀', slug: 'sci-fi' },
  { id: 'horror', name: 'Kinh Dị', icon: '👻', slug: 'horror' },
  { id: 'romance', name: 'Lãng Mạn', icon: '💕', slug: 'romance' },
  { id: 'school-life', name: 'Trường Học', icon: '🏫', slug: 'school-life' },
  { id: 'xianxia', name: 'Tu Tiên', icon: '✨', slug: 'xianxia' },
  { id: 'murim', name: 'Võ Lâm', icon: '🗡️', slug: 'murim' },
  { id: 'slice-of-life', name: 'Đời Thường', icon: '☀️', slug: 'slice-of-life' },
  { id: 'sports', name: 'Thể Thao', icon: '⚽', slug: 'sports' },
  { id: 'detective', name: 'Trinh Thám', icon: '🔍', slug: 'detective' },
  { id: 'mecha', name: 'Người Máy', icon: '🤖', slug: 'mecha' },
  { id: 'game', name: 'Game/Isekai', icon: '🎮', slug: 'game' },
  { id: 'military', name: 'Chiến Tranh', icon: '⚔️', slug: 'military' },
  { id: 'thriller', name: 'Hồi Hộp', icon: '😱', slug: 'thriller' },
  { id: 'historical', name: 'Cổ Trang', icon: '🏯', slug: 'historical' },
];

// Empty — user uploads their own comics via admin panel
export const COMICS = [];

// Helper functions
export function getComicBySlug(slug) {
  return COMICS.find(c => c.slug === slug) || null;
}

export function getChapter(comic, chapterNum) {
  return (comic?.chapters || []).find(ch => ch.number === chapterNum) || null;
}

export function getGenreBySlug(slug) {
  return GENRES.find(g => g.slug === slug) || null;
}

export function getComicsByGenre(genreSlug) {
  return COMICS.filter(c => (c.genres || []).includes(genreSlug));
}

export function getTopComics(limit = 10) {
  return [...COMICS].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, limit);
}

export function getLatestComics(limit = 12) {
  return [...COMICS].sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)).slice(0, limit);
}

export function getFeaturedComics() {
  return COMICS.filter(c => c.isFeatured);
}

export function formatViews(count) {
  if (!count) return '0';
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
  return count.toString();
}

export function getStatusLabel(status) {
  return status === 'completed' ? 'Hoàn Thành' : 'Đang Ra';
}

export function getGenreNames(genreIds) {
  return (genreIds || []).map(id => GENRES.find(g => g.id === id)?.name).filter(Boolean);
}
