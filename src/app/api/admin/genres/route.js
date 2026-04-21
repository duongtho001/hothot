import { getServiceSupabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { GENRES } from '@/lib/data';

// GET /api/admin/genres — List all genres
export async function GET() {
  try {
    const sb = getServiceSupabase();
    if (!sb) {
      // Fallback to Vietnamese genres from data.js
      return NextResponse.json({ genres: GENRES.map(g => ({ id: g.id, name: g.name, slug: g.slug })) });
    }
    const { data, error } = await sb
      .from('genres')
      .select('*')
      .order('name');

    if (error) {
      console.error('Genres error:', error);
      return NextResponse.json({ genres: GENRES.map(g => ({ id: g.id, name: g.name, slug: g.slug })) });
    }
    
    return NextResponse.json({ genres: data || [] });
  } catch (err) {
    console.error('Genres API error:', err);
    return NextResponse.json({ genres: GENRES.map(g => ({ id: g.id, name: g.name, slug: g.slug })) });
  }
}
