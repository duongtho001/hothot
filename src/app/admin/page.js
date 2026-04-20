'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function formatNum(n) {
  if (n >= 1000000) return `${(n/1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n/1000).toFixed(0)}K`;
  return n?.toString() || '0';
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const s = stats?.stats || {};

  return (
    <div>
      <h1 className="admin-page-title">📊 Tổng Quan</h1>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon">📚</div>
          <div className="stat-card-value">{loading ? '...' : formatNum(s.totalComics)}</div>
          <div className="stat-card-label">Tổng Truyện</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">📑</div>
          <div className="stat-card-value">{loading ? '...' : formatNum(s.totalChapters)}</div>
          <div className="stat-card-label">Tổng Chương</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">👁</div>
          <div className="stat-card-value">{loading ? '...' : formatNum(s.totalViews)}</div>
          <div className="stat-card-label">Tổng Lượt Xem</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">👥</div>
          <div className="stat-card-value">{loading ? '...' : formatNum(s.totalUsers)}</div>
          <div className="stat-card-label">Người Dùng</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">💎</div>
          <div className="stat-card-value">{loading ? '...' : formatNum(s.totalVIP)}</div>
          <div className="stat-card-label">VIP Active</div>
        </div>
      </div>

      {/* Two panels */}
      <div className="admin-two-panel">
        {/* Recent Comics */}
        <div className="admin-table-wrap">
          <div className="admin-table-header">
            <h3 className="admin-table-title">🕐 Truyện Mới Cập Nhật</h3>
            <Link href="/admin/comics" className="action-btn">Xem tất cả →</Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Truyện</th>
                <th>Lượt Xem</th>
                <th>Trạng Thái</th>
                <th>Cập Nhật</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>Đang tải...</td></tr>
              ) : (stats?.recentComics || []).length === 0 ? (
                <tr><td colSpan={4} style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>
                  Chưa có truyện nào. <Link href="/admin/upload" style={{color:'var(--accent)'}}>Tải lên ngay →</Link>
                </td></tr>
              ) : (stats?.recentComics || []).map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                      {c.cover_url ? (
                        <img src={c.cover_url} className="comic-thumb" alt="" />
                      ) : (
                        <div className="comic-thumb" style={{display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg-surface)',fontSize:'20px'}}>📖</div>
                      )}
                      <Link href={`/admin/comics/${c.id}`} style={{fontWeight:600,color:'var(--text-primary)'}}>
                        {c.title}
                      </Link>
                    </div>
                  </td>
                  <td>{formatNum(c.view_count)}</td>
                  <td>
                    <span className={`status-badge status-${c.status}`}>
                      {c.status === 'completed' ? 'Hoàn Thành' : c.status === 'hiatus' ? 'Tạm Dừng' : 'Đang Ra'}
                    </span>
                  </td>
                  <td style={{color:'var(--text-muted)',fontSize:'13px'}}>
                    {new Date(c.updated_at).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Comics */}
        <div className="admin-table-wrap">
          <div className="admin-table-header">
            <h3 className="admin-table-title">🔥 Top Lượt Xem</h3>
          </div>
          <div style={{padding:'8px'}}>
            {loading ? (
              <div style={{padding:'40px',textAlign:'center',color:'var(--text-muted)'}}>Đang tải...</div>
            ) : (stats?.topComics || []).length === 0 ? (
              <div style={{padding:'40px',textAlign:'center',color:'var(--text-muted)'}}>Chưa có dữ liệu</div>
            ) : (stats?.topComics || []).map((c, i) => (
              <Link key={c.id} href={`/admin/comics/${c.id}`} className="ranking-item" style={{padding:'10px 8px'}}>
                <span className="ranking-number">{i + 1}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:'13px',fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                    {c.title}
                  </div>
                  <div style={{fontSize:'11px',color:'var(--text-muted)'}}>
                    👁 {formatNum(c.view_count)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        marginTop:'32px',display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'12px'
      }}>
        <Link href="/admin/upload" style={{
          display:'flex',alignItems:'center',gap:'12px',padding:'16px 20px',
          background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'var(--radius)',
          transition:'var(--transition)',
        }} className="admin-quick-action">
          <span style={{fontSize:'28px'}}>📤</span>
          <div>
            <div style={{fontWeight:700,fontSize:'14px'}}>Tải Truyện Lên</div>
            <div style={{fontSize:'12px',color:'var(--text-muted)'}}>Thêm truyện mới + upload ảnh</div>
          </div>
        </Link>
        <Link href="/admin/comics" style={{
          display:'flex',alignItems:'center',gap:'12px',padding:'16px 20px',
          background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'var(--radius)',
        }}>
          <span style={{fontSize:'28px'}}>📚</span>
          <div>
            <div style={{fontWeight:700,fontSize:'14px'}}>Quản Lý Truyện</div>
            <div style={{fontSize:'12px',color:'var(--text-muted)'}}>Chỉnh sửa, xóa truyện</div>
          </div>
        </Link>
        <Link href="/admin/vip-codes" style={{
          display:'flex',alignItems:'center',gap:'12px',padding:'16px 20px',
          background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'var(--radius)',
        }}>
          <span style={{fontSize:'28px'}}>🔑</span>
          <div>
            <div style={{fontWeight:700,fontSize:'14px'}}>Tạo Mã VIP</div>
            <div style={{fontSize:'12px',color:'var(--text-muted)'}}>Quản lý mã kích hoạt</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
