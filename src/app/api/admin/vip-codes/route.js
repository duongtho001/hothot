import { getServiceSupabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

function generateCode(plan) {
  const prefix = plan === 'lifetime' ? 'VIP-LT' : plan === '90d' ? 'VIP-90' : plan === '30d' ? 'VIP-30' : 'VIP-7';
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = prefix + '-';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
    if (i === 3) code += '-';
  }
  return code;
}

// GET /api/admin/vip-codes
export async function GET() {
  const sb = getServiceSupabase();
  if (!sb) return NextResponse.json({ error: "DB not configured" }, { status: 503 });
  const { data, error } = await sb
    .from('vip_codes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ codes: data || [] });
}

// POST /api/admin/vip-codes — Generate new codes
export async function POST(req) {
  const sb = getServiceSupabase();
  if (!sb) return NextResponse.json({ error: "DB not configured" }, { status: 503 });
  const { plan, quantity } = await req.json();

  const codes = [];
  for (let i = 0; i < (quantity || 5); i++) {
    codes.push({ code: generateCode(plan), plan, is_used: false });
  }

  const { data, error } = await sb.from('vip_codes').insert(codes).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ codes: data });
}
