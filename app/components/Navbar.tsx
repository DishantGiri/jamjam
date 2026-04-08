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
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6  flex items-center justify-between">
                <Link href="/" className="flex items-center">
                    <div className="relative w-20 h-20">
                        <Image
                            src="/logo.png"
                            alt="JamJam Trek Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className="text-2xl font-bold text-[#1B3B36] hover:text-[#142C28] transition-colors">
                        JamJam Treks
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-lg font-medium">
                    <Link
                        href="/"
                        className={`transition-colors cursor-pointer ${isActive('/') ? 'text-[#1B3B36]' : 'text-gray-600 hover:text-[#1B3B36]'}`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/treks"
                        className={`transition-colors cursor-pointer ${isActive('/treks') ? 'text-[#1B3B36]' : 'text-gray-600 hover:text-[#1B3B36]'}`}
                    >
                        Treks
                    </Link>
                    <Link
                        href="/tours"
                        className={`transition-colors cursor-pointer ${isActive('/tours') ? 'text-[#1B3B36]' : 'text-gray-600 hover:text-[#1B3B36]'}`}
                    >
                        Tours
                    </Link>
                    <Link
                        href="/blog"
                        className={`transition-colors cursor-pointer ${isActive('/blog') ? 'text-[#1B3B36]' : 'text-gray-600 hover:text-[#1B3B36]'}`}
                    >
                        Blog
                    </Link>
                    <Link
                        href="/reviews"
                        className={`transition-colors cursor-pointer ${isActive('/reviews') ? 'text-[#1B3B36]' : 'text-gray-600 hover:text-[#1B3B36]'}`}
                    >
                        Reviews
                    </Link>
                    <Link
                        href="/gallery"
                        className={`transition-colors cursor-pointer ${isActive('/gallery') ? 'text-[#1B3B36]' : 'text-gray-600 hover:text-[#1B3B36]'}`}
                    >
                        Gallery
                    </Link>
                    <Link
                        href="/legal"
                        className={`transition-colors cursor-pointer ${isActive('/legal') ? 'text-[#1B3B36]' : 'text-gray-600 hover:text-[#1B3B36]'}`}
                    >
                        Legal Documents
                    </Link>

                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden text-gray-600 hover:text-gray-900 transition-colors bg-gray-100 p-2 rounded-md"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute top-full left-0 right-0">
                    <div className="px-6 py-4 space-y-3">
                        <Link
                            href="/"
                            onClick={closeMenu}
                            className={`block py-2 transition-colors ${isActive('/') ? 'text-[#1B3B36] font-semibold' : 'text-gray-600 hover:text-[#1B3B36]'}`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/treks"
                            onClick={closeMenu}
                            className={`block py-2 transition-colors ${isActive('/treks') ? 'text-[#1B3B36] font-semibold' : 'text-gray-600 hover:text-[#1B3B36]'}`}
                        >
                            Treks
                        </Link>
                        <Link
                            href="/tours"
                            onClick={closeMenu}
                            className={`block py-2 transition-colors ${isActive('/tours') ? 'text-[#1B3B36] font-semibold' : 'text-gray-600 hover:text-[#1B3B36]'}`}
                        >
                            Tours
                        </Link>
                        <Link
                            href="/blog"
                            onClick={closeMenu}
                            className={`block py-2 transition-colors ${isActive('/blog') ? 'text-[#1B3B36] font-semibold' : 'text-gray-600 hover:text-[#1B3B36]'}`}
                        >
                            Blog
                        </Link>
                        <Link
                            href="/reviews"
                            onClick={closeMenu}
                            className={`block py-2 transition-colors ${isActive('/reviews') ? 'text-[#1B3B36] font-semibold' : 'text-gray-600 hover:text-[#1B3B36]'}`}
                        >
                            Reviews
                        </Link>
                        <Link
                            href="/gallery"
                            onClick={closeMenu}
                            className={`block py-2 transition-colors ${isActive('/gallery') ? 'text-[#1B3B36] font-semibold' : 'text-gray-600 hover:text-[#1B3B36]'}`}
                        >
                            Gallery
                        </Link>
                        <Link
                            href="/legal"
                            onClick={closeMenu}
                            className={`block py-2 transition-colors ${isActive('/legal') ? 'text-[#1B3B36] font-semibold' : 'text-gray-600 hover:text-[#1B3B36]'}`}
                        >
                            Legal
                        </Link>

                    </div>
                </div>
            )}
        </nav>
    );
}
