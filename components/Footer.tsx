"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white px-6 py-6 mt-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Portfolio. All rights reserved.</p>
        <div className="flex gap-4 mt-2 md:mt-0">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/portfolio" className="hover:underline">
            Portfolio
          </Link>
          <Link href="/blog" className="hover:underline">
            Blog
          </Link>
          <Link href="/videos" className="hover:underline">
            Videos
          </Link>
        </div>
      </div>
    </footer>
  );
}
