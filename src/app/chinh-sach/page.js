import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Chính Sách Bảo Mật — Truyện Tranh AI',
  description: 'Chính sách bảo mật thông tin người dùng trên Truyện Tranh AI',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="page-content">
        <div className="container" style={{maxWidth:'800px'}}>
          <h1 style={{fontSize:'28px',fontWeight:800,marginBottom:'24px',color:'var(--accent)'}}>🔒 Chính Sách Bảo Mật</h1>
          
          <div style={{color:'var(--text-secondary)',lineHeight:1.8,fontSize:'15px'}}>
            <p style={{marginBottom:'16px'}}>Cập nhật lần cuối: 21/04/2026</p>
            
            <h2 style={{fontSize:'20px',fontWeight:700,color:'var(--text-primary)',margin:'24px 0 12px'}}>1. Thu thập thông tin</h2>
            <p style={{marginBottom:'16px'}}>Chúng tôi <strong>không</strong> yêu cầu đăng ký tài khoản để đọc truyện. Website không thu thập thông tin cá nhân nhạy cảm của bạn.</p>
            
            <h2 style={{fontSize:'20px',fontWeight:700,color:'var(--text-primary)',margin:'24px 0 12px'}}>2. Cookie</h2>
            <p style={{marginBottom:'16px'}}>Website sử dụng cookie cơ bản để cải thiện trải nghiệm (lưu chế độ đọc, lịch sử đọc). Bạn có thể tắt cookie trong trình duyệt.</p>
            
            <h2 style={{fontSize:'20px',fontWeight:700,color:'var(--text-primary)',margin:'24px 0 12px'}}>3. Dữ liệu sử dụng</h2>
            <p style={{marginBottom:'16px'}}>Chúng tôi có thể thu thập dữ liệu ẩn danh (lượt xem, thời gian đọc) để cải thiện nội dung và trải nghiệm người dùng.</p>
            
            <h2 style={{fontSize:'20px',fontWeight:700,color:'var(--text-primary)',margin:'24px 0 12px'}}>4. Bảo mật thanh toán</h2>
            <p style={{marginBottom:'16px'}}>Mọi giao dịch ủng hộ được thực hiện trực tiếp qua ngân hàng/ví điện tử. Chúng tôi không lưu trữ thông tin tài chính của bạn.</p>
            
            <h2 style={{fontSize:'20px',fontWeight:700,color:'var(--text-primary)',margin:'24px 0 12px'}}>5. Chia sẻ thông tin</h2>
            <p style={{marginBottom:'16px'}}>Chúng tôi <strong>không</strong> bán hoặc chia sẻ bất kỳ dữ liệu nào của bạn cho bên thứ ba.</p>
            
            <h2 style={{fontSize:'20px',fontWeight:700,color:'var(--text-primary)',margin:'24px 0 12px'}}>6. Liên hệ</h2>
            <p>Nếu có câu hỏi về chính sách bảo mật, vui lòng liên hệ qua trang <a href="/lien-he" style={{color:'var(--accent)'}}>Liên Hệ</a>.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
