'use client';

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="admin-page-title">👥 Quản Lý Người Dùng</h1>
      
      <div className="stats-grid" style={{marginBottom:'24px'}}>
        <div className="stat-card">
          <div className="stat-card-icon">👥</div>
          <div className="stat-card-value">0</div>
          <div className="stat-card-label">Tổng Người Dùng</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">💎</div>
          <div className="stat-card-value">0</div>
          <div className="stat-card-label">VIP Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">🆕</div>
          <div className="stat-card-value">0</div>
          <div className="stat-card-label">Hôm Nay</div>
        </div>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h3 className="admin-table-title">Danh Sách Người Dùng</h3>
        </div>
        <div style={{padding:'60px 20px',textAlign:'center',color:'var(--text-muted)'}}>
          <div style={{fontSize:'40px',marginBottom:'12px'}}>🔐</div>
          <p>Tính năng quản lý người dùng sẽ hoạt động sau khi tích hợp Supabase Auth.</p>
          <p style={{fontSize:'13px',marginTop:'8px'}}>Cần setup đăng nhập/đăng ký trước.</p>
        </div>
      </div>
    </div>
  );
}
