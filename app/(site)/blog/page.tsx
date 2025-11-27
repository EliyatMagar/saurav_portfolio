//app/(site)/blog/

import { getBlogPosts, BlogPost } from '@/lib/blog';
import BlogCard from '@/components/BlogCard';

export const metadata = {
  title: 'Blog - My Portfolio',
  description: 'Read my latest thoughts, tutorials, and insights on web development and design.',
};

// Remove pagination for now to fix the searchParams issue
export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Thoughts, tutorials, and insights on web development, design, and technology.
        </p>
        {posts.length > 0 && (
          <p className="text-gray-500 mt-2">
            {posts.length} article{posts.length !== 1 ? 's' : ''} published
          </p>
        )}
      </div>
      
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: BlogPost) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No blog posts yet</h3>
            <p className="text-gray-500 mb-6">
              I'm working on some great content. Check back soon for new articles!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}