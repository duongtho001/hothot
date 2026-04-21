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

  // Chapter image editor
  const [editingChapter, setEditingChapter] = useState(null);
  const [chapterPages, setChapterPages] = useState([]);
  const [uploadingIdx, setUploadingIdx] = useState(-1);

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

  // === Chapter Image Editor ===
  function openImageEditor(chapter) {
    setEditingChapter(chapter);
    setChapterPages(chapter.pages || []);
  }

  function closeImageEditor() {
    setEditingChapter(null);
    setChapterPages([]);
    setUploadingIdx(-1);
  }

  async function handleReplaceImage(index) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploadingIdx(index);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('path', `chapters/${editingChapter.id}`);

        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        const data = await res.json();

        if (data.url) {
          const newPages = [...chapterPages];
          newPages[index] = data.url;
          setChapterPages(newPages);
          // Save immediately
          await saveChapterPages(editingChapter.id, newPages);
        }
      } catch (err) {
        setMessage(`❌ Upload lỗi: ${err.message}`);
      }
      setUploadingIdx(-1);
    };
    input.click();
  }

  async function handleAddImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = async (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;
      setUploadingIdx(chapterPages.length);

      const newPages = [...chapterPages];
      for (const file of files) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('path', `chapters/${editingChapter.id}`);
          const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
          const data = await res.json();
          if (data.url) newPages.push(data.url);
        } catch {}
      }
      setChapterPages(newPages);
      await saveChapterPages(editingChapter.id, newPages);
      setUploadingIdx(-1);
    };
    input.click();
  }

  function handleDeleteImage(index) {
    if (!confirm(`Xóa ảnh trang ${index + 1}?`)) return;
    const newPages = chapterPages.filter((_, i) => i !== index);
    setChapterPages(newPages);
    saveChapterPages(editingChapter.id, newPages);
  }

  function handleMoveImage(index, direction) {
    const newPages = [...chapterPages];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= newPages.length) return;
    [newPages[index], newPages[targetIdx]] = [newPages[targetIdx], newPages[index]];
    setChapterPages(newPages);
    saveChapterPages(editingChapter.id, newPages);
  }

  async function saveChapterPages(chapterId, pages) {
    try {
      const res = await fetch(`/api/admin/chapters`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: chapterId, pages })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessage('✅ Đã lưu ảnh chương!');
      loadComic();
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
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
                  <div style={{display:'flex',gap:'6px'}}>
                    <button className="action-btn" onClick={() => openImageEditor(ch)} title="Sửa ảnh">
                      🖼️
                    </button>
                    <button className="action-btn danger" onClick={() => deleteChapter(ch.id, ch.chapter_number)}>
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* === Chapter Image Editor Modal === */}
      {editingChapter && (
        <div style={{
          position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',zIndex:10000,
          display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'
        }} onClick={(e) => e.target === e.currentTarget && closeImageEditor()}>
          <div style={{
            background:'var(--bg-card)',borderRadius:'var(--radius)',
            width:'100%',maxWidth:'900px',maxHeight:'90vh',overflow:'hidden',
            display:'flex',flexDirection:'column',border:'1px solid var(--border)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding:'16px 20px',borderBottom:'1px solid var(--border)',
              display:'flex',justifyContent:'space-between',alignItems:'center'
            }}>
              <h3 style={{margin:0,fontWeight:700}}>
                🖼️ Chỉnh sửa ảnh — Chương {editingChapter.chapter_number}
              </h3>
              <div style={{display:'flex',gap:'8px'}}>
                <button className="btn btn-primary" onClick={handleAddImage}
                        style={{padding:'6px 16px',fontSize:'13px'}}>
                  ➕ Thêm Ảnh
                </button>
                <button onClick={closeImageEditor}
                        style={{fontSize:'24px',color:'var(--text-muted)',padding:'4px',cursor:'pointer',background:'none',border:'none'}}>
                  ✕
                </button>
              </div>
            </div>

            {/* Image Grid */}
            <div style={{
              padding:'20px',overflowY:'auto',flex:1,
              display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:'16px'
            }}>
              {chapterPages.length === 0 ? (
                <div style={{gridColumn:'1/-1',textAlign:'center',padding:'60px 20px',color:'var(--text-muted)'}}>
                  <p style={{fontSize:'36px',marginBottom:'8px'}}>🖼️</p>
                  <p>Chương này chưa có ảnh</p>
                  <button className="btn btn-primary" onClick={handleAddImage}
                          style={{marginTop:'12px',padding:'8px 20px'}}>
                    ➕ Tải Ảnh Lên
                  </button>
                </div>
              ) : chapterPages.map((url, idx) => (
                <div key={idx} style={{
                  position:'relative',borderRadius:'var(--radius-sm)',overflow:'hidden',
                  border:'1px solid var(--border)',background:'var(--bg-surface)',
                  transition:'all 0.2s'
                }}>
                  {/* Page Number Badge */}
                  <div style={{
                    position:'absolute',top:'6px',left:'6px',zIndex:2,
                    background:'rgba(0,0,0,0.7)',color:'#fff',padding:'2px 8px',
                    borderRadius:'4px',fontSize:'11px',fontWeight:700
                  }}>
                    Trang {idx + 1}
                  </div>

                  {/* Image */}
                  <img src={url} alt={`Trang ${idx+1}`}
                       style={{width:'100%',aspectRatio:'2/3',objectFit:'cover',display:'block'}} />

                  {/* Uploading overlay */}
                  {uploadingIdx === idx && (
                    <div style={{
                      position:'absolute',inset:0,background:'rgba(0,0,0,0.7)',
                      display:'flex',alignItems:'center',justifyContent:'center',
                      color:'var(--accent)',fontSize:'24px'
                    }}>
                      ⏳
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{
                    display:'flex',gap:'4px',padding:'6px',justifyContent:'center',
                    background:'rgba(0,0,0,0.4)'
                  }}>
                    <button onClick={() => handleMoveImage(idx, -1)} disabled={idx === 0}
                            style={{padding:'4px 8px',fontSize:'12px',cursor:'pointer',
                                    background:'var(--bg-surface)',border:'1px solid var(--border)',
                                    borderRadius:'4px',color:'var(--text-secondary)',
                                    opacity: idx === 0 ? 0.3 : 1}}>
                      ⬆
                    </button>
                    <button onClick={() => handleMoveImage(idx, 1)} disabled={idx === chapterPages.length - 1}
                            style={{padding:'4px 8px',fontSize:'12px',cursor:'pointer',
                                    background:'var(--bg-surface)',border:'1px solid var(--border)',
                                    borderRadius:'4px',color:'var(--text-secondary)',
                                    opacity: idx === chapterPages.length - 1 ? 0.3 : 1}}>
                      ⬇
                    </button>
                    <button onClick={() => handleReplaceImage(idx)}
                            style={{padding:'4px 8px',fontSize:'12px',cursor:'pointer',
                                    background:'var(--purple-dim)',border:'1px solid rgba(139,92,246,0.3)',
                                    borderRadius:'4px',color:'var(--purple)'}}>
                      🔄
                    </button>
                    <button onClick={() => handleDeleteImage(idx)}
                            style={{padding:'4px 8px',fontSize:'12px',cursor:'pointer',
                                    background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',
                                    borderRadius:'4px',color:'var(--red)'}}>
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{
              padding:'12px 20px',borderTop:'1px solid var(--border)',
              display:'flex',justifyContent:'space-between',alignItems:'center',
              fontSize:'13px',color:'var(--text-muted)'
            }}>
              <span>Tổng: {chapterPages.length} trang</span>
              <span>Nhấn vào 🔄 để thay ảnh, ⬆⬇ để đổi thứ tự, 🗑 để xóa</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
