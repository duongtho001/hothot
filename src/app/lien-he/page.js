import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Liên Hệ — Truyện Tranh AI',
  description: 'Liên hệ với Truyện Tranh AI để góp ý, hợp tác hoặc báo lỗi',
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="page-content">
        <div className="container" style={{maxWidth:'800px'}}>
          <h1 style={{fontSize:'28px',fontWeight:800,marginBottom:'24px',color:'var(--accent)'}}>📧 Liên Hệ</h1>
          
          <div style={{color:'var(--text-secondary)',lineHeight:1.8,fontSize:'15px'}}>
            
            <p style={{marginBottom:'24px'}}>Bạn có câu hỏi, góp ý hoặc muốn hợp tác? Hãy liên hệ với chúng tôi qua các kênh sau:</p>
            
            <div style={{display:'grid',gap:'16px',marginBottom:'32px'}}>
              {[
                {
                  icon: '💬',
                  title: 'Zalo',
                  desc: '0934415387 — Đường Thọ',
                  link: 'https://zalo.me/0934415387',
                  color: '#0068ff',
                },
                {
                  icon: '📧',
                  title: 'Email',
                  desc: 'duongthovpn@gmail.com',
                  link: 'mailto:duongthovpn@gmail.com',
                  color: '#ef4444',
                },
              ].map((item, i) => (
                <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" style={{
                  display:'flex',
                  alignItems:'center',
                  gap:'16px',
                  background:'var(--bg-card)',
                  border:'1px solid var(--border)',
                  borderRadius:'12px',
                  padding:'20px 24px',
                  transition:'all 0.2s ease',
                  textDecoration:'none',
                  color:'inherit',
                }}>
                  <div style={{
                    width:'48px',height:'48px',
                    borderRadius:'12px',
                    background:`${item.color}20`,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:'24px',flexShrink:0,
                  }}>{item.icon}</div>
                  <div>
                    <div style={{fontWeight:700,color:'var(--text-primary)',fontSize:'16px'}}>{item.title}</div>
                    <div style={{color:'var(--text-muted)',fontSize:'14px'}}>{item.desc}</div>
                  </div>
                </a>
              ))}
            </div>
            
            <div style={{
              background:'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(239,68,68,0.1))',
              border:'1px solid rgba(245,158,11,0.2)',
              borderRadius:'16px',
              padding:'32px',
              textAlign:'center',
            }}>
              <div style={{fontSize:'32px',marginBottom:'8px'}}>💝</div>
              <h2 style={{fontSize:'18px',fontWeight:700,color:'var(--text-primary)',marginBottom:'8px'}}>Thích Truyện Tranh AI?</h2>
              <p style={{color:'var(--text-muted)',fontSize:'14px',marginBottom:'16px'}}>Ủng hộ để chúng mình tạo thêm nhiều truyện hay!</p>
              <a href="/donate" style={{
                display:'inline-flex',
                padding:'12px 28px',
                background:'linear-gradient(135deg, #f59e0b, #ef4444)',
                color:'#fff',
                borderRadius:'100px',
                fontWeight:700,
                fontSize:'14px',
                textDecoration:'none',
              }}>💝 Ủng Hộ Ngay</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
