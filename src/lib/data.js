// Mock data for Truyện Tranh AI — Genres matched from ComicGenius tool

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

export const COMICS = [
  {
    id: '1',
    title: 'Võ Luyện Đỉnh Phong',
    slug: 'vo-luyen-dinh-phong',
    description: 'Thế giới tu luyện, mạnh giả vi tôn! Dương Khai từ một thanh niên bình thường tu luyện thành đệ nhất cao thủ thiên hạ.',
    cover: 'https://picsum.photos/seed/comic1/400/711',
    author: 'AI Studio',
    status: 'ongoing',
    genres: ['action', 'wuxia', 'xianxia'],
    viewCount: 2850000,
    rating: 4.8,
    freeChapters: 999,
    isFeatured: true,
    latestChapter: 38,
    updatedAt: '2026-04-21',
    chapters: generateChapters(38, 999),
  },
  {
    id: '2',
    title: 'Hồi Sinh Tại Thế Giới Game',
    slug: 'hoi-sinh-tai-the-gioi-game',
    description: 'Sau khi chết, được hồi sinh trong thế giới game với hệ thống level up. Cuộc hành trình chinh phục đỉnh cao bắt đầu!',
    cover: 'https://picsum.photos/seed/comic2/400/711',
    author: 'AI Studio',
    status: 'ongoing',
    genres: ['game', 'action', 'chuyen-sinh'],
    viewCount: 1520000,
    rating: 4.7,
    freeChapters: 999,
    isFeatured: true,
    latestChapter: 25,
    updatedAt: '2026-04-21',
    chapters: generateChapters(25, 999),
  },
  {
    id: '3',
    title: 'Thám Tử Bóng Đêm',
    slug: 'tham-tu-bong-dem',
    description: 'Trong thành phố đầy tội ác, một thám tử bí ẩn sử dụng khả năng siêu nhiên để phá giải những vụ án kinh hoàng.',
    cover: 'https://picsum.photos/seed/comic3/400/711',
    author: 'AI Studio',
    status: 'ongoing',
    genres: ['detective', 'thriller', 'mature'],
    viewCount: 980000,
    rating: 4.6,
    freeChapters: 999,
    isFeatured: true,
    latestChapter: 18,
    updatedAt: '2026-04-20',
    chapters: generateChapters(18, 999),
  },
  {
    id: '4',
    title: 'Tái Sinh Đô Thị Tu Tiên',
    slug: 'tai-sinh-do-thi-tu-tien',
    description: 'Tu tiên giả mạnh nhất bị phản bội, trọng sinh về thời điểm còn là thanh niên. Quyết tâm xây dựng lại đế chế tu luyện.',
    cover: 'https://picsum.photos/seed/comic4/400/711',
    author: 'AI Studio',
    status: 'ongoing',
    genres: ['chuyen-sinh', 'xianxia', 'action'],
    viewCount: 1850000,
    rating: 4.5,
    freeChapters: 999,
    isFeatured: false,
    latestChapter: 30,
    updatedAt: '2026-04-20',
    chapters: generateChapters(30, 999),
  },
  {
    id: '5',
    title: 'Vạn Cổ Thần Vương',
    slug: 'van-co-than-vuong',
    description: 'Thiếu niên mang trong mình dòng máu thần bí, bước vào con đường trở thành Thần Vương tối cao, chinh phục vạn giới.',
    cover: 'https://picsum.photos/seed/comic5/400/711',
    author: 'AI Studio',
    status: 'ongoing',
    genres: ['wuxia', 'fantasy', 'action'],
    viewCount: 780000,
    rating: 4.3,
    freeChapters: 999,
    isFeatured: false,
    latestChapter: 22,
    updatedAt: '2026-04-19',
    chapters: generateChapters(22, 999),
  },
  {
    id: '6',
    title: 'Pháp Sư Lửa Thiêng',
    slug: 'phap-su-lua-thieng',
    description: 'Trong thế giới phép thuật, cậu bé mồ côi phát hiện mình có khả năng điều khiển lửa thần. Cuộc chiến giữa ánh sáng và bóng tối bắt đầu.',
    cover: 'https://picsum.photos/seed/comic6/400/711',
    author: 'AI Studio',
    status: 'ongoing',
    genres: ['fantasy', 'action', 'school-life'],
    viewCount: 650000,
    rating: 4.4,
    freeChapters: 999,
    isFeatured: false,
    latestChapter: 15,
    updatedAt: '2026-04-19',
    chapters: generateChapters(15, 999),
  },
  {
    id: '7',
    title: 'Mùa Hè Năm Ấy',
    slug: 'mua-he-nam-ay',
    description: 'Câu chuyện tình yêu tuổi học trò ngọt ngào, khi mùa hè đến mang theo rung động đầu đời.',
    cover: 'https://picsum.photos/seed/comic7/400/711',
    author: 'AI Studio',
    status: 'completed',
    genres: ['romance', 'school-life', 'slice-of-life'],
    viewCount: 340000,
    rating: 4.6,
    freeChapters: 999,
    isFeatured: false,
    latestChapter: 12,
    updatedAt: '2026-04-18',
    chapters: generateChapters(12, 999),
  },
  {
    id: '8',
    title: 'Siêu Anh Hùng Học Đường',
    slug: 'sieu-anh-hung-hoc-duong',
    description: 'Khi siêu năng lực xuất hiện ở học sinh cấp 3, trường học trở thành chiến trường! Hài hước và hành động đầy kịch tính.',
    cover: 'https://picsum.photos/seed/comic8/400/711',
    author: 'AI Studio',
    status: 'ongoing',
    genres: ['superhero', 'school-life', 'action'],
    viewCount: 520000,
    rating: 4.5,
    freeChapters: 999,
    isFeatured: false,
    latestChapter: 20,
    updatedAt: '2026-04-18',
    chapters: generateChapters(20, 999),
  },
  {
    id: '9',
    title: 'Cỗ Máy Chiến Tranh',
    slug: 'co-may-chien-tranh',
    description: 'Năm 2150, robot chiến đấu trở thành vũ khí quyết định. Người lái máy trẻ tuổi phải bảo vệ nhân loại.',
    cover: 'https://picsum.photos/seed/comic9/400/711',
    author: 'AI Studio',
    status: 'ongoing',
    genres: ['mecha', 'sci-fi', 'military'],
    viewCount: 420000,
    rating: 4.2,
    freeChapters: 999,
    isFeatured: false,
    latestChapter: 16,
    updatedAt: '2026-04-17',
    chapters: generateChapters(16, 999),
  },
  {
    id: '10',
    title: 'Kiếm Khách Cổ Trang',
    slug: 'kiem-khach-co-trang',
    description: 'Kiếm khách vô danh lang thang giữa thiên hạ loạn lạc, dùng kiếm bảo vệ kẻ yếu và tìm ý nghĩa kiếm đạo.',
    cover: 'https://picsum.photos/seed/comic10/400/711',
    author: 'AI Studio',
    status: 'completed',
    genres: ['historical', 'wuxia', 'action'],
    viewCount: 390000,
    rating: 4.7,
    freeChapters: 999,
    isFeatured: false,
    latestChapter: 24,
    updatedAt: '2026-04-15',
    chapters: generateChapters(24, 999),
  },
  {
    id: '11',
    title: 'Bóng Ma Đêm',
    slug: 'bong-ma-dem',
    description: 'Những câu chuyện kinh dị rùng rợn xảy ra trong khu phố cổ bí ẩn. Liệu ai có thể sống sót?',
    cover: 'https://picsum.photos/seed/comic11/400/711',
    author: 'AI Studio',
    status: 'ongoing',
    genres: ['horror', 'thriller', 'mature'],
    viewCount: 280000,
    rating: 4.4,
    freeChapters: 999,
    isFeatured: false,
    latestChapter: 10,
    updatedAt: '2026-04-16',
    chapters: generateChapters(10, 999),
  },
  {
    id: '12',
    title: 'Vua Bóng Đá',
    slug: 'vua-bong-da',
    description: 'Hành trình từ cậu bé đường phố trở thành cầu thủ huyền thoại. Mồ hôi, nước mắt và đam mê!',
    cover: 'https://picsum.photos/seed/comic12/400/711',
    author: 'AI Studio',
    status: 'ongoing',
    genres: ['sports', 'slice-of-life'],
    viewCount: 210000,
    rating: 4.3,
    freeChapters: 999,
    isFeatured: false,
    latestChapter: 14,
    updatedAt: '2026-04-17',
    chapters: generateChapters(14, 999),
  },
];

