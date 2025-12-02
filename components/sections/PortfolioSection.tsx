'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PortfolioItem } from '@/types';
import SectionHeader from '../ui/SectionHeader';

export default function PortfolioSection() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const fetchPortfolioItems = async () => {
    try {
      const response = await fetch('/api/portfolio');
      if (response.ok) {
        const data = await response.json();
        const featuredItems = data.filter((item: PortfolioItem) => item.featured);
        setPortfolioItems(featuredItems.slice(0, 3).length > 0 ? featuredItems.slice(0, 3) : data.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader
          title="Featured Work"
          description="Here are some of my recent projects that showcase my skills and creativity."
        />

        <PortfolioGrid loading={loading} portfolioItems={portfolioItems} />

        <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Link
            href="/portfolio"
            className="inline-flex items-center px-8 py-4 border border-gray-600 rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
          >
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  );
}

function PortfolioGrid({ loading, portfolioItems }: { loading: boolean; portfolioItems: PortfolioItem[] }) {
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <PortfolioSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (portfolioItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No portfolio projects yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {portfolioItems.map((project, index) => (
        <PortfolioCard 
          key={project.id || `portfolio-${index}`} // Add fallback key
          project={project} 
          index={index} 
        />
      ))}
    </div>
  );
}

function PortfolioCard({ project, index }: { project: PortfolioItem; index: number }) {
  return (
    <div 
      className="group relative bg-gray-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-500 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <ProjectImage project={project} />
      
      <div className="p-6 relative z-10">
        <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
        <p className="text-gray-400 mb-4 line-clamp-2">{project.description}</p>
        
        <TechStack technologies={project.technologies} />
        
        <Link
          href={`/portfolio/${project.id}`}
          className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors group/link"
        >
          View Project
          <svg className="w-4 h-4 ml-2 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function ProjectImage({ project }: { project: PortfolioItem }) {
  return (
    <div className="h-48 bg-gradient-to-br from-purple-500 to-blue-500 relative overflow-hidden">
      {project.imageUrl ? (
        <img
          src={project.imageUrl}
          alt={project.title || 'Project image'}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold opacity-20">
          {(project.title || 'Project').split(' ')[0]}
        </div>
      )}
    </div>
  );
}

function TechStack({ technologies }: { technologies: string[] }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {technologies.slice(0, 3).map((tech) => (
        <span 
          key={tech}
          className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
        >
          {tech}
        </span>
      ))}
      {technologies.length > 3 && (
        <span className="px-3 py-1 bg-gray-700 text-gray-500 rounded-full text-sm">
          +{technologies.length - 3}
        </span>
      )}
    </div>
  );
}

function PortfolioSkeleton() {
  return (
    <div className="bg-gray-800 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-700"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-700 rounded mb-3"></div>
        <div className="h-4 bg-gray-700 rounded mb-4"></div>
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-6 bg-gray-700 rounded-full w-16"></div>
          <div className="h-6 bg-gray-700 rounded-full w-20"></div>
        </div>
      </div>
    </div>
  );
}