import { getServiceSupabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET /api/admin/stats — Dashboard statistics
export async function GET() {
  const sb = getServiceSupabase();
  if (!sb) return NextResponse.json({ error: "DB not configured" }, { status: 503 });
  
  try {
    const [
      { count: totalComics },
      { count: totalChapters },
      { data: viewsData },
      { count: totalUsers },
      { count: totalVIP },
    ] = await Promise.all([
      sb.from('comics').select('*', { count: 'exact', head: true }),
      sb.from('chapters').select('*', { count: 'exact', head: true }),
      sb.from('comics').select('view_count'),
      sb.from('profiles').select('*', { count: 'exact', head: true }),
      sb.from('vip_subscriptions').select('*', { count: 'exact', head: true })
        .gte('expires_at', new Date().toISOString()),
    ]);

    const totalViews = (viewsData || []).reduce((sum, c) => sum + (c.view_count || 0), 0);

    // Recent comics
    const { data: recentComics } = await sb
      .from('comics')
      .select('id, title, slug, cover_url, view_count, updated_at, status')
      .order('updated_at', { ascending: false })
      .limit(5);

    // Top comics
    const { data: topComics } = await sb
      .from('comics')
      .select('id, title, slug, cover_url, view_count')
      .order('view_count', { ascending: false })
      .limit(5);

    return NextResponse.json({
      stats: {
        totalComics: totalComics || 0,
        totalChapters: totalChapters || 0,
        totalViews: totalViews || 0,
        totalUsers: totalUsers || 0,
        totalVIP: totalVIP || 0,
      },
      recentComics: recentComics || [],
      topComics: topComics || [],
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
