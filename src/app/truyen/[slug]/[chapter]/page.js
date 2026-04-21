import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getServiceSupabase } from '@/lib/supabase';
import { getComicBySlug, getChapter } from '@/lib/data';

async function getChapterData(slug, chapterNum) {
  const sb = getServiceSupabase();
  const chNum = parseInt(chapterNum);

  // Fallback to mock data if no Supabase
  if (!sb) {
    const mock = getComicBySlug(slug);
    if (!mock) return null;
    const ch = getChapter(mock, chNum);
    if (!ch) return null;
    const allCh = mock.chapters.map(c => ({
      chapter_number: c.number, title: c.title, is_free: true,
    })).sort((a,b) => a.chapter_number - b.chapter_number);
    return {
      comic: { ...mock, cover_url: mock.cover, view_count: mock.viewCount },
      chapter: { ...ch, chapter_number: ch.number, is_free: true, pages: ch.pages || [] },
      allChapters: allCh,
      isFree: true,
      prevChapter: allCh.find(c => c.chapter_number === chNum - 1),
      nextChapter: allCh.find(c => c.chapter_number === chNum + 1),
    };
  }

  // Get comic
  const { data: comic, error } = await sb
    .from('comics')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !comic) return null;

  // Get this chapter
  const { data: chapter } = await sb
    .from('chapters')
    .select('*')
    .eq('comic_id', comic.id)
    .eq('chapter_number', chNum)
    .single();

  if (!chapter) return null;

  // Get all chapter numbers for navigation
  const { data: allChapters } = await sb
    .from('chapters')
    .select('chapter_number, title, is_free')
    .eq('comic_id', comic.id)
    .order('chapter_number', { ascending: true });

  // Check if free
  const isFree = chapter.is_free || chapter.chapter_number <= comic.free_chapters;

  // Increment view
  sb.from('chapters').update({ view_count: (chapter.view_count || 0) + 1 }).eq('id', chapter.id).then(() => {});

  return {
    comic,
    chapter,
    allChapters: allChapters || [],
    isFree,
    prevChapter: allChapters?.find(c => c.chapter_number === chapter.chapter_number - 1),
    nextChapter: allChapters?.find(c => c.chapter_number === chapter.chapter_number + 1),
  };
}

export async function generateMetadata({ params }) {
  const { slug, chapter } = await params;
  const data = await getChapterData(slug, chapter);
  if (!data) return { title: 'Không tìm thấy' };
  return {
    title: `Chương ${data.chapter.chapter_number} - ${data.comic.title} | ComicVerse`,
  };
}

export const dynamic = 'force-dynamic';

export default async function ReaderPage({ params }) {
  const { slug, chapter: chapterNum } = await params;
  const data = await getChapterData(slug, chapterNum);

  if (!data) {
    return (
      <>
        <Header />
        <main className="page-content">
          <div className="container" style={{textAlign:'center',padding:'80px 20px'}}>
            <h1 style={{fontSize:'48px',marginBottom:'16px'}}>😢</h1>
            <h2>Không tìm thấy chương</h2>
            <Link href={`/truyen/${slug}`} className="btn btn-primary" style={{marginTop:'20px'}}>← Về Trang Truyện</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { comic, chapter, isFree, prevChapter, nextChapter } = data;
  const pages = chapter.pages || [];

  // VIP Gate
  if (!isFree) {
    return (
      <>
        <Header />
        <main className="page-content">
          <div className="container" style={{textAlign:'center',padding:'60px 20px'}}>
            <div style={{
              maxWidth:'500px',margin:'0 auto',padding:'40px',
              background:'var(--bg-card)',border:'1px solid var(--accent)',
              borderRadius:'var(--radius)',
            }}>
              <div style={{fontSize:'60px',marginBottom:'16px'}}>🔒</div>
              <h2 style={{marginBottom:'8px'}}>Chương VIP</h2>
              <p style={{color:'var(--text-muted)',marginBottom:'24px'}}>
                Chương {chapter.chapter_number} cần tài khoản VIP để đọc.<br/>
                Nâng cấp VIP để đọc không giới hạn!
              </p>
              <div style={{display:'flex',gap:'12px',justifyContent:'center'}}>
                <Link href="/vip" className="btn btn-primary" style={{padding:'12px 28px'}}>
                  💎 Nâng Cấp VIP
                </Link>
                <Link href={`/truyen/${slug}`} className="btn btn-ghost" style={{padding:'12px 28px'}}>
                  ← Quay lại
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      {/* Minimal Reader Header */}
      <div className="reader-header" style={{
        position:'sticky',top:0,zIndex:100,
        background:'var(--bg-primary)',borderBottom:'1px solid var(--border)',
        padding:'8px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',
      }}>
        <Link href={`/truyen/${slug}`} style={{color:'var(--text-muted)',fontSize:'14px'}}>
          ← {comic.title}
        </Link>
        <span style={{fontWeight:700,fontSize:'14px'}}>
          Chương {chapter.chapter_number}
        </span>
        <div style={{display:'flex',gap:'8px'}}>
          {prevChapter && (
            <Link href={`/truyen/${slug}/${prevChapter.chapter_number}`} className="btn btn-ghost" style={{padding:'4px 12px',fontSize:'12px'}}>
              ← Trước
            </Link>
          )}
          {nextChapter && (
            <Link href={`/truyen/${slug}/${nextChapter.chapter_number}`} className="btn btn-primary" style={{padding:'4px 12px',fontSize:'12px'}}>
              Sau →
            </Link>
          )}
        </div>
      </div>

      {/* Reader Content */}
      <main style={{background:'var(--bg-primary)',minHeight:'100vh'}}>
        <div style={{maxWidth:'800px',margin:'0 auto'}}>
          {pages.length > 0 ? (
            pages.sort((a, b) => a.order - b.order).map((page, idx) => (
              <img
                key={idx}
                src={page.url}
                alt={`Trang ${idx + 1}`}
                style={{width:'100%',display:'block'}}
                loading={idx > 2 ? 'lazy' : 'eager'}
              />
            ))
          ) : (
            <div style={{textAlign:'center',padding:'80px 20px',color:'var(--text-muted)'}}>
              <div style={{fontSize:'60px',marginBottom:'16px'}}>📄</div>
              <p>Chương này chưa có ảnh</p>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div style={{
          maxWidth:'800px',margin:'0 auto',padding:'20px 16px',
          display:'flex',justifyContent:'space-between',alignItems:'center',
          borderTop:'1px solid var(--border)',
        }}>
          {prevChapter ? (
            <Link href={`/truyen/${slug}/${prevChapter.chapter_number}`} className="btn btn-ghost" style={{padding:'10px 20px'}}>
              ← Chương {prevChapter.chapter_number}
            </Link>
          ) : (
            <Link href={`/truyen/${slug}`} className="btn btn-ghost" style={{padding:'10px 20px'}}>
              ← Về Truyện
            </Link>
          )}
          {nextChapter ? (
            <Link href={`/truyen/${slug}/${nextChapter.chapter_number}`} className="btn btn-primary" style={{padding:'10px 20px'}}>
              Chương {nextChapter.chapter_number} →
            </Link>
          ) : (
            <div style={{color:'var(--text-muted)',fontSize:'13px'}}>Đã hết chương</div>
          )}
        </div>
      </main>
    </>
  );
}
