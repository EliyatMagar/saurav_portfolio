// lib/db.ts
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// For development, we need to handle SSL certificate issues
const sslConfig = process.env.NODE_ENV === 'production' 
  ? { rejectUnauthorized: true }
  : { 
      rejectUnauthorized: false, // Allow self-signed certificates
      // Additional SSL options for development
      sslmode: 'require'
    };

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
  // Connection timeout settings
  connectionTimeoutMillis: 10000, // 10 seconds
  idleTimeoutMillis: 30000,
  max: 20, // Maximum number of clients in the pool
});

// Test connection function
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

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