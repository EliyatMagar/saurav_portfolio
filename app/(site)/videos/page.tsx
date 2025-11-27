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
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Videos</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Watch my latest tutorials, project walkthroughs, and tech insights.
        </p>
        {videos.length > 0 && (
          <p className="text-gray-500 mt-2">
            {videos.length} video{videos.length !== 1 ? 's' : ''} available
          </p>
        )}
      </div>

      {videos.length > 0 ? (
        <div className="space-y-12">
          {/* Featured Videos */}
          {featuredVideos.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <svg className="w-6 h-6 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                Featured Videos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </section>
          )}

          {/* All Videos */}
          <section>
            <h2 className="text-2xl font-bold mb-6">All Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
            <p className="text-gray-500">
              I'm working on some great video content. Check back soon!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}