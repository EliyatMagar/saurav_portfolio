'use client';

import { useState, useEffect } from 'react';
import HeroSection from '@/components/sections/HeroSection';
import PortfolioSection from '@/components/sections/PortfolioSection';
import BlogSection from '@/components/sections/BlogSection';
import VideosSection from '@/components/sections/VideoSection';
import CTASection from '@/components/sections/CTASection';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <HeroSection />
      <PortfolioSection />
      <BlogSection />
      <VideosSection />
      <CTASection />
    </div>
  );
}