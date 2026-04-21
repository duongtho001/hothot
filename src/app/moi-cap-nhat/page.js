import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getLatestComics, GENRES, formatViews } from '@/lib/data';
import Link from 'next/link';

export const metadata = {
  title: 'Mới Cập Nhật — Truyện Tranh AI',
  description: 'Danh sách truyện tranh AI mới cập nhật, đọc miễn phí!',
};

export default function MoiCapNhatPage() {
  const comics = getLatestComics(50);

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
                      <span className="new">Chương {comic.latestChapter}</span>
                      <span>• {formatViews(comic.viewCount)} lượt xem</span>
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
