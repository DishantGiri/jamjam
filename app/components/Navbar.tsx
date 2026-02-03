'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path: string) => {
        return pathname === path;
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a2332] text-white">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center">
                    <div className="relative w-48 h-16">
                        <Image
                            src="/logo.png"
                            alt="JamJam Trek Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link
                        href="/"
                        className={`hover:text-cyan-400 transition-colors cursor-pointer ${isActive('/') ? 'text-cyan-400 font-semibold' : ''}`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/treks"
                        className={`hover:text-cyan-400 transition-colors cursor-pointer ${isActive('/treks') ? 'text-cyan-400 font-semibold' : ''}`}
                    >
                        Treks
                    </Link>
                    <Link
                        href="/blog"
                        className={`hover:text-cyan-400 transition-colors cursor-pointer ${isActive('/blog') ? 'text-cyan-400 font-semibold' : ''}`}
                    >
                        Blog
                    </Link>
                    <Link
                        href="/reviews"
                        className={`hover:text-cyan-400 transition-colors cursor-pointer ${isActive('/reviews') ? 'text-cyan-400 font-semibold' : ''}`}
                    >
                        Reviews
                    </Link>
                    <Link href="/admin/login" className="bg-cyan-400 hover:bg-cyan-500 hover:scale-105 text-white px-6 py-2 rounded-lg transition-all duration-200 cursor-pointer">
                        Admin Login
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden text-white hover:text-cyan-400 transition-colors"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-[#1a2332] border-t border-gray-700">
                    <div className="px-6 py-4 space-y-3">
                        <Link
                            href="/"
                            onClick={closeMenu}
                            className={`block py-2 hover:text-cyan-400 transition-colors ${isActive('/') ? 'text-cyan-400 font-semibold' : ''}`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/treks"
                            onClick={closeMenu}
                            className={`block py-2 hover:text-cyan-400 transition-colors ${isActive('/treks') ? 'text-cyan-400 font-semibold' : ''}`}
                        >
                            Treks
                        </Link>
                        <Link
                            href="/blog"
                            onClick={closeMenu}
                            className={`block py-2 hover:text-cyan-400 transition-colors ${isActive('/blog') ? 'text-cyan-400 font-semibold' : ''}`}
                        >
                            Blog
                        </Link>
                        <Link
                            href="/reviews"
                            onClick={closeMenu}
                            className={`block py-2 hover:text-cyan-400 transition-colors ${isActive('/reviews') ? 'text-cyan-400 font-semibold' : ''}`}
                        >
                            Reviews
                        </Link>
                        <Link
                            href="/admin/login"
                            onClick={closeMenu}
                            className="block bg-cyan-400 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg transition-colors text-center"
                        >
                            Admin Login
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
