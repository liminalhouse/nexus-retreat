import {db} from '../lib/db/index.js';
import {sql} from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    const migrationPath = path.join(__dirname, '../drizzle/0005_update_jacket_sizes.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    // Split by statement breakpoint
    const statements = migrationSQL.split(';').filter(s => s.trim() && !s.includes('statement-breakpoint'));

    console.log(`Running migration with ${statements.length} statements...`);

    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.trim().substring(0, 100)}...`);
        await db.execute(sql.raw(statement.trim()));
      }
    }

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
