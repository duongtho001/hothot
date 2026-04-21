import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getServiceSupabase } from '@/lib/supabase';
import { getLatestComics, formatViews } from '@/lib/data';
import Link from 'next/link';

export const metadata = {
  title: 'Mới Cập Nhật — Truyện Tranh AI',
  description: 'Danh sách truyện tranh AI mới cập nhật, đọc miễn phí!',
};

export const dynamic = 'force-dynamic';

async function getLatestFromDB() {
  const sb = getServiceSupabase();
  if (!sb) return getLatestComics(50);

  const { data: comics, error } = await sb
    .from('comics')
    .select(`
      id, slug, title, cover_url, author, status,
      view_count, rating, updated_at, free_chapters
    `)
    .order('updated_at', { ascending: false })
    .limit(50);

  if (error || !comics?.length) return [];

  // Get latest chapter for each comic
  const comicIds = comics.map(c => c.id);
  const { data: chapters } = await sb
    .from('chapters')
    .select('comic_id, chapter_number, created_at')
    .in('comic_id', comicIds)
    .order('chapter_number', { ascending: false });

  // Map latest chapter per comic
  const latestChapterMap = {};
  (chapters || []).forEach(ch => {
    if (!latestChapterMap[ch.comic_id] || ch.chapter_number > latestChapterMap[ch.comic_id].chapter_number) {
      latestChapterMap[ch.comic_id] = ch;
    }
  });

  return comics.map(c => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    cover: c.cover_url,
    author: c.author,
    status: c.status,
    viewCount: c.view_count || 0,
    rating: c.rating || 0,
    latestChapter: latestChapterMap[c.id]?.chapter_number || 0,
    updatedAt: timeAgo(c.updated_at),
  }));
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'Vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
  return d.toLocaleDateString('vi-VN');
}

function fmtViews(n) {
  if (n >= 1000000) return `${(n/1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n/1000).toFixed(1)}K`;
  return n?.toString() || '0';
}

export default async function MoiCapNhatPage() {
  const comics = await getLatestFromDB();

  return (
    <>
      <Header />
      <main className="page-content">
        <div className="container">
          <div className="section-header">
            <h1 className="section-title">
              <span className="icon">🕐</span> Mới Cập Nhật
            </h1>
          </div>

          {comics.length === 0 ? (
            <div style={{textAlign:'center',padding:'60px 20px',opacity:0.5}}>
              <div style={{fontSize:'48px',marginBottom:'12px'}}>📭</div>
              <p>Chưa có truyện nào. Hãy quay lại sau!</p>
            </div>
          ) : (
            <div className="comic-grid">
              {comics.map(comic => (
                <Link key={comic.id} href={`/truyen/${comic.slug}`} className="comic-card">
                  <div className="comic-cover">
                    {comic.cover ? (
                      <img src={comic.cover} alt={comic.title} />
                    ) : (
                      <div style={{width:'100%',height:'100%',background:'var(--bg-surface)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'48px'}}>📖</div>
                    )}
                    <div className="comic-cover-overlay">
                      <span className="comic-badge badge-new">✨ NEW</span>
                    </div>
                  </div>
                  <div className="comic-info">
                    <div className="comic-title">{comic.title}</div>
                    <div className="comic-chapter">
                      {comic.latestChapter > 0 ? (
                        <>
                          <span className="new">Chương {comic.latestChapter}</span>
                          <span>• {fmtViews(comic.viewCount)} lượt xem</span>
                        </>
                      ) : (
                        <span style={{color:'var(--text-muted)'}}>Đang cập nhật...</span>
                      )}
                    </div>
                    <div className="comic-update-time">{comic.updatedAt}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
