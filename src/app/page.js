import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ComicCard from '@/components/ComicCard';
import Link from 'next/link';
import { getServiceSupabase } from '@/lib/supabase';
import { COMICS, GENRES, getFeaturedComics, getLatestComics, getTopComics, formatViews as fmtViews } from '@/lib/data';

export const dynamic = 'force-dynamic';

async function getHomeData() {
  const sb = getServiceSupabase();
  
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

  const { data: featured } = await sb
    .from('comics').select('*')
    .eq('is_featured', true)
    .order('updated_at', { ascending: false }).limit(3);

  const { data: latest } = await sb
    .from('comics').select('*')
    .order('updated_at', { ascending: false }).limit(12);

  const { data: top } = await sb
    .from('comics').select('*')
    .order('view_count', { ascending: false }).limit(10);

  const { data: completed } = await sb
    .from('comics').select('*')
    .eq('status', 'completed')
    .order('view_count', { ascending: false }).limit(4);

  return {
    featured: featured || [],
    latest: latest || [],
    top: top || [],
    completed: completed || [],
    genres: GENRES.map(g => ({ id: g.id, name: g.name, icon: g.icon })),
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
  const hasData = latest.length > 0;

  return (
    <>
      <Header />

      {/* ===== HERO BANNER ===== */}
      <section className="video-hero" style={{backgroundImage:'url(/hero-banner.png)',backgroundSize:'cover',backgroundPosition:'center top'}}>
        <div className="video-hero-overlay" />
        <div className="video-hero-content">
          <div className="video-hero-badge">
            <span className="video-hero-dot" />
            <span style={{opacity:0.6}}>Truyện tranh AI đầu tiên tại Việt Nam</span>
          </div>
          <h1 className="video-hero-title">
            Truyện Tranh<br/>Tạo Bằng <em style={{fontStyle:'italic',fontWeight:400}}>AI</em>
          </h1>
          <p className="video-hero-subtitle">
            Khám phá kho truyện tranh đa thể loại được tạo 100% bằng trí tuệ nhân tạo.<br/>
            Cốt truyện hấp dẫn, hình ảnh sống động — hoàn toàn miễn phí!
          </p>
          <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/moi-cap-nhat" className="btn btn-primary" style={{padding:'14px 32px',fontSize:'15px'}}>
              📖 Đọc Ngay
            </Link>
            <Link href="/donate" className="btn btn-ghost" style={{padding:'14px 32px',fontSize:'15px',borderColor:'rgba(255,255,255,0.3)',color:'#fff'}}>
              💝 Ủng Hộ
            </Link>
          </div>
        </div>
        <div style={{position:'absolute',bottom:0,left:0,right:0,height:'120px',background:'linear-gradient(to top, var(--bg-primary), transparent)',zIndex:3,pointerEvents:'none'}} />
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <main className="page-content" style={{paddingTop:0}}>
        <div className="container">

          {/* Genre Pills */}
          {genres.length > 0 && (
            <div className="genre-pills" style={{marginTop:'8px',marginBottom:'28px'}}>
              {genres.map(g => (
                <span key={g.id} className="genre-pill">
                  {g.icon} {g.name}
                </span>
              ))}
            </div>
          )}

          {/* No data placeholder */}
          {!hasData && (
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
          )}

          {/* Two Column Layout */}
          {hasData && (
            <div className="two-col-layout">
              
              {/* Left: Comics */}
              <div>
                {/* Featured */}
                {featured.length > 0 && (
                  <>
                    <div className="section-header">
                      <h2 className="section-title">
                        <span className="icon">🔥</span> Truyện Nổi Bật
                      </h2>
                    </div>
                    <div className="comic-grid" style={{gridTemplateColumns:'repeat(4, 1fr)'}}>
                      {featured.map(comic => (
                        <ComicCard key={comic.id} comic={comic} badge="hot" />
                      ))}
                    </div>
                  </>
                )}

                {/* Latest */}
                <div className="section-header" style={{marginTop:'36px'}}>
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

                {/* Completed */}
                {completed.length > 0 && (
                  <>
                    <div className="section-header" style={{marginTop:'36px'}}>
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
