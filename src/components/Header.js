'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState('');

  return (
    <>
      {/* New Updates Ticker */}
      <div className="updates-ticker">
        <div className="ticker-inner">
          <span className="ticker-label">🔔 MỚI</span>
          <div className="ticker-scroll">
            <span className="ticker-item">📖 Cập nhật liên tục truyện tranh AI mới mỗi ngày!</span>
            <span className="ticker-item">✨ Truyện được tạo 100% bằng trí tuệ nhân tạo</span>
            <span className="ticker-item">💝 Ủng hộ để chúng mình tạo thêm nhiều truyện hay!</span>
          </div>
        </div>
      </div>

      <header className="header">
        <div className="header-inner">
          {/* Logo */}
          <Link href="/" className="logo">
            <img src="/logo.png" alt="Logo" className="logo-img" />
            <span>Truyện Tranh AI</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="nav-menu">
            <Link href="/" className="nav-item active">Trang Chủ</Link>
            <Link href="/moi-cap-nhat" className="nav-item">Mới Cập Nhật</Link>
            <Link href="/donate" className="nav-item" style={{color:'var(--accent)',fontWeight:700}}>💝 Ủng Hộ</Link>
          </nav>

          {/* Search */}
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Tìm truyện..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Mobile Toggle */}
          <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenu && (
          <div className="mobile-menu-overlay" onClick={() => setMobileMenu(false)}>
            <nav className="mobile-menu" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-search">
                <span>🔍</span>
                <input 
                  type="text" 
                  placeholder="Tìm truyện..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Link href="/" className="mobile-menu-item" onClick={() => setMobileMenu(false)}>
                🏠 Trang Chủ
              </Link>
              <Link href="/moi-cap-nhat" className="mobile-menu-item" onClick={() => setMobileMenu(false)}>
                🕐 Mới Cập Nhật
              </Link>
              <Link href="/donate" className="mobile-menu-item donate-link" onClick={() => setMobileMenu(false)}>
                💝 Ủng Hộ Tác Giả
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
