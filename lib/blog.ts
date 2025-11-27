// lib/blog.ts
import { query } from '@/lib/db';

// Base interface matching database columns (snake_case)
export interface BlogPostDB {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  published: boolean;
  published_at: string;
  read_time: number;
  created_at: string;
  updated_at: string;
}

// Client-facing interface (camelCase)
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  published: boolean;
  publishedAt: string;
  readTime: number;
  createdAt: string;
  updatedAt: string;
}

// Input interface for creating posts (camelCase)
export interface CreateBlogPostInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  published: boolean;
  readTime: number;
}

// Helper to convert database rows to camelCase
function toCamelCase(row: BlogPostDB): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.cover_image,
    published: row.published,
    publishedAt: row.published_at,
    readTime: row.read_time,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Helper to convert camelCase to snake_case for database
function toSnakeCase(data: Partial<CreateBlogPostInput>): any {
  const result: any = {};
  for (const [key, value] of Object.entries(data)) {
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    result[snakeKey] = value;
  }
  return result;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const rows = await query<BlogPostDB>(`
      SELECT * FROM blog_posts 
      WHERE published = true 
      ORDER BY published_at DESC
    `);
    return rows.map(toCamelCase);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getBlogPost(slugOrId: string): Promise<BlogPost | null> {
  try {
    const isId = !isNaN(Number(slugOrId));
    
    const rows = await query<BlogPostDB>(`
      SELECT * FROM blog_posts 
      WHERE ${isId ? 'id = $1' : 'slug = $1'} 
      AND published = true
    `, [isId ? Number(slugOrId) : slugOrId]);

    return rows.length > 0 ? toCamelCase(rows[0]) : null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function createBlogPost(postData: CreateBlogPostInput): Promise<BlogPost> {
  try {
    const { title, slug, excerpt, content, coverImage, published, readTime } = postData;
    
    const rows = await query<BlogPostDB>(`
      INSERT INTO blog_posts 
      (title, slug, excerpt, content, cover_image, published, published_at, read_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      title, 
      slug, 
      excerpt, 
      content, 
      coverImage, 
      published, 
      published ? new Date().toISOString() : null, 
      readTime || 5
    ]);

    if (rows.length === 0) {
      throw new Error('Failed to create blog post');
    }

    return toCamelCase(rows[0]);
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
}

export async function updateBlogPost(id: number, postData: Partial<CreateBlogPostInput>): Promise<BlogPost> {
  try {
    const snakeCaseData = toSnakeCase(postData);
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Build dynamic update query
    for (const [key, value] of Object.entries(snakeCaseData)) {
      if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
        fields.push(`${key} = $${paramCount}`);
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

    const rows = await query<BlogPostDB>(`
      UPDATE blog_posts 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);

    if (rows.length === 0) {
      throw new Error('Blog post not found');
    }

    return toCamelCase(rows[0]);
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
}

export async function deleteBlogPost(id: number): Promise<void> {
  try {
    await query('DELETE FROM blog_posts WHERE id = $1', [id]);
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
}

// Admin function to get all posts (including unpublished)
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const rows = await query<BlogPostDB>(`
      SELECT * FROM blog_posts 
      ORDER BY created_at DESC
    `);
    return rows.map(toCamelCase);
  } catch (error) {
    console.error('Error fetching all blog posts:', error);
    return [];
  }
}

// Add these functions to lib/blog.ts

export interface PaginatedBlogPosts {
  posts: BlogPost[];
  totalPages: number;
  currentPage: number;
  totalPosts: number;
}

export async function getPaginatedBlogPosts(page: number = 1, limit: number = 9): Promise<PaginatedBlogPosts> {
  try {
    const offset = (page - 1) * limit;
    
    // Get posts for current page
    const postsRows = await query<BlogPostDB>(`
      SELECT * FROM blog_posts 
      WHERE published = true 
      ORDER BY published_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);
    
    // Get total count
    const countRows = await query<{ count: string }>(`
      SELECT COUNT(*) FROM blog_posts WHERE published = true
    `);
    
    const totalPosts = parseInt(countRows[0].count);
    const totalPages = Math.ceil(totalPosts / limit);
    
    return {
      posts: postsRows.map(toCamelCase),
      totalPages,
      currentPage: page,
      totalPosts,
    };
  } catch (error) {
    console.error('Error fetching paginated blog posts:', error);
    return {
      posts: [],
      totalPages: 0,
      currentPage: 1,
      totalPosts: 0,
    };
  }
}