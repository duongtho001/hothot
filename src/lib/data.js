// Mock data for ComicVerse — replace with Supabase later

export const GENRES = [
  { id: 'action', name: 'Action', icon: '⚔️', slug: 'action' },
  { id: 'romance', name: 'Romance', icon: '💕', slug: 'romance' },
  { id: 'fantasy', name: 'Fantasy', icon: '🧙', slug: 'fantasy' },
  { id: 'comedy', name: 'Comedy', icon: '😂', slug: 'comedy' },
  { id: 'horror', name: 'Horror', icon: '👻', slug: 'horror' },
  { id: 'adventure', name: 'Phiêu Lưu', icon: '🗺️', slug: 'adventure' },
  { id: 'martial-arts', name: 'Võ Thuật', icon: '🥋', slug: 'martial-arts' },
  { id: 'shounen', name: 'Shounen', icon: '💪', slug: 'shounen' },
  { id: 'manhua', name: 'Manhua', icon: '📖', slug: 'manhua' },
  { id: 'manhwa', name: 'Manhwa', icon: '🇰🇷', slug: 'manhwa' },
  { id: 'webtoon', name: 'Webtoon', icon: '📱', slug: 'webtoon' },
  { id: 'chuyen-sinh', name: 'Chuyển Sinh', icon: '🔄', slug: 'chuyen-sinh' },
  { id: 'drama', name: 'Drama', icon: '🎭', slug: 'drama' },
  { id: 'mystery', name: 'Trinh Thám', icon: '🔍', slug: 'mystery' },
  { id: 'school-life', name: 'School Life', icon: '🏫', slug: 'school-life' },
  { id: 'supernatural', name: 'Siêu Nhiên', icon: '✨', slug: 'supernatural' },
];

