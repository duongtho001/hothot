import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Điều Khoản Dịch Vụ — Truyện Tranh AI',
  description: 'Điều khoản sử dụng dịch vụ đọc truyện tranh AI miễn phí',
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="page-content">
        <div className="container" style={{maxWidth:'800px'}}>
          <h1 style={{fontSize:'28px',fontWeight:800,marginBottom:'24px',color:'var(--accent)'}}>📋 Điều Khoản Dịch Vụ</h1>
          
          <div style={{color:'var(--text-secondary)',lineHeight:1.8,fontSize:'15px'}}>
            <p style={{marginBottom:'16px'}}>Cập nhật lần cuối: 21/04/2026</p>
            
            <h2 style={{fontSize:'20px',fontWeight:700,color:'var(--text-primary)',margin:'24px 0 12px'}}>1. Giới thiệu</h2>
            <p style={{marginBottom:'16px'}}>Chào mừng bạn đến với <strong>Truyện Tranh AI</strong> — nền tảng đọc truyện tranh được tạo bằng trí tuệ nhân tạo. Khi sử dụng website, bạn đồng ý tuân thủ các điều khoản dưới đây.</p>
            
            <h2 style={{fontSize:'20px',fontWeight:700,color:'var(--text-primary)',margin:'24px 0 12px'}}>2. Nội dung</h2>
            <p style={{marginBottom:'16px'}}>Toàn bộ nội dung truyện tranh trên website được tạo bằng công nghệ AI. Chúng tôi không sao chép hay vi phạm bản quyền từ bất kỳ nguồn nào. Nội dung chỉ mang tính giải trí.</p>
            
            <h2 style={{fontSize:'20px',fontWeight:700,color:'var(--text-primary)',margin:'24px 0 12px'}}>3. Quyền sử dụng</h2>
            <p style={{marginBottom:'16px'}}>Bạn được phép đọc truyện miễn phí. Không được sao chép, phân phối lại nội dung khi chưa có sự đồng ý của chúng tôi.</p>
            
            <h2 style={{fontSize:'20px',fontWeight:700,color:'var(--text-primary)',margin:'24px 0 12px'}}>4. Ủng hộ</h2>
            <p style={{marginBottom:'16px'}}>Mọi khoản ủng hộ đều là tự nguyện và không hoàn lại. Ủng hộ giúp chúng tôi duy trì và phát triển nội dung chất lượng.</p>
            
            <h2 style={{fontSize:'20px',fontWeight:700,color:'var(--text-primary)',margin:'24px 0 12px'}}>5. Miễn trừ trách nhiệm</h2>
            <p style={{marginBottom:'16px'}}>Chúng tôi không chịu trách nhiệm về bất kỳ thiệt hại nào phát sinh từ việc sử dụng website. Nội dung AI có thể không hoàn hảo và chỉ mang tính tham khảo.</p>
            
            <h2 style={{fontSize:'20px',fontWeight:700,color:'var(--text-primary)',margin:'24px 0 12px'}}>6. Thay đổi điều khoản</h2>
            <p>Chúng tôi có quyền thay đổi điều khoản bất cứ lúc nào. Việc tiếp tục sử dụng website đồng nghĩa với việc bạn chấp nhận các thay đổi.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
