// test-connection.js
const { Pool } = require('pg');
require('dotenv').config();

async function test() {
  console.log('Testing connection with URL:', 
    process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@'));
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connected successfully!');
    
    const result = await client.query('SELECT version()');
    console.log('PostgreSQL version:', result.rows[0].version);
    
    client.release();
    await pool.end();
  } catch (error) {
    console.error('❌ Connection failed:', error instanceof Error ? error.message : String(error));
  }
}

test();