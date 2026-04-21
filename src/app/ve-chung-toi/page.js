import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Về Chúng Tôi — Truyện Tranh AI',
  description: 'Tìm hiểu về Truyện Tranh AI - nền tảng đọc truyện tranh được tạo bằng AI đầu tiên tại Việt Nam',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="page-content">
        <div className="container" style={{maxWidth:'800px'}}>
          <h1 style={{fontSize:'28px',fontWeight:800,marginBottom:'24px',color:'var(--accent)'}}>🎨 Về Chúng Tôi</h1>
          
          <div style={{color:'var(--text-secondary)',lineHeight:1.8,fontSize:'15px'}}>
            
            <div style={{
              background:'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(139,92,246,0.1))',
              border:'1px solid rgba(245,158,11,0.2)',
              borderRadius:'16px',
              padding:'32px',
              marginBottom:'32px',
              textAlign:'center',
            }}>
              <div style={{fontSize:'48px',marginBottom:'12px'}}>🎨</div>
              <h2 style={{fontSize:'24px',fontWeight:800,color:'var(--text-primary)',marginBottom:'8px'}}>Truyện Tranh AI</h2>
              <p style={{color:'var(--accent)',fontWeight:600}}>Powered by AI 🤖 — Made with Đường Thọ ❤️</p>
            </div>
            
            <h2 style={{fontSize:'20px',fontWeight:700,color:'var(--text-primary)',margin:'24px 0 12px'}}>Chúng tôi là ai?</h2>
            <p style={{marginBottom:'16px'}}><strong>Truyện Tranh AI</strong> là dự án cá nhân được tạo bởi <strong>Đường Thọ</strong> — sử dụng công nghệ trí tuệ nhân tạo để tạo ra những bộ truyện tranh độc đáo, chất lượng cao hoàn toàn miễn phí.</p>
            
            <h2 style={{fontSize:'20px',fontWeight:700,color:'var(--text-primary)',margin:'24px 0 12px'}}>Sứ mệnh</h2>
            <p style={{marginBottom:'16px'}}>Mang nội dung giải trí sáng tạo, đa thể loại đến tất cả mọi người. Chúng tôi tin rằng AI có thể tạo ra những câu chuyện hấp dẫn, hình ảnh đẹp mắt mà ai cũng có thể thưởng thức.</p>
            
            <h2 style={{fontSize:'20px',fontWeight:700,color:'var(--text-primary)',margin:'24px 0 12px'}}>Công nghệ</h2>
            <p style={{marginBottom:'16px'}}>Sử dụng bộ công cụ <strong>ComicGenius AI</strong> tự phát triển — tích hợp các mô hình AI tiên tiến nhất để tạo cốt truyện, nhân vật, hình ảnh và bố cục truyện tranh chuyên nghiệp.</p>
            
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'16px',margin:'24px 0'}}>
              {[
                { icon: '📖', label: '12+', desc: 'Bộ truyện' },
                { icon: '🎨', label: '21', desc: 'Thể loại' },
                { icon: '🤖', label: 'AI', desc: '100% tạo bằng AI' },
                { icon: '💝', label: 'FREE', desc: 'Miễn phí hoàn toàn' },
              ].map((item, i) => (
                <div key={i} style={{
                  background:'var(--bg-card)',
                  border:'1px solid var(--border)',
                  borderRadius:'12px',
                  padding:'20px',
                  textAlign:'center',
                }}>
                  <div style={{fontSize:'32px',marginBottom:'8px'}}>{item.icon}</div>
                  <div style={{fontSize:'24px',fontWeight:800,color:'var(--accent)'}}>{item.label}</div>
                  <div style={{fontSize:'13px',color:'var(--text-muted)'}}>{item.desc}</div>
                </div>
              ))}
            </div>
            
            <h2 style={{fontSize:'20px',fontWeight:700,color:'var(--text-primary)',margin:'24px 0 12px'}}>Ủng hộ</h2>
            <p>Nếu bạn thích nội dung, hãy <a href="/donate" style={{color:'var(--accent)',fontWeight:700}}>ủng hộ chúng mình</a> để tạo thêm nhiều truyện hay hơn nữa! 💝</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
