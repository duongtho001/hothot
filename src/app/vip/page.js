import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Nâng Cấp VIP — ComicVerse',
  description: 'Nâng cấp tài khoản VIP để đọc truyện không giới hạn tại ComicVerse.',
};

const plans = [
  { id: '7d', name: '7 Ngày', price: '29.000đ', pricePerDay: '~4.100đ/ngày', popular: false, icon: '⚡' },
  { id: '30d', name: '30 Ngày', price: '79.000đ', pricePerDay: '~2.600đ/ngày', popular: true, icon: '🔥', save: 'Tiết kiệm 37%' },
  { id: '90d', name: '90 Ngày', price: '199.000đ', pricePerDay: '~2.200đ/ngày', popular: false, icon: '💎', save: 'Tiết kiệm 46%' },
  { id: 'lifetime', name: 'Vĩnh Viễn', price: '499.000đ', pricePerDay: 'Một lần duy nhất', popular: false, icon: '👑', save: 'Tốt nhất' },
];

const benefits = [
  { icon: '📖', text: 'Đọc tất cả chương VIP không giới hạn' },
  { icon: '🚀', text: 'Đọc sớm chương mới trước 24h' },
  { icon: '🚫', text: 'Không quảng cáo' },
  { icon: '⬇️', text: 'Tải truyện đọc offline' },
  { icon: '🎨', text: 'Badge VIP độc quyền' },
  { icon: '💬', text: 'Ưu tiên hỗ trợ' },
];

export default function VIPPage() {
  return (
    <>
      <Header />
      <main className="page-content">
        <div className="container" style={{maxWidth:'900px'}}>
          
          {/* Hero */}
          <div style={{
            textAlign:'center',padding:'48px 20px',marginBottom:'40px',
            background:'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(236,72,153,0.08))',
            borderRadius:'var(--radius)',border:'1px solid rgba(245,158,11,0.15)'
          }}>
            <div style={{fontSize:'56px',marginBottom:'16px'}}>💎</div>
            <h1 style={{fontSize:'32px',fontWeight:800,marginBottom:'8px'}}>
              Nâng Cấp <span style={{color:'var(--accent)'}}>VIP</span>
            </h1>
            <p style={{color:'var(--text-secondary)',fontSize:'16px',maxWidth:'500px',margin:'0 auto'}}>
              Mở khóa toàn bộ kho truyện, đọc không giới hạn mọi lúc mọi nơi
            </p>
          </div>

          {/* Plans */}
          <div style={{
            display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',
            gap:'16px',marginBottom:'48px'
          }}>
            {plans.map(plan => (
              <div key={plan.id} style={{
                background:'var(--bg-card)',border: plan.popular ? '2px solid var(--accent)' : '1px solid var(--border)',
                borderRadius:'var(--radius)',padding:'24px 20px',textAlign:'center',
                position:'relative',transition:'var(--transition)',cursor:'pointer',
              }}>
                {plan.popular && (
                  <div style={{
                    position:'absolute',top:'-12px',left:'50%',transform:'translateX(-50%)',
                    background:'linear-gradient(135deg, var(--accent), #e67e22)',
                    color:'#fff',padding:'4px 16px',borderRadius:'100px',
                    fontSize:'11px',fontWeight:700,whiteSpace:'nowrap'
                  }}>
                    PHỔ BIẾN NHẤT
                  </div>
                )}
                <div style={{fontSize:'36px',marginBottom:'8px'}}>{plan.icon}</div>
                <h3 style={{fontSize:'18px',fontWeight:700,marginBottom:'4px'}}>{plan.name}</h3>
                <div style={{fontSize:'28px',fontWeight:800,color:'var(--accent)',marginBottom:'4px'}}>
                  {plan.price}
                </div>
                <div style={{fontSize:'12px',color:'var(--text-muted)',marginBottom:'16px'}}>
                  {plan.pricePerDay}
                </div>
                {plan.save && (
                  <div style={{
                    fontSize:'11px',color:'var(--green)',fontWeight:600,marginBottom:'12px'
                  }}>
                    ✨ {plan.save}
                  </div>
                )}
                <button className="btn btn-primary" style={{
                  width:'100%',padding:'10px',
                  background: plan.popular 
                    ? 'linear-gradient(135deg, var(--accent), #e67e22)' 
                    : 'var(--bg-surface)',
                  color: plan.popular ? '#fff' : 'var(--text-primary)',
                  border: plan.popular ? 'none' : '1px solid var(--border)'
                }}>
                  Chọn Gói
                </button>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div style={{
            background:'var(--bg-card)',borderRadius:'var(--radius)',
            border:'1px solid var(--border)',padding:'32px',marginBottom:'32px'
          }}>
            <h2 style={{fontSize:'20px',fontWeight:700,marginBottom:'24px',textAlign:'center'}}>
              🎁 Quyền Lợi VIP
            </h2>
            <div style={{
              display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))',gap:'16px'
            }}>
              {benefits.map((b, i) => (
                <div key={i} style={{
                  display:'flex',alignItems:'center',gap:'12px',
                  padding:'12px 16px',background:'var(--bg-surface)',
                  borderRadius:'var(--radius-sm)'
                }}>
                  <span style={{fontSize:'24px'}}>{b.icon}</span>
                  <span style={{fontSize:'14px'}}>{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* VIP Code Input */}
          <div style={{
            background:'var(--bg-card)',borderRadius:'var(--radius)',
            border:'1px solid var(--border)',padding:'32px',textAlign:'center'
          }}>
            <h3 style={{fontSize:'18px',fontWeight:700,marginBottom:'8px'}}>
              🔑 Có Mã VIP?
            </h3>
            <p style={{fontSize:'13px',color:'var(--text-muted)',marginBottom:'16px'}}>
              Nhập mã kích hoạt VIP bên dưới
            </p>
            <div style={{
              display:'flex',gap:'8px',maxWidth:'400px',margin:'0 auto'
            }}>
              <input 
                type="text" 
                placeholder="Nhập mã VIP..." 
                style={{
                  flex:1,padding:'10px 16px',background:'var(--bg-surface)',
                  border:'1px solid var(--border)',borderRadius:'var(--radius-sm)',
                  color:'var(--text-primary)',fontSize:'14px',fontFamily:'inherit'
                }}
              />
              <button className="btn btn-primary" style={{padding:'10px 24px'}}>
                Kích Hoạt
              </button>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
