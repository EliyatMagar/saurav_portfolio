import { query } from '@/lib/db';

export interface PortfolioItemDB {
  id: number;
  title: string;
  description: string;
  content: string;
  image_url: string;
  project_url: string;
  github_url: string;
  technologies: string[];
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  projectUrl: string;
  githubUrl: string;
  technologies: string[];
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePortfolioItemInput {
  title: string;
  description: string;
  content?: string;
  imageUrl?: string;
  projectUrl?: string;
  githubUrl?: string;
  technologies?: string[];
  featured?: boolean;
  published?: boolean;
}

// Helper to convert database rows to camelCase
function toCamelCase(row: PortfolioItemDB): PortfolioItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    content: row.content || '',
    imageUrl: row.image_url || '',
    projectUrl: row.project_url || '',
    githubUrl: row.github_url || '',
    technologies: Array.isArray(row.technologies) ? row.technologies : JSON.parse(row.technologies || '[]'),
    featured: row.featured || false,
    published: row.published || false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    console.log('Fetching portfolio items...');
    const rows = await query<PortfolioItemDB>(`
      SELECT * FROM portfolio_items 
      WHERE published = true 
      ORDER BY 
        featured DESC,
        created_at DESC
    `);
    console.log(`Found ${rows.length} portfolio items`);
    return rows.map(toCamelCase);
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    return [];
  }
}

export async function getPortfolioItem(id: number): Promise<PortfolioItem | null> {
  try {
    console.log('Fetching portfolio item with ID:', id, 'Type:', typeof id);
    
    // Validate the ID
    if (isNaN(id) || id <= 0) {
      console.error('Invalid portfolio item ID:', id);
      return null;
    }

    const rows = await query<PortfolioItemDB>(`
      SELECT * FROM portfolio_items 
      WHERE id = $1 AND published = true
    `, [id]);

    console.log(`Found ${rows.length} items with ID ${id}`);
    
    return rows.length > 0 ? toCamelCase(rows[0]) : null;
  } catch (error) {
    console.error('Error fetching portfolio item:', error);
    return null;
  }
}

export async function createPortfolioItem(itemData: CreatePortfolioItemInput): Promise<PortfolioItem> {
  try {
    const { 
      title, 
      description, 
      content = '', 
      imageUrl = '', 
      projectUrl = '', 
      githubUrl = '', 
      technologies = [], 
      published = false, 
      featured = false 
    } = itemData;
    
    const rows = await query<PortfolioItemDB>(`
      INSERT INTO portfolio_items 
      (title, description, content, image_url, project_url, github_url, technologies, published, featured)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [title, description, content, imageUrl, projectUrl, githubUrl, JSON.stringify(technologies), published, featured]);

    if (rows.length === 0) {
      throw new Error('Failed to create portfolio item');
    }

    return toCamelCase(rows[0]);
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    throw error;
  }
}

export async function updatePortfolioItem(id: number, itemData: Partial<CreatePortfolioItemInput>): Promise<PortfolioItem> {
  try {
    // Validate the ID
    if (isNaN(id) || id <= 0) {
      throw new Error('Invalid portfolio item ID');
    }

    const fields = [];
    const values = [];
    let paramCount = 1;

    // Build dynamic update query
    if (itemData.title !== undefined) {
      fields.push(`title = $${paramCount}`);
      values.push(itemData.title);
      paramCount++;
    }
    if (itemData.description !== undefined) {
      fields.push(`description = $${paramCount}`);
      values.push(itemData.description);
      paramCount++;
    }
    if (itemData.content !== undefined) {
      fields.push(`content = $${paramCount}`);
      values.push(itemData.content);
      paramCount++;
    }
    if (itemData.imageUrl !== undefined) {
      fields.push(`image_url = $${paramCount}`);
      values.push(itemData.imageUrl);
      paramCount++;
    }
    if (itemData.projectUrl !== undefined) {
      fields.push(`project_url = $${paramCount}`);
      values.push(itemData.projectUrl);
      paramCount++;
    }
    if (itemData.githubUrl !== undefined) {
      fields.push(`github_url = $${paramCount}`);
      values.push(itemData.githubUrl);
      paramCount++;
    }
    if (itemData.technologies !== undefined) {
      fields.push(`technologies = $${paramCount}`);
      values.push(JSON.stringify(itemData.technologies));
      paramCount++;
    }
    if (itemData.published !== undefined) {
      fields.push(`published = $${paramCount}`);
      values.push(itemData.published);
      paramCount++;
    }
    if (itemData.featured !== undefined) {
      fields.push(`featured = $${paramCount}`);
      values.push(itemData.featured);
      paramCount++;
    }

    // Add updated_at timestamp
    fields.push(`updated_at = $${paramCount}`);
    values.push(new Date().toISOString());
    paramCount++;

    // Add ID as last parameter
    values.push(id);

    const rows = await query<PortfolioItemDB>(`
      UPDATE portfolio_items 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);

    if (rows.length === 0) {
      throw new Error('Portfolio item not found');
    }

    return toCamelCase(rows[0]);
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    throw error;
  }
}

export async function deletePortfolioItem(id: number): Promise<void> {
  try {
    // Validate the ID
    if (isNaN(id) || id <= 0) {
      throw new Error('Invalid portfolio item ID');
    }

    await query('DELETE FROM portfolio_items WHERE id = $1', [id]);
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    throw error;
  }
}

export async function getAllPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const rows = await query<PortfolioItemDB>(`
      SELECT * FROM portfolio_items 
      ORDER BY created_at DESC
    `);
    return rows.map(toCamelCase);
  } catch (error) {
    console.error('Error fetching all portfolio items:', error);
    return [];
  }
}