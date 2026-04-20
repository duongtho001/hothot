import { getServiceSupabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// POST /api/admin/upload — Upload image to Supabase Storage
export async function POST(req) {
  const sb = getServiceSupabase();
  
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'covers';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split('.').pop() || 'webp';
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { data, error } = await sb.storage
      .from('comics')
      .upload(fileName, buffer, {
        contentType: file.type || 'image/webp',
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: urlData } = sb.storage.from('comics').getPublicUrl(data.path);

    return NextResponse.json({ 
      url: urlData.publicUrl,
      path: data.path,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
