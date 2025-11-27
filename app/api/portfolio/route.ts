//app/api/portfolio/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioItems, createPortfolioItem, getAllPortfolioItems, CreatePortfolioItemInput } from '@/lib/portfolio';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin');
    
    let items;
    
    if (admin) {
      const userId = getUserIdFromRequest(request);
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      items = await getAllPortfolioItems();
    } else {
      items = await getPortfolioItems();
    }
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error in GET /api/portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const itemData: CreatePortfolioItemInput = {
      title: body.title,
      description: body.description,
      content: body.content || '',
      imageUrl: body.imageUrl || '',
      projectUrl: body.projectUrl || '',
      githubUrl: body.githubUrl || '',
      technologies: body.technologies || [],
      published: body.published || false,
      featured: body.featured || false,
    };

    const item = await createPortfolioItem(itemData);
    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio item' },
      { status: 500 }
    );
  }
}