const postgres = require('postgres');

const sql = postgres('postgresql://neondb_owner:npg_Szc9Le0FCsmv@ep-young-union-adyk6bbz-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require', {
  max: 1,
  connect_timeout: 10,
});

console.log('🔌 Testing Neon connection...\n');

sql`SELECT NOW() as time, version() as version`
  .then(result => {
    console.log('✅ Connection successful!');
    console.log('📅 Current time:', result[0].time);
    console.log('🗄️  PostgreSQL version:', result[0].version.split(' ')[0], result[0].version.split(' ')[1]);
    console.log('\n✨ Neon database is ready!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  });
