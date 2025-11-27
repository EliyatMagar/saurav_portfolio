"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    alert("Logged out successfully!");
    setMenuOpen(false); // Close menu after logout
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-gray-900 text-white px-4 sm:px-6 py-4 flex items-center justify-between relative">
      {/* Logo/Brand */}
      <Link href="/" className="text-xl font-bold hover:text-gray-300 transition-colors">
        Portfolio
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-6 items-center">
        <Link href="/" className="hover:text-gray-300 transition-colors">
          Home
        </Link>
        <Link href="/about" className="hover:text-gray-300 transition-colors">
          About
        </Link>
        <Link href="/portfolio" className="hover:text-gray-300 transition-colors">
          Portfolio
        </Link>
        <Link href="/blog" className="hover:text-gray-300 transition-colors">
          Blog
        </Link>
        <Link href="/videos" className="hover:text-gray-300 transition-colors">
          Videos
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link 
              href="/auth/login" 
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm"
            >
              Register
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu */}
      <div 
        className={`
          fixed top-0 right-0 h-full w-64 bg-gray-800 p-6 flex flex-col gap-6 z-50
          transform transition-transform duration-300 ease-in-out md:hidden
          ${menuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Close Button */}
        <button
          className="self-end p-2 hover:bg-gray-700 rounded-lg transition-colors"
          onClick={closeMenu}
          aria-label="Close menu"
        >
          ✕
        </button>

        {/* Navigation Links */}
        <Link 
          href="/" 
          className="py-3 px-4 hover:bg-gray-700 rounded-lg transition-colors"
          onClick={closeMenu}
        >
          Home
        </Link>
        <Link 
          href="/about" 
          className="py-3 px-4 hover:bg-gray-700 rounded-lg transition-colors"
          onClick={closeMenu}
        >
          About
        </Link>
        <Link 
          href="/portfolio" 
          className="py-3 px-4 hover:bg-gray-700 rounded-lg transition-colors"
          onClick={closeMenu}
        >
          Portfolio
        </Link>
        <Link 
          href="/blog" 
          className="py-3 px-4 hover:bg-gray-700 rounded-lg transition-colors"
          onClick={closeMenu}
        >
          Blog
        </Link>
        <Link 
          href="/videos" 
          className="py-3 px-4 hover:bg-gray-700 rounded-lg transition-colors"
          onClick={closeMenu}
        >
          Videos
        </Link>

        {/* Auth Section */}
        <div className="mt-auto pt-6 border-t border-gray-700">
          {user ? (
            <div className="flex flex-col gap-4">
              <span className="py-3 px-4 text-gray-300">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 py-3 px-4 rounded hover:bg-red-700 transition-colors text-center"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link 
                href="/auth/login" 
                className="bg-blue-600 py-3 px-4 rounded hover:bg-blue-700 transition-colors text-center"
                onClick={closeMenu}
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="bg-green-600 py-3 px-4 rounded hover:bg-green-700 transition-colors text-center"
                onClick={closeMenu}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}