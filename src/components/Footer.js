import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <div className="footer-brand">🎨 Truyện Tranh AI</div>
          <p className="footer-desc">
            Nền tảng truyện tranh được tạo hoàn toàn bằng AI. 
            Đọc miễn phí — Ủng hộ để tạo thêm nhiều truyện hay hơn!
          </p>
        </div>
        <div>
          <div className="footer-title">Liên Kết</div>
          <div className="footer-links">
            <Link href="/" className="footer-link">Trang Chủ</Link>
            <Link href="/donate" className="footer-link">💝 Ủng Hộ</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        © 2026 Truyện Tranh AI. Powered by AI 🤖 — Made with ❤️
      </div>
    </footer>
  );
}
