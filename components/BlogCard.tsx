// components/BlogCard.tsx
import Link from 'next/link';
import { BlogPost } from '@/lib/blog';

interface Props {
  post: BlogPost;
}

export default function BlogCard({ post }: Props) {
  // Add safety checks
  if (!post) {
    return (
      <div className="glass-effect rounded-2xl overflow-hidden h-full flex flex-col animate-pulse">
        <div className="h-48 sm:h-52 bg-gray-700"></div>
        <div className="p-4 sm:p-6 flex-1 flex flex-col">
          <div className="flex items-center text-xs sm:text-sm text-gray-400 mb-3">
            <div className="h-4 bg-gray-700 rounded w-20"></div>
          </div>
          <div className="h-6 bg-gray-700 rounded mb-3"></div>
          <div className="h-4 bg-gray-700 rounded mb-4 flex-1"></div>
          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <div className="h-4 bg-gray-700 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <Link href={`/blog/${post.slug || post.id}`} className="group h-full block">
      <article className="glass-effect rounded-2xl overflow-hidden hover-lift transition-all duration-300 h-full flex flex-col">
        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative h-48 sm:h-52 overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title || 'Blog post'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )}
        
        {/* Content */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col">
          <div className="flex items-center text-xs sm:text-sm text-gray-400 mb-3">
            <span className="text-purple-400 font-medium">
              {formatDate(post.publishedAt)}
            </span>
            <span className="mx-2">•</span>
            <span>{post.readTime || 5} min read</span>
          </div>
          
          <h3 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors duration-300 line-clamp-2">
            {post.title || 'Untitled Post'}
          </h3>
          
          <p className="text-gray-300 text-sm sm:text-base mb-4 flex-1 line-clamp-3">
            {post.excerpt || 'No excerpt available.'}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <span className="text-purple-400 text-sm font-medium group-hover:text-purple-300 transition-colors">
              Read More
            </span>
            <svg 
              className="w-4 h-4 text-gray-400 transform group-hover:translate-x-1 group-hover:text-purple-400 transition-all duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}