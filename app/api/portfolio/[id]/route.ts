import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioItem, updatePortfolioItem, deletePortfolioItem } from '@/lib/portfolio';

const getUserIdFromRequest = (request: NextRequest): number | null => {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  
  try {
    const { verifyToken } = require('@/lib/auth');
    const decoded = verifyToken(token);
    return decoded.userId;
  } catch {
    return null;
  }
};

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    
    // Validate and parse the ID
    const itemId = parseInt(id);
    if (isNaN(itemId)) {
      return NextResponse.json(
        { error: 'Invalid portfolio item ID' },
        { status: 400 }
      );
    }

    const item = await getPortfolioItem(itemId);
    
    if (!item) {
      return NextResponse.json(
        { error: 'Portfolio item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error in GET /api/portfolio/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Context) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const itemId = parseInt(id);
    
    if (isNaN(itemId)) {
      return NextResponse.json(
        { error: 'Invalid portfolio item ID' },
        { status: 400 }
      );
    }

    const item = await updatePortfolioItem(itemId, body);
    return NextResponse.json(item);
  } catch (error: any) {
    console.error('Error in PUT /api/portfolio/[id]:', error);
    
    if (error.message === 'Portfolio item not found') {
      return NextResponse.json(
        { error: 'Portfolio item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update portfolio item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const itemId = parseInt(id);
    
    if (isNaN(itemId)) {
      return NextResponse.json(
        { error: 'Invalid portfolio item ID' },
        { status: 400 }
      );
    }

    await deletePortfolioItem(itemId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/portfolio/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to delete portfolio item' },
      { status: 500 }
    );
  }
}