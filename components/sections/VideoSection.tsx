'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Video } from '@/types';
import SectionHeader from '../ui/SectionHeader';
import Image from 'next/image';

export default function VideosSection() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos');
      if (response.ok) {
        const data = await response.json();
        const featuredVideos = data.filter((video: Video) => video.featured);
        setVideos(featuredVideos.slice(0, 3).length > 0 ? featuredVideos.slice(0, 3) : data.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader
          title="Latest Videos"
          description="Watch my latest tutorials, project walkthroughs, and tech insights."
        />

        <VideosGrid loading={loading} videos={videos} />

        <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Link
            href="/videos"
            className="inline-flex items-center px-8 py-4 border border-gray-600 rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
          >
            View All Videos
          </Link>
        </div>
      </div>
    </section>
  );
}

function VideosGrid({ loading, videos }: { loading: boolean; videos: Video[] }) {
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <VideoSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No videos yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {videos.map((video, index) => (
        <VideoCard key={video.id} video={video} index={index} />
      ))}
    </div>
  );
}

function VideoCard({ video, index }: { video: Video; index: number }) {
  const [thumbnailError, setThumbnailError] = useState(false);
  
  const getThumbnailUrl = () => {
    // If thumbnailUrl exists, use it
    if (video.thumbnailUrl && !thumbnailError) {
      return video.thumbnailUrl;
    }
    
    // Try to extract YouTube video ID from various URL formats
    let videoId = '';
    if (video.youtubeUrl) {
      const url = video.youtubeUrl;
      
      // Handle different YouTube URL formats
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
      } else if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1]?.split('&')[0] || '';
      } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('embed/')[1]?.split('?')[0] || '';
      }
    }
    
    // Fallback to a default thumbnail if no video ID found
    if (!videoId) {
      return '/images/default-video-thumbnail.jpg'; // Create this fallback image
    }
    
    // Return YouTube thumbnail URL (using maxresdefault for highest quality)
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const thumbnailUrl = getThumbnailUrl();

  return (
    <div 
      className="group bg-gray-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-500 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <div className="relative aspect-video bg-gradient-to-br from-purple-500 to-blue-500 overflow-hidden">
        {!thumbnailError ? (
          <img
            src={thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => {
              setThumbnailError(true);
              // Try fallback to lower quality thumbnail
              if (video.youtubeUrl) {
                const url = video.youtubeUrl;
                let videoId = '';
                if (url.includes('youtu.be/')) {
                  videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
                } else if (url.includes('youtube.com/watch?v=')) {
                  videoId = url.split('v=')[1]?.split('&')[0] || '';
                }
                if (videoId) {
                  // Try hqdefault as fallback
                  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }
              }
              return '/images/default-video-thumbnail.jpg';
            }}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500">
            <div className="text-center">
              <svg className="w-12 h-12 text-white mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <p className="text-white text-sm">Thumbnail not available</p>
            </div>
          </div>
        )}
        
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
          <div className="bg-red-600 rounded-full p-3 transform scale-100 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        
        {/* Video duration overlay if available */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {video.duration}
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{video.title}</h3>
        <p className="text-gray-400 mb-4 line-clamp-2">{video.description}</p>
        
        <div className="flex justify-between items-center">
          <Link
            href={`/videos/${video.id}`}
            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors group/link"
          >
            Watch Video
            <svg className="w-4 h-4 ml-2 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          
          {video.publishedAt && (
            <span className="text-gray-500 text-sm">
              {new Date(video.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function VideoSkeleton() {
  return (
    <div className="bg-gray-800 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-700"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-700 rounded mb-3"></div>
        <div className="h-4 bg-gray-700 rounded mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
      </div>
    </div>
  );
}