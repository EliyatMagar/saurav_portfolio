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
      ORDER BY created_at DESC
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
    
    const rows = await query<VideoDB>(`
      INSERT INTO videos 
      (title, description, youtube_url, thumbnail_url, published, featured)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [title, description, youtubeUrl, thumbnailUrl, published, featured]);

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
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}