function generateChapters(totalChapters, freeChapters) {
  const chapters = [];
  for (let i = totalChapters; i >= Math.max(1, totalChapters - 99); i--) {
    const daysAgo = totalChapters - i;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    chapters.push({
      id: `ch-${i}`,
      number: i,
      title: `Chương ${i}`,
      isFree: true,
      viewCount: Math.floor(Math.random() * 50000) + 1000,
      createdAt: date.toISOString().split('T')[0],
      pages: generatePages(i),
    });
  }
  return chapters;
}

function generatePages(chapterNum) {
  const pageCount = Math.floor(Math.random() * 6) + 8;
  return Array.from({ length: pageCount }, (_, i) => ({
    id: `page-${chapterNum}-${i + 1}`,
    url: `https://picsum.photos/seed/ch${chapterNum}p${i + 1}/800/1200`,
    order: i + 1,
  }));
}

// Helper functions
export function getComicBySlug(slug) {
  return COMICS.find(c => c.slug === slug) || null;
}

export function getChapter(comic, chapterNum) {
  return comic.chapters.find(ch => ch.number === chapterNum) || null;
}

export function getGenreBySlug(slug) {
  return GENRES.find(g => g.slug === slug) || null;
}

export function getComicsByGenre(genreSlug) {
  return COMICS.filter(c => c.genres.includes(genreSlug));
}

export function getTopComics(limit = 10) {
  return [...COMICS].sort((a, b) => b.viewCount - a.viewCount).slice(0, limit);
}

export function getLatestComics(limit = 12) {
  return [...COMICS].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, limit);
}

export function getFeaturedComics() {
  return COMICS.filter(c => c.isFeatured);
}

export function formatViews(count) {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
  return count.toString();
}

export function getStatusLabel(status) {
  return status === 'completed' ? 'Hoàn Thành' : 'Đang Ra';
}

export function getGenreNames(genreIds) {
  return genreIds.map(id => GENRES.find(g => g.id === id)?.name).filter(Boolean);
}
