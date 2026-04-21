import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

          {/* Hero */}
          <div className="donate-hero-v2">
            <div className="donate-hero-glow"></div>
            <div className="donate-hero-inner">
              <div className="donate-badge">💝 Ủng hộ dự án</div>
              <h1 className="donate-heading">
                Giúp Chúng Mình<br/>
                <span className="heading-accent">Tạo Thêm Truyện Hay</span>
              </h1>
              <p className="donate-desc">
                Mỗi đồng ủng hộ giúp duy trì server AI và tạo ra nhiều truyện tranh chất lượng cao hơn.
                Tất cả truyện luôn <strong>MIỄN PHÍ</strong> cho mọi người!
              </p>
            </div>
          </div>

          {/* Impact Cards */}
          <div className="impact-grid">
            <div className="impact-card">
              <div className="impact-icon-wrap" style={{'--c':'#f59e0b'}}>
                <span>🎨</span>
              </div>
              <h3>Tạo Ảnh AI</h3>
              <p>Chi phí API tạo hình ảnh truyện tranh chất lượng cao</p>
              <div className="impact-bar" style={{'--w':'85%','--c':'#f59e0b'}}></div>
            </div>
            <div className="impact-card">
              <div className="impact-icon-wrap" style={{'--c':'#8b5cf6'}}>
                <span>📖</span>
              </div>
              <h3>Thêm Truyện Mới</h3>
              <p>Nhiều thể loại, nhiều tập, cập nhật nhanh hơn</p>
              <div className="impact-bar" style={{'--w':'65%','--c':'#8b5cf6'}}></div>
            </div>
            <div className="impact-card">
              <div className="impact-icon-wrap" style={{'--c':'#10b981'}}>
                <span>🆓</span>
              </div>
              <h3>Giữ Miễn Phí</h3>
              <p>Mục tiêu: tất cả truyện luôn miễn phí mãi mãi</p>
              <div className="impact-bar" style={{'--w':'100%','--c':'#10b981'}}></div>
            </div>
          </div>

          {/* Bank Transfer — Main Focus */}
          <div className="donate-bank-section">
            <div className="bank-section-badge">📲 Quét Mã QR</div>
            <h2 className="bank-section-title">Chuyển Khoản Ngân Hàng</h2>
            
            <div className="bank-transfer-card">
              <div className="bank-qr-side">
                <div className="bank-qr-frame">
                  <img src="/qr/bank_qr.png" alt="QR Ngân hàng OCB" />
                </div>
                <p className="bank-qr-hint">Mở app ngân hàng → Quét mã QR</p>
              </div>
              
              <div className="bank-details-side">
                <div className="bank-logo-row">
                  <span className="bank-logo-icon">🏦</span>
                  <div>
                    <div className="bank-name">OCB — Ngân hàng Phương Đông</div>
                    <div className="bank-type">Tài khoản cá nhân</div>
                  </div>
                </div>

                <div className="bank-detail-rows">
                  <div className="bank-detail-item">
                    <span className="bank-detail-label">Chủ tài khoản</span>
                    <span className="bank-detail-value">TRAN MINH GIANG</span>
                  </div>
                  <div className="bank-detail-item highlight-row">
                    <span className="bank-detail-label">Nội dung CK</span>
                    <span className="bank-detail-value accent">UNGHO TRUYENAI</span>
                  </div>
                </div>

                <div className="bank-amounts">
                  <span className="bank-amount-chip">☕ 10K</span>
                  <span className="bank-amount-chip active">🍜 20K</span>
                  <span className="bank-amount-chip">🎮 50K</span>
                  <span className="bank-amount-chip">🎁 100K</span>
                  <span className="bank-amount-chip premium">💎 Tùy tâm</span>
                </div>

                <p className="bank-note">
                  💡 Nhập nội dung CK: <strong>UNGHO TRUYENAI</strong> để chúng mình biết bạn ủng hộ nhé!
                </p>
              </div>
            </div>
          </div>

          {/* Thank You */}
          <div className="donate-thankyou">
            <div className="thankyou-sparkle">✨</div>
            <h2>Cảm Ơn Bạn Rất Nhiều!</h2>
            <p>
              Mọi khoản ủng hộ dù nhỏ đều vô cùng ý nghĩa.<br/>
              Team sẽ cố gắng mỗi ngày để mang đến truyện hay hơn! ❤️
            </p>
            <div className="thankyou-stats">
              <div className="ty-stat">
                <div className="ty-stat-value">🎨 100%</div>
                <div className="ty-stat-label">AI Generated</div>
              </div>
              <div className="ty-stat">
                <div className="ty-stat-value">📖 FREE</div>
                <div className="ty-stat-label">Đọc Miễn Phí</div>
              </div>
              <div className="ty-stat">
                <div className="ty-stat-value">🔄 Daily</div>
                <div className="ty-stat-label">Cập Nhật</div>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
