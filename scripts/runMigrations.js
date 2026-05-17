/**
 * Migration runner — executes SQL files against Supabase using pg-meta REST endpoint.
 * Usage: node scripts/runMigrations.js
 */
import { readFileSync } from 'fs';
import { config } from 'dotenv';
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
    console.error('Missing VITE_SUPABASE_URL in .env');
    process.exit(1);
}

// Use whichever key we have
const authKey = serviceRoleKey || anonKey;

const MIGRATIONS = [
    'supabase/migrations/001_schema.sql',
    'supabase/migrations/002_rls_policies.sql',
    'supabase/migrations/003_rpc_functions.sql',
];

async function runSQL(sql, label) {
    console.log(`\n📄 Running: ${label}...`);

    // Try the pg-meta query endpoint (used by Supabase dashboard)
    const url = `${supabaseUrl}/pg/query`;

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': anonKey,
                'Authorization': `Bearer ${authKey}`,
                'X-Supabase-Api-Version': '2024-01-01',
            },
            body: JSON.stringify({ query: sql }),
        });

        if (res.ok) {
            console.log(`  ✓ ${label} — success`);
            return true;
        }

        // If pg/query doesn't work, try rpc
        const errText = await res.text();
        console.log(`  ⚠ pg/query returned ${res.status}: ${errText.substring(0, 200)}`);
    } catch (e) {
        console.log(`  ⚠ pg/query failed: ${e.message}`);
    }

    // Fallback: try via PostgREST rpc (if a helper function exists)
    // This won't work for DDL but let's try
    return false;
}

async function main() {
    console.log('🚀 Supabase Migration Runner');
    console.log(`   URL: ${supabaseUrl}`);
    console.log(`   Key: ${authKey?.substring(0, 20)}...`);

    let allOk = true;

    for (const file of MIGRATIONS) {
        const sql = readFileSync(file, 'utf-8');
        const ok = await runSQL(sql, file);
        if (!ok) allOk = false;
    }

    if (allOk) {
        console.log('\n✅ All migrations completed successfully!');
    } else {
        console.log('\n⚠️  Some migrations may have failed.');
        console.log('   Please run them manually in the Supabase SQL Editor:');
        console.log('   https://supabase.com/dashboard/project/<your-project-id>/sql/new');
    }
}

main().catch(console.error);
