// app/(site)/blog/[slug]/page.tsx
import { getBlogPost, getBlogPosts, BlogPost } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { BackToTopButton, ShareButtons } from '@/components/BlogInteractive';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post: BlogPost) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  const post = await getBlogPost(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} - My Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Construct the current URL for sharing
  const currentUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : `https://yourdomain.com/blog/${slug}`;

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
            href="/blog"
            className="inline-flex items-center text-gray-400 hover:text-purple-400 transition-colors duration-300 group text-sm sm:text-base"
          >
            <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </Link>
        </div>

        <article className="animate-fade-in-up">
          {/* Header */}
          <header className="mb-8 sm:mb-12 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent leading-tight">
              {post.title}
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm sm:text-base text-gray-400">
              <time dateTime={post.publishedAt} className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(post.publishedAt)}
              </time>
              <span className="hidden sm:block">•</span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {post.readTime} min read
              </span>
            </div>
          </header>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="mb-8 sm:mb-12 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          )}

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none 
                      prose-headings:text-white 
                      prose-p:text-gray-300 
                      prose-strong:text-white
                      prose-em:text-gray-200
                      prose-blockquote:text-gray-400
                      prose-blockquote:border-purple-500
                      prose-blockquote:bg-purple-500/10
                      prose-blockquote:rounded-xl
                      prose-blockquote:px-6
                      prose-blockquote:py-4
                      prose-ul:text-gray-300
                      prose-ol:text-gray-300
                      prose-li:text-gray-300
                      prose-a:text-purple-400
                      prose-a:no-underline
                      prose-a:border-b-2
                      prose-a:border-purple-500/50
                      prose-a:hover:border-purple-400
                      prose-a:hover:text-purple-300
                      prose-code:text-gray-200
                      prose-code:bg-gray-800
                      prose-code:px-2
                      prose-code:py-1
                      prose-code:rounded
                      prose-pre:bg-gray-900
                      prose-pre:border
                      prose-pre:border-gray-700
                      prose-pre:rounded-xl
                      prose-hr:border-gray-700
                      animate-fade-in-up"
            style={{animationDelay: '0.4s'}}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Share Section */}
          <div className="mt-12 sm:mt-16 pt-8 border-t border-gray-700 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">Share this article</h3>
              <ShareButtons title={post.title} url={currentUrl} />
            </div>
          </div>

          {/* Back to Top */}
          <div className="mt-8 text-center animate-fade-in-up" style={{animationDelay: '0.8s'}}>
            <BackToTopButton />
          </div>
        </article>
      </div>
    </div>
  );
}