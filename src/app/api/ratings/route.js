import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

// GET: Get ratings for a comic
export async function GET(request) {
  try {
    const supabase = getServiceSupabase();
    if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 500 });

    const { searchParams } = new URL(request.url);
    const comicId = searchParams.get('comic_id');
    const userId = searchParams.get('user_id');

    if (!comicId) return NextResponse.json({ error: 'comic_id required' }, { status: 400 });

    // Get average rating and count
    const { data: ratings } = await supabase
      .from('comic_ratings')
      .select('rating')
      .eq('comic_id', comicId);

    const total = ratings?.length || 0;
    const avg = total > 0 ? (ratings.reduce((s, r) => s + r.rating, 0) / total).toFixed(1) : 0;

    // Get user's rating if logged in
    let userRating = null;
    if (userId) {
      const { data } = await supabase
        .from('comic_ratings')
        .select('rating')
        .eq('comic_id', comicId)
        .eq('user_id', userId)
        .single();
      userRating = data?.rating || null;
    }

    return NextResponse.json({ average: parseFloat(avg), total, userRating });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Submit/update rating
export async function POST(request) {
  try {
    const supabase = getServiceSupabase();
    if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 500 });

    const { user_id, comic_id, rating } = await request.json();
    if (!user_id || !comic_id || !rating) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('comic_ratings')
      .upsert(
        { user_id, comic_id, rating, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,comic_id' }
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, rating: data.rating });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
