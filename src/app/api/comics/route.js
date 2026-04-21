import { getServiceSupabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET /api/comics — Public: list comics OR get single comic by slug
export async function GET(req) {
  const sb = getServiceSupabase();
  if (!sb) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const featured = searchParams.get('featured');
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    if (slug) {
      // Get single comic by slug
      const { data: comic, error } = await sb
        .from('comics')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !comic) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }

      // Get chapters
      const { data: chapters } = await sb
        .from('chapters')
        .select('id, chapter_number, title, is_free, view_count, created_at, pages')
        .eq('comic_id', comic.id)
        .order('chapter_number', { ascending: true });

      // Get genres
      const { data: comicGenres } = await sb
        .from('comic_genres')
        .select('genre_id, genres(id, name, slug, icon)')
        .eq('comic_id', comic.id);

      // Increment view count
      await sb.from('comics').update({ view_count: comic.view_count + 1 }).eq('id', comic.id);

      return NextResponse.json({ 
        comic, 
        chapters: chapters || [],
        genres: comicGenres?.map(cg => cg.genres).filter(Boolean) || []
      });
    }

    // List comics
    let query = sb
      .from('comics')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ comics: data || [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
