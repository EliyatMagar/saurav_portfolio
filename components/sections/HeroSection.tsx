'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { Points as PointsType, Mesh, Group, BufferAttribute } from 'three';

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

// Floating Particles Component
function FloatingParticles() {
  const pointsRef = useRef<PointsType>(null);
  const [positions] = useState(() => {
    const positionsArray = new Float32Array(2000 * 3); // Reduced particles for mobile
    for (let i = 0; i < 2000; i++) {
      positionsArray[i * 3] = (Math.random() - 0.5) * 8;
      positionsArray[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positionsArray[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return positionsArray;
  });

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      pointsRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.3) * 0.1;
      pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#8B5CF6"
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Animated Sphere Component
function AnimatedSphere() {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.1;
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.4) * 0.1;
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05);
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 16, 16]} scale={1.2}>
      <meshStandardMaterial
        color="#4F46E5"
        transparent
        opacity={0.08}
        wireframe
        roughness={0.5}
        metalness={0.8}
      />
    </Sphere>
  );
}

// Floating Icons Component
function FloatingIcons() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Content Creation Icon */}
      <Text
        position={[-1.5, 0.8, 0]}
        fontSize={0.2}
        color="#EC4899"
        anchorX="center"
        anchorY="middle"
      >
        🎬
      </Text>
      {/* Design Icon */}
      <Text
        position={[1.5, -0.8, 0]}
        fontSize={0.2}
        color="#8B5CF6"
        anchorX="center"
        anchorY="middle"
      >
        🎨
      </Text>
      {/* YouTube Icon */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.2}
        color="#EF4444"
        anchorX="center"
        anchorY="middle"
      >
        📺
      </Text>
    </group>
  );
}

// Three.js Scene Component with mobile optimization
function ThreeScene() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 2]} // Better performance on mobile
        gl={{ antialias: false }} // Disable antialias for performance
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        {!isMobile && <FloatingParticles />}
        <AnimatedSphere />
        <FloatingIcons />
      </Canvas>
    </div>
  );
}

// Main Hero Section Component
export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (!mounted) {
    return (
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-black to-blue-900/30"></div>
        </div>
        
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

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
              <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black pt-16 pb-8">
      {/* Three.js Background */}
      <ThreeScene />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black/80 to-blue-900/30 z-1"></div>
      
      {/* Desktop Animated Illustration */}
      <div className="absolute right-4 bottom-4 w-64 h-64 z-10 hidden lg:block xl:right-10 xl:bottom-10 xl:w-80 xl:h-80">
        <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
          <div className="text-center p-6 xl:p-8">
            <div className="text-5xl xl:text-6xl mb-3 xl:mb-4 animate-bounce">🎬</div>
            <p className="text-white text-base xl:text-lg font-semibold">Content Creator</p>
            <p className="text-gray-400 text-xs xl:text-sm mt-2">Creating amazing experiences</p>
          </div>
        </div>
      </div>

      {/* Mobile Animated Illustration */}
      <div className="absolute right-2 bottom-2 w-28 h-28 z-10 md:w-36 md:h-36 lg:hidden">
        <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
          <div className="text-center p-2">
            <div className="text-2xl md:text-3xl mb-1 animate-bounce">✨</div>
            <p className="text-white text-xs md:text-sm font-semibold">Creator</p>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-2">
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

      {/* Main Content */}
      <div className={`relative z-10 text-center px-4 max-w-6xl mx-auto w-full transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <ProfileImage isMobile={isMobile} />
        <MainHeading />
        <SubHeading />
        <Description />
        <TechStack />
        <ActionButtons />
        <ScrollIndicator />
      </div>
    </section>
  );
}

// Profile Image Component
function ProfileImage({ isMobile }: { isMobile: boolean }) {
  return (
    <div className="mb-6 sm:mb-8 animate-float">
      <div className={`relative mx-auto group cursor-pointer ${
        isMobile ? 'w-28 h-28' : 'w-32 h-32 sm:w-40 sm:h-40'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse group-hover:rotate-180 transition-all duration-1000"></div>
        <div className="absolute inset-1.5 sm:inset-2 bg-black rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <div className={`bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-2xl ${
            isMobile ? 'w-20 h-20 text-2xl' : 'w-24 h-24 sm:w-32 sm:h-32 text-3xl sm:text-4xl'
          }`}>
            SA
          </div>
        </div>
        <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500"></div>
      </div>
    </div>
  );
}

// Main Heading Component
function MainHeading() {
  return (
    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 sm:mb-6 px-2">
      <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
        SAURAV
      </span>
      <br />
      <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x-reverse text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
        Aryal
      </span>
    </h1>
  );
}

// SubHeading Component
function SubHeading() {
  return (
    <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 mb-6 sm:mb-8 animate-fade-in-up px-4" style={{ animationDelay: '0.3s' }}>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4">
        <span className="text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">
          Content Creator
        </span>
        <span className="hidden sm:inline text-purple-400">|</span>
        <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">
          Digital Influencer
        </span>
      </div>
    </div>
  );
}

// Description Component
function Description() {
  return (
    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up px-4" style={{ animationDelay: '0.6s' }}>
      Crafting <span className="text-purple-400 font-semibold">digital content</span> that blends 
      creativity with <span className="text-blue-400 font-semibold">engaging storytelling</span>. 
      Specializing in YouTube videos, graphics design, and digital influence.
    </p>
  );
}

// TechStack Component
function TechStack() {
  const technologies = ['YouTube', 'Design', 'Content', 'Graphics', 'Digital', 'Influence'];
  
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 animate-fade-in-up px-2" style={{ animationDelay: '0.8s' }}>
      {technologies.map((tech, index) => (
        <div
          key={tech}
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-xs sm:text-sm"
          style={{ animationDelay: `${0.9 + index * 0.1}s` }}
        >
          <span className="text-gray-300 font-medium">{tech}</span>
        </div>
      ))}
    </div>
  );
}

// ActionButtons Component
function ActionButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up px-4" style={{ animationDelay: '1.2s' }}>
      <Link
        href="/portfolio"
        className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden text-sm sm:text-base"
      >
        <span className="relative z-10">View My Work</span>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>
      
      <Link
        href="/contact"
        className="group relative px-6 py-3 sm:px-8 sm:py-4 border border-gray-600 rounded-full font-semibold text-white hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105 backdrop-blur-sm text-sm sm:text-base"
      >
        <span className="relative z-10">Get In Touch</span>
      </Link>
    </div>
  );
}

// ScrollIndicator Component
function ScrollIndicator() {
  return (
    <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
      <div className="flex flex-col items-center">
        <span className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Scroll Down</span>
        <div className="w-5 h-8 sm:w-6 sm:h-10 border border-gray-400 rounded-full flex justify-center group hover:border-purple-400 transition-colors duration-300">
          <div className="w-0.5 h-2 sm:h-3 bg-gray-400 rounded-full mt-1.5 sm:mt-2 animate-pulse group-hover:bg-purple-400 transition-colors duration-300"></div>
        </div>
      </div>
    </div>
  );
}