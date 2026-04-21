import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getServiceSupabase } from '@/lib/supabase';
import { getComicBySlug, getGenreNames, GENRES } from '@/lib/data';

async function getComic(slug) {
  const sb = getServiceSupabase();

  // Fallback to mock data if no Supabase
  if (!sb) {
    const mock = getComicBySlug(slug);
    if (!mock) return null;
    return {
      ...mock,
      id: mock.id, slug: mock.slug, title: mock.title,
      description: mock.description, cover_url: mock.cover,
      author: mock.author, status: mock.status,
      view_count: mock.viewCount, rating: mock.rating,
      chapters: (mock.chapters || []).map(ch => ({
        ...ch, chapter_number: ch.number, is_free: true,
        view_count: ch.viewCount, created_at: ch.createdAt,
      })),
      genres: (mock.genres || []).map(gid => GENRES.find(g => g.id === gid)).filter(Boolean),
    };
  }

  const { data: comic, error } = await sb
    .from('comics')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !comic) return null;

  // Get chapters
  const { data: chapters } = await sb
    .from('chapters')
    .select('id, chapter_number, title, is_free, view_count, created_at, pages')
    .eq('comic_id', comic.id)
    .order('chapter_number', { ascending: true });

  // Get genres
  const { data: comicGenres } = await sb
    .from('comic_genres')
    .select('genre_id, genres(id, name, slug, icon)')
    .eq('comic_id', comic.id);

  // Increment view count (fire and forget)
  sb.from('comics').update({ view_count: (comic.view_count || 0) + 1 }).eq('id', comic.id).then(() => {});

  return {
    ...comic,
    chapters: chapters || [],
    genres: comicGenres?.map(cg => cg.genres).filter(Boolean) || []
  };
}

function formatViews(n) {
  if (n >= 1000000) return `${(n/1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n/1000).toFixed(1)}K`;
  return n?.toString() || '0';
}

function getStatusLabel(status) {
  switch(status) {
    case 'completed': return 'Hoàn Thành';
    case 'hiatus': return 'Tạm Dừng';
    default: return 'Đang Ra';
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const comic = await getComic(slug);
  if (!comic) return { title: 'Không tìm thấy — ComicVerse' };
  return {
    title: `${comic.title} - Đọc Online | ComicVerse`,
    description: comic.description || `Đọc ${comic.title} online miễn phí tại ComicVerse`,
  };
}

export const dynamic = 'force-dynamic';

export default async function ComicDetailPage({ params }) {
  const { slug } = await params;
  const comic = await getComic(slug);

  if (!comic) {
    return (
      <>
        <Header />
        <main className="page-content">
          <div className="container" style={{textAlign:'center',padding:'80px 20px'}}>
            <h1 style={{fontSize:'48px',marginBottom:'16px'}}>😢</h1>
            <h2>Không tìm thấy truyện</h2>
            <Link href="/" className="btn btn-primary" style={{marginTop:'20px'}}>← Về Trang Chủ</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const latestChapter = comic.chapters.length > 0 
    ? Math.max(...comic.chapters.map(c => c.chapter_number)) 
    : 0;
  const firstChapter = comic.chapters.length > 0
    ? Math.min(...comic.chapters.map(c => c.chapter_number))
    : 1;

  return (
    <>
      <Header />
      <main className="page-content">
        <div className="container">

          {/* Comic Detail Header */}
          <div className="comic-detail-header">
            <div className="detail-cover">
              {comic.cover_url ? (
                <img src={comic.cover_url} alt={comic.title} />
              ) : (
                <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg-surface)',fontSize:'80px',borderRadius:'var(--radius)'}}>📖</div>
              )}
            </div>
            <div className="detail-info">
              <h1 className="detail-title">{comic.title}</h1>
              
              <div className="detail-meta">
                <span className="detail-meta-item">
                  <span className="label">Tác giả:</span> {comic.author}
                </span>
                <span className="detail-meta-item">
                  <span className="label">Trạng thái:</span>
                  <span style={{
                    color: comic.status === 'completed' ? 'var(--green)' : 'var(--accent)',
                    fontWeight: 600
                  }}>
                    {getStatusLabel(comic.status)}
                  </span>
                </span>
                <span className="detail-meta-item">
                  <span className="label">Cập nhật:</span> {new Date(comic.updated_at).toLocaleDateString('vi-VN')}
                </span>
              </div>

              {comic.genres.length > 0 && (
                <div className="detail-genres">
                  {comic.genres.map(g => (
                    <span key={g.id} className="genre-tag">
                      {g.icon} {g.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="detail-stats">
                <div className="stat-item">
                  <div className="stat-value">{formatViews(comic.view_count)}</div>
                  <div className="stat-label">Lượt Xem</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">⭐ {comic.rating || '0.0'}</div>
                  <div className="stat-label">Đánh Giá</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{latestChapter}</div>
                  <div className="stat-label">Chương</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{comic.free_chapters >= 999 ? 'Tất cả' : comic.free_chapters}</div>
                  <div className="stat-label">Chương Free</div>
                </div>
              </div>

              {comic.description && (
                <p className="detail-description">{comic.description}</p>
              )}

              <div className="detail-actions">
                {comic.chapters.length > 0 ? (
                  <>
                    <Link 
                      href={`/truyen/${comic.slug}/${firstChapter}`}
                      className="btn btn-primary" 
                      style={{padding:'12px 28px',fontSize:'15px'}}
                    >
                      📖 Đọc Từ Đầu
                    </Link>
                    {latestChapter > firstChapter && (
                      <Link 
                        href={`/truyen/${comic.slug}/${latestChapter}`}
                        className="btn btn-ghost" 
                        style={{padding:'12px 28px',fontSize:'15px'}}
                      >
                        🆕 Chương Mới Nhất
                      </Link>
                    )}
                  </>
                ) : (
                  <div style={{color:'var(--text-muted)',fontSize:'14px'}}>
                    ⏳ Chưa có chương nào — đang cập nhật...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chapter List */}
          {comic.chapters.length > 0 && (
            <div className="chapter-list-section">
              <div className="chapter-list-header">
                <h2 className="chapter-list-title">
                  📑 Danh Sách Chương ({latestChapter})
                </h2>
              </div>
              <div className="chapter-list">
                {comic.chapters.map(ch => {
                  const isFree = ch.is_free || ch.chapter_number <= comic.free_chapters;
                  const isLocked = !isFree;
                  return (
                    <Link 
                      key={ch.id}
                      href={isLocked ? `/vip` : `/truyen/${comic.slug}/${ch.chapter_number}`}
                      className={`chapter-item ${isLocked ? 'locked' : ''}`}
                    >
                      <span className="chapter-name">
                        {isLocked && <span className="lock-icon">🔒</span>}
                        Chương {ch.chapter_number}{ch.title && ch.title !== `Chương ${ch.chapter_number}` ? `: ${ch.title}` : ''}
                      </span>
                      <span className="chapter-date">
                        {isLocked ? (
                          <span style={{color:'var(--accent)',fontWeight:600,fontSize:'11px'}}>VIP</span>
                        ) : (
                          new Date(ch.created_at).toLocaleDateString('vi-VN')
                        )}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
