// app/api/db/health/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { healthCheck, testConnection } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const detailed = searchParams.get('detailed') === 'true';
  
  try {
    if (detailed) {
      const connectionResult = await testConnection();
      
      return NextResponse.json({
        success: connectionResult.success,
        data: connectionResult.details,
        error: connectionResult.error,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      });
    } else {
      const health = await healthCheck();
      
      return NextResponse.json({
        ...health,
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}