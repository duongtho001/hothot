import { getServiceSupabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET /api/admin/comics — List all comics
export async function GET(req) {
  const sb = getServiceSupabase();
  if (!sb) return NextResponse.json({ error: "DB not configured" }, { status: 503 });
  
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';

    let query = sb
      .from('comics')
      .select('*', { count: 'exact' })
      .order('updated_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data, count, error } = await query;
    
    if (error) {
      console.error('Comics list error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ comics: data || [], total: count || 0, page, limit });
  } catch (err) {
    console.error('Comics API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/admin/comics — Create a new comic
export async function POST(req) {
  const sb = getServiceSupabase();
  if (!sb) return NextResponse.json({ error: "DB not configured" }, { status: 503 });
  const body = await req.json();

  const slug = body.title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const { data, error } = await sb
    .from('comics')
    .insert({
      title: body.title,
      slug,
      description: body.description || '',
      cover_url: body.cover_url || '',
      author: body.author || 'Unknown',
      status: body.status || 'ongoing',
      free_chapters: body.free_chapters || 5,
      is_featured: body.is_featured || false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Link genres
  if (body.genre_ids?.length > 0) {
    const links = body.genre_ids.map(gid => ({ comic_id: data.id, genre_id: gid }));
    await sb.from('comic_genres').insert(links);
  }

  return NextResponse.json({ comic: data });
}
