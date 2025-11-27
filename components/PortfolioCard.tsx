// components/PortfolioCard.tsx
import Link from 'next/link';
import { PortfolioItem } from '@/lib/portfolio';

interface Props {
  item: PortfolioItem;
}

export default function PortfolioCard({ item }: Props) {
  if (!item) {
    return (
      <div className="glass-effect rounded-2xl overflow-hidden h-full flex flex-col animate-pulse">
        <div className="h-48 bg-gray-700"></div>
        <div className="p-4 sm:p-6 flex-1 flex flex-col">
          <div className="h-6 bg-gray-700 rounded mb-3"></div>
          <div className="h-4 bg-gray-700 rounded mb-4 flex-1"></div>
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="h-6 bg-gray-700 rounded-full w-16"></div>
            <div className="h-6 bg-gray-700 rounded-full w-20"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/portfolio/${item.id}`} className="group h-full block">
      <div className="glass-effect rounded-2xl overflow-hidden hover-lift transition-all duration-300 h-full flex flex-col">
        {/* Project Image */}
        <div className="relative h-48 sm:h-52 overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {item.featured && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center bg-yellow-500/90 text-white px-2 py-1 rounded-full text-xs font-medium">
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
            {item.title}
          </h3>
          
          <p className="text-gray-300 text-sm sm:text-base mb-4 flex-1 line-clamp-3">
            {item.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {item.technologies.slice(0, 3).map((tech, index) => (
              <span 
                key={index}
                className="px-2 sm:px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 rounded-full text-xs sm:text-sm border border-purple-500/30"
              >
                {tech}
              </span>
            ))}
            {item.technologies.length > 3 && (
              <span className="px-2 sm:px-3 py-1 bg-gray-700 text-gray-500 rounded-full text-xs sm:text-sm">
                +{item.technologies.length - 3}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <span className="text-purple-400 text-sm font-medium group-hover:text-purple-300 transition-colors">
              View Project
            </span>
            <svg 
              className="w-4 h-4 text-gray-400 transform group-hover:translate-x-1 group-hover:text-purple-400 transition-all duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}