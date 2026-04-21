'use client';
import { useState, useEffect } from 'react';

export default function StarRating({ comicId, userId, initialRating = 0, initialTotal = 0 }) {
  const [average, setAverage] = useState(initialRating);
  const [total, setTotal] = useState(initialTotal);
  const [userRating, setUserRating] = useState(null);
  const [hovered, setHovered] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (comicId) fetchRating();
  }, [comicId]);

  async function fetchRating() {
    try {
      const url = `/api/ratings?comic_id=${comicId}${userId ? `&user_id=${userId}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.average !== undefined) setAverage(data.average);
      if (data.total !== undefined) setTotal(data.total);
      if (data.userRating) setUserRating(data.userRating);
    } catch {}
  }

  async function submitRating(rating) {
    if (!userId) {
      alert('Vui lòng đăng nhập để đánh giá!');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, comic_id: comicId, rating })
      });
      const data = await res.json();
      if (data.success) {
        setUserRating(rating);
        fetchRating();
      }
    } catch {}
    setLoading(false);
  }

  return (
    <div className="star-rating-container">
      <div className="star-rating-display">
        <div className="stars-interactive" onMouseLeave={() => setHovered(0)}>
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              className={`star-btn ${star <= (hovered || userRating || 0) ? 'active' : ''} ${loading ? 'disabled' : ''}`}
              onMouseEnter={() => setHovered(star)}
              onClick={() => submitRating(star)}
              disabled={loading}
              title={`${star} sao`}
            >
              ★
            </button>
          ))}
        </div>
        <div className="rating-info">
          <span className="rating-avg">{average > 0 ? average : '—'}</span>
          <span className="rating-count">({total} đánh giá)</span>
        </div>
      </div>
      {userRating && (
        <p className="your-rating">Bạn đã đánh giá: {userRating}★</p>
      )}
    </div>
  );
}
