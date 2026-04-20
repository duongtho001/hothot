'use client';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AdminUploadPage() {
  const searchParams = useSearchParams();
  const existingComicId = searchParams.get('comic_id');

  const [genres, setGenres] = useState([]);
  const [step, setStep] = useState(existingComicId ? 2 : 1); // Skip to step 2 if editing
  const [comicId, setComicId] = useState(existingComicId);
  const [comicTitle, setComicTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Comic form
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('ongoing');
  const [freeChapters, setFreeChapters] = useState(5);
  const [isFeatured, setIsFeatured] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');

  // Chapter form
  const [chapterNumber, setChapterNumber] = useState(1);
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterFree, setChapterFree] = useState(true);
  const [pageFiles, setPageFiles] = useState([]);
  const [pagePreviews, setPagePreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [chapters, setChapters] = useState([]);

  const fileInputRef = useRef(null);

  // Load genres from Supabase
  useEffect(() => {
    fetch('/api/admin/genres')
      .then(r => r.json())
      .then(data => setGenres(data.genres || []))
      .catch(() => {});
  }, []);

  // If existing comic_id, load comic info
  useEffect(() => {
    if (existingComicId) {
      fetch(`/api/admin/comics/${existingComicId}`)
        .then(r => r.json())
        .then(data => {
          if (data.comic) {
            setComicTitle(data.comic.title);
            const maxCh = data.chapters?.length > 0
              ? Math.max(...data.chapters.map(c => c.chapter_number)) + 1
              : 1;
            setChapterNumber(maxCh);
          }
        })
        .catch(() => {});
    }
  }, [existingComicId]);

  // Cover preview
  useEffect(() => {
    if (coverFile) {
      const url = URL.createObjectURL(coverFile);
      setCoverPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [coverFile]);

  // Page previews
  useEffect(() => {
    const urls = pageFiles.map(f => URL.createObjectURL(f));
    setPagePreviews(urls);
    return () => urls.forEach(u => URL.revokeObjectURL(u));
  }, [pageFiles]);

  const showMsg = (msg, isError = false) => {
    setMessage(msg);
    if (!isError) setTimeout(() => setMessage(''), 5000);
  };

  // Upload a single file
  async function uploadFile(file, folder) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.url;
  }

  // Toggle genre
  function toggleGenre(genreId) {
    setSelectedGenres(prev =>
      prev.includes(genreId) ? prev.filter(id => id !== genreId) : [...prev, genreId]
    );
  }

  // Step 1: Save comic info
  async function saveComic() {
    if (!title.trim()) { showMsg('❌ Vui lòng nhập tên truyện!', true); return; }

    setSaving(true);
    try {
      let coverUrl = '';
      if (coverFile) {
        showMsg('📤 Đang upload ảnh bìa...');
        coverUrl = await uploadFile(coverFile, 'covers');
      }

      const res = await fetch('/api/admin/comics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          author,
          description,
          cover_url: coverUrl,
          status,
          free_chapters: freeChapters,
          is_featured: isFeatured,
          genre_ids: selectedGenres,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setComicId(data.comic.id);
      setComicTitle(title);
      setStep(2);
      showMsg(`✅ Đã tạo truyện "${title}" thành công! Giờ thêm chương.`);
    } catch (err) {
      showMsg(`❌ Lỗi: ${err.message}`, true);
    }
    setSaving(false);
  }

  // Handle file selection for chapter pages
  function handlePageFiles(e) {
    const files = Array.from(e.target.files);
    files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    setPageFiles(prev => [...prev, ...files]);
    // Reset input so the same files can be selected again
    e.target.value = '';
  }

  // Handle drag & drop
  function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    setPageFiles(prev => [...prev, ...files]);
  }

  // Remove a page from preview
  function removePage(idx) {
    setPageFiles(prev => prev.filter((_, i) => i !== idx));
  }

  // Upload chapter
  async function uploadChapter() {
    if (pageFiles.length === 0) { showMsg('❌ Vui lòng thêm ảnh cho chương!', true); return; }

    setUploading(true);
    setUploadProgress(0);

    try {
      const folder = `chapters/${comicId}/ch${chapterNumber}`;
      const pageUrls = [];

      for (let i = 0; i < pageFiles.length; i++) {
        showMsg(`📤 Đang upload trang ${i + 1}/${pageFiles.length}...`);
        const url = await uploadFile(pageFiles[i], folder);
        pageUrls.push({ url, order: i + 1 });
        setUploadProgress(((i + 1) / pageFiles.length) * 100);
      }

      // Save chapter to database
      const res = await fetch('/api/admin/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comic_id: comicId,
          chapter_number: chapterNumber,
          title: chapterTitle || `Chương ${chapterNumber}`,
          pages: pageUrls,
          is_free: chapterFree,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Success — reset for next chapter
      setChapters(prev => [{ number: chapterNumber, title: chapterTitle || `Chương ${chapterNumber}`, pages: pageUrls.length }, ...prev]);
      setChapterNumber(chapterNumber + 1);
      setChapterTitle('');
      setPageFiles([]);
      setPagePreviews([]);
      setUploadProgress(0);
      showMsg(`✅ Chương ${chapterNumber} đã tải lên (${pageUrls.length} trang)!`);
    } catch (err) {
      showMsg(`❌ Lỗi upload: ${err.message}`, true);
    }
    setUploading(false);
  }

  return (
    <div>
      <h1 className="admin-page-title">
        📤 {existingComicId ? `Thêm Chương — ${comicTitle || 'Đang tải...'}` : 'Tải Truyện Lên'}
      </h1>

      {/* Steps indicator */}
      {!existingComicId && (
        <div style={{display:'flex',gap:'16px',marginBottom:'24px'}}>
          <div style={{
            display:'flex',alignItems:'center',gap:'8px',padding:'8px 16px',borderRadius:'100px',
            background: step >= 1 ? 'var(--accent-dim)' : 'var(--bg-card)',
            color: step >= 1 ? 'var(--accent)' : 'var(--text-muted)',
            fontWeight:600,fontSize:'13px',
            border: step === 1 ? '1px solid var(--accent)' : '1px solid var(--border)',
          }}>
            ① Thông Tin Truyện
          </div>
          <div style={{display:'flex',alignItems:'center',color:'var(--text-muted)'}}>→</div>
          <div style={{
            display:'flex',alignItems:'center',gap:'8px',padding:'8px 16px',borderRadius:'100px',
            background: step >= 2 ? 'var(--accent-dim)' : 'var(--bg-card)',
            color: step >= 2 ? 'var(--accent)' : 'var(--text-muted)',
            fontWeight:600,fontSize:'13px',
            border: step === 2 ? '1px solid var(--accent)' : '1px solid var(--border)',
          }}>
            ② Tải Chương
          </div>
        </div>
      )}

      {/* Message */}
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

      {/* STEP 1: Comic Info */}
      {step === 1 && (
        <div className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tên Truyện *</label>
              <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="VD: Võ Luyện Đỉnh Phong" />
            </div>
            <div className="form-group">
              <label className="form-label">Tác Giả</label>
              <input className="form-input" value={author} onChange={e => setAuthor(e.target.value)} placeholder="VD: Mạc Mặc" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mô Tả</label>
            <textarea className="form-textarea" value={description} onChange={e => setDescription(e.target.value)}
                      placeholder="Mô tả nội dung truyện..." />
          </div>

          {/* Genre Selection */}
          <div className="form-group">
            <label className="form-label">Thể Loại ({selectedGenres.length} đã chọn)</label>
            <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
              {genres.map(g => (
                <button key={g.id} onClick={() => toggleGenre(g.id)}
                  style={{
                    padding:'6px 14px',fontSize:'12px',fontWeight:500,borderRadius:'100px',
                    border: selectedGenres.includes(g.id) ? '1px solid var(--accent)' : '1px solid var(--border)',
                    background: selectedGenres.includes(g.id) ? 'var(--accent-dim)' : 'var(--bg-surface)',
                    color: selectedGenres.includes(g.id) ? 'var(--accent)' : 'var(--text-secondary)',
                    cursor:'pointer',transition:'all 0.2s'
                  }}>
                  {g.icon} {g.name}
                </button>
              ))}
            </div>
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
              <input className="form-input" type="number" min="0" value={freeChapters} onChange={e => setFreeChapters(parseInt(e.target.value) || 0)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer'}}>
              <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} />
              ⭐ Đánh dấu Nổi Bật (hiện trên Hero Banner)
            </label>
          </div>

          {/* Cover Upload */}
          <div className="form-group">
            <label className="form-label">Ảnh Bìa</label>
            <div style={{display:'flex',gap:'16px',alignItems:'start'}}>
              <div className="upload-zone" style={{flex:1,padding:'20px'}}
                   onClick={() => document.getElementById('cover-input').click()}>
                <div className="upload-zone-icon">🖼️</div>
                <div className="upload-zone-text">Click để chọn ảnh bìa</div>
                <div className="upload-zone-hint">Tỷ lệ 3:4 (400×560px) | JPG, PNG, WebP</div>
                <input id="cover-input" type="file" accept="image/*" hidden
                       onChange={e => setCoverFile(e.target.files[0])} />
              </div>
              {coverPreview && (
                <div style={{width:'120px',position:'relative'}}>
                  <img src={coverPreview} alt="Cover" style={{width:'100%',borderRadius:'8px',border:'1px solid var(--border)'}} />
                  <button onClick={() => { setCoverFile(null); setCoverPreview(''); }} 
                    style={{position:'absolute',top:'-6px',right:'-6px',background:'var(--red)',color:'#fff',
                            borderRadius:'50%',width:'22px',height:'22px',fontSize:'12px',border:'none',cursor:'pointer'}}>
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          <button className="btn btn-primary" onClick={saveComic} disabled={saving}
                  style={{padding:'12px 32px',fontSize:'15px'}}>
            {saving ? '⏳ Đang lưu...' : '💾 Lưu & Tiếp Tục →'}
          </button>
        </div>
      )}

      {/* STEP 2: Upload Chapters */}
      {step === 2 && (
        <div>
          {/* Already uploaded chapters */}
          {chapters.length > 0 && (
            <div className="admin-table-wrap" style={{marginBottom:'20px'}}>
              <div className="admin-table-header">
                <h3 className="admin-table-title">✅ Chương Đã Tải Phiên Này ({chapters.length})</h3>
              </div>
              <div style={{padding:'8px'}}>
                {chapters.map((ch, i) => (
                  <div key={i} style={{
                    display:'flex',justifyContent:'space-between',alignItems:'center',
                    padding:'8px 12px',borderRadius:'var(--radius-sm)',
                    background: i % 2 === 0 ? 'transparent' : 'var(--bg-surface)'
                  }}>
                    <span style={{fontWeight:600}}>📑 Chương {ch.number}: {ch.title}</span>
                    <span style={{fontSize:'12px',color:'var(--green)',fontWeight:600}}>✅ {ch.pages} trang</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New chapter form */}
          <div className="admin-form">
            <h3 style={{marginBottom:'16px',fontSize:'16px',fontWeight:700}}>
              📑 Tải Chương {chapterNumber} {comicTitle && `— ${comicTitle}`}
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Số Chương</label>
                <input className="form-input" type="number" min="1" value={chapterNumber}
                       onChange={e => setChapterNumber(parseInt(e.target.value) || 1)} />
              </div>
              <div className="form-group">
                <label className="form-label">Tiêu Đề (tùy chọn)</label>
                <input className="form-input" value={chapterTitle}
                       onChange={e => setChapterTitle(e.target.value)}
                       placeholder={`Chương ${chapterNumber}`} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer'}}>
                <input type="checkbox" checked={chapterFree} onChange={e => setChapterFree(e.target.checked)} />
                ✅ Chương miễn phí (bỏ tick = 🔒 VIP Only)
              </label>
            </div>

            {/* Pages Upload */}
            <div className="form-group">
              <label className="form-label">Ảnh Trang ({pageFiles.length} trang đã chọn)</label>
              <div className="upload-zone"
                   onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('dragover'); }}
                   onDragLeave={e => e.currentTarget.classList.remove('dragover')}
                   onDrop={handleDrop}
                   onClick={() => fileInputRef.current?.click()}>
                <div className="upload-zone-icon">📄</div>
                <div className="upload-zone-text">Click hoặc kéo thả ảnh vào đây</div>
                <div className="upload-zone-hint">
                  Hỗ trợ chọn nhiều ảnh cùng lúc (Ctrl+A) | Sắp xếp tự động theo tên file<br/>
                  JPG, PNG, WebP | Mỗi ảnh tối đa 10MB
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" multiple hidden
                       onChange={handlePageFiles} />
              </div>

              {/* Page previews */}
              {pagePreviews.length > 0 && (
                <>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',margin:'12px 0 8px'}}>
                    <span style={{fontSize:'13px',color:'var(--text-muted)'}}>
                      📋 Thứ tự trang (kéo thả hoặc xóa để sắp xếp)
                    </span>
                    <button className="action-btn" onClick={() => fileInputRef.current?.click()}>
                      + Thêm Ảnh
                    </button>
                  </div>
                  <div className="upload-preview-grid">
                    {pagePreviews.map((url, i) => (
                      <div key={i} className="upload-preview-item">
                        <img src={url} alt={`Trang ${i + 1}`} />
                        <span className="order-badge">{i + 1}</span>
                        <button className="remove-btn" onClick={(e) => { e.stopPropagation(); removePage(i); }}>✕</button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Upload progress */}
              {uploading && (
                <div style={{marginTop:'12px'}}>
                  <div className="upload-progress">
                    <div className="upload-progress-bar" style={{width: `${uploadProgress}%`}} />
                  </div>
                  <div style={{fontSize:'12px',color:'var(--text-muted)',marginTop:'4px',textAlign:'center'}}>
                    {Math.round(uploadProgress)}% hoàn thành
                  </div>
                </div>
              )}
            </div>

            <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
              <button className="btn btn-primary" onClick={uploadChapter} disabled={uploading || pageFiles.length === 0}
                      style={{padding:'12px 32px',fontSize:'15px'}}>
                {uploading ? `⏳ Đang tải (${Math.round(uploadProgress)}%)...` : `📤 Tải Chương ${chapterNumber} (${pageFiles.length} trang)`}
              </button>
              <button className="btn btn-ghost" onClick={() => {
                setPageFiles([]); setPagePreviews([]);
              }} disabled={uploading} style={{padding:'12px 20px'}}>
                🗑️ Xóa Tất Cả Ảnh
              </button>
              {comicId && (
                <a href={`/admin/comics/${comicId}`} className="btn btn-ghost" style={{padding:'12px 20px'}}>
                  📋 Xem Truyện
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
