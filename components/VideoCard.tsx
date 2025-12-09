// components/VideoCard.tsx
'use client';

import Link from 'next/link';
import { Video } from '@/lib/video';
import { useState, useEffect } from 'react';

interface Props {
  video: Video;
}

export default function VideoCard({ video }: Props) {
  const [imgError, setImgError] = useState(false);
  const [thumbnailSrc, setThumbnailSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  if (!video) {
    return (
      <div className="glass-effect rounded-2xl overflow-hidden h-full flex flex-col animate-pulse">
        <div className="aspect-video bg-gray-700"></div>
        <div className="p-4 sm:p-6 flex-1 flex flex-col">
          <div className="h-6 bg-gray-700 rounded mb-3"></div>
          <div className="h-4 bg-gray-700 rounded mb-4 flex-1"></div>
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

  // Extract YouTube thumbnail
  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  // Generate thumbnail URL
  const generateThumbnailUrl = (url: string, quality: 'maxresdefault' | 'hqdefault' | 'mqdefault' = 'hqdefault'): string => {
    const videoId = extractYouTubeId(url);
    if (videoId) {
      return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
    }
    return video.thumbnailUrl || '/placeholder-thumbnail.jpg';
  };

  // Initialize thumbnail on component mount
  useEffect(() => {
    if (video.youtubeUrl) {
      const url = generateThumbnailUrl(video.youtubeUrl, 'maxresdefault');
      setThumbnailSrc(url);
    }
  }, [video.youtubeUrl, video.thumbnailUrl]);

  const handleImageError = () => {
    if (!imgError && thumbnailSrc.includes('maxresdefault')) {
      // Fallback to hqdefault if maxresdefault fails
      const hqUrl = generateThumbnailUrl(video.youtubeUrl, 'hqdefault');
      setThumbnailSrc(hqUrl);
      setImgError(false); // Reset error state for next attempt
    } else if (!imgError && thumbnailSrc.includes('hqdefault')) {
      // Fallback to mqdefault if hqdefault fails
      const mqUrl = generateThumbnailUrl(video.youtubeUrl, 'mqdefault');
      setThumbnailSrc(mqUrl);
    } else {
      // All YouTube thumbnails failed, use stored thumbnail or placeholder
      if (video.thumbnailUrl) {
        setThumbnailSrc(video.thumbnailUrl);
      } else {
        setImgError(true);
      }
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <Link href={`/videos/${video.id}`} className="group h-full block">
      <div className="glass-effect rounded-2xl overflow-hidden hover-lift transition-all duration-300 h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-gray-800">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          )}
          
          {!imgError && thumbnailSrc ? (
            <img
              src={thumbnailSrc}
              alt={video.title}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
              width={640}
              height={360}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-blue-900/50">
              <div className="text-center p-4">
                <svg className="w-16 h-16 mx-auto text-red-500 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
                <p className="text-white font-medium">Video Preview</p>
                <p className="text-gray-300 text-sm mt-1">{video.title}</p>
              </div>
            </div>
          )}
          
          {!imgError && video.featured && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center px-2 py-1 bg-yellow-500/90 text-white rounded-full text-xs font-medium">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                Featured
              </span>
            </div>
          )}
          
          {/* Play overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
            <div className="bg-red-600 rounded-full p-3 transform scale-100 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          
          {/* Duration badge */}
          <div className="absolute bottom-3 right-3">
            <span className="inline-flex items-center px-2 py-1 bg-black/80 text-white rounded-md text-xs font-medium">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              15:30
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors duration-300 line-clamp-2">
            {video.title}
          </h3>
          
          <p className="text-gray-300 text-sm sm:text-base mb-4 flex-1 line-clamp-3">
            {video.description || 'No description available.'}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <span className="text-purple-400 text-sm font-medium group-hover:text-purple-300 transition-colors flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
              </svg>
              Watch
            </span>
            <div className="flex items-center text-xs text-gray-400">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
              </svg>
              <time dateTime={video.createdAt}>
                {formatDate(video.createdAt)}
              </time>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}