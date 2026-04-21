import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ComicCard from '@/components/ComicCard';
import Link from 'next/link';
import { getServiceSupabase } from '@/lib/supabase';
import { COMICS, GENRES, getFeaturedComics, getLatestComics, getTopComics, formatViews as fmtViews } from '@/lib/data';

export const dynamic = 'force-dynamic';

async function getHomeData() {
  const sb = getServiceSupabase();
  
  // If no Supabase configured, use mock data
  if (!sb) {
    return {
      featured: getFeaturedComics().slice(0, 3).map(c => ({
        ...c, id: c.id, slug: c.slug, title: c.title,
        description: c.description, cover_url: c.cover,
        view_count: c.viewCount, is_featured: c.isFeatured,
        free_chapters: c.freeChapters, status: c.status,
      })),
      latest: getLatestComics(12).map(c => ({
        ...c, id: c.id, slug: c.slug, title: c.title,
        description: c.description, cover_url: c.cover,
        view_count: c.viewCount, free_chapters: c.freeChapters,
        status: c.status,
      })),
      top: getTopComics(10).map(c => ({
        ...c, id: c.id, slug: c.slug, title: c.title,
        cover_url: c.cover, view_count: c.viewCount,
      })),
      completed: COMICS.filter(c => c.status === 'completed').slice(0, 4).map(c => ({
        ...c, id: c.id, slug: c.slug, title: c.title,
        cover_url: c.cover, view_count: c.viewCount,
        free_chapters: c.freeChapters, status: c.status,
      })),
      genres: GENRES.map(g => ({ id: g.id, name: g.name, icon: g.icon })),
    };
  }

  // Featured comics
  const { data: featured } = await sb
    .from('comics')
    .select('*')
    .eq('is_featured', true)
    .order('updated_at', { ascending: false })
    .limit(3);

  // Latest comics
  const { data: latest } = await sb
    .from('comics')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(12);

  // Top viewed
  const { data: top } = await sb
    .from('comics')
    .select('*')
    .order('view_count', { ascending: false })
    .limit(10);

  // Completed
  const { data: completed } = await sb
    .from('comics')
    .select('*')
    .eq('status', 'completed')
    .order('view_count', { ascending: false })
    .limit(4);

  // Genres
  const { data: genres } = await sb
    .from('genres')
    .select('*')
    .order('name');

  return {
    featured: featured || [],
    latest: latest || [],
    top: top || [],
    completed: completed || [],
    genres: genres || [],
  };
}

function formatViews(n) {
  if (!n) return '0';
  if (n >= 1000000) return `${(n/1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n/1000).toFixed(1)}K`;
  return n.toString();
}

export default async function HomePage() {
  const { featured, latest, top, completed, genres } = await getHomeData();

  // If no real data yet, show placeholder
  const hasData = latest.length > 0;

  return (
    <>
      <Header />
      <main className="page-content">
        <div className="container">
          
          {/* Hero Section */}
          {featured.length > 0 ? (
            <section className="hero-section">
              <div className="hero-slider">
                <Link href={`/truyen/${featured[0].slug}`} className="hero-main">
                  {featured[0].cover_url ? (
                    <img src={featured[0].cover_url} alt={featured[0].title} />
                  ) : (
                    <div style={{width:'100%',height:'100%',background:'linear-gradient(135deg,var(--accent),var(--blue))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'80px'}}>📖</div>
                  )}
                  <div className="hero-main-overlay">
                    <span className="comic-badge badge-hot">🔥 HOT</span>
                    <h2 className="hero-main-title">{featured[0].title}</h2>
                    <p className="hero-main-desc">{featured[0].description}</p>
                    <span className="btn btn-primary" style={{display:'inline-flex',width:'auto'}}>
                      Đọc Ngay →
                    </span>
                  </div>
                </Link>
                {featured.length > 1 && (
                  <div className="hero-sidebar">
                    {featured.slice(1, 3).map(comic => (
                      <Link key={comic.id} href={`/truyen/${comic.slug}`} className="hero-side-card">
                        {comic.cover_url ? (
                          <img src={comic.cover_url} alt={comic.title} />
                        ) : (
                          <div style={{width:'100%',height:'100%',background:'var(--bg-surface)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'40px'}}>📖</div>
                        )}
                        <div className="hero-side-overlay">
                          <h3 className="hero-side-title">{comic.title}</h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </section>
          ) : !hasData ? (
            <section style={{
              textAlign:'center',padding:'60px 20px',
              background:'var(--bg-card)',borderRadius:'var(--radius)',
              margin:'20px 0',border:'1px dashed var(--border)',
            }}>
              <div style={{fontSize:'60px',marginBottom:'16px'}}>📚</div>
              <h2 style={{marginBottom:'8px'}}>Chào mừng đến Truyện Tranh AI!</h2>
              <p style={{color:'var(--text-muted)',marginBottom:'20px'}}>Chưa có truyện nào. Vào Admin để tải truyện lên.</p>
              <Link href="/admin/upload" className="btn btn-primary" style={{padding:'12px 24px'}}>
                📤 Tải Truyện Lên
              </Link>
            </section>
          ) : null}

          {/* Genre Pills */}
          {genres.length > 0 && (
            <div className="genre-pills">
              {genres.slice(0, 12).map(g => (
                <span key={g.id} className="genre-pill">
                  {g.icon} {g.name}
                </span>
              ))}
            </div>
          )}

          {/* Two Column: Comics + Ranking */}
          {hasData && (
            <div className="two-col-layout">
              
              {/* Left: Latest Comics */}
              <div>
                <div className="section-header">
                  <h2 className="section-title">
                    <span className="icon">🕐</span> Mới Cập Nhật
                  </h2>
                </div>
                <div className="comic-grid" style={{gridTemplateColumns:'repeat(4, 1fr)'}}>
                  {latest.map((comic, idx) => (
                    <ComicCard 
                      key={comic.id} 
                      comic={comic} 
                      badge={idx < 3 ? 'hot' : comic.free_chapters < 30 ? 'vip' : 'new'}
                    />
                  ))}
                </div>

                {/* Completed Section */}
                {completed.length > 0 && (
                  <>
                    <div className="section-header" style={{marginTop:'40px'}}>
                      <h2 className="section-title">
                        <span className="icon">✅</span> Truyện Hoàn Thành
                      </h2>
                    </div>
                    <div className="comic-grid" style={{gridTemplateColumns:'repeat(4, 1fr)'}}>
                      {completed.map(comic => (
                        <ComicCard key={comic.id} comic={comic} />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Right: Ranking */}
              <aside>
                <div className="ranking-panel">
                  <div className="ranking-tabs">
                    <button className="ranking-tab active">Top Lượt Xem</button>
                  </div>
                  <div className="ranking-list">
                    {top.map((comic, idx) => (
                      <Link key={comic.id} href={`/truyen/${comic.slug}`} className="ranking-item">
                        <span className="ranking-number">{idx + 1}</span>
                        <div className="ranking-cover">
                          {comic.cover_url ? (
                            <img src={comic.cover_url} alt={comic.title} loading="lazy" />
                          ) : (
                            <div style={{width:'100%',height:'100%',background:'var(--bg-surface)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px'}}>📖</div>
                          )}
                        </div>
                        <div className="ranking-info">
                          <div className="ranking-title">{comic.title}</div>
                          <div className="ranking-meta">
                            👁 {formatViews(comic.view_count)}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
