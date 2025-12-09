'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    const positionsArray = new Float32Array(2000 * 3);
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
      <Text
        position={[-1.5, 0.8, 0]}
        fontSize={0.2}
        color="#EC4899"
        anchorX="center"
        anchorY="middle"
      >
        🎬
      </Text>
      <Text
        position={[1.5, -0.8, 0]}
        fontSize={0.2}
        color="#8B5CF6"
        anchorX="center"
        anchorY="middle"
      >
        🎨
      </Text>
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

// Three.js Scene Component
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
        dpr={[1, 2]}
        gl={{ antialias: false }}
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

// Convert File to Base64 for localStorage
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Save profile image to localStorage
const saveProfileImage = (base64Image: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('profileImage', base64Image);
    localStorage.setItem('profileImageTimestamp', Date.now().toString());
  }
};

// Load profile image from localStorage
const loadProfileImage = (): string | null => {
  if (typeof window !== 'undefined') {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      const timestamp = localStorage.getItem('profileImageTimestamp');
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
      
      // Check if image is older than 30 days (optional cleanup)
      if (timestamp && (Date.now() - parseInt(timestamp)) > thirtyDaysInMs) {
        localStorage.removeItem('profileImage');
        localStorage.removeItem('profileImageTimestamp');
        return null;
      }
      return savedImage;
    }
  }
  return null;
};

// Profile Image Component with Persistent Storage
function ProfileImage({ isMobile, onImageUpdate }: { isMobile: boolean; onImageUpdate: (url: string) => void }) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageError, setImageError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved image on component mount
  useEffect(() => {
    const savedImage = loadProfileImage();
    if (savedImage) {
      setImageUrl(savedImage);
    }
  }, []);

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };

  // Handle file input change
  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await processImageFile(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Process image file
  const processImageFile = async (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPG, PNG, GIF, WEBP)');
      return;
    }

    // Validate file size (max 2MB for localStorage - adjust as needed)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB for better performance');
      return;
    }

    setIsUploading(true);
    
    try {
      // Convert to base64 for localStorage storage
      const base64Image = await convertToBase64(file);
      
      // Save to localStorage
      saveProfileImage(base64Image);
      
      // Set the new image URL
      setImageUrl(base64Image);
      setImageError(false);
      onImageUpdate(base64Image);
      
      alert('Profile image updated successfully!');
    } catch (error) {
      console.error('Error updating profile image:', error);
      alert('Failed to update profile image');
    } finally {
      setIsUploading(false);
      setShowModal(false);
      setIsDragging(false);
    }
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // Clear profile image
  const clearProfileImage = () => {
    if (confirm('Are you sure you want to remove your profile image?')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('profileImage');
        localStorage.removeItem('profileImageTimestamp');
      }
      setImageUrl('');
      setImageError(false);
      onImageUpdate('');
      alert('Profile image removed successfully!');
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="mb-6 sm:mb-8 animate-float">
        <div 
          className={`relative mx-auto group cursor-pointer ${isMobile ? 'w-28 h-28' : 'w-32 h-32 sm:w-40 sm:h-40'}`}
          onClick={() => setShowModal(true)}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {/* Gradient border */}
          <div className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse group-hover:rotate-180 transition-all duration-1000 ${
            isDragging ? 'ring-4 ring-purple-400 ring-offset-2 ring-offset-black' : ''
          }`}></div>
          
          {/* Image container */}
          <div className="absolute inset-1.5 sm:inset-2 bg-black rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300 overflow-hidden">
            {imageUrl && !imageError ? (
              <div className="relative w-full h-full">
                <Image
                  src={imageUrl}
                  alt="Profile"
                  fill
                  className="object-cover rounded-full"
                  sizes={isMobile ? "112px" : "160px"}
                  priority
                  onError={handleImageError}
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm font-semibold">Update Photo</span>
                </div>
              </div>
            ) : (
              <div className={`bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-2xl ${
                isMobile ? 'w-20 h-20 text-2xl' : 'w-24 h-24 sm:w-32 sm:h-32 text-3xl sm:text-4xl'
              }`}>
                SA
              </div>
            )}
          </div>
          
          {/* Hover glow effect */}
          <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500"></div>
          
          {/* Edit icon */}
          <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-purple-600 rounded-full p-1.5 sm:p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>

          {/* Drag & drop indicator */}
          {isDragging && (
            <div className="absolute inset-0 bg-purple-900/50 backdrop-blur-sm rounded-full flex items-center justify-center z-20">
              <div className="text-center p-4">
                <svg className="w-8 h-8 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-white text-sm font-semibold">Drop image here</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Upload hint */}
        <p className="text-gray-400 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Click to update profile image
        </p>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        className="hidden"
      />

      {/* Update Image Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Profile Image</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <div 
                className={`border-2 rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  isDragging 
                    ? 'border-purple-500 bg-purple-900/20 border-solid' 
                    : 'border-dashed border-gray-600 hover:border-purple-500'
                }`}
                onClick={triggerFileInput}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {isDragging ? (
                  <div className="text-center">
                    <svg className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-purple-300 mb-2">Drop your image here</p>
                  </div>
                ) : (
                  <>
                    <svg className="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <p className="text-gray-300 mb-2">Click or drag & drop to upload</p>
                    <p className="text-gray-500 text-sm">Supports JPG, PNG, WEBP (Max 2MB)</p>
                  </>
                )}
              </div>
              
              {isUploading && (
                <div className="mt-4 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                  <p className="text-gray-300 mt-2">Uploading image...</p>
                </div>
              )}
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={isUploading}
                  className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                {imageUrl && (
                  <button
                    onClick={clearProfileImage}
                    disabled={isUploading}
                    className="px-4 py-2 border border-red-600 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors disabled:opacity-50"
                  >
                    Remove
                  </button>
                )}
              </div>
              <button
                onClick={triggerFileInput}
                disabled={isUploading}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 justify-center"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Uploading...
                  </>
                ) : (
                  'Upload New Image'
                )}
              </button>
            </div>
            
            {/* Current profile preview */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-gray-400 text-sm mb-3">Current Profile:</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600">
                  {imageUrl && !imageError ? (
                    <Image
                      src={imageUrl}
                      alt="Current profile"
                      fill
                      className="object-cover"
                      sizes="96px"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                      SA
                    </div>
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-gray-300 font-medium">Saurav Aryal</p>
                  <p className="text-gray-500 text-sm">Content Creator</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {imageUrl ? 'Image saved locally' : 'No profile image set'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Storage info */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-gray-500 text-xs">
                <span className="text-yellow-400">⚠️ Note:</span> Images are saved in your browser's local storage. 
                They will persist until you clear your browser data or remove the image.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
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
          Content Creator | Software Developer
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

// Main Hero Section Component
export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string>('');

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

  // Handle profile image update
  const handleProfileImageUpdate = (newImageUrl: string) => {
    setProfileImageUrl(newImageUrl);
    console.log('Profile image updated to:', newImageUrl);
  };

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
        <ProfileImage isMobile={isMobile} onImageUpdate={handleProfileImageUpdate} />
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