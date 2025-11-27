"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesMeshRef = useRef<THREE.Points | null>(null);
  const shapesRef = useRef<THREE.Mesh[]>([]);
  const animationFrameId = useRef<number>(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    rendererRef.current = renderer;
    
    // Set darker background
    renderer.setClearColor(0x000011, 0.3);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    updateRendererSize(renderer, camera);
    mountRef.current.appendChild(renderer.domElement);

    // Particles with darker colors
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
      // Darker color range for particles
      colorArray[i] = Math.random() * 0.3 + 0.1; // Dark blue/purple range
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    particlesMeshRef.current = particlesMesh;

    // Floating shapes with darker colors
    const geometries = [
      new THREE.IcosahedronGeometry(0.5),
      new THREE.OctahedronGeometry(0.4),
      new THREE.TetrahedronGeometry(0.3)
    ];

    const shapes: THREE.Mesh[] = [];
    const darkColors = [
      0x1a1a2e, // Dark blue
      0x16213e, // Darker blue
      0x0f3460  // Deep blue
    ];

    geometries.forEach((geometry, index) => {
      const material = new THREE.MeshPhysicalMaterial({
        color: darkColors[index],
        transparent: true,
        opacity: 0.15,
        transmission: 0.95,
        roughness: 0.2,
        metalness: 0.3,
        clearcoat: 0.5,
        clearcoatRoughness: 0.1
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2
      );
      scene.add(mesh);
      shapes.push(mesh);
    });

    shapesRef.current = shapes;
    camera.position.z = 5;

    // Mouse movement
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Animate particles
      if (particlesMeshRef.current) {
        particlesMeshRef.current.rotation.y = elapsedTime * 0.05;
        particlesMeshRef.current.rotation.x = elapsedTime * 0.03;
      }

      // Animate shapes
      shapesRef.current.forEach((shape, index) => {
        shape.rotation.x = elapsedTime * 0.2 * (index + 1);
        shape.rotation.y = elapsedTime * 0.3 * (index + 1);
        shape.position.y = Math.sin(elapsedTime * 0.5 + index) * 0.5;
        shape.position.x = Math.cos(elapsedTime * 0.3 + index) * 0.5;
      });

      // Camera movement based on mouse
      if (cameraRef.current) {
        cameraRef.current.position.x += (mouse.x * 2 - cameraRef.current.position.x) * 0.02;
        cameraRef.current.position.y += (-mouse.y * 2 - cameraRef.current.position.y) * 0.02;
        cameraRef.current.lookAt(scene.position);
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      animationFrameId.current = requestAnimationFrame(animate);
    };
    animate();

    // Handle resize with debounce
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (cameraRef.current && rendererRef.current) {
          updateRendererSize(rendererRef.current, cameraRef.current);
        }
      }, 250);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId.current);
      
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose of Three.js resources
      rendererRef.current?.dispose();
      particlesMeshRef.current?.geometry.dispose();
      if (particlesMeshRef.current?.material instanceof THREE.Material) {
        particlesMeshRef.current.material.dispose();
      }
      
      shapesRef.current.forEach(shape => {
        shape.geometry.dispose();
        if (shape.material instanceof THREE.Material) {
          shape.material.dispose();
        }
      });
    };
  }, []);

  const updateRendererSize = (renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  return <div ref={mountRef} className="absolute inset-0 -z-10" />;
}