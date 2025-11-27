import { getPortfolioItem, getPortfolioItems, PortfolioItem } from '@/lib/portfolio';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const items = await getPortfolioItems();
    return items.map((item: PortfolioItem) => ({
      id: item.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params for portfolio:', error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    
    // Validate and parse the ID
    const itemId = parseInt(id);
    if (isNaN(itemId)) {
      console.error('Invalid portfolio item ID in metadata:', id);
      return {
        title: 'Project Not Found',
      };
    }

    console.log('Generating metadata for portfolio item ID:', itemId);
    const item = await getPortfolioItem(itemId);
    
    if (!item) {
      console.log('Portfolio item not found for metadata generation');
      return {
        title: 'Project Not Found',
      };
    }

    return {
      title: `${item.title} - Portfolio`,
      description: item.description,
      openGraph: {
        title: item.title,
        description: item.description,
        images: item.imageUrl ? [item.imageUrl] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata for portfolio item:', error);
    return {
      title: 'Project Not Found',
    };
  }
}

export default async function PortfolioDetailPage({ params }: Props) {
  try {
    const { id } = await params;
    
    // Validate and parse the ID
    const itemId = parseInt(id);
    if (isNaN(itemId)) {
      console.error('Invalid portfolio item ID:', id);
      notFound();
    }

    console.log('Loading portfolio detail page for ID:', itemId);
    const item = await getPortfolioItem(itemId);

    if (!item) {
      console.log('Portfolio item not found:', itemId);
      notFound();
    }

    return (
      <div className="min-h-screen bg-black text-white pt-20">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1.5s'}}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl relative z-10">
          {/* Back Button */}
          <div className="mb-8 animate-fade-in-up">
            <Link
              href="/portfolio"
              className="inline-flex items-center text-gray-400 hover:text-purple-400 transition-colors duration-300 group text-sm sm:text-base"
            >
              <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Portfolio
            </Link>
          </div>

          {/* Project Header */}
          <div className="glass-effect rounded-2xl overflow-hidden mb-8 sm:mb-12 animate-fade-in-up">
            <div className="relative h-64 sm:h-80 lg:h-96">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              {item.featured && (
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center bg-yellow-500/90 text-white px-3 py-2 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    Featured Project
                  </span>
                </div>
              )}
            </div>
            
            <div className="p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {item.title}
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-300 mb-6 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:ml-8 lg:mt-0 mt-6">
                  {item.projectUrl && (
                    <a
                      href={item.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 font-medium text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Live Demo
                    </a>
                  )}
                  {item.githubUrl && (
                    <a
                      href={item.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-gray-800 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 font-medium text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      View Code
                    </a>
                  )}
                </div>
              </div>

              {/* Technologies */}
              <div className="mb-6 sm:mb-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">Technologies Used</h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {item.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 px-3 py-2 rounded-lg text-sm font-medium border border-purple-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Project Content */}
          {item.content && (
            <div className="glass-effect rounded-2xl p-6 sm:p-8 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">Project Details</h2>
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
                          prose-hr:border-gray-700"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </div>
          )}

          {/* Related Projects CTA */}
          <div className="mt-12 sm:mt-16 text-center animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <div className="glass-effect rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">Explore More Projects</h3>
              <p className="text-gray-300 mb-6 text-sm sm:text-base">
                Check out my other work and see how I can help bring your ideas to life.
              </p>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border border-gray-600 text-gray-300 rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
              >
                View All Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading portfolio item:', error);
    notFound();
  }
}