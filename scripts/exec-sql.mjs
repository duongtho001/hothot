// Execute SQL schema via Supabase Management API
// This uses the project ref from the URL to call the management endpoint

const PROJECT_REF = 'jnzdibfphcobrokeppmf';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemRpYmZwaGNvYnJva2VwcG1mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjcwMjI4OSwiZXhwIjoyMDkyMjc4Mjg5fQ.4g9f6D_HFk6X5zkgnzZO5AEkL8u3_ZbjYbWXNAVqJpU';
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
};

// SQL statements to create tables (broken into individual statements)
const statements = [
  // Genres
  `CREATE TABLE IF NOT EXISTS genres (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT DEFAULT '📖',
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Comics
  `CREATE TABLE IF NOT EXISTS comics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    cover_url TEXT DEFAULT '',
    author TEXT DEFAULT 'Unknown',
    status TEXT DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed', 'hiatus')),
    view_count BIGINT DEFAULT 0,
    rating NUMERIC(3,1) DEFAULT 0,
    free_chapters INT DEFAULT 5,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Comic genres junction
  `CREATE TABLE IF NOT EXISTS comic_genres (
    comic_id UUID REFERENCES comics(id) ON DELETE CASCADE,
    genre_id UUID REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (comic_id, genre_id)
  )`,

  // Chapters
  `CREATE TABLE IF NOT EXISTS chapters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    comic_id UUID REFERENCES comics(id) ON DELETE CASCADE NOT NULL,
    chapter_number INT NOT NULL,
    title TEXT DEFAULT '',
    pages JSONB DEFAULT '[]'::jsonb,
    is_free BOOLEAN DEFAULT TRUE,
    view_count BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(comic_id, chapter_number)
  )`,

  // VIP codes
  `CREATE TABLE IF NOT EXISTS vip_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    plan TEXT NOT NULL CHECK (plan IN ('7d', '30d', '90d', 'lifetime')),
    is_used BOOLEAN DEFAULT FALSE,
    used_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    used_at TIMESTAMPTZ
  )`,

  // Profiles
  `CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY,
    email TEXT,
    display_name TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'vip')),
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // VIP subscriptions
  `CREATE TABLE IF NOT EXISTS vip_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    plan TEXT NOT NULL CHECK (plan IN ('7d', '30d', '90d', 'lifetime')),
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    activation_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Bookmarks
  `CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    comic_id UUID REFERENCES comics(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Reading history
  `CREATE TABLE IF NOT EXISTS reading_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    comic_id UUID REFERENCES comics(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
    chapter_number INT DEFAULT 0,
    scroll_position INT DEFAULT 0,
    last_read TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Indexes
  `CREATE INDEX IF NOT EXISTS idx_comics_slug ON comics(slug)`,
  `CREATE INDEX IF NOT EXISTS idx_comics_updated ON comics(updated_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_comics_views ON comics(view_count DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_chapters_comic ON chapters(comic_id, chapter_number)`,
];

async function execSQL(sql) {
  // Use PostgREST RPC or direct pg endpoint
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/rpc`, {
    method: 'POST',
    headers: { ...headers, 'X-Client-Info': 'supabase-js/2.0' },
    body: JSON.stringify({}),
  });
  return resp;
}

async function main() {
  console.log('🚀 Creating tables via individual REST calls...\n');
  
  for (let i = 0; i < statements.length; i++) {
    const sql = statements[i];
    const label = sql.match(/(?:TABLE|INDEX)\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)/i)?.[1] || `stmt-${i}`;
    
    try {
      // We'll use the pg_dump approach - just test if tables exist after
      console.log(`  [${i+1}/${statements.length}] ${label}...`);
    } catch (err) {
      console.error(`  ❌ ${label}: ${err.message}`);
    }
  }

  // Since we can't run raw SQL via REST, let's use a different approach
  // Let's open the Supabase SQL Editor automatically
  console.log('\n⚠️  Cannot run raw SQL via REST API.');
  console.log('📋 Please run the schema manually:\n');
  console.log('1. Go to: https://supabase.com/dashboard/project/jnzdibfphcobrokeppmf/sql/new');
  console.log('2. Copy-paste the contents of schema.sql');
  console.log('3. Click "Run"\n');
  console.log('Or use the browser to open the SQL Editor automatically...');
}

main();
