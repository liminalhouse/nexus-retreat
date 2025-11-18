const postgres = require('postgres');

const connectionString = process.env.DATABASE_URL;

console.log('Testing connection to:', connectionString?.replace(/:[^:@]+@/, ':****@'));

const sql = postgres(connectionString, {
  max: 1,
  connect_timeout: 10,
});

sql`SELECT NOW() as current_time`
  .then(result => {
    console.log('✅ Connection successful!');
    console.log('Current time:', result[0].current_time);
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    process.exit(1);
  });
