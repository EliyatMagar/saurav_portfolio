// app/(site)/videos/page.tsx
import { getVideos, Video } from '@/lib/video';
import VideoCard from '@/components/VideoCard';

export const metadata = {
  title: 'Videos - My Portfolio',
  description: 'Watch my latest video content and tutorials.',
};

export default async function VideosPage() {
  const videos = await getVideos();
  const featuredVideos = videos.filter(video => video.featured);
  const regularVideos = videos.filter(video => !video.featured);

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Videos
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Watch my latest tutorials, project walkthroughs, and tech insights.
          </p>
          {videos.length > 0 && (
            <p className="text-gray-400 mt-4 text-sm sm:text-base">
              {videos.length} video{videos.length !== 1 ? 's' : ''} available
            </p>
          )}
        </div>

        {videos.length > 0 ? (
          <div className="space-y-12 sm:space-y-16">
            {/* Featured Videos */}
            {featuredVideos.length > 0 && (
              <section className="animate-fade-in-up">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center justify-center sm:justify-start">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  Featured Videos
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {featuredVideos.map((video, index) => (
                    <div 
                      key={video.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <VideoCard video={video} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* All Videos */}
            <section className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center sm:text-left">
                All Videos
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {regularVideos.map((video, index) => (
                  <div 
                    key={video.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1 + 0.4}s` }}
                  >
                    <VideoCard video={video} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 lg:py-20 animate-fade-in-up">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 mb-6">
                <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-white">No videos yet</h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                I'm working on some great video content. Check back soon!
              </p>
            </div>
          </div>
        )}

        {/* YouTube CTA */}
        {videos.length > 0 && (
          <div className="mt-16 sm:mt-20 lg:mt-24 text-center animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <div className="glass-effect rounded-2xl p-6 sm:p-8 lg:p-12 max-w-2xl mx-auto hover-lift transition-all duration-300">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Subscribe on YouTube
              </h3>
              <p className="text-gray-300 mb-6 text-sm sm:text-base lg:text-lg">
                Never miss a new video! Subscribe to my YouTube channel for the latest content.
              </p>
              <a
                href="https://youtube.com/your-channel"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
                Subscribe Now
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}