export const COMICS = [
  {
    id: '1',
    title: 'Võ Luyện Đỉnh Phong',
    slug: 'vo-luyen-dinh-phong',
    description: 'Thế giới tu luyện, mạnh giả vi tôn! Dương Khai từ một thanh niên bình thường tu luyện thành đệ nhất cao thủ thiên hạ. Con đường tu luyện gian nan, nhưng với ý chí kiên cường và bất khuất, y từng bước bước lên đỉnh phong của thế giới võ học.',
    cover: 'https://picsum.photos/seed/comic1/400/560',
    author: 'Mạc Mặc',
    status: 'ongoing',
    genres: ['action', 'martial-arts', 'manhua', 'fantasy'],
    viewCount: 2850000,
    rating: 4.8,
    freeChapters: 50,
    isFeatured: true,
    latestChapter: 3860,
    updatedAt: '2026-04-20',
    chapters: generateChapters(3860, 50),
  },
  {
    id: '2',
    title: 'Đảo Hải Tặc',
    slug: 'dao-hai-tac',
    description: 'Monkey D. Luffy, cậu bé ăn phải trái ác quỷ Gomu Gomu, cùng băng hải tặc Mũ Rơm bắt đầu hành trình tìm kiếm kho báu One Piece để trở thành Vua Hải Tặc.',
    cover: 'https://picsum.photos/seed/comic2/400/560',
    author: 'Oda Eiichiro',
    status: 'ongoing',
    genres: ['action', 'adventure', 'shounen', 'comedy'],
    viewCount: 5200000,
    rating: 4.9,
    freeChapters: 100,
    isFeatured: true,
    latestChapter: 1179,
    updatedAt: '2026-04-20',
    chapters: generateChapters(1179, 100),
  },
  {
    id: '3',
    title: 'Thám Tử Lừng Danh Conan',
    slug: 'tham-tu-lung-danh-conan',
    description: 'Shinichi Kudo, thám tử học sinh nổi tiếng, bị tổ chức áo đen ép uống thuốc độc và biến thành đứa trẻ lớp 1. Dưới tên Edogawa Conan, cậu tiếp tục phá các vụ án.',
    cover: 'https://picsum.photos/seed/comic3/400/560',
    author: 'Gosho Aoyama',
    status: 'ongoing',
    genres: ['mystery', 'action', 'shounen', 'drama'],
    viewCount: 3100000,
    rating: 4.7,
    freeChapters: 80,
    isFeatured: true,
    latestChapter: 1160,
    updatedAt: '2026-04-20',
    chapters: generateChapters(1160, 80),
  },
  {
    id: '4',
    title: 'Trọng Sinh Đô Thị Tu Tiên',
    slug: 'trong-sinh-do-thi-tu-tien',
    description: 'Một tu tiên giả mạnh nhất bị phản bội và trọng sinh về thời điểm còn là thanh niên bình thường. Y quyết tâm sửa chữa sai lầm trong quá khứ, xây dựng lại đế chế tu luyện.',
    cover: 'https://picsum.photos/seed/comic4/400/560',
    author: 'Thập Nguyệt',
    status: 'ongoing',
    genres: ['chuyen-sinh', 'martial-arts', 'fantasy', 'action'],
    viewCount: 1850000,
    rating: 4.5,
    freeChapters: 30,
    isFeatured: false,
    latestChapter: 1135,
    updatedAt: '2026-04-20',
    chapters: generateChapters(1135, 30),
  },
  {
    id: '5',
    title: 'Vạn Cổ Thần Vương',
    slug: 'van-co-than-vuong',
    description: 'Thiếu niên Lâm Phong, mang trong mình dòng máu thần bí, bước vào con đường trở thành Thần Vương tối cao, chinh phục vạn giới.',
    cover: 'https://picsum.photos/seed/comic5/400/560',
    author: 'Phong Hỏa',
    status: 'ongoing',
    genres: ['martial-arts', 'fantasy', 'manhua', 'action'],
    viewCount: 980000,
    rating: 4.3,
    freeChapters: 20,
    isFeatured: false,
    latestChapter: 411,
    updatedAt: '2026-04-20',
    chapters: generateChapters(411, 20),
  },
  {
    id: '6',
    title: 'Toàn Chức Pháp Sư',
    slug: 'toan-chuc-phap-su',
    description: 'Trong thế giới nơi phép thuật thay thế khoa học, Mạc Phàm với khả năng sử dụng đồng thời nhiều hệ phép thuật, từng bước trở thành pháp sư mạnh nhất.',
    cover: 'https://picsum.photos/seed/comic6/400/560',
    author: 'Loạn',
    status: 'ongoing',
    genres: ['fantasy', 'action', 'manhua', 'school-life'],
    viewCount: 2100000,
    rating: 4.6,
    freeChapters: 40,
    isFeatured: false,
    latestChapter: 1181,
    updatedAt: '2026-04-19',
    chapters: generateChapters(1181, 40),
  },
  {
    id: '7',
    title: 'Hỏa Vũ Diệu Dương',
    slug: 'hoa-vu-dieu-duong',
    description: 'Lửa và ánh sáng, sức mạnh và số phận. Diệu Dương mang trong mình hỏa hồn thần bí, bước vào thế giới tu luyện đầy nguy hiểm và thách thức.',
    cover: 'https://picsum.photos/seed/comic7/400/560',
    author: 'Thiên Tàm',
    status: 'ongoing',
    genres: ['martial-arts', 'fantasy', 'manhua'],
    viewCount: 1450000,
    rating: 4.4,
    freeChapters: 35,
    isFeatured: false,
    latestChapter: 1154,
    updatedAt: '2026-04-19',
    chapters: generateChapters(1154, 35),
  },
  {
    id: '8',
    title: 'Anh Hùng Ta Không Làm Lâu Rồi',
    slug: 'anh-hung-ta-khong-lam-lau-roi',
    description: 'Một cựu anh hùng quyết định nghỉ hưu, nhưng thế giới cứ lôi kéo anh trở lại. Hài hước, hành động và những tình huống bất ngờ xảy ra liên tục.',
    cover: 'https://picsum.photos/seed/comic8/400/560',
    author: 'Hắc Gia',
    status: 'ongoing',
    genres: ['comedy', 'action', 'fantasy', 'manhwa'],
    viewCount: 780000,
    rating: 4.5,
    freeChapters: 25,
    isFeatured: false,
    latestChapter: 488,
    updatedAt: '2026-04-18',
    chapters: generateChapters(488, 25),
  },
  {
    id: '9',
    title: 'Kiếm Khách Lưu Lạc',
    slug: 'kiem-khach-luu-lac',
    description: 'Kiếm khách vô danh lang thang giữa thiên hạ loạn lạc, dùng kiếm để bảo vệ kẻ yếu và tìm kiếm ý nghĩa thật sự của kiếm đạo.',
    cover: 'https://picsum.photos/seed/comic9/400/560',
    author: 'Lạc Thiên',
    status: 'completed',
    genres: ['martial-arts', 'drama', 'action'],
    viewCount: 620000,
    rating: 4.7,
    freeChapters: 999,
    isFeatured: false,
    latestChapter: 256,
    updatedAt: '2026-04-15',
    chapters: generateChapters(256, 999),
  },
  {
    id: '10',
    title: 'Thiên Tài Triệu Hồi Sư',
    slug: 'thien-tai-trieu-hoi-su',
    description: 'Trong thế giới nơi triệu hồi sư có thể gọi ra sinh vật từ chiều không gian khác, một thiếu niên bình thường phát hiện mình có khả năng triệu hồi siêu phàm.',
    cover: 'https://picsum.photos/seed/comic10/400/560',
    author: 'Ngọc Tiêu',
    status: 'ongoing',
    genres: ['fantasy', 'action', 'shounen', 'supernatural'],
    viewCount: 450000,
    rating: 4.2,
    freeChapters: 15,
    isFeatured: false,
    latestChapter: 189,
    updatedAt: '2026-04-17',
    chapters: generateChapters(189, 15),
  },
  {
    id: '11',
    title: 'Mùa Hè Năm Ấy',
    slug: 'mua-he-nam-ay',
    description: 'Câu chuyện tình yêu tuổi học trò, khi mùa hè đến mang theo những rung động đầu đời. Nhẹ nhàng, ngọt ngào và đầy hoài niệm.',
    cover: 'https://picsum.photos/seed/comic11/400/560',
    author: 'Hoa Phượng',
    status: 'completed',
    genres: ['romance', 'school-life', 'drama'],
    viewCount: 340000,
    rating: 4.6,
    freeChapters: 999,
    isFeatured: false,
    latestChapter: 85,
    updatedAt: '2026-03-20',
    chapters: generateChapters(85, 999),
  },
  {
    id: '12',
    title: 'Ma Vương Học Đường',
    slug: 'ma-vuong-hoc-duong',
    description: 'Ma vương bất tử chuyển sinh thành học sinh cấp 3. Với sức mạnh tối thượng nhưng phải giấu bí mật, cuộc sống học đường trở nên vô cùng rắc rối.',
    cover: 'https://picsum.photos/seed/comic12/400/560',
    author: 'Bạch Dạ',
    status: 'ongoing',
    genres: ['comedy', 'fantasy', 'school-life', 'supernatural'],
    viewCount: 890000,
    rating: 4.4,
    freeChapters: 20,
    isFeatured: false,
    latestChapter: 312,
    updatedAt: '2026-04-18',
    chapters: generateChapters(312, 20),
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
      isFree: i <= freeChapters,
      viewCount: Math.floor(Math.random() * 50000) + 1000,
      createdAt: date.toISOString().split('T')[0],
      pages: generatePages(i),
    });
  }
  return chapters;
}

function generatePages(chapterNum) {
  const pageCount = Math.floor(Math.random() * 6) + 8; // 8-13 pages
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
