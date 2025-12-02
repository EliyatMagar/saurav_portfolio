'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/types';
import SectionHeader from '../ui/SectionHeader';

export default function BlogSection() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      if (response.ok) {
        const data = await response.json();
        setBlogPosts(data.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black py-20">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader
          title="Latest Articles"
          description="Thoughts, tutorials, and insights about web development and design."
        />

        <BlogGrid loading={loading} blogPosts={blogPosts} formatDate={formatDate} />

        <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Link
            href="/blog"
            className="inline-flex items-center px-8 py-4 border border-gray-600 rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
          >
            Read All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}

function BlogGrid({ loading, blogPosts, formatDate }: { 
  loading: boolean; 
  blogPosts: BlogPost[]; 
  formatDate: (date: string) => string;
}) {
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {[1, 2, 3].map((i) => (
          <BlogSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (blogPosts.length === 0) {
    return (
      <div className="text-center py-12 mb-12">
        <p className="text-gray-400 text-lg">No blog posts yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      {blogPosts.map((post, index) => (
        <BlogCard 
          key={post.id || post.slug || `post-${index}`}  // Fallback chain
          post={post} 
          index={index} 
          formatDate={formatDate} 
        />
      ))}
    </div>
  );
}

function BlogCard({ post, index, formatDate }: { 
  post: BlogPost; 
  index: number; 
  formatDate: (date: string) => string;
}) {
  return (
    <div 
      className="group bg-gray-800 rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-500 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <div className="mb-4">
        <span className="text-sm text-purple-400 font-semibold">
          {formatDate(post.publishedAt)}
        </span>
        <span className="text-sm text-gray-500 mx-2">•</span>
        <span className="text-sm text-gray-500">{post.readTime} min read</span>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
        {post.title}
      </h3>
      
      <p className="text-gray-400 mb-4 line-clamp-3">
        {post.excerpt}
      </p>
      
      <Link
        href={`/blog/${post.slug}`}
        className="inline-flex items-center text-gray-400 hover:text-white transition-colors group/link"
      >
        Read More
        <svg className="w-4 h-4 ml-2 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

function BlogSkeleton() {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 animate-pulse">
      <div className="h-4 bg-gray-700 rounded w-24 mb-4"></div>
      <div className="h-6 bg-gray-700 rounded mb-3"></div>
      <div className="h-4 bg-gray-700 rounded mb-4"></div>
    </div>
  );
}