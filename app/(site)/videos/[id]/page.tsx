// app/(site)/videos/[id]/page.tsx
import { getVideo, getVideos, Video } from '@/lib/video';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const videos = await getVideos();
  return videos.map((video: Video) => ({
    id: video.id.toString(),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  const video = await getVideo(id);
  
  if (!video) {
    return {
      title: 'Video Not Found',
    };
  }

  return {
    title: `${video.title} - My Videos`,
    description: video.description,
    openGraph: {
      title: video.title,
      description: video.description,
      images: video.thumbnailUrl ? [video.thumbnailUrl] : [],
    },
  };
}

export default async function VideoPage({ params }: Props) {
  const { id } = await params;
  
  const video = await getVideo(id);

  if (!video) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const youtubeId = getYouTubeId(video.youtubeUrl);

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl relative z-10">
        {/* Back Button */}
        <div className="mb-8 animate-fade-in-up">
          <Link
            href="/videos"
            className="inline-flex items-center text-gray-400 hover:text-purple-400 transition-colors duration-300 group text-sm sm:text-base"
          >
            <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Videos
          </Link>
        </div>

        <article className="animate-fade-in-up">
          {/* Video Player */}
          <div className="mb-8 sm:mb-12">
            <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden">
              {youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0`}
                  title={video.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-400">Video not available</p>
                </div>
              )}
            </div>
          </div>

          {/* Video Info */}
          <header className="mb-8 sm:mb-12">
            <div className="flex items-center mb-4">
              {video.featured && (
                <span className="inline-flex items-center px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium mr-3">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  Featured
                </span>
              )}
              <time dateTime={video.createdAt} className="text-sm text-gray-400">
                {formatDate(video.createdAt)}
              </time>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent leading-tight">
              {video.title}
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
              {video.description}
            </p>
          </header>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 sm:mb-12 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <a
              href={video.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
              Watch on YouTube
            </a>
            
            <button className="inline-flex items-center justify-center px-6 py-3 border border-gray-600 text-gray-300 rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
              Share
            </button>
          </div>

          {/* Related Videos Section */}
          <div className="mt-12 sm:mt-16 pt-8 border-t border-gray-700 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-white">More Videos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* You could fetch and display related videos here */}
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">Check out more videos on the videos page</p>
                <Link
                  href="/videos"
                  className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-300"
                >
                  View All Videos
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}