// lib/db.ts
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// For Supabase, SSL is always required
const sslConfig = { 
  rejectUnauthorized: false // Supabase uses self-signed certificates
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20,
});

// Test connection function (enhanced)
export const testConnection = async (): Promise<{ success: boolean; error?: string }> => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connected successfully:', result.rows[0]);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Database connection failed:', error);
    
    // Provide more specific error information
    let errorMessage = 'Unknown database error';
    if (error.code) {
      switch (error.code) {
        case 'ECONNREFUSED':
          errorMessage = 'Connection refused - check host and port';
          break;
        case 'ENOTFOUND':
          errorMessage = 'Host not found - check database URL';
          break;
        case '28P01':
          errorMessage = 'Authentication failed - check username/password';
          break;
        case '3D000':
          errorMessage = 'Database does not exist';
          break;
        default:
          errorMessage = `Database error: ${error.code}`;
      }
    }
    
    return { 
      success: false, 
      error: `${errorMessage} - ${error.message}`
    };
  } finally {
    if (client) client.release();
  }
};

// Your existing query function is good
export const query = async <T>(text: string, params?: any[]): Promise<T[]> => {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default pool;