import Link from 'next/link';

function formatViews(n) {
  if (!n) return '0';
  if (n >= 1000000) return `${(n/1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n/1000).toFixed(1)}K`;
  return n.toString();
}

export default function ComicCard({ comic, badge }) {
  const badgeMap = {
    'hot': { label: '🔥 HOT', className: 'badge-hot' },
    'new': { label: '🆕 MỚI', className: 'badge-new' },
    'vip': { label: '💎 VIP', className: 'badge-vip' },
  };
  const b = badgeMap[badge];

  return (
    <Link href={`/truyen/${comic.slug}`} className="comic-card">
      <div className="comic-card-cover">
        {comic.cover_url || comic.cover ? (
          <img src={comic.cover_url || comic.cover} alt={comic.title} loading="lazy" />
        ) : (
          <div style={{width:'100%',height:'100%',background:'linear-gradient(135deg,#1e293b,#334155)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'40px'}}>📖</div>
        )}
        {b && <span className={`comic-badge ${b.className}`}>{b.label}</span>}
        <div className="comic-card-overlay">
          <span className="comic-chapter">
            👁 {formatViews(comic.view_count || comic.viewCount)}
          </span>
        </div>
      </div>
      <div className="comic-card-info">
        <h3 className="comic-card-title">{comic.title}</h3>
        <div className="comic-card-meta">
          <span>{comic.author}</span>
        </div>
      </div>
    </Link>
  );
}
