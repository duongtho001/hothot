'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './admin.css';

const menuItems = [
  { href: '/admin', icon: '📊', label: 'Tổng Quan' },
  { href: '/admin/comics', icon: '📚', label: 'Quản Lý Truyện' },
  { href: '/admin/upload', icon: '📤', label: 'Tải Truyện Lên' },
  { href: '/admin/users', icon: '👥', label: 'Người Dùng' },
  { href: '/admin/vip-codes', icon: '🔑', label: 'Mã VIP' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-logo">
          <span style={{fontSize:'24px'}}>📚</span>
          <div>
            <div style={{fontWeight:800,fontSize:'16px',color:'var(--accent)'}}>ComicVerse</div>
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
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
