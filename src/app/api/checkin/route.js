import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

// POST: Daily check-in
export async function POST(request) {
  try {
    const supabase = getServiceSupabase();
    if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 500 });

    const { user_id } = await request.json();
    if (!user_id) return NextResponse.json({ error: 'user_id required' }, { status: 400 });

    // Call the stored function
    const { data, error } = await supabase.rpc('do_daily_checkin', { p_user_id: user_id });

    if (error) {
      // Already checked in today
      if (error.message.includes('duplicate') || error.message.includes('unique')) {
        return NextResponse.json({ success: false, message: 'Đã điểm danh hôm nay rồi!' });
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET: Check-in status for a user
export async function GET(request) {
  try {
    const supabase = getServiceSupabase();
    if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 500 });

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    if (!userId) return NextResponse.json({ error: 'user_id required' }, { status: 400 });

    // Get profile with points
    const { data: profile } = await supabase
      .from('profiles')
      .select('contribution_points, last_checkin')
      .eq('id', userId)
      .single();

    // Get check-in history (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: history } = await supabase
      .from('daily_checkins')
      .select('checked_at, points_earned')
      .eq('user_id', userId)
      .gte('checked_at', thirtyDaysAgo.toISOString().split('T')[0])
      .order('checked_at', { ascending: false });

    const today = new Date().toISOString().split('T')[0];
    const checkedToday = history?.some(h => h.checked_at === today) || false;

    return NextResponse.json({
      points: profile?.contribution_points || 0,
      checkedToday,
      streak: history?.length || 0,
      history: history || []
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
