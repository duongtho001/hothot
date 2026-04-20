'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';

export default function AdminComicDetailPage({ params }) {
  const { id } = use(params);
  const [comic, setComic] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Edit form
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('ongoing');
  const [freeChapters, setFreeChapters] = useState(5);
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    loadComic();
  }, [id]);

  async function loadComic() {
    setLoading(true);
    const res = await fetch(`/api/admin/comics/${id}`);
    const data = await res.json();
    if (data.comic) {
      setComic(data.comic);
      setTitle(data.comic.title);
      setAuthor(data.comic.author);
      setDescription(data.comic.description);
      setStatus(data.comic.status);
      setFreeChapters(data.comic.free_chapters);
      setIsFeatured(data.comic.is_featured);
    }
    setChapters(data.chapters || []);
    setLoading(false);
  }

  async function saveComic() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/comics/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author, description, status, free_chapters: freeChapters, is_featured: isFeatured }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessage('✅ Đã lưu thành công!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
    setSaving(false);
  }

  async function deleteChapter(chId, chNum) {
    if (!confirm(`Xóa Chương ${chNum}?`)) return;
    await fetch(`/api/admin/chapters?id=${chId}`, { method: 'DELETE' });
    loadComic();
  }

  if (loading) return <div style={{padding:'60px',textAlign:'center',color:'var(--text-muted)'}}>Đang tải...</div>;
  if (!comic) return <div style={{padding:'60px',textAlign:'center',color:'var(--text-muted)'}}>Không tìm thấy truyện</div>;

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'24px'}}>
        <Link href="/admin/comics" style={{color:'var(--text-muted)',fontSize:'20px'}}>←</Link>
        <h1 className="admin-page-title" style={{margin:0}}>✏️ {comic.title}</h1>
      </div>

      {message && (
        <div style={{
          padding:'12px 16px',borderRadius:'var(--radius-sm)',marginBottom:'16px',
          background: message.startsWith('❌') ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
          border: `1px solid ${message.startsWith('❌') ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
          fontSize:'14px'
        }}>
          {message}
        </div>
      )}

      <div className="admin-two-panel">
        {/* Edit Form */}
        <div className="admin-form">
          <h3 style={{marginBottom:'16px',fontWeight:700}}>📝 Thông Tin Truyện</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tên Truyện</label>
              <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Tác Giả</label>
              <input className="form-input" value={author} onChange={e => setAuthor(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mô Tả</label>
            <textarea className="form-textarea" value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Trạng Thái</label>
              <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="ongoing">Đang Ra</option>
                <option value="completed">Hoàn Thành</option>
                <option value="hiatus">Tạm Dừng</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Số Chương Free</label>
              <input className="form-input" type="number" value={freeChapters} onChange={e => setFreeChapters(parseInt(e.target.value)||0)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} />
              ⭐ Nổi Bật
            </label>
          </div>

          <button className="btn btn-primary" onClick={saveComic} disabled={saving}
                  style={{padding:'10px 24px'}}>
            {saving ? '⏳ Đang lưu...' : '💾 Lưu Thay Đổi'}
          </button>
        </div>

        {/* Stats */}
        <div>
          <div className="admin-form" style={{marginBottom:'16px'}}>
            <h3 style={{marginBottom:'12px',fontWeight:700}}>📊 Thống Kê</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
              <div style={{textAlign:'center',padding:'12px',background:'var(--bg-surface)',borderRadius:'var(--radius-sm)'}}>
                <div style={{fontSize:'24px',fontWeight:800,color:'var(--accent)'}}>{chapters.length}</div>
                <div style={{fontSize:'11px',color:'var(--text-muted)'}}>Chương</div>
              </div>
              <div style={{textAlign:'center',padding:'12px',background:'var(--bg-surface)',borderRadius:'var(--radius-sm)'}}>
                <div style={{fontSize:'24px',fontWeight:800,color:'var(--blue)'}}>
                  {comic.view_count >= 1000 ? `${(comic.view_count/1000).toFixed(0)}K` : comic.view_count}
                </div>
                <div style={{fontSize:'11px',color:'var(--text-muted)'}}>Lượt Xem</div>
              </div>
            </div>
          </div>

          {comic.cover_url && (
            <div className="admin-form">
              <h3 style={{marginBottom:'12px',fontWeight:700}}>🖼️ Ảnh Bìa</h3>
              <img src={comic.cover_url} alt="" style={{width:'100%',borderRadius:'var(--radius-sm)'}} />
            </div>
          )}
        </div>
      </div>

      {/* Chapters List */}
      <div className="admin-table-wrap" style={{marginTop:'24px'}}>
        <div className="admin-table-header">
          <h3 className="admin-table-title">📑 Danh Sách Chương ({chapters.length})</h3>
          <Link href={`/admin/upload?comic_id=${id}`} className="btn btn-primary" style={{padding:'6px 16px',fontSize:'13px'}}>
            + Thêm Chương
          </Link>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Chương</th>
              <th>Tiêu Đề</th>
              <th>Trang</th>
              <th>Free</th>
              <th>Lượt Xem</th>
              <th>Ngày Tạo</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {chapters.length === 0 ? (
              <tr><td colSpan={7} style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>
                Chưa có chương nào
              </td></tr>
            ) : chapters.map(ch => (
              <tr key={ch.id}>
                <td style={{fontWeight:700}}>{ch.chapter_number}</td>
                <td>{ch.title || `Chương ${ch.chapter_number}`}</td>
                <td>{ch.pages?.length || 0} trang</td>
                <td>
                  {ch.is_free ? (
                    <span style={{color:'var(--green)',fontWeight:600}}>✓ Free</span>
                  ) : (
                    <span style={{color:'var(--accent)',fontWeight:600}}>🔒 VIP</span>
                  )}
                </td>
                <td>{ch.view_count || 0}</td>
                <td style={{fontSize:'13px',color:'var(--text-muted)'}}>
                  {new Date(ch.created_at).toLocaleDateString('vi-VN')}
                </td>
                <td>
                  <button className="action-btn danger" onClick={() => deleteChapter(ch.id, ch.chapter_number)}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
