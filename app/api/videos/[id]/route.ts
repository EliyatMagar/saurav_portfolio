import { NextRequest, NextResponse } from 'next/server';
import { getVideo, updateVideo, deleteVideo } from '@/lib/video';

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
    const video = await getVideo(id);
    
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(video);
  } catch (error) {
    console.error('Error in GET /api/videos/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video' },
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
    const videoId = parseInt(id);
    
    if (isNaN(videoId)) {
      return NextResponse.json(
        { error: 'Invalid video ID' },
        { status: 400 }
      );
    }

    const video = await updateVideo(videoId, body);
    return NextResponse.json(video);
  } catch (error: any) {
    console.error('Error in PUT /api/videos/[id]:', error);
    
    if (error.message === 'Video not found') {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update video' },
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
    const videoId = parseInt(id);
    
    if (isNaN(videoId)) {
      return NextResponse.json(
        { error: 'Invalid video ID' },
        { status: 400 }
      );
    }

    await deleteVideo(videoId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/videos/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}