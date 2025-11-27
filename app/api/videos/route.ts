//app/api/videos/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getVideos, createVideo, getAllVideos, CreateVideoInput } from '@/lib/video';

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
    
    let videos;
    
    if (admin) {
      const userId = getUserIdFromRequest(request);
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      videos = await getAllVideos();
    } else {
      videos = await getVideos();
    }
    
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error in GET /api/videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
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
    
    if (!body.title || !body.youtubeUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const videoData: CreateVideoInput = {
      title: body.title,
      description: body.description || '',
      youtubeUrl: body.youtubeUrl,
      thumbnailUrl: body.thumbnailUrl || '',
      published: body.published || false,
      featured: body.featured || false,
    };

    const video = await createVideo(videoData);
    return NextResponse.json(video, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/videos:', error);
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    );
  }
}