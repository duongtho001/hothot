import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';

export const metadata = {
  title: 'Ủng Hộ — Truyện Tranh AI',
  description: 'Ủng hộ để tạo thêm nhiều truyện tranh AI chất lượng cao miễn phí!',
};

export default function DonatePage() {
  return (
    <>
      <Header />
      <main className="page-content">
        <div className="container">

          {/* Hero Donate */}
          <div className="donate-hero">
            <div className="donate-hero-bg"></div>
            <div className="donate-hero-content">
              <div className="donate-icon">💝</div>
              <h1 className="donate-title">Ủng Hộ Truyện Tranh AI</h1>
              <p className="donate-subtitle">
                Mỗi đồng ủng hộ giúp chúng mình tạo thêm nhiều truyện hay hơn!<br/>
                Tất cả truyện đều <strong>MIỄN PHÍ</strong> — powered by AI 🤖
              </p>
              <div className="donate-amount-pills">
                <span className="amount-pill">☕ 10K</span>
                <span className="amount-pill hot">🍜 20K</span>
                <span className="amount-pill">🎮 50K</span>
                <span className="amount-pill">🎁 100K</span>
                <span className="amount-pill premium">💎 Tùy tâm</span>
              </div>
            </div>
          </div>

          {/* Why Donate */}
          <div className="donate-reasons">
            <div className="donate-reason-card">
              <div className="reason-icon">🎨</div>
              <h3>Tạo Ảnh AI</h3>
              <p>Chi phí server + API để tạo ảnh truyện tranh chất lượng cao bằng AI</p>
            </div>
            <div className="donate-reason-card">
              <div className="reason-icon">📖</div>
              <h3>Thêm Truyện Mới</h3>
              <p>Ủng hộ = nhiều thể loại truyện mới, nhiều tập hơn, cập nhật nhanh hơn</p>
            </div>
            <div className="donate-reason-card">
              <div className="reason-icon">🆓</div>
              <h3>Giữ Miễn Phí</h3>
              <p>Mục tiêu: tất cả truyện luôn miễn phí cho mọi người đọc</p>
            </div>
          </div>

          {/* QR Section Title */}
          <h2 className="donate-section-title">
            <span className="section-glow">📲</span> Quét Mã QR Để Ủng Hộ
          </h2>

          {/* QR Cards Grid */}
          <div className="qr-grid">
            
            {/* Bank QR */}
            <div className="qr-card bank-card">
              <div className="qr-card-header bank-header">
                <span className="qr-method-icon">🏦</span>
                <div>
                  <h3>Chuyển Khoản Ngân Hàng</h3>
                  <p className="qr-method-sub">OCB — Ngân hàng Phương Đông</p>
                </div>
              </div>
              <div className="qr-card-body">
                <div className="qr-image-wrapper bank-bg">
                  <img src="/qr/bank_qr.png" alt="QR Ngân hàng OCB" className="qr-img" />
                </div>
                <div className="qr-info">
                  <div className="qr-info-row">
                    <span className="qr-label">Chủ TK:</span>
                    <span className="qr-value">TRAN MINH GIANG</span>
                  </div>
                  <div className="qr-info-row">
                    <span className="qr-label">Nội dung CK:</span>
                    <span className="qr-value highlight">UNGHO TRUYENAI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MoMo QR */}
            <div className="qr-card momo-card">
              <div className="qr-card-header momo-header">
                <span className="qr-method-icon">📱</span>
                <div>
                  <h3>Ví MoMo</h3>
                  <p className="qr-method-sub">Quét mã hoặc chuyển trực tiếp</p>
                </div>
              </div>
              <div className="qr-card-body">
                <div className="qr-image-wrapper momo-bg">
                  <img src="/qr/momo_qr.jpg" alt="QR MoMo" className="qr-img" />
                </div>
                <div className="qr-info">
                  <div className="qr-info-row">
                    <span className="qr-label">Tên:</span>
                    <span className="qr-value">TRẦN MINH GIANG</span>
                  </div>
                  <div className="qr-info-row">
                    <span className="qr-label">Lời nhắn:</span>
                    <span className="qr-value highlight momo-text">Ủng hộ Truyện AI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Zalo QR */}
            <div className="qr-card zalo-card">
              <div className="qr-card-header zalo-header">
                <span className="qr-method-icon">💬</span>
                <div>
                  <h3>Zalo Tác Giả</h3>
                  <p className="qr-method-sub">Kết bạn & nhắn tin trực tiếp</p>
                </div>
              </div>
              <div className="qr-card-body">
                <div className="qr-image-wrapper zalo-bg">
                  <img src="/qr/zalo_qr.jpg" alt="QR Zalo" className="qr-img" />
                </div>
                <div className="qr-info">
                  <div className="qr-info-row">
                    <span className="qr-label">Tác giả:</span>
                    <span className="qr-value">Đường Thọ</span>
                  </div>
                  <div className="qr-info-row">
                    <span className="qr-label">Zalo:</span>
                    <span className="qr-value highlight zalo-text">Quét mã kết bạn</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thank You */}
          <div className="donate-thanks">
            <div className="thanks-hearts">💖✨💖</div>
            <h2>Cảm Ơn Bạn Rất Nhiều!</h2>
            <p>
              Mọi khoản ủng hộ dù nhỏ đều vô cùng ý nghĩa với chúng mình.<br/>
              Team sẽ cố gắng tạo thêm nhiều truyện hay, đẹp, hấp dẫn hơn mỗi ngày! ❤️
            </p>
            <div className="thanks-counter">
              <div className="counter-item">
                <div className="counter-value">🎨 100%</div>
                <div className="counter-label">AI Generated</div>
              </div>
              <div className="counter-item">
                <div className="counter-value">📖 FREE</div>
                <div className="counter-label">Đọc Miễn Phí</div>
              </div>
              <div className="counter-item">
                <div className="counter-value">🔄 Daily</div>
                <div className="counter-label">Cập Nhật</div>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
