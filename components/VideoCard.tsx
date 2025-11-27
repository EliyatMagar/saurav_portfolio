// components/VideoCard.tsx
import Link from 'next/link';
import { Video } from '@/lib/video';

interface Props {
  video: Video;
}

export default function VideoCard({ video }: Props) {
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
  const getYouTubeThumbnail = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : video.thumbnailUrl;
  };

  const thumbnailUrl = getYouTubeThumbnail(video.youtubeUrl);

  return (
    <Link href={`/videos/${video.id}`} className="group h-full block">
      <div className="glass-effect rounded-2xl overflow-hidden hover-lift transition-all duration-300 h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={thumbnailUrl || '/placeholder-thumbnail.jpg'}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
            <div className="bg-red-600 rounded-full p-3 transform scale-100 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          {video.featured && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center px-2 py-1 bg-yellow-500/90 text-white rounded-full text-xs font-medium">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                Featured
              </span>
            </div>
          )}
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
            <span className="text-purple-400 text-sm font-medium group-hover:text-purple-300 transition-colors">
              Watch Video
            </span>
            <div className="flex items-center text-xs text-gray-400">
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