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

  // Dynamic comic pages from Supabase
  let comicPages = [];
  try {
    const sb = getServiceSupabase();
    if (sb) {
      const { data: comics } = await sb
        .from('comics')
        .select('slug, updated_at')
        .order('updated_at', { ascending: false });

      if (comics) {
        comicPages = comics.map(comic => ({
          url: `${baseUrl}/truyen/${comic.slug}`,
          lastModified: new Date(comic.updated_at),
          changeFrequency: 'weekly',
          priority: 0.8,
        }));
      }
    }
  } catch (e) {
    console.error('Sitemap error:', e);
  }

  return [...staticPages, ...comicPages];
}
