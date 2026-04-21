'use client';
import { useState, useEffect } from 'react';

export default function DailyCheckin({ userId }) {
  const [points, setPoints] = useState(0);
  const [checkedToday, setCheckedToday] = useState(false);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (userId) fetchStatus();
  }, [userId]);

  async function fetchStatus() {
    try {
      const res = await fetch(`/api/checkin?user_id=${userId}`);
      const data = await res.json();
      setPoints(data.points || 0);
      setCheckedToday(data.checkedToday || false);
      setStreak(data.streak || 0);
    } catch {}
  }

  async function doCheckin() {
    if (checkedToday || loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });
      const data = await res.json();
      if (data.success) {
        setCheckedToday(true);
        setPoints(p => p + (data.points_earned || 6));
        setStreak(s => s + 1);
        setMessage(data.message);
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 2000);
      } else {
        setMessage(data.message || 'Đã điểm danh rồi!');
      }
    } catch {}
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  }

  if (!userId) return null;

  return (
    <div className="daily-checkin">
      <div className="checkin-info">
        <div className="checkin-points">
          <span className="points-icon">🏆</span>
          <span className="points-value">{points}</span>
          <span className="points-label">Cống hiến</span>
        </div>
        <div className="checkin-streak">
          <span>🔥 {streak} ngày</span>
        </div>
      </div>
      <button
        className={`btn-checkin ${checkedToday ? 'checked' : ''} ${showAnimation ? 'animate' : ''}`}
        onClick={doCheckin}
        disabled={checkedToday || loading}
      >
        {loading ? '⏳' : checkedToday ? '✅ Đã điểm danh' : '📋 Điểm danh (+6)'}
      </button>
      {message && <p className="checkin-message">{message}</p>}
    </div>
  );
}
