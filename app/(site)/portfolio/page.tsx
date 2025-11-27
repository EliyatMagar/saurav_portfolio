import { getPortfolioItems, PortfolioItem } from '@/lib/portfolio';
import PortfolioCard from '@/components/PortfolioCard';

export const metadata = {
  title: 'Portfolio - My Projects',
  description: 'Explore my latest projects and creative work in web development and design.',
};

export default async function PortfolioPage() {
  const items = await getPortfolioItems();
  const featuredItems = items.filter(item => item.featured);
  const regularItems = items.filter(item => !item.featured);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">My Portfolio</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A collection of my latest projects, experiments, and creative work in web development.
        </p>
        {items.length > 0 && (
          <p className="text-gray-500 mt-2">
            {items.length} project{items.length !== 1 ? 's' : ''} showcased
          </p>
        )}
      </div>

      {items.length > 0 ? (
        <div className="space-y-12">
          {/* Featured Projects */}
          {featuredItems.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <svg className="w-6 h-6 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                Featured Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredItems.map((item) => (
                  <PortfolioCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {/* All Projects */}
          <section>
            <h2 className="text-2xl font-bold mb-6">All Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularItems.map((item) => (
                <PortfolioCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
            <p className="text-gray-500">
              I'm working on some amazing projects. Check back soon to see my work!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}