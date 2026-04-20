// Script to initialize Supabase database schema
// Run: node scripts/init-db.mjs

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://jnzdibfphcobrokeppmf.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemRpYmZwaGNvYnJva2VwcG1mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjcwMjI4OSwiZXhwIjoyMDkyMjc4Mjg5fQ.4g9f6D_HFk6X5zkgnzZO5AEkL8u3_ZbjYbWXNAVqJpU';

const sb = createClient(SUPABASE_URL, SERVICE_KEY);

async function init() {
  console.log('🚀 Initializing ComicVerse database...\n');

  // Read and execute SQL schema
  const sqlPath = join(__dirname, '..', 'schema.sql');
  const sql = readFileSync(sqlPath, 'utf-8');
  
  // Split by semicolons and execute each statement
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  let success = 0;
  let errors = 0;

  for (const stmt of statements) {
    try {
      const { error } = await sb.rpc('exec_sql', { sql_text: stmt + ';' }).maybeSingle();
      if (error) {
        // Try direct SQL via REST
        const resp = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'apikey': SERVICE_KEY,
            'Authorization': `Bearer ${SERVICE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sql_text: stmt + ';' }),
        });
        if (!resp.ok) throw new Error(await resp.text());
      }
      success++;
    } catch (err) {
      // Some statements might fail if already exists, that's OK
      const msg = err.message || '';
      if (msg.includes('already exists') || msg.includes('duplicate')) {
        console.log(`  ⏭ Skipped (already exists): ${stmt.slice(0, 60)}...`);
      } else {
        console.error(`  ❌ Error: ${msg.slice(0, 100)}`);
        errors++;
      }
    }
  }

  console.log(`\n✅ Done: ${success} statements executed, ${errors} errors`);

  // Create storage bucket
  console.log('\n📦 Creating storage bucket "comics"...');
  const { error: bucketError } = await sb.storage.createBucket('comics', {
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
  });

  if (bucketError) {
    if (bucketError.message?.includes('already exists')) {
      console.log('  ⏭ Bucket already exists');
    } else {
      console.error('  ❌ Bucket error:', bucketError.message);
    }
  } else {
    console.log('  ✅ Bucket created!');
  }

  // Verify tables
  console.log('\n📊 Verifying tables...');
  const tables = ['genres', 'comics', 'chapters', 'profiles', 'vip_codes', 'bookmarks'];
  for (const table of tables) {
    const { data, error } = await sb.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`  ❌ ${table}: ${error.message}`);
    } else {
      console.log(`  ✅ ${table}: OK`);
    }
  }

  // Check genres seed
  const { data: genresData } = await sb.from('genres').select('*');
  console.log(`\n🏷 Genres: ${genresData?.length || 0} loaded`);

  console.log('\n🎉 Database initialization complete!');
}

init().catch(console.error);
