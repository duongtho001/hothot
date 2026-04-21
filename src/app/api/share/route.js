import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

// POST: Share comic to Facebook and earn points
export async function POST(request) {
  try {
    const supabase = getServiceSupabase();
    if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 500 });

    const { user_id, comic_id, platform = 'facebook' } = await request.json();

    if (!user_id || !comic_id) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const pointsEarned = 2;

    // Record the share
    const { error: shareError } = await supabase
      .from('comic_shares')
      .insert({ user_id, comic_id, platform, points_earned: pointsEarned });

    if (shareError) throw shareError;

    // Add points to user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('contribution_points')
      .eq('id', user_id)
      .single();

    await supabase
      .from('profiles')
      .update({ contribution_points: (profile?.contribution_points || 0) + pointsEarned })
      .eq('id', user_id);

    // Increment share count on comic
    await supabase.rpc('increment_share_count', { p_comic_id: comic_id }).catch(() => {
      // Fallback if function doesn't exist
      supabase
        .from('comics')
        .update({ share_count: (0) + 1 })
        .eq('id', comic_id);
    });

    return NextResponse.json({
      success: true,
      points_earned: pointsEarned,
      message: `Chia sẻ thành công! +${pointsEarned} điểm cống hiến`
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
