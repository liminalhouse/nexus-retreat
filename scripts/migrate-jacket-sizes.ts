import {db} from '../lib/db'
import {sql} from 'drizzle-orm'
import fs from 'fs'
import path from 'path'

async function runMigration() {
  try {
    const migrationPath = path.join(__dirname, '../drizzle/0005_update_jacket_sizes.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')

    // Split by semicolons and filter out empty statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'))

    console.log(`Running migration with ${statements.length} statements...\n`)

    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 80)}...`)
      await db.execute(sql.raw(statement))
      console.log('✓ Done\n')
    }

    console.log('✅ Migration completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

runMigration()
