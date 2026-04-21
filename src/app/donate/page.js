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
            <div className="bank-section-badge">📲 Quét Mã QR hoặc Bấm Chuyển Khoản</div>
            <h2 className="bank-section-title">Chuyển Khoản Ngân Hàng</h2>
            
            <div className="bank-transfer-card">
              <div className="bank-qr-side">
                <div className="bank-qr-frame">
                  <img 
                    src="https://img.vietqr.io/image/OCB-939399-compact2.png?amount=20000&addInfo=UNGHO%20TRUYENAI&accountName=TRAN%20MINH%20GIANG" 
                    alt="QR Chuyển khoản OCB" 
                  />
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
                    <span className="bank-detail-label">Số tài khoản</span>
                    <span className="bank-detail-value" style={{color:'#60a5fa',letterSpacing:'2px',fontSize:'16px'}}>939399</span>
                  </div>
                  <div className="bank-detail-item">
                    <span className="bank-detail-label">Ngân hàng</span>
                    <span className="bank-detail-value">OCB</span>
                  </div>
                  <div className="bank-detail-item">
                    <span className="bank-detail-label">Chủ tài khoản</span>
                    <span className="bank-detail-value">TRAN MINH GIANG</span>
                  </div>
                  <div className="bank-detail-item highlight-row">
                    <span className="bank-detail-label">Nội dung CK</span>
                    <span className="bank-detail-value accent">UNGHO TRUYENAI</span>
                  </div>
                </div>

                {/* Quick transfer buttons — opens banking app */}
                <div className="bank-amounts">
                  <a href="https://dl.vietqr.io/pay?app=ocb&ba=939399&bn=OCB&an=TRAN+MINH+GIANG&am=10000&info=UNGHO+TRUYENAI" 
                     target="_blank" rel="noopener" className="bank-amount-chip clickable">☕ 10K</a>
                  <a href="https://dl.vietqr.io/pay?app=ocb&ba=939399&bn=OCB&an=TRAN+MINH+GIANG&am=20000&info=UNGHO+TRUYENAI" 
                     target="_blank" rel="noopener" className="bank-amount-chip clickable active">🍜 20K</a>
                  <a href="https://dl.vietqr.io/pay?app=ocb&ba=939399&bn=OCB&an=TRAN+MINH+GIANG&am=50000&info=UNGHO+TRUYENAI" 
                     target="_blank" rel="noopener" className="bank-amount-chip clickable">🎮 50K</a>
                  <a href="https://dl.vietqr.io/pay?app=ocb&ba=939399&bn=OCB&an=TRAN+MINH+GIANG&am=100000&info=UNGHO+TRUYENAI" 
                     target="_blank" rel="noopener" className="bank-amount-chip clickable">🎁 100K</a>
                  <a href="https://dl.vietqr.io/pay?app=ocb&ba=939399&bn=OCB&an=TRAN+MINH+GIANG&info=UNGHO+TRUYENAI" 
                     target="_blank" rel="noopener" className="bank-amount-chip clickable premium">💎 Tùy tâm</a>
                </div>

                <p className="bank-note">
                  👆 <strong>Bấm vào số tiền</strong> để tự động mở app ngân hàng chuyển khoản!<br/>
                  💡 Nội dung CK: <strong>UNGHO TRUYENAI</strong>
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
