// Setup Supabase database tables + storage bucket via Management API
// Run: node scripts/setup.mjs

const SUPABASE_URL = 'https://jnzdibfphcobrokeppmf.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemRpYmZwaGNvYnJva2VwcG1mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjcwMjI4OSwiZXhwIjoyMDkyMjc4Mjg5fQ.4g9f6D_HFk6X5zkgnzZO5AEkL8u3_ZbjYbWXNAVqJpU';

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal',
};

async function query(sql) {
  // Use the pg_query endpoint
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/rpc`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: sql }),
  });
  return resp;
}

async function setupStorage() {
  console.log('📦 Setting up storage bucket...');
  
  // Create comics bucket
  const resp = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      id: 'comics',
      name: 'comics',
      public: true,
      file_size_limit: 10485760,
      allowed_mime_types: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    }),
  });
  
  const data = await resp.json();
  if (resp.ok) {
    console.log('  ✅ Bucket "comics" created!');
  } else if (data.message?.includes('already exists') || data.error?.includes('already exists')) {
    console.log('  ⏭ Bucket already exists');
    // Make sure it's public
    await fetch(`${SUPABASE_URL}/storage/v1/bucket/comics`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ public: true }),
    });
    console.log('  ✅ Bucket set to public');
  } else {
    console.error('  ❌', data);
  }
}

async function setupTables() {
  console.log('\n📊 Setting up tables via service role...');

  // Test connection by listing genres
  const testResp = await fetch(`${SUPABASE_URL}/rest/v1/genres?select=count`, {
    headers: { ...headers, 'Prefer': 'count=exact' },
  });

  if (testResp.ok) {
    const count = testResp.headers.get('content-range');
    console.log(`  ℹ️  Genres table exists (${count})`);
    
    // Check if already has data
    const genreResp = await fetch(`${SUPABASE_URL}/rest/v1/genres?select=*`, { headers });
    const genres = await genreResp.json();
    
    if (genres.length === 0) {
      console.log('  📝 Seeding genres...');
      await seedGenres();
    } else {
      console.log(`  ✅ Genres: ${genres.length} entries found`);
    }
  } else {
    console.log('  ⚠️  Tables not found. Please run the SQL schema in Supabase Dashboard SQL Editor.');
    console.log('  📋 Copy schema.sql content → Supabase Dashboard → SQL Editor → Run');
  }

  // Check other tables
  for (const table of ['comics', 'chapters', 'profiles', 'vip_codes', 'bookmarks', 'reading_history']) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=count`, { 
      headers: { ...headers, 'Prefer': 'count=exact' } 
    });
    if (r.ok) {
      console.log(`  ✅ ${table}: OK`);
    } else {
      console.log(`  ❌ ${table}: Not found — run schema.sql!`);
    }
  }
}

async function seedGenres() {
  const genres = [
    { name: 'Action', slug: 'action', icon: '⚔️' },
    { name: 'Romance', slug: 'romance', icon: '💕' },
    { name: 'Fantasy', slug: 'fantasy', icon: '🧙' },
    { name: 'Comedy', slug: 'comedy', icon: '😂' },
    { name: 'Horror', slug: 'horror', icon: '👻' },
    { name: 'Phiêu Lưu', slug: 'adventure', icon: '🗺️' },
    { name: 'Võ Thuật', slug: 'martial-arts', icon: '🥋' },
    { name: 'Shounen', slug: 'shounen', icon: '💪' },
    { name: 'Manhua', slug: 'manhua', icon: '📖' },
    { name: 'Manhwa', slug: 'manhwa', icon: '🇰🇷' },
    { name: 'Webtoon', slug: 'webtoon', icon: '📱' },
    { name: 'Chuyển Sinh', slug: 'chuyen-sinh', icon: '🔄' },
    { name: 'Drama', slug: 'drama', icon: '🎭' },
    { name: 'Trinh Thám', slug: 'mystery', icon: '🔍' },
    { name: 'School Life', slug: 'school-life', icon: '🏫' },
    { name: 'Siêu Nhiên', slug: 'supernatural', icon: '✨' },
  ];

  const resp = await fetch(`${SUPABASE_URL}/rest/v1/genres`, {
    method: 'POST',
    headers: { ...headers, 'Prefer': 'return=representation' },
    body: JSON.stringify(genres),
  });

  if (resp.ok) {
    console.log(`  ✅ Seeded ${genres.length} genres`);
  } else {
    const err = await resp.json();
    console.error('  ❌ Seed error:', err);
  }
}

async function main() {
  console.log('🚀 ComicVerse — Database Setup\n');
  await setupStorage();
  await setupTables();
  console.log('\n🎉 Setup complete!');
  console.log('\n📌 IMPORTANT: If tables are missing, go to:');
  console.log(`   ${SUPABASE_URL.replace('.co', '.co')}`);
  console.log('   → SQL Editor → Paste content of schema.sql → Run');
}

main().catch(console.error);
