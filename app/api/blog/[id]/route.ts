import { NextRequest, NextResponse } from 'next/server';
import { getBlogPost, updateBlogPost, deleteBlogPost } from '@/lib/blog';

// Helper to get user ID from NextRequest
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
    // Await the params promise
    const { id } = await params;
    console.log('Fetching blog post with ID:', id);
    
    const post = await getBlogPost(id);
    
    if (!post) {
      console.log('Blog post not found for ID:', id);
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error in GET /api/blog/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

// ... rest of your PUT and DELETE methods remain the same
export async function PUT(request: NextRequest, { params }: Context) {
  try {
    // Verify admin access
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await the params promise
    const { id } = await params;
    const body = await request.json();
    const postId = parseInt(id);
    
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    const post = await updateBlogPost(postId, body);
    return NextResponse.json(post);
  } catch (error: any) {
    console.error('Error in PUT /api/blog/[id]:', error);
    
    if (error.message === 'Blog post not found') {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  try {
    // Verify admin access
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await the params promise
    const { id } = await params;
    const postId = parseInt(id);
    
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    await deleteBlogPost(postId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/blog/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}