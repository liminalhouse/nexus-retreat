const postgres = require('postgres');

const sql = postgres('postgresql://postgres:q6GPmzi23J9m9UfC@db.bctsbrfxepkvnlhadvnm.supabase.co:5432/postgres', {
  max: 1,
  connect_timeout: 10,
});

console.log('Testing connection...');

// First, test basic connection
sql`SELECT NOW() as time, version() as version`
  .then(result => {
    console.log('✅ Connection successful!');
    console.log('Time:', result[0].time);
    console.log('PostgreSQL version:', result[0].version.split(' ')[0], result[0].version.split(' ')[1]);
    
    // Check if table exists
    return sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'registrations'
      ) as table_exists
    `;
  })
  .then(result => {
    console.log('\n📊 Table check:');
    console.log('registrations table exists:', result[0].table_exists);
    
    if (!result[0].table_exists) {
      console.log('\n❌ The registrations table does not exist!');
      console.log('You need to run: npx drizzle-kit push');
      process.exit(1);
    }
    
    // Try a simple test insert
    console.log('\n🧪 Attempting test insert...');
    return sql`
      INSERT INTO registrations (
        email, first_name, last_name, mobile_phone,
        address_line_1, city, state, zip, country,
        emergency_contact_name, emergency_contact_email, emergency_contact_phone
      ) VALUES (
        'test@example.com', 'Test', 'User', '555-0000',
        '123 Test St', 'Test City', 'CA', '90000', 'United States',
        'Emergency Contact', 'emergency@example.com', '555-0001'
      )
      RETURNING id, email, first_name, last_name
    `;
  })
  .then(result => {
    console.log('✅ Insert successful!');
    console.log('Inserted record:', result[0]);
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Error:', error.message);
    console.error('Code:', error.code);
    if (error.code === 'ENOTFOUND') {
      console.error('\n⚠️  Cannot reach database host. Possible reasons:');
      console.error('   1. Project is paused (check Supabase dashboard)');
      console.error('   2. Network/DNS issue');
      console.error('   3. Incorrect hostname');
    }
    process.exit(1);
  });
