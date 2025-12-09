export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  readTime: number;
  publishedAt: string;
  coverImage: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  featured: boolean;
  projectUrl?: string;
  githubUrl?: string;
}

export interface Video {
  id: number;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  featured: boolean;
  createdAt: string;
  publishedAt: string;
  duration: number; // duration in seconds
}