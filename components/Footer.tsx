"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const socialLinks = [
    { name: "YouTube", href: "https://youtube.com", icon: "▶️", color: "hover:text-red-400" },
    { name: "Instagram", href: "https://instagram.com", icon: "📸", color: "hover:text-pink-400" },
    { name: "Twitter", href: "https://twitter.com", icon: "🐦", color: "hover:text-blue-400" },
    { name: "LinkedIn", href: "https://linkedin.com", icon: "💼", color: "hover:text-blue-300" },
    { name: "GitHub", href: "https://github.com", icon: "💻", color: "hover:text-gray-300" },
  ];

  const quickLinks = [
    { name: "Home", href: "/", emoji: "🏠" },
    { name: "About", href: "/about", emoji: "👨‍💻" },
    { name: "Portfolio", href: "/portfolio", emoji: "🎨" },
    { name: "Videos", href: "/videos", emoji: "🎬" },
    { name: "Blog", href: "/blog", emoji: "📝" },
    { name: "Contact", href: "/contact", emoji: "📧" },
  ];

  const creatorLinks = [
    { name: "Design Work", href: "/design", emoji: "🎨" },
    { name: "YouTube Channel", href: "/youtube", emoji: "📺" },
    { name: "Content Creation", href: "/content", emoji: "✨" },
    { name: "Digital Products", href: "/products", emoji: "🛒" },
  ];

  return (
    <footer className="bg-gray-900 text-white border-t border-gray-700">
      {/* Main Footer Content */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                SA
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Saurav Aryal
                </h3>
                <p className="text-gray-400 text-sm">Content Creator & Digital Influencer</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Creating engaging content, stunning designs, and digital experiences that inspire and connect with audiences worldwide.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 hover:scale-110 transform transition-all duration-300 ${social.color} bg-gray-800 p-2 rounded-lg`}
                  aria-label={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2">🚀</span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 group-hover:scale-110 transition-transform duration-300">
                      {link.emoji}
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Creator Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2">🎬</span>
              My Work
            </h4>
            <ul className="space-y-3">
              {creatorLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 group-hover:scale-110 transition-transform duration-300">
                      {link.emoji}
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2">📧</span>
              Stay Updated
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Get notified about new content, design tips, and exclusive updates.
            </p>
            
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition-colors duration-300"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold text-sm hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
                  Join
                </button>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <Link
                  href="/contact"
                  className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-300 font-semibold text-sm"
                >
                  <span className="mr-2">💬</span>
                  Let's Collaborate
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} <span className="text-purple-400 font-semibold">Saurav Aryal</span>. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Crafted with ❤️ using Next.js & Tailwind CSS
              </p>
            </div>

            {/* Additional Links */}
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors duration-300">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating CTA for Mobile */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Link
          href="/contact"
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
        >
          <span className="text-lg">💬</span>
        </Link>
      </div>
    </footer>
  );
}