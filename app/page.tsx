'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Types based on your API responses
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  readTime: number;
  publishedAt: string;
  coverImage: string;
}

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  featured: boolean;
  projectUrl?: string;
  githubUrl?: string;
}

interface Video {
  id: number;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  featured: boolean;
  createdAt: string;
}

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState({
    blog: true,
    portfolio: true,
    videos: true
  });

  // Predefined particle positions to avoid hydration mismatches
  const PARTICLE_POSITIONS = [
    { left: 80, top: 46, delay: 2.7, duration: 14.2 },
    { left: 78, top: 93, delay: 1.8, duration: 11.0 },
    { left: 2, top: 69, delay: 0.1, duration: 15.9 },
    { left: 24, top: 97, delay: 0.8, duration: 17.4 },
    { left: 23, top: 47, delay: 0.0, duration: 16.3 },
    { left: 53, top: 32, delay: 3.5, duration: 19.2 },
    { left: 99, top: 55, delay: 1.8, duration: 16.9 },
    { left: 71, top: 31, delay: 1.6, duration: 11.5 },
    { left: 76, top: 86, delay: 1.2, duration: 10.9 },
    { left: 24, top: 17, delay: 2.0, duration: 15.3 },
  ];

  useEffect(() => {
    setMounted(true);
    setIsVisible(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch blog posts
      const blogResponse = await fetch('/api/blog');
      if (blogResponse.ok) {
        const blogData = await blogResponse.json();
        setBlogPosts(blogData.slice(0, 3)); // Get latest 3 posts
      }
      setLoading(prev => ({ ...prev, blog: false }));
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setLoading(prev => ({ ...prev, blog: false }));
    }

    try {
      // Fetch portfolio items
      const portfolioResponse = await fetch('/api/portfolio');
      if (portfolioResponse.ok) {
        const portfolioData = await portfolioResponse.json();
        // Get featured items or first 3 items
        const featuredItems = portfolioData.filter((item: PortfolioItem) => item.featured);
        setPortfolioItems(featuredItems.slice(0, 3).length > 0 ? featuredItems.slice(0, 3) : portfolioData.slice(0, 3));
      }
      setLoading(prev => ({ ...prev, portfolio: false }));
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      setLoading(prev => ({ ...prev, portfolio: false }));
    }

    try {
      // Fetch videos
      const videosResponse = await fetch('/api/videos');
      if (videosResponse.ok) {
        const videosData = await videosResponse.json();
        // Get featured videos or first 3 videos
        const featuredVideos = videosData.filter((video: Video) => video.featured);
        setVideos(featuredVideos.slice(0, 3).length > 0 ? featuredVideos.slice(0, 3) : videosData.slice(0, 3));
      }
      setLoading(prev => ({ ...prev, videos: false }));
    } catch (error) {
      console.error('Error fetching videos:', error);
      setLoading(prev => ({ ...prev, videos: false }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!mounted) {
    // Return a simplified version for SSR that matches the client structure
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden">
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-black to-blue-900/30"></div>
          </div>
          
          {/* Static particles for SSR */}
          <div className="absolute inset-0">
            {PARTICLE_POSITIONS.map((particle, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-20"
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto opacity-0">
            {/* Content skeleton */}
            <div className="mb-8">
              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-black to-blue-900/30"></div>
        </div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {PARTICLE_POSITIONS.map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-float"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`
              }}
            />
          ))}
        </div>

        <div className={`relative z-10 text-center px-4 max-w-4xl mx-auto transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {/* Profile Image */}
          <div className="mb-8 animate-float">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  AS
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
            Saurav Sharma
          </h1>
          
          <div className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            Full Stack Developer & 
            <span className="text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text"> Creative Designer</span>
          </div>
          
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            I create beautiful, functional web experiences that combine cutting-edge technology 
            with elegant design principles.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
            <Link
              href="/portfolio"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              View My Work
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border border-gray-600 rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
            >
              Get In Touch
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Portfolio Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Featured Work
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Here are some of my recent projects that showcase my skills and creativity.
            </p>
          </div>

          {loading.portfolio ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800 rounded-2xl overflow-hidden animate-pulse">
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
              ))}
            </div>
          ) : portfolioItems.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioItems.map((project, index) => (
                <div 
                  key={project.id}
                  className="group relative bg-gray-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-500 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="h-48 bg-gradient-to-br from-purple-500 to-blue-500 relative overflow-hidden">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold opacity-20">
                        {project.title.split(' ')[0]}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 relative z-10">
                    <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span 
                          key={tech}
                          className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-3 py-1 bg-gray-700 text-gray-500 rounded-full text-sm">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                    
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
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No portfolio projects yet. Check back soon!</p>
            </div>
          )}

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

      {/* Latest Blog Posts Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Latest Articles
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Thoughts, tutorials, and insights about web development and design.
            </p>
          </div>

          {loading.blog ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800 rounded-2xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-24 mb-4"></div>
                  <div className="h-6 bg-gray-700 rounded mb-3"></div>
                  <div className="h-4 bg-gray-700 rounded mb-4"></div>
                </div>
              ))}
            </div>
          ) : blogPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {blogPosts.map((post, index) => (
                <div 
                  key={post.id}
                  className="group bg-gray-800 rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-500 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="mb-4">
                    <span className="text-sm text-purple-400 font-semibold">
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="text-sm text-gray-500 mx-2">•</span>
                    <span className="text-sm text-gray-500">{post.readTime} min read</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-gray-400 hover:text-white transition-colors group/link"
                  >
                    Read More
                    <svg className="w-4 h-4 ml-2 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No blog posts yet. Check back soon!</p>
            </div>
          )}

          <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Link
              href="/blog"
              className="inline-flex items-center px-8 py-4 border border-gray-600 rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
            >
              Read All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Videos Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Latest Videos
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Watch my latest tutorials, project walkthroughs, and tech insights.
            </p>
          </div>

          {loading.videos ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-700 rounded mb-3"></div>
                    <div className="h-4 bg-gray-700 rounded mb-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : videos.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video, index) => (
                <div 
                  key={video.id}
                  className="group bg-gray-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-500 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="relative aspect-video bg-gradient-to-br from-purple-500 to-blue-500 overflow-hidden">
                    <img
                      src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeUrl.split('v=')[1]}/hqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                      <div className="bg-red-600 rounded-full p-3 transform scale-100 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{video.title}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">{video.description}</p>
                    
                    <Link
                      href="/videos"
                      className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors group/link"
                    >
                      Watch Video
                      <svg className="w-4 h-4 ml-2 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No videos yet. Check back soon!</p>
            </div>
          )}

          <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Link
              href="/videos"
              className="inline-flex items-center px-8 py-4 border border-gray-600 rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
            >
              View All Videos
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Let's Work Together
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Have a project in mind? I'd love to hear about it and help bring your ideas to life.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/contact"
                className="px-12 py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-pulse-slow"
              >
                Start a Project
              </Link>
              
              <Link
                href="/portfolio"
                className="px-12 py-5 border border-gray-600 rounded-full font-semibold text-lg hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
              >
                View My Work
              </Link>
            </div>

            <div className="mt-16 flex justify-center space-x-8 text-gray-400">
              {['GitHub', 'LinkedIn', 'Twitter', 'Instagram'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="hover:text-purple-400 transition-colors duration-300 transform hover:scale-110"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}