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
      setMessage('Saved!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
    setSaving(false);
  }

  async function deleteChapter(chId, chNum) {
    if (!confirm('Delete Chapter ' + chNum + '?')) return;
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
        formData.append('path', 'chapters/' + editingChapter.id);
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.url) {
          const newPages = [...chapterPages];
          newPages[index] = data.url;
          setChapterPages(newPages);
          await saveChapterPages(editingChapter.id, newPages);
        }
      } catch (err) {
        setMessage('Upload error: ' + err.message);
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
          formData.append('path', 'chapters/' + editingChapter.id);
          const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
          const data = await res.json();
          if (data.url) newPages.push(data.url);
        } catch (ex) {
          console.error(ex);
        }
      }
      setChapterPages(newPages);
      await saveChapterPages(editingChapter.id, newPages);
      setUploadingIdx(-1);
    };
    input.click();
  }

  function handleDeleteImage(index) {
    if (!confirm('Delete page ' + (index + 1) + '?')) return;
    const newPages = chapterPages.filter(function(_, i) { return i !== index; });
    setChapterPages(newPages);
    saveChapterPages(editingChapter.id, newPages);
  }

  function handleMoveImage(index, direction) {
    const newPages = [...chapterPages];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= newPages.length) return;
    const temp = newPages[index];
    newPages[index] = newPages[targetIdx];
    newPages[targetIdx] = temp;
    setChapterPages(newPages);
    saveChapterPages(editingChapter.id, newPages);
  }

  async function saveChapterPages(chapterId, pages) {
    try {
      const res = await fetch('/api/admin/chapters', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: chapterId, pages: pages })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessage('Saved!');
      loadComic();
      setTimeout(function() { setMessage(''); }, 2000);
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  }

  if (loading) return <div style={{padding:'60px',textAlign:'center',color:'#888'}}>Loading...</div>;
  if (!comic) return <div style={{padding:'60px',textAlign:'center',color:'#888'}}>Not found</div>;

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'24px'}}>
        <Link href="/admin/comics" style={{color:'#888',fontSize:'20px'}}>&#8592;</Link>
        <h1 className="admin-page-title" style={{margin:0}}>&#9998; {comic.title}</h1>
      </div>

      {message && (
        <div style={{
          padding:'12px 16px',borderRadius:'8px',marginBottom:'16px',
          background: message.startsWith('Error') ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
          border: '1px solid ' + (message.startsWith('Error') ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'),
          fontSize:'14px'
        }}>
          {message}
        </div>
      )}

      <div className="admin-two-panel">
        {/* Edit Form */}
        <div className="admin-form">
          <h3 style={{marginBottom:'16px',fontWeight:700}}>Edit Comic</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="form-input" value={title} onChange={function(e) { setTitle(e.target.value); }} />
            </div>
            <div className="form-group">
              <label className="form-label">Author</label>
              <input className="form-input" value={author} onChange={function(e) { setAuthor(e.target.value); }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={description} onChange={function(e) { setDescription(e.target.value); }} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={status} onChange={function(e) { setStatus(e.target.value); }}>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="hiatus">Hiatus</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Free Chapters</label>
              <input className="form-input" type="number" value={freeChapters} onChange={function(e) { setFreeChapters(parseInt(e.target.value)||0); }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <input type="checkbox" checked={isFeatured} onChange={function(e) { setIsFeatured(e.target.checked); }} />
              Featured
            </label>
          </div>

          <button className="btn btn-primary" onClick={saveComic} disabled={saving}
                  style={{padding:'10px 24px'}}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Stats */}
        <div>
          <div className="admin-form" style={{marginBottom:'16px'}}>
            <h3 style={{marginBottom:'12px',fontWeight:700}}>Stats</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
              <div style={{textAlign:'center',padding:'12px',background:'var(--bg-surface)',borderRadius:'8px'}}>
                <div style={{fontSize:'24px',fontWeight:800,color:'var(--accent)'}}>{chapters.length}</div>
                <div style={{fontSize:'11px',color:'#888'}}>Chapters</div>
              </div>
              <div style={{textAlign:'center',padding:'12px',background:'var(--bg-surface)',borderRadius:'8px'}}>
                <div style={{fontSize:'24px',fontWeight:800,color:'#60a5fa'}}>
                  {comic.view_count >= 1000 ? Math.floor(comic.view_count/1000) + 'K' : comic.view_count}
                </div>
                <div style={{fontSize:'11px',color:'#888'}}>Views</div>
              </div>
            </div>
          </div>

          {comic.cover_url && (
            <div className="admin-form">
              <h3 style={{marginBottom:'12px',fontWeight:700}}>Cover</h3>
              <img src={comic.cover_url} alt="" style={{width:'100%',borderRadius:'8px'}} />
            </div>
          )}
        </div>
      </div>

      {/* Chapters List */}
      <div className="admin-table-wrap" style={{marginTop:'24px'}}>
        <div className="admin-table-header">
          <h3 className="admin-table-title">Chapters ({chapters.length})</h3>
          <Link href={'/admin/upload?comic_id=' + id} className="btn btn-primary" style={{padding:'6px 16px',fontSize:'13px'}}>
            + Add Chapter
          </Link>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ch</th>
              <th>Title</th>
              <th>Pages</th>
              <th>Free</th>
              <th>Views</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {chapters.length === 0 ? (
              <tr><td colSpan={7} style={{textAlign:'center',padding:'40px',color:'#888'}}>
                No chapters yet
              </td></tr>
            ) : chapters.map(function(ch) {
              return (
                <tr key={ch.id}>
                  <td style={{fontWeight:700}}>{ch.chapter_number}</td>
                  <td>{ch.title || ('Chapter ' + ch.chapter_number)}</td>
                  <td>{ch.pages ? ch.pages.length : 0} pages</td>
                  <td>
                    {ch.is_free ? (
                      <span style={{color:'#10b981',fontWeight:600}}>Free</span>
                    ) : (
                      <span style={{color:'#f59e0b',fontWeight:600}}>VIP</span>
                    )}
                  </td>
                  <td>{ch.view_count || 0}</td>
                  <td style={{fontSize:'13px',color:'#888'}}>
                    {new Date(ch.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td>
                    <div style={{display:'flex',gap:'6px'}}>
                      <button className="action-btn" onClick={function() { openImageEditor(ch); }} title="Edit images">
                        &#128444;
                      </button>
                      <button className="action-btn danger" onClick={function() { deleteChapter(ch.id, ch.chapter_number); }}>
                        &#128465;
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Chapter Image Editor Modal */}
      {editingChapter ? (
        <div style={{
          position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.85)',zIndex:10000,
          display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'
        }} onClick={function(e) { if (e.target === e.currentTarget) closeImageEditor(); }}>
          <div style={{
            background:'#1a1a2e',borderRadius:'16px',
            width:'100%',maxWidth:'960px',maxHeight:'92vh',overflow:'hidden',
            display:'flex',flexDirection:'column',border:'1px solid rgba(255,255,255,0.1)'
          }}>
            {/* Header */}
            <div style={{
              padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,0.08)',
              display:'flex',justifyContent:'space-between',alignItems:'center',
              background:'rgba(0,0,0,0.3)'
            }}>
              <h3 style={{margin:0,fontWeight:700,fontSize:'16px'}}>
                Edit Images - Chapter {editingChapter.chapter_number}
              </h3>
              <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                <button className="btn btn-primary" onClick={handleAddImage}
                        style={{padding:'8px 16px',fontSize:'13px'}}>
                  + Add
                </button>
                <button onClick={closeImageEditor}
                        style={{fontSize:'20px',color:'#999',padding:'6px 10px',cursor:'pointer',
                                background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',
                                borderRadius:'8px'}}>
                  X
                </button>
              </div>
            </div>

            {/* Image Grid */}
            <div style={{
              padding:'16px',overflowY:'auto',flex:1,
              display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'12px'
            }}>
              {chapterPages.length === 0 ? (
                <div style={{gridColumn:'1/-1',textAlign:'center',padding:'60px 20px',color:'#888'}}>
                  <p style={{fontSize:'48px',marginBottom:'8px'}}>&#128444;</p>
                  <p>No images yet</p>
                  <button className="btn btn-primary" onClick={handleAddImage}
                          style={{marginTop:'12px',padding:'10px 24px'}}>
                    + Upload
                  </button>
                </div>
              ) : chapterPages.map(function(url, idx) {
                return (
                  <div key={idx + '-' + url} style={{
                    borderRadius:'10px',overflow:'hidden',
                    border:'1px solid rgba(255,255,255,0.08)',
                    background:'#111'
                  }}>
                    <div style={{position:'relative'}}>
                      <div style={{
                        position:'absolute',top:'6px',left:'6px',zIndex:2,
                        background:'rgba(0,0,0,0.8)',color:'#fff',padding:'3px 10px',
                        borderRadius:'6px',fontSize:'11px',fontWeight:700
                      }}>
                        Page {idx + 1}
                      </div>
                      <img
                        src={url}
                        alt={'Page ' + (idx+1)}
                        style={{width:'100%',aspectRatio:'2/3',objectFit:'cover',display:'block',background:'#222'}}
                        onError={function(e) {
                          e.target.style.display = 'none';
                          if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div style={{
                        display:'none',width:'100%',aspectRatio:'2/3',
                        background:'#1a1a2e',alignItems:'center',justifyContent:'center',
                        flexDirection:'column',color:'#666',fontSize:'12px',gap:'4px'
                      }}>
                        <span style={{fontSize:'24px'}}>&#9888;</span>
                        <span>Image error</span>
                      </div>
                      {uploadingIdx === idx && (
                        <div style={{
                          position:'absolute',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.7)',
                          display:'flex',alignItems:'center',justifyContent:'center',
                          color:'#f59e0b',fontSize:'32px'
                        }}>
                          ...
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                      display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:'2px',
                      background:'rgba(0,0,0,0.3)',padding:'4px'
                    }}>
                      <button
                        onClick={function() { handleMoveImage(idx, -1); }}
                        disabled={idx === 0}
                        title="Move up"
                        style={{
                          padding:'8px 0',fontSize:'14px',cursor: idx === 0 ? 'default' : 'pointer',
                          background: idx === 0 ? 'transparent' : 'rgba(59,130,246,0.15)',
                          border:'none',borderRadius:'6px',
                          color: idx === 0 ? '#333' : '#60a5fa',
                          opacity: idx === 0 ? 0.3 : 1
                        }}>
                        &#9650;
                      </button>
                      <button
                        onClick={function() { handleMoveImage(idx, 1); }}
                        disabled={idx === chapterPages.length - 1}
                        title="Move down"
                        style={{
                          padding:'8px 0',fontSize:'14px',cursor: idx === chapterPages.length-1 ? 'default' : 'pointer',
                          background: idx === chapterPages.length-1 ? 'transparent' : 'rgba(59,130,246,0.15)',
                          border:'none',borderRadius:'6px',
                          color: idx === chapterPages.length-1 ? '#333' : '#60a5fa',
                          opacity: idx === chapterPages.length-1 ? 0.3 : 1
                        }}>
                        &#9660;
                      </button>
                      <button
                        onClick={function() { handleReplaceImage(idx); }}
                        title="Replace"
                        style={{
                          padding:'8px 0',fontSize:'14px',cursor:'pointer',
                          background:'rgba(139,92,246,0.15)',
                          border:'none',borderRadius:'6px',color:'#a78bfa'
                        }}>
                        &#128260;
                      </button>
                      <button
                        onClick={function() { handleDeleteImage(idx); }}
                        title="Delete"
                        style={{
                          padding:'8px 0',fontSize:'14px',cursor:'pointer',
                          background:'rgba(239,68,68,0.15)',
                          border:'none',borderRadius:'6px',color:'#f87171'
                        }}>
                        &#128465;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div style={{
              padding:'12px 20px',borderTop:'1px solid rgba(255,255,255,0.08)',
              display:'flex',justifyContent:'space-between',alignItems:'center',
              fontSize:'13px',color:'#888',background:'rgba(0,0,0,0.3)'
            }}>
              <span>Total: {chapterPages.length} pages</span>
              <span>Up/Down: Reorder | Replace | Delete</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
