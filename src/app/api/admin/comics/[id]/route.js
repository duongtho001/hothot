import { getServiceSupabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET /api/admin/comics/[id] — Get single comic with chapters
export async function GET(req, { params }) {
  const sb = getServiceSupabase();
  if (!sb) return NextResponse.json({ error: "DB not configured" }, { status: 503 });
  const { id } = await params;

  const { data: comic, error } = await sb
    .from('comics')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });

  const { data: chapters } = await sb
    .from('chapters')
    .select('id, chapter_number, title, is_free, view_count, created_at, pages')
    .eq('comic_id', id)
    .order('chapter_number', { ascending: false });

  const { data: genres } = await sb
    .from('comic_genres')
    .select('genre_id, genres(id, name, slug, icon)')
    .eq('comic_id', id);

  return NextResponse.json({ 
    comic, 
    chapters: chapters || [],
    genres: (genres || []).map(g => g.genres),
  });
}

// PUT /api/admin/comics/[id] — Update comic
export async function PUT(req, { params }) {
  const sb = getServiceSupabase();
  if (!sb) return NextResponse.json({ error: "DB not configured" }, { status: 503 });
  const { id } = await params;
  const body = await req.json();

  const { data, error } = await sb
    .from('comics')
    .update({
      title: body.title,
      description: body.description,
      cover_url: body.cover_url,
      author: body.author,
      status: body.status,
      free_chapters: body.free_chapters,
      is_featured: body.is_featured,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Update genres
  if (body.genre_ids) {
    await sb.from('comic_genres').delete().eq('comic_id', id);
    if (body.genre_ids.length > 0) {
      const links = body.genre_ids.map(gid => ({ comic_id: id, genre_id: gid }));
      await sb.from('comic_genres').insert(links);
    }
  }

  return NextResponse.json({ comic: data });
}

// DELETE /api/admin/comics/[id] — Delete comic
export async function DELETE(req, { params }) {
  const sb = getServiceSupabase();
  if (!sb) return NextResponse.json({ error: "DB not configured" }, { status: 503 });
  const { id } = await params;

  const { error } = await sb.from('comics').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
