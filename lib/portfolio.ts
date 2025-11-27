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
  content: string;
  imageUrl: string;
  projectUrl: string;
  githubUrl: string;
  technologies: string[];
  featured: boolean;
  published: boolean;
}

// Helper to convert database rows to camelCase
function toCamelCase(row: PortfolioItemDB): PortfolioItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    content: row.content,
    imageUrl: row.image_url,
    projectUrl: row.project_url,
    githubUrl: row.github_url,
    technologies: Array.isArray(row.technologies) ? row.technologies : JSON.parse(row.technologies || '[]'),
    featured: row.featured,
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Helper to convert camelCase to snake_case for database
function toSnakeCase(data: Partial<CreatePortfolioItemInput>): any {
  const result: any = {};
  for (const [key, value] of Object.entries(data)) {
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    result[snakeKey] = value;
  }
  return result;
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const rows = await query<PortfolioItemDB>(`
      SELECT * FROM portfolio_items 
      WHERE published = true 
      ORDER BY 
        featured DESC,
        created_at DESC
    `);
    return rows.map(toCamelCase);
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    return [];
  }
}

export async function getPortfolioItem(id: string): Promise<PortfolioItem | null> {
  try {
    const rows = await query<PortfolioItemDB>(`
      SELECT * FROM portfolio_items 
      WHERE id = $1 AND published = true
    `, [Number(id)]);

    return rows.length > 0 ? toCamelCase(rows[0]) : null;
  } catch (error) {
    console.error('Error fetching portfolio item:', error);
    return null;
  }
}

export async function createPortfolioItem(itemData: CreatePortfolioItemInput): Promise<PortfolioItem> {
  try {
    const { title, description, content, imageUrl, projectUrl, githubUrl, technologies, published, featured } = itemData;
    
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
    const snakeCaseData = toSnakeCase(itemData);
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Build dynamic update query
    for (const [key, value] of Object.entries(snakeCaseData)) {
      if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
        fields.push(`${key} = $${paramCount}`);
        // Handle technologies array
        values.push(key === 'technologies' ? JSON.stringify(value) : value);
        paramCount++;
      }
    }

    // Add updated_at timestamp
    fields.push('updated_at = $' + paramCount);
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

export interface PaginatedPortfolioItems {
  items: PortfolioItem[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export async function getPaginatedPortfolioItems(page: number = 1, limit: number = 9): Promise<PaginatedPortfolioItems> {
  try {
    const offset = (page - 1) * limit;
    
    // Get items for current page
    const itemsRows = await query<PortfolioItemDB>(`
      SELECT * FROM portfolio_items 
      WHERE published = true 
      ORDER BY featured DESC, created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);
    
    // Get total count
    const countRows = await query<{ count: string }>(`
      SELECT COUNT(*) FROM portfolio_items WHERE published = true
    `);
    
    const totalItems = parseInt(countRows[0].count);
    const totalPages = Math.ceil(totalItems / limit);
    
    return {
      items: itemsRows.map(toCamelCase),
      totalPages,
      currentPage: page,
      totalItems,
    };
  } catch (error) {
    console.error('Error fetching paginated portfolio items:', error);
    return {
      items: [],
      totalPages: 0,
      currentPage: 1,
      totalItems: 0,
    };
  }
}