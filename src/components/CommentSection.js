'use client';
import { useState, useEffect } from 'react';

export default function CommentSection({ comicId, chapterId, userId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (comicId) fetchComments();
  }, [comicId, chapterId, page]);

  async function fetchComments() {
    try {
      let url = `/api/comments?comic_id=${comicId}&page=${page}`;
      if (chapterId) url += `&chapter_id=${chapterId}`;
      const res = await fetch(url);
      const data = await res.json();
      if (page === 1) {
        setComments(data.comments || []);
      } else {
        setComments(prev => [...prev, ...(data.comments || [])]);
      }
      setTotal(data.total || 0);
      setHasMore(data.hasMore || false);
    } catch {}
  }

  async function submitComment(parentId = null) {
    if (!userId) {
      alert('Vui lòng đăng nhập để bình luận!');
      return;
    }

    const content = parentId ? replyText : newComment;
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          comic_id: comicId,
          chapter_id: chapterId || null,
          content: content.trim(),
          parent_id: parentId || null
        })
      });
      const data = await res.json();
      if (data.success) {
        if (parentId) {
          // Add reply to parent
          setComments(prev => prev.map(c => {
            if (c.id === parentId) {
              return { ...c, replies: [...(c.replies || []), data.comment] };
            }
            return c;
          }));
          setReplyTo(null);
          setReplyText('');
        } else {
          setComments(prev => [data.comment, ...prev]);
          setNewComment('');
          setTotal(t => t + 1);
        }
      }
    } catch {}
    setLoading(false);
  }

  async function deleteComment(commentId) {
    if (!confirm('Xóa bình luận này?')) return;
    try {
      await fetch(`/api/comments?id=${commentId}&user_id=${userId}`, { method: 'DELETE' });
      setComments(prev => prev.filter(c => c.id !== commentId));
      setTotal(t => t - 1);
    } catch {}
  }

  function timeAgo(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
    return d.toLocaleDateString('vi-VN');
  }

  return (
    <div className="comment-section">
      <h3 className="comment-title">
        💬 Bình luận <span className="comment-count">({total})</span>
      </h3>

      {/* New comment form */}
      <div className="comment-form">
        <textarea
          className="comment-input"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder={userId ? "Viết bình luận... (hóng phần tiếp theo nào! 🔥)" : "Đăng nhập để bình luận"}
          maxLength={1000}
          rows={3}
          disabled={!userId}
        />
        <div className="comment-form-actions">
          <span className="char-count">{newComment.length}/1000</span>
          <button
            className="btn-comment-submit"
            onClick={() => submitComment()}
            disabled={!newComment.trim() || loading || !userId}
          >
            {loading ? '⏳' : '📤'} Gửi
          </button>
        </div>
      </div>

      {/* Comments list */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">
            <p>🫥 Chưa có bình luận nào</p>
            <p>Hãy là người đầu tiên bình luận!</p>
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <div className="comment-avatar">
                  {comment.avatar ? (
                    <img src={comment.avatar} alt="" />
                  ) : (
                    <span>👤</span>
                  )}
                </div>
                <div className="comment-meta">
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-time">{timeAgo(comment.created_at)}</span>
                </div>
                <div className="comment-actions-right">
                  <button
                    className="btn-reply"
                    onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                  >
                    💬 Trả lời
                  </button>
                  {comment.user_id === userId && (
                    <button className="btn-delete-comment" onClick={() => deleteComment(comment.id)}>
                      🗑️
                    </button>
                  )}
                </div>
              </div>
              <p className="comment-content">{comment.content}</p>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="comment-replies">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="reply-item">
                      <div className="comment-header">
                        <div className="comment-avatar small">
                          {reply.avatar ? <img src={reply.avatar} alt="" /> : <span>👤</span>}
                        </div>
                        <div className="comment-meta">
                          <span className="comment-author">{reply.author}</span>
                          <span className="comment-time">{timeAgo(reply.created_at)}</span>
                        </div>
                      </div>
                      <p className="comment-content">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply form */}
              {replyTo === comment.id && (
                <div className="reply-form">
                  <input
                    className="reply-input"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder={`Trả lời ${comment.author}...`}
                    maxLength={500}
                    onKeyDown={e => e.key === 'Enter' && submitComment(comment.id)}
                  />
                  <button
                    className="btn-reply-submit"
                    onClick={() => submitComment(comment.id)}
                    disabled={!replyText.trim() || loading}
                  >
                    📤
                  </button>
                </div>
              )}
            </div>
          ))
        )}

        {hasMore && (
          <button className="btn-load-more" onClick={() => setPage(p => p + 1)}>
            Xem thêm bình luận...
          </button>
        )}
      </div>
    </div>
  );
}
