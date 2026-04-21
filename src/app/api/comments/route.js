import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

// GET: Get comments for a comic/chapter
export async function GET(request) {
  try {
    const supabase = getServiceSupabase();
    if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 500 });

    const { searchParams } = new URL(request.url);
    const comicId = searchParams.get('comic_id');
    const chapterId = searchParams.get('chapter_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;

    if (!comicId) return NextResponse.json({ error: 'comic_id required' }, { status: 400 });

    let query = supabase
      .from('comments')
      .select(`
        id, content, created_at, likes_count, parent_id,
        user_id,
        profiles!inner(display_name, avatar_url)
      `)
      .eq('comic_id', comicId)
      .is('parent_id', null)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (chapterId) {
      query = query.eq('chapter_id', chapterId);
    }

    const { data: comments, error } = await query;
    if (error) throw error;

    // Get replies for each comment
    const commentIds = (comments || []).map(c => c.id);
    let replies = [];
    if (commentIds.length > 0) {
      const { data: replyData } = await supabase
        .from('comments')
        .select(`
          id, content, created_at, likes_count, parent_id,
          user_id,
          profiles!inner(display_name, avatar_url)
        `)
        .in('parent_id', commentIds)
        .order('created_at', { ascending: true });
      replies = replyData || [];
    }

    // Get total count
    const { count } = await supabase
      .from('comments')
      .select('id', { count: 'exact', head: true })
      .eq('comic_id', comicId)
      .is('parent_id', null);

    // Attach replies to parent comments
    const result = (comments || []).map(c => ({
      ...c,
      author: c.profiles?.display_name || 'Ẩn danh',
      avatar: c.profiles?.avatar_url || '',
      replies: replies
        .filter(r => r.parent_id === c.id)
        .map(r => ({
          ...r,
          author: r.profiles?.display_name || 'Ẩn danh',
          avatar: r.profiles?.avatar_url || ''
        }))
    }));

    return NextResponse.json({
      comments: result,
      total: count || 0,
      page,
      hasMore: (count || 0) > page * limit
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Create comment
export async function POST(request) {
  try {
    const supabase = getServiceSupabase();
    if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 500 });

    const { user_id, comic_id, chapter_id, content, parent_id } = await request.json();

    if (!user_id || !comic_id || !content?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (content.length > 1000) {
      return NextResponse.json({ error: 'Comment too long (max 1000 chars)' }, { status: 400 });
    }

    const insertData = {
      user_id,
      comic_id,
      content: content.trim(),
    };
    if (chapter_id) insertData.chapter_id = chapter_id;
    if (parent_id) insertData.parent_id = parent_id;

    const { data, error } = await supabase
      .from('comments')
      .insert(insertData)
      .select(`
        id, content, created_at, likes_count, parent_id,
        profiles!inner(display_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      comment: {
        ...data,
        author: data.profiles?.display_name || 'Ẩn danh',
        avatar: data.profiles?.avatar_url || '',
        replies: []
      }
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Delete own comment
export async function DELETE(request) {
  try {
    const supabase = getServiceSupabase();
    if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 500 });

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('id');
    const userId = searchParams.get('user_id');

    if (!commentId || !userId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', userId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
