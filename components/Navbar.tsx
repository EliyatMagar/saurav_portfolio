"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  const handleLogout = async () => {
    await logout();
    alert("Logged out successfully!");
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/blog", label: "Blog" },
    { href: "/videos", label: "Videos" },
  ];

  // Properly typed variants
  const menuVariants: Variants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const itemVariants: Variants = {
    closed: { 
      opacity: 0, 
      x: 20 
    },
    open: { 
      opacity: 1, 
      x: 0 
    },
  };

  const containerVariants: Variants = {
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const buttonVariants: Variants = {
    hover: { 
      scale: 1.05 
    },
    tap: { 
      scale: 0.95 
    },
  };

  const navItemVariants: Variants = {
    hover: { 
      y: -2 
    },
    tap: { 
      y: 0 
    },
  };

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/20 backdrop-blur-xl shadow-2xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo/Brand */}
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="flex-shrink-0"
          >
            <Link
              href="/"
              className={`text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent transition-all duration-300 ${
                scrolled ? "hover:from-purple-500 hover:to-blue-500" : "hover:from-purple-400 hover:to-blue-400"
              }`}
            >
              Saurav
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.div
                key={item.href}
                variants={navItemVariants}
                whileHover="hover"
                whileTap="tap"
                className="relative"
              >
                <Link
                  href={item.href}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeLink === item.href
                      ? "text-purple-400 font-semibold"
                      : scrolled
                      ? "text-white/90 hover:text-white"
                      : "text-white hover:text-purple-300"
                  }`}
                  onClick={() => setActiveLink(item.href)}
                >
                  {item.label}
                  {activeLink === item.href && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 bg-white/10 rounded-lg -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
            
            {/* Contact Button in Desktop Navigation */}
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="relative ml-2"
            >
              <Link
                href="/contact"
                className="relative px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-purple-700 hover:to-blue-700 flex items-center space-x-2"
                onClick={() => setActiveLink("/contact")}
              >
                <span>📧</span>
                <span>Contact</span>
              </Link>
            </motion.div>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <motion.div
                className="flex items-center space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.span
                  className={`font-medium ${
                    scrolled ? "text-white/90" : "text-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  Hi, {user.name}
                </motion.span>
                <motion.button
                  onClick={handleLogout}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-red-600 hover:to-pink-600"
                >
                  Logout
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                className="flex items-center space-x-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    href="/auth/login"
                    className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                      scrolled
                        ? "text-white border-2 border-white/50 hover:border-white hover:bg-white/10"
                        : "text-white border-2 border-white/50 hover:border-white hover:bg-white/10"
                    }`}
                  >
                    Login
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-3 rounded-2xl backdrop-blur-sm border border-white/20"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            style={{
              background: scrolled
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(255, 255, 255, 0.05)",
            }}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <motion.span
                className="w-5 h-0.5 bg-white block rounded-full"
                animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="w-5 h-0.5 bg-white block rounded-full mt-1.5"
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="w-5 h-0.5 bg-white block rounded-full mt-1.5"
                animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={closeMenu}
            />
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 h-full w-80 max-w-full bg-gray-900/95 backdrop-blur-xl shadow-2xl z-50 lg:hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link
                      href="/"
                      className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
                      onClick={closeMenu}
                    >
                      Saurav
                    </Link>
                  </motion.div>
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    onClick={closeMenu}
                    aria-label="Close menu"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Navigation Links */}
              <motion.div
                variants={containerVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="flex-1 p-6 space-y-2"
              >
                {navItems.map((item) => (
                  <motion.div key={item.href} variants={itemVariants}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        activeLink === item.href
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                      onClick={() => {
                        setActiveLink(item.href);
                        closeMenu();
                      }}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                
                {/* Contact Button in Mobile Navigation */}
                <motion.div variants={itemVariants} className="pt-4">
                  <Link
                    href="/contact"
                    className={`flex items-center justify-center px-4 py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-blue-700 ${
                      activeLink === "/contact" ? "ring-2 ring-white/20" : ""
                    }`}
                    onClick={() => {
                      setActiveLink("/contact");
                      closeMenu();
                    }}
                  >
                    <span className="mr-2">📧</span>
                    Contact Me
                  </Link>
                </motion.div>
              </motion.div>

              {/* Auth Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="p-6 border-t border-gray-700"
              >
                {user ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-gray-400">Welcome back,</p>
                      <p className="font-semibold text-white">{user.name}</p>
                    </div>
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={handleLogout}
                      className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Logout
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <motion.div
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Link
                        href="/auth/login"
                        className="block w-full py-3 text-center border-2 border-gray-600 text-white rounded-xl font-semibold hover:border-purple-500 hover:text-purple-400 transition-all duration-300"
                        onClick={closeMenu}
                      >
                        Login
                      </Link>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}