'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import './admin.css';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Minhyang18@@';

const menuItems = [
  { href: '/admin', icon: '📊', label: 'Tổng Quan' },
  { href: '/admin/comics', icon: '📚', label: 'Quản Lý Truyện' },
  { href: '/admin/upload', icon: '📤', label: 'Tải Truyện Lên' },
  { href: '/admin/users', icon: '👥', label: 'Người Dùng' },
  { href: '/admin/vip-codes', icon: '🔑', label: 'Mã VIP' },
];

function AdminLoginGate({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('admin_auth', btoa(password + '_' + Date.now()));
      onLogin();
    } else {
      setError('Sai mật khẩu!');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: 'rgba(30,41,59,0.95)',
        border: '1px solid rgba(245,158,11,0.3)',
        borderRadius: '16px',
        padding: '48px 40px',
        maxWidth: '420px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        animation: shake ? 'shake 0.5s ease' : 'none',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
        <h2 style={{
          fontSize: '24px', fontWeight: 800,
          background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: '8px',
        }}>Admin Panel</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '28px' }}>
          Nhập mật khẩu để truy cập quản trị
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(''); }}
          placeholder="Mật khẩu..."
          autoFocus
          style={{
            width: '100%',
            padding: '14px 18px',
            fontSize: '16px',
            background: 'rgba(15,23,42,0.8)',
            border: error ? '2px solid #ef4444' : '2px solid rgba(245,158,11,0.3)',
            borderRadius: '10px',
            color: '#e2e8f0',
            outline: 'none',
            marginBottom: '16px',
            transition: 'border 0.3s',
          }}
        />

        {error && (
          <div style={{
            color: '#ef4444', fontSize: '13px',
            marginBottom: '12px', fontWeight: 600,
          }}>⚠️ {error}</div>
        )}

        <button type="submit" style={{
          width: '100%',
          padding: '14px',
          fontSize: '16px',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseOver={(e) => { e.target.style.transform = 'scale(1.02)'; e.target.style.boxShadow = '0 8px 24px rgba(245,158,11,0.4)'; }}
        onMouseOut={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = 'none'; }}
        >
          🔑 Đăng Nhập
        </button>

        <Link href="/" style={{
          display: 'block', marginTop: '20px',
          color: '#64748b', fontSize: '13px', textDecoration: 'none',
        }}>
          ← Về Trang Chủ
        </Link>
      </form>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth) {
      try {
        const decoded = atob(auth);
        const [pwd] = decoded.split('_');
        if (pwd === ADMIN_PASSWORD) {
          setIsAuthenticated(true);
        }
      } catch {}
    }
    setChecking(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
  };

  if (checking) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: '#0f172a', color: '#94a3b8',
      }}>
        Đang kiểm tra...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginGate onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-logo">
          <span style={{fontSize:'24px'}}>📚</span>
          <div>
            <div style={{fontWeight:800,fontSize:'16px',color:'var(--accent)'}}>Truyện Tranh AI</div>
            <div style={{fontSize:'10px',color:'var(--text-muted)',letterSpacing:'1px'}}>ADMIN PANEL</div>
          </div>
        </Link>

        <nav className="admin-nav">
          {menuItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link href="/" className="admin-nav-item" style={{color:'var(--text-muted)'}}>
            <span className="admin-nav-icon">🌐</span>
            <span>Xem Trang Web</span>
          </Link>
          <button
            onClick={handleLogout}
            className="admin-nav-item"
            style={{
              color:'#ef4444', background:'none', border:'none',
              cursor:'pointer', width:'100%', textAlign:'left',
              padding:'10px 16px', display:'flex', alignItems:'center', gap:'10px',
              fontSize:'14px',
            }}
          >
            <span className="admin-nav-icon">🚪</span>
            <span>Đăng Xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
