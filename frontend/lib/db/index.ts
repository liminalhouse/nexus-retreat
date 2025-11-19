import {drizzle} from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.NEXUS_DATABASE_URL!

if (!connectionString) {
  throw new Error('NEXUS_DATABASE_URL environment variable is not set')
}

// For serverless/edge functions, use connection pooling
// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, {
  prepare: false,
  max: 1, // Limit connections for serverless
  idle_timeout: 20,
  connect_timeout: 10,
})

export const db = drizzle(client, {schema})
