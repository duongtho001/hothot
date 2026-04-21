import { getServiceSupabase } from '@/lib/supabase';

export default async function sitemap() {
  const baseUrl = 'https://truyentranhai.com';
  
  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/moi-cap-nhat`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/donate`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/dieu-khoan`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/chinh-sach`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/ve-chung-toi`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/lien-he`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ];

  // Dynamic pages from Supabase
  let comicPages = [];
  let chapterPages = [];

  try {
    const sb = getServiceSupabase();
    if (sb) {
      // Get all comics with their slugs
      const { data: comics } = await sb
        .from('comics')
        .select('id, slug, updated_at')
        .order('updated_at', { ascending: false });

      if (comics) {
        // Comic detail pages
        comicPages = comics.map(comic => ({
          url: `${baseUrl}/truyen/${comic.slug}`,
          lastModified: new Date(comic.updated_at),
          changeFrequency: 'weekly',
          priority: 0.8,
        }));

        // Get chapters for each comic (reading pages)
        const { data: chapters } = await sb
          .from('chapters')
          .select('comic_id, chapter_number, updated_at')
          .order('updated_at', { ascending: false });

        if (chapters && comics) {
          const slugMap = {};
          comics.forEach(c => { slugMap[c.id] = c.slug; });

          chapterPages = chapters
            .filter(ch => slugMap[ch.comic_id])
            .map(ch => ({
              url: `${baseUrl}/truyen/${slugMap[ch.comic_id]}/${ch.chapter_number}`,
              lastModified: new Date(ch.updated_at),
              changeFrequency: 'monthly',
              priority: 0.7,
            }));
        }
      }
    }
  } catch (e) {
    console.error('Sitemap error:', e);
  }

  return [...staticPages, ...comicPages, ...chapterPages];
}
