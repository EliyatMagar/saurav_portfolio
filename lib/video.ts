// lib/video.ts
import { query } from '@/lib/db';

export interface VideoDB {
  id: number;
  title: string;
  description: string;
  youtube_url: string;
  thumbnail_url: string;
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: number;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVideoInput {
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  published: boolean;
  featured: boolean;
}

// Helper to convert database rows to camelCase
function toCamelCase(row: VideoDB): Video {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    youtubeUrl: row.youtube_url,
    thumbnailUrl: row.thumbnail_url,
    published: row.published,
    featured: row.featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getVideos(): Promise<Video[]> {
  try {
    const rows = await query<VideoDB>(`
      SELECT * FROM videos 
      WHERE published = true 
      ORDER BY 
        featured DESC,
        created_at DESC
    `);
    return rows.map(toCamelCase);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
}

export async function getVideo(id: string): Promise<Video | null> {
  try {
    const rows = await query<VideoDB>(`
      SELECT * FROM videos 
      WHERE id = $1 AND published = true
    `, [Number(id)]);

    return rows.length > 0 ? toCamelCase(rows[0]) : null;
  } catch (error) {
    console.error('Error fetching video:', error);
    return null;
  }
}

export async function createVideo(videoData: CreateVideoInput): Promise<Video> {
  try {
    const { title, description, youtubeUrl, thumbnailUrl, published, featured } = videoData;
    
    // Auto-generate thumbnail if not provided
    let finalThumbnailUrl = thumbnailUrl;
    if (!finalThumbnailUrl && youtubeUrl) {
      const videoId = extractYouTubeId(youtubeUrl);
      if (videoId) {
        finalThumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      }
    }
    
    const rows = await query<VideoDB>(`
      INSERT INTO videos 
      (title, description, youtube_url, thumbnail_url, published, featured)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [title, description, youtubeUrl, finalThumbnailUrl, published, featured]);

    if (rows.length === 0) {
      throw new Error('Failed to create video');
    }

    return toCamelCase(rows[0]);
  } catch (error) {
    console.error('Error creating video:', error);
    throw error;
  }
}

export async function updateVideo(id: number, videoData: Partial<CreateVideoInput>): Promise<Video> {
  try {
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Build dynamic update query
    for (const [key, value] of Object.entries(videoData)) {
      if (key !== 'id') {
        const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        fields.push(`${snakeKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    // Add updated_at timestamp
    fields.push('updated_at = $' + paramCount);
    values.push(new Date().toISOString());
    paramCount++;

    // Add ID as last parameter
    values.push(id);

    const rows = await query<VideoDB>(`
      UPDATE videos 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);

    if (rows.length === 0) {
      throw new Error('Video not found');
    }

    return toCamelCase(rows[0]);
  } catch (error) {
    console.error('Error updating video:', error);
    throw error;
  }
}

export async function deleteVideo(id: number): Promise<void> {
  try {
    await query('DELETE FROM videos WHERE id = $1', [id]);
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
}

export async function getAllVideos(): Promise<Video[]> {
  try {
    const rows = await query<VideoDB>(`
      SELECT * FROM videos 
      ORDER BY created_at DESC
    `);
    return rows.map(toCamelCase);
  } catch (error) {
    console.error('Error fetching all videos:', error);
    return [];
  }
}

export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/,
    /youtube\.com\/shorts\/([^"&?\/\s]{11})/,
    /youtube\.com\/live\/([^"&?\/\s]{11})/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[match.length - 1]?.length === 11) {
      return match[match.length - 1];
    }
  }
  
  return null;
}

// Helper function to generate YouTube thumbnail URLs
export function generateYouTubeThumbnail(url: string, quality: 'maxresdefault' | 'hqdefault' | 'mqdefault' | 'sddefault' = 'hqdefault'): string | null {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;
  
  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
}

// Get featured videos
export async function getFeaturedVideos(): Promise<Video[]> {
  try {
    const rows = await query<VideoDB>(`
      SELECT * FROM videos 
      WHERE published = true AND featured = true
      ORDER BY created_at DESC
    `);
    return rows.map(toCamelCase);
  } catch (error) {
    console.error('Error fetching featured videos:', error);
    return [];
  }
}

// Get recent videos
export async function getRecentVideos(limit?: number): Promise<Video[]> {
  try {
    const rows = await query<VideoDB>(`
      SELECT * FROM videos 
      WHERE published = true
      ORDER BY created_at DESC
      ${limit ? `LIMIT ${limit}` : ''}
    `);
    return rows.map(toCamelCase);
  } catch (error) {
    console.error('Error fetching recent videos:', error);
    return [];
  }
}

// Search videos by title or description
export async function searchVideos(queryText: string): Promise<Video[]> {
  try {
    const rows = await query<VideoDB>(`
      SELECT * FROM videos 
      WHERE published = true 
        AND (title ILIKE $1 OR description ILIKE $1)
      ORDER BY created_at DESC
    `, [`%${queryText}%`]);
    
    return rows.map(toCamelCase);
  } catch (error) {
    console.error('Error searching videos:', error);
    return [];
  }
}

// Update video thumbnail URL based on YouTube URL
export async function updateVideoThumbnailFromYouTube(videoId: number): Promise<Video | null> {
  try {
    // Get current video data
    const videoRows = await query<VideoDB>('SELECT * FROM videos WHERE id = $1', [videoId]);
    if (videoRows.length === 0) return null;
    
    const video = toCamelCase(videoRows[0]);
    
    // Generate thumbnail from YouTube URL
    const youtubeId = extractYouTubeId(video.youtubeUrl);
    if (!youtubeId) return null;
    
    const thumbnailUrl = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
    
    // Update thumbnail in database
    const updatedRows = await query<VideoDB>(`
      UPDATE videos 
      SET thumbnail_url = $1, updated_at = $2
      WHERE id = $3
      RETURNING *
    `, [thumbnailUrl, new Date().toISOString(), videoId]);
    
    return updatedRows.length > 0 ? toCamelCase(updatedRows[0]) : null;
  } catch (error) {
    console.error('Error updating video thumbnail:', error);
    return null;
  }
}