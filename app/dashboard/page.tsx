'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface Stats {
  blogPosts: number;
  videos: number;
  portfolioItems: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<Stats>({
    blogPosts: 0,
    videos: 0,
    portfolioItems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      fetchStats();
    }
  }, [user, authLoading, router]);

  const fetchStats = async () => {
    try {
      // Fetch blog posts count
      const blogResponse = await fetch('/api/blog?admin=true', {
        credentials: 'include',
      });
      const blogPosts = blogResponse.ok ? await blogResponse.json() : [];
      
      // Fetch videos count
      const videosResponse = await fetch('/api/videos?admin=true', {
        credentials: 'include',
      });
      const videos = videosResponse.ok ? await videosResponse.json() : [];

      setStats({
        blogPosts: blogPosts.length,
        videos: videos.length,
        portfolioItems: 0, // You can add portfolio API later
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-4 lg:p-6">
        <div className="animate-pulse space-y-6">
          {/* Header Skeleton */}
          <div className="space-y-3">
            <div className="h-8 bg-gray-800 rounded-lg w-1/4"></div>
            <div className="h-4 bg-gray-800 rounded w-1/3"></div>
          </div>
          
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-800 rounded-xl"></div>
            ))}
          </div>
          
          {/* Quick Actions Skeleton */}
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome back! Here's what's happening with your portfolio.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {/* Blog Posts Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 mr-4 shadow-inner">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Blog Posts</p>
              <p className="text-2xl font-bold text-white">{stats.blogPosts}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <Link 
              href="/dashboard/blog"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center"
            >
              Manage posts
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Videos Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6 border border-gray-700 hover:border-green-500/50 transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-green-500/10 text-green-400 mr-4 shadow-inner">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Videos</p>
              <p className="text-2xl font-bold text-white">{stats.videos}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <Link 
              href="/dashboard/videos"
              className="text-sm text-green-400 hover:text-green-300 transition-colors flex items-center"
            >
              Manage videos
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Portfolio Items Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 mr-4 shadow-inner">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Portfolio Items</p>
              <p className="text-2xl font-bold text-white">{stats.portfolioItems}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <Link 
              href="/dashboard/portfolio"
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center"
            >
              Manage portfolio
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
        </div>
        <div className="p-4 lg:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/dashboard/blog/new"
              className="flex items-center p-4 lg:p-5 border border-gray-700 rounded-xl hover:border-blue-500 hover:bg-blue-500/5 transition-all duration-300 group"
            >
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 mr-4 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white">New Blog Post</p>
                <p className="text-sm text-gray-400">Write a new article</p>
              </div>
            </Link>

            <Link
              href="/dashboard/videos/new"
              className="flex items-center p-4 lg:p-5 border border-gray-700 rounded-xl hover:border-green-500 hover:bg-green-500/5 transition-all duration-300 group"
            >
              <div className="p-3 rounded-xl bg-green-500/10 text-green-400 mr-4 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white">New Video</p>
                <p className="text-sm text-gray-400">Add a new video</p>
              </div>
            </Link>

            <Link
              href="/dashboard/portfolio/new"
              className="flex items-center p-4 lg:p-5 border border-gray-700 rounded-xl hover:border-purple-500 hover:bg-purple-500/5 transition-all duration-300 group"
            >
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 mr-4 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white">New Portfolio Item</p>
                <p className="text-sm text-gray-400">Add a new project</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}