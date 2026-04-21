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
            <Link href="/moi-cap-nhat" className="footer-link">Mới Cập Nhật</Link>
            <Link href="/donate" className="footer-link">💝 Ủng Hộ</Link>
          </div>
        </div>
        <div>
          <div className="footer-title">Thông Tin</div>
          <div className="footer-links">
            <Link href="/dieu-khoan" className="footer-link">Điều khoản dịch vụ</Link>
            <Link href="/chinh-sach" className="footer-link">Chính sách bảo mật</Link>
            <Link href="/ve-chung-toi" className="footer-link">Về chúng tôi</Link>
            <Link href="/lien-he" className="footer-link">Liên hệ</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        © 2026 Truyện Tranh AI. Powered by AI 🤖 — Made with Đường Thọ ❤️
      </div>
    </footer>
  );
}
