import { getServiceSupabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// POST /api/admin/chapters — Create/update chapter with pages
export async function POST(req) {
  const sb = getServiceSupabase();
  const body = await req.json();

  const { comic_id, chapter_number, title, pages, is_free } = body;

  if (!comic_id || !chapter_number) {
    return NextResponse.json({ error: 'comic_id and chapter_number required' }, { status: 400 });
  }

  // Upsert: insert or update if exists
  const { data, error } = await sb
    .from('chapters')
    .upsert({
      comic_id,
      chapter_number,
      title: title || `Chương ${chapter_number}`,
      pages: pages || [],
      is_free: is_free !== undefined ? is_free : true,
    }, { onConflict: 'comic_id,chapter_number' })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Update comic's updated_at
  await sb.from('comics').update({ updated_at: new Date().toISOString() }).eq('id', comic_id);

  return NextResponse.json({ chapter: data });
}

// DELETE /api/admin/chapters?id=xxx — Delete chapter
export async function DELETE(req) {
  const sb = getServiceSupabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { error } = await sb.from('chapters').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
