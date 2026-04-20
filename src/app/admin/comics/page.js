'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function formatNum(n) {
  if (n >= 1000000) return `${(n/1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n/1000).toFixed(0)}K`;
  return n?.toString() || '0';
}

export default function AdminComicsPage() {
  const [comics, setComics] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const loadComics = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20, search });
    const res = await fetch(`/api/admin/comics?${params}`);
    const data = await res.json();
    setComics(data.comics || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => { loadComics(); }, [page, search]);

  const handleDelete = async (id, title) => {
    if (!confirm(`Xóa truyện "${title}"? Tất cả chương cũng sẽ bị xóa!`)) return;
    await fetch(`/api/admin/comics/${id}`, { method: 'DELETE' });
    loadComics();
  };

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'24px'}}>
        <h1 className="admin-page-title" style={{margin:0}}>📚 Quản Lý Truyện</h1>
        <Link href="/admin/upload" className="btn btn-primary" style={{padding:'10px 20px'}}>
          + Thêm Truyện Mới
        </Link>
      </div>

      {/* Search */}
      <div style={{marginBottom:'16px'}}>
        <input
          type="text"
          className="form-input"
          placeholder="🔍 Tìm kiếm truyện..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{maxWidth:'400px'}}
        />
      </div>

      {/* Comics Table */}
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h3 className="admin-table-title">Tổng: {total} truyện</h3>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Truyện</th>
              <th>Chương</th>
              <th>Lượt Xem</th>
              <th>Free</th>
              <th>Trạng Thái</th>
              <th>Cập Nhật</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{textAlign:'center',padding:'60px',color:'var(--text-muted)'}}>
                <div className="mini-spinner" style={{margin:'0 auto 12px'}}></div>
                Đang tải...
              </td></tr>
            ) : comics.length === 0 ? (
              <tr><td colSpan={7} style={{textAlign:'center',padding:'60px',color:'var(--text-muted)'}}>
                {search ? 'Không tìm thấy truyện' : (
                  <>Chưa có truyện nào. <Link href="/admin/upload" style={{color:'var(--accent)'}}>Tải lên ngay →</Link></>
                )}
              </td></tr>
            ) : comics.map(c => (
              <tr key={c.id}>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                    {c.cover_url ? (
                      <img src={c.cover_url} className="comic-thumb" alt="" />
                    ) : (
                      <div className="comic-thumb" style={{display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg-surface)',fontSize:'20px'}}>📖</div>
                    )}
                    <div>
                      <Link href={`/admin/comics/${c.id}`} style={{fontWeight:600,color:'var(--text-primary)',fontSize:'14px'}}>
                        {c.title}
                      </Link>
                      <div style={{fontSize:'11px',color:'var(--text-muted)'}}>
                        {c.author} {c.is_featured && <span style={{color:'var(--accent)'}}>⭐</span>}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{fontWeight:600}}>{c.chapters?.[0]?.count || 0}</td>
                <td>{formatNum(c.view_count)}</td>
                <td>{c.free_chapters}</td>
                <td>
                  <span className={`status-badge status-${c.status}`}>
                    {c.status === 'completed' ? 'Hoàn Thành' : c.status === 'hiatus' ? 'Tạm Dừng' : 'Đang Ra'}
                  </span>
                </td>
                <td style={{color:'var(--text-muted)',fontSize:'13px'}}>
                  {new Date(c.updated_at).toLocaleDateString('vi-VN')}
                </td>
                <td>
                  <div style={{display:'flex',gap:'6px'}}>
                    <Link href={`/admin/comics/${c.id}`} className="action-btn">✏️</Link>
                    <button className="action-btn danger" onClick={() => handleDelete(c.id, c.title)}>🗑️</button>
                    <Link href={`/truyen/${c.slug}`} className="action-btn" target="_blank">🔍</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div style={{display:'flex',justifyContent:'center',gap:'8px',marginTop:'20px'}}>
          <button className="action-btn" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>
            ← Trước
          </button>
          <span style={{padding:'5px 12px',fontSize:'13px',color:'var(--text-muted)'}}>
            Trang {page} / {Math.ceil(total / 20)}
          </span>
          <button className="action-btn" onClick={() => setPage(p => p+1)} disabled={page >= Math.ceil(total / 20)}>
            Sau →
          </button>
        </div>
      )}
    </div>
  );
}
