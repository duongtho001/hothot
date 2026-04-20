'use client';
import { useState, useEffect } from 'react';

export default function AdminVIPCodesPage() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState('30d');
  const [quantity, setQuantity] = useState(5);
  const [message, setMessage] = useState('');

  useEffect(() => { loadCodes(); }, []);

  async function loadCodes() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/vip-codes');
      const data = await res.json();
      setCodes(data.codes || []);
    } catch (e) {}
    setLoading(false);
  }

  async function generateCodes() {
    setGenerating(true);
    try {
      const res = await fetch('/api/admin/vip-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, quantity }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessage(`✅ Đã tạo ${data.codes?.length || quantity} mã VIP ${plan}!`);
      setTimeout(() => setMessage(''), 5000);
      loadCodes();
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
    setGenerating(false);
  }

  const planLabels = { '7d': '7 Ngày', '30d': '30 Ngày', '90d': '90 Ngày', 'lifetime': 'Vĩnh Viễn' };

  return (
    <div>
      <h1 className="admin-page-title">🔑 Quản Lý Mã VIP</h1>

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

      {/* Generate form */}
      <div className="admin-form" style={{marginBottom:'24px'}}>
        <h3 style={{marginBottom:'16px',fontWeight:700}}>🎲 Tạo Mã Mới</h3>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Gói VIP</label>
            <select className="form-select" value={plan} onChange={e => setPlan(e.target.value)}>
              <option value="7d">7 Ngày — 29.000đ</option>
              <option value="30d">30 Ngày — 79.000đ</option>
              <option value="90d">90 Ngày — 199.000đ</option>
              <option value="lifetime">Vĩnh Viễn — 499.000đ</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Số Lượng</label>
            <input className="form-input" type="number" min="1" max="50" value={quantity}
                   onChange={e => setQuantity(parseInt(e.target.value) || 1)} />
          </div>
        </div>
        <button className="btn btn-primary" onClick={generateCodes} disabled={generating}
                style={{padding:'10px 24px'}}>
          {generating ? '⏳ Đang tạo...' : '🎲 Tạo Mã'}
        </button>
      </div>

      {/* Codes Table */}
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h3 className="admin-table-title">Danh Sách Mã ({codes.length})</h3>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Gói</th>
              <th>Trạng Thái</th>
              <th>Ngày Tạo</th>
              <th>Ngày Dùng</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>Đang tải...</td></tr>
            ) : codes.length === 0 ? (
              <tr><td colSpan={5} style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>Chưa có mã nào</td></tr>
            ) : codes.map(c => (
              <tr key={c.id}>
                <td>
                  <code style={{
                    background:'var(--bg-surface)',padding:'4px 10px',borderRadius:'4px',
                    fontSize:'13px',fontWeight:600,letterSpacing:'1px',
                    color: c.is_used ? 'var(--text-muted)' : 'var(--accent)',
                    cursor:'pointer'
                  }} onClick={() => { navigator.clipboard.writeText(c.code); setMessage(`📋 Đã copy: ${c.code}`); setTimeout(() => setMessage(''), 2000); }}>
                    {c.code}
                  </code>
                </td>
                <td>
                  <span style={{fontSize:'12px',fontWeight:600}}>{planLabels[c.plan] || c.plan}</span>
                </td>
                <td>
                  {c.is_used ? (
                    <span className="status-badge status-completed">Đã Dùng</span>
                  ) : (
                    <span className="status-badge status-ongoing">Chưa Dùng</span>
                  )}
                </td>
                <td style={{fontSize:'13px',color:'var(--text-muted)'}}>
                  {new Date(c.created_at).toLocaleDateString('vi-VN')}
                </td>
                <td style={{fontSize:'13px',color:'var(--text-muted)'}}>
                  {c.used_at ? new Date(c.used_at).toLocaleDateString('vi-VN') : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
