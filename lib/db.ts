// lib/db.ts - COMPLETE FIXED VERSION
import { Pool, PoolConfig } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Enhanced configuration interface
export interface DatabaseConfig extends PoolConfig {
  connectionString?: string;
  ssl: any;
}

// For development/production environment detection
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Parse connection string if provided, otherwise use individual params
const getPoolConfig = (): DatabaseConfig => {
  const connectionString = process.env.DATABASE_URL || process.env.DATABASE_DIRECT_URL;
  
  if (connectionString) {
    // Using connection string (recommended for Supabase)
    return {
      connectionString,
      ssl: {
        rejectUnauthorized: false, // Required for Supabase
        ...(isDevelopment && { rejectUnauthorized: false })
      },
      connectionTimeoutMillis: parseInt(process.env.DATABASE_CONNECTION_TIMEOUT || '10000'),
      idleTimeoutMillis: parseInt(process.env.DATABASE_IDLE_TIMEOUT || '30000'),
      max: parseInt(process.env.DATABASE_MAX_CONNECTIONS || '20'),
      // Connection pool optimization
      allowExitOnIdle: false,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    };
  }
  
  // Fallback to individual parameters
  return {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    ssl: process.env.DATABASE_SSL === 'true' ? { 
      rejectUnauthorized: false 
    } : false,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 20,
  };
};

// Create pool with configuration
const poolConfig = getPoolConfig();
const pool = new Pool(poolConfig);

// Log pool events for debugging
pool.on('connect', () => {
  if (isDevelopment) {
    console.log('🟢 New client connected to database pool');
  }
});

pool.on('error', (err) => {
  console.error('🔴 Unexpected error on idle client', err);
  // Don't crash the app on pool errors
});

pool.on('remove', () => {
  if (isDevelopment) {
    console.log('🔵 Client removed from pool');
  }
});

// Enhanced test connection function
export const testConnection = async (): Promise<{
  success: boolean;
  error?: string;
  details?: any;
}> => {
  let client;
  const startTime = Date.now();
  
  try {
    client = await pool.connect();
    const result = await client.query(`
      SELECT 
        NOW() as server_time,
        version() as postgres_version,
        current_database() as database_name,
        current_user as current_user,
        inet_server_addr() as server_address
    `);
    
    const connectionTime = Date.now() - startTime;
    
    console.log('✅ Database connected successfully:', {
      time: result.rows[0].server_time,
      version: result.rows[0].postgres_version,
      database: result.rows[0].database_name,
      user: result.rows[0].current_user,
      server: result.rows[0].server_address,
      connectionTime: `${connectionTime}ms`,
      poolSize: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount,
    });
    
    return {
      success: true,
      details: {
        ...result.rows[0],
        connectionTime,
        poolStats: {
          total: pool.totalCount,
          idle: pool.idleCount,
          waiting: pool.waitingCount,
        }
      }
    };
  } catch (error: any) {
    console.error('❌ Database connection failed:', {
      error: error.message,
      code: error.code,
      stack: isDevelopment ? error.stack : undefined
    });
    
    // Enhanced error handling
    let errorMessage = 'Unknown database error';
    let errorType = 'UNKNOWN';
    
    if (error.code) {
      switch (error.code) {
        case 'ECONNREFUSED':
          errorMessage = 'Connection refused - check host and port';
          errorType = 'CONNECTION_REFUSED';
          break;
        case 'ENOTFOUND':
          errorMessage = 'Host not found - check database URL';
          errorType = 'HOST_NOT_FOUND';
          break;
        case '28P01':
          errorMessage = 'Authentication failed - check username/password';
          errorType = 'AUTHENTICATION_FAILED';
          break;
        case '3D000':
          errorMessage = 'Database does not exist';
          errorType = 'DATABASE_NOT_FOUND';
          break;
        case 'ETIMEDOUT':
          errorMessage = 'Connection timeout - check network or increase timeout';
          errorType = 'CONNECTION_TIMEOUT';
          break;
        case 'EHOSTUNREACH':
          errorMessage = 'Host unreachable - check network connectivity';
          errorType = 'HOST_UNREACHABLE';
          break;
        default:
          errorMessage = `Database error: ${error.code}`;
          errorType = error.code;
      }
    }
    
    return {
      success: false,
      error: `${errorMessage} - ${error.message}`,
      details: {
        errorType,
        code: error.code,
        connectionTime: Date.now() - startTime,
      }
    };
  } finally {
    if (client) client.release();
  }
};

// Enhanced query function with better error handling and logging
export const query = async <T = any>(
  text: string, 
  params?: any[], 
  options?: {
    client?: any;
    timeout?: number;
    name?: string;
  }
): Promise<T[]> => {
  const { client: externalClient, timeout, name } = options || {};
  const shouldUseExternalClient = !!externalClient;
  const client = externalClient || await pool.connect();
  const queryName = name || `query-${Date.now()}`;
  
  try {
    const startTime = Date.now();
    const result = await client.query({
      text,
      values: params,
      name: queryName,
      ...(timeout && { timeout })
    });
    
    const queryTime = Date.now() - startTime;
    
    // Log slow queries (optional, for development)
    if (isDevelopment && queryTime > 100) {
      console.log(`🐢 Slow query detected (${queryTime}ms):`, {
        query: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        params: params?.slice(0, 3),
        time: queryTime,
        rowCount: result.rowCount,
      });
    }
    
    // Debug: log the structure of returned rows
    if (isDevelopment && result.rows.length > 0) {
      const firstRow = result.rows[0];
      console.log(`🔍 Query returned ${result.rows.length} row(s)`);
      console.log(`First row type: ${typeof firstRow}`);
      console.log(`First row is array: ${Array.isArray(firstRow)}`);
      if (typeof firstRow === 'object' && !Array.isArray(firstRow)) {
        console.log(`First row keys: ${Object.keys(firstRow).join(', ')}`);
      }
    }
    
    return result.rows as T[];
  } catch (error: any) {
    console.error('Database query error:', {
      query: text.substring(0, 200),
      params,
      error: error.message,
      code: error.code,
      name: queryName,
    });
    
    // Re-throw with more context
    const enhancedError = new Error(`Database query failed: ${error.message}`);
    (enhancedError as any).originalError = error;
    (enhancedError as any).query = text;
    (enhancedError as any).params = params;
    throw enhancedError;
  } finally {
    // Only release if we created the client internally
    if (!shouldUseExternalClient && client) {
      client.release();
    }
  }
};

// Transaction helper function
export const transaction = async <T>(
  callback: (client: any) => Promise<T>
): Promise<T> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Health check function
export const healthCheck = async () => {
  try {
    const result = await query<{ status: string }>(
      'SELECT $1::text as status',
      ['healthy']
    );
    
    const poolStats = {
      total: pool.totalCount,
      idle: pool.idleCount,
      waiting: pool.waitingCount,
    };
    
    return {
      status: 'healthy',
      database: result[0]?.status === 'healthy' ? 'connected' : 'unknown',
      timestamp: new Date().toISOString(),
      pool: poolStats,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
};

// Graceful shutdown
export const closePool = async (): Promise<void> => {
  console.log('Closing database pool...');
  await pool.end();
  console.log('Database pool closed');
};

// Export the pool for direct access if needed
export default pool;