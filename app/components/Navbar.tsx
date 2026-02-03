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
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
                <Link href="/" className="flex items-center">
                    <div className="relative w-54 h-14">
                        <Image
                            src="/logo.png"
                            alt="JamJam Trek Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <Link
                        href="/"
                        className={`transition-colors cursor-pointer ${isActive('/') ? 'text-[#2C5F7D]' : 'text-gray-600 hover:text-[#2C5F7D]'}`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/treks"
                        className={`transition-colors cursor-pointer ${isActive('/treks') ? 'text-[#2C5F7D]' : 'text-gray-600 hover:text-[#2C5F7D]'}`}
                    >
                        Treks
                    </Link>
                    <Link
                        href="/blog"
                        className={`transition-colors cursor-pointer ${isActive('/blog') ? 'text-[#2C5F7D]' : 'text-gray-600 hover:text-[#2C5F7D]'}`}
                    >
                        Blog
                    </Link>
                    <Link
                        href="/reviews"
                        className={`transition-colors cursor-pointer ${isActive('/reviews') ? 'text-[#2C5F7D]' : 'text-gray-600 hover:text-[#2C5F7D]'}`}
                    >
                        Reviews
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
                            className={`block py-2 transition-colors ${isActive('/') ? 'text-[#2C5F7D] font-semibold' : 'text-gray-600 hover:text-[#2C5F7D]'}`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/treks"
                            onClick={closeMenu}
                            className={`block py-2 transition-colors ${isActive('/treks') ? 'text-[#2C5F7D] font-semibold' : 'text-gray-600 hover:text-[#2C5F7D]'}`}
                        >
                            Treks
                        </Link>
                        <Link
                            href="/blog"
                            onClick={closeMenu}
                            className={`block py-2 transition-colors ${isActive('/blog') ? 'text-[#2C5F7D] font-semibold' : 'text-gray-600 hover:text-[#2C5F7D]'}`}
                        >
                            Blog
                        </Link>
                        <Link
                            href="/reviews"
                            onClick={closeMenu}
                            className={`block py-2 transition-colors ${isActive('/reviews') ? 'text-[#2C5F7D] font-semibold' : 'text-gray-600 hover:text-[#2C5F7D]'}`}
                        >
                            Reviews
                        </Link>

                    </div>
                </div>
            )}
        </nav>
    );
}
