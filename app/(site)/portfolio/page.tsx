import { getPortfolioItems, PortfolioItem } from '@/lib/portfolio';
import PortfolioCard from '@/components/PortfolioCard';

export const metadata = {
  title: 'Portfolio - My Projects',
  description: 'Explore my latest projects and creative work in web development and design.',
};

export default async function PortfolioPage() {
  let items: PortfolioItem[] = [];
  let hasError = false;

  try {
    console.log('Portfolio page: Fetching portfolio items...');
    items = await getPortfolioItems();
    console.log('Portfolio page: Successfully fetched', items.length, 'items');
  } catch (err) {
    hasError = true;
    console.error('Portfolio page: Error fetching portfolio items:', err);
  }

  const featuredItems = items.filter(item => item.featured);
  const regularItems = items.filter(item => !item.featured);

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
            My Portfolio
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            A collection of my latest projects, experiments, and creative work in web development.
          </p>
          {items.length > 0 && (
            <p className="text-gray-400 mt-4 text-sm sm:text-base">
              {items.length} project{items.length !== 1 ? 's' : ''} showcased
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
              <h3 className="text-xl font-semibold mb-2 text-white">Error Loading Projects</h3>
              <p className="text-gray-400 mb-6">
                There was an issue loading the portfolio projects. Please try again later.
              </p>
            </div>
          </div>
        )}

        {!hasError && items.length > 0 ? (
          <div className="space-y-12 sm:space-y-16">
            {/* Featured Projects */}
            {featuredItems.length > 0 && (
              <section className="animate-fade-in-up">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center justify-center sm:justify-start">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  Featured Projects
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {featuredItems.map((item, index) => (
                    <div 
                      key={item.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <PortfolioCard item={item} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* All Projects */}
            <section className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center sm:text-left">
                All Projects
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {regularItems.map((item, index) => (
                  <div 
                    key={item.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1 + 0.4}s` }}
                  >
                    <PortfolioCard item={item} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : !hasError && (
          <div className="text-center py-12 sm:py-16 lg:py-20 animate-fade-in-up">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 mb-6">
                <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-white">No projects yet</h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                I'm working on some amazing projects. Check back soon to see my work!
              </p>
            </div>
          </div>
        )}

        {/* CTA Section */}
        {!hasError && items.length > 0 && (
          <div className="mt-16 sm:mt-20 lg:mt-24 text-center animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <div className="glass-effect rounded-2xl p-6 sm:p-8 lg:p-12 max-w-2xl mx-auto hover-lift transition-all duration-300">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Ready to Start Your Project?
              </h3>
              <p className="text-gray-300 mb-6 text-sm sm:text-base lg:text-lg">
                Let's work together to bring your ideas to life with cutting-edge technology and design.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                >
                  Start a Project
                </a>
                <a
                  href="/about"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border border-gray-600 text-gray-300 rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                >
                  Learn More About Me
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}