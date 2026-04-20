import { getServiceSupabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET /api/admin/genres — List all genres
export async function GET() {
  try {
    const sb = getServiceSupabase();
    const { data, error } = await sb
      .from('genres')
      .select('*')
      .order('name');

    if (error) {
      console.error('Genres error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ genres: data || [] });
  } catch (err) {
    console.error('Genres API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
