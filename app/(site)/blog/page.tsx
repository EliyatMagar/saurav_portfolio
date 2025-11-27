// app/(site)/blog/page.tsx
import { getBlogPosts, BlogPost } from '@/lib/blog';
import BlogCard from '@/components/BlogCard';

export const metadata = {
  title: 'Blog - My Portfolio',
  description: 'Read my latest thoughts, tutorials, and insights on web development and design.',
};

export default async function BlogPage() {
  let posts: BlogPost[] = [];
  let hasError = false;

  try {
    posts = await getBlogPosts();
  } catch (err) {
    hasError = true;
    console.error('Error fetching blog posts:', err);
  }

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
            Blog
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Thoughts, tutorials, and insights on web development, design, and technology.
          </p>
          {posts.length > 0 && (
            <p className="text-gray-400 mt-4 text-sm sm:text-base">
              {posts.length} article{posts.length !== 1 ? 's' : ''} published
            </p>
          )}
        </div>

        {/* Error State */}
        {hasError && (
          <div className="text-center py-12 animate-fade-in-up">
            <div className="max-w-md mx-auto">
              <div className="text-red-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Error Loading Posts</h3>
              <p className="text-gray-400 mb-6">
                There was an issue loading the blog posts. Please try again later.
              </p>
            </div>
          </div>
        )}
        
        {/* Blog Posts Grid */}
        {!hasError && posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {posts.map((post: BlogPost, index: number) => (
              <div 
                key={post.id || index}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        ) : !hasError && (
          <div className="text-center py-12 sm:py-16 lg:py-20 animate-fade-in-up">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 mb-6">
                <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-white">No blog posts yet</h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                I'm working on some great content. Check back soon for new articles!
              </p>
            </div>
          </div>
        )}

        {/* Newsletter CTA */}
        {!hasError && posts.length > 0 && (
          <div className="mt-16 sm:mt-20 lg:mt-24 text-center animate-fade-in-up">
            <div className="glass-effect rounded-2xl p-6 sm:p-8 lg:p-12 max-w-2xl mx-auto hover-lift transition-all duration-300">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Stay Updated
              </h3>
              <p className="text-gray-300 mb-6 text-sm sm:text-base lg:text-lg">
                Get notified when I publish new articles and tutorials.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-white placeholder-gray-400 text-sm sm:text-base"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}