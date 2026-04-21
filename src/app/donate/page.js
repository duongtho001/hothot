'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const BANK_ID = 'OCB';      // Mã ngân hàng VietQR
const ACCOUNT = '939399';
const ACCOUNT_NAME = 'TRAN MINH GIANG';
const MEMO = 'UNGHO TRUYENAI';

const AMOUNTS = [
  { label: '☕ 10K',  value: 10000 },
  { label: '🍜 20K',  value: 20000 },
  { label: '🎮 50K',  value: 50000 },
  { label: '🎁 100K', value: 100000 },
  { label: '💎 Tùy tâm', value: 0 },
];

function getQRUrl(amount) {
  const base = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT}-compact2.png`;
  const params = new URLSearchParams({
    accountName: ACCOUNT_NAME,
    addInfo: MEMO,
  });
  if (amount > 0) params.set('amount', amount.toString());
  return `${base}?${params.toString()}`;
}

function getDeepLink(amount) {
  // VietQR deep link — mở app ngân hàng OCB hoặc app hỗ trợ VietQR
  const params = new URLSearchParams({
    app: 'ocb',
    ba: ACCOUNT,
    bn: BANK_ID,
    an: ACCOUNT_NAME,
    info: MEMO,
  });
  if (amount > 0) params.set('am', amount.toString());
  return `https://dl.vietqr.io/pay?${params.toString()}`;
}

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState(20000);

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

          {/* Bank Transfer */}
          <div className="donate-bank-section">
            <div className="bank-section-badge">📲 Quét QR hoặc Bấm Chuyển Khoản</div>
            <h2 className="bank-section-title">Chuyển Khoản Ngân Hàng</h2>
            
            <div className="bank-transfer-card">
              <div className="bank-qr-side">
                <div className="bank-qr-frame">
                  <img 
                    src={getQRUrl(selectedAmount)} 
                    alt="QR Chuyển khoản OCB"
                    key={selectedAmount}
                  />
                </div>
                <p className="bank-qr-hint">
                  {selectedAmount > 0 
                    ? `Quét QR — ${(selectedAmount/1000).toFixed(0)}K VNĐ` 
                    : 'Quét QR — Nhập số tiền tùy ý'}
                </p>
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

                {/* Chọn số tiền — QR thay đổi theo */}
                <div>
                  <p style={{fontSize:'12px',color:'var(--text-muted)',marginBottom:'8px'}}>Chọn số tiền:</p>
                  <div className="bank-amounts">
                    {AMOUNTS.map(a => (
                      <button 
                        key={a.value}
                        className={`bank-amount-chip clickable ${selectedAmount === a.value ? 'active' : ''} ${a.value === 0 ? 'premium' : ''}`}
                        onClick={() => setSelectedAmount(a.value)}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* NÚT CHUYỂN KHOẢN CHÍNH */}
                <a 
                  href={getDeepLink(selectedAmount)}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-transfer-now"
                >
                  <span className="btn-transfer-icon">🏦</span>
                  <span>
                    <span className="btn-transfer-text">Chuyển khoản ngay</span>
                    <span className="btn-transfer-sub">
                      {selectedAmount > 0 
                        ? `${(selectedAmount/1000).toFixed(0)},000 VNĐ — Mở app ngân hàng` 
                        : 'Mở app ngân hàng — Nhập số tiền tùy ý'}
                    </span>
                  </span>
                </a>

                <p className="bank-note">
                  👆 Bấm <strong>Chuyển khoản ngay</strong> → Tự mở app ngân hàng với thông tin đã điền sẵn!
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
