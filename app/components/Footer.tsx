import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#1A3D50] text-white py-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center mb-4">
                            <div className="relative w-20 h-20">
                                <Image
                                    src="/log.png"
                                    alt="JamJam Trek Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-2xl font-bold text-[#ffff] hover:text-[#244f68] transition-colors">
                                JamJam Treks
                            </span>
                        </div>
                        <p className="text-sky-100 text-sm">
                            We are the experts in Nepal trekking and adventure activities in Nepal.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sky-100">
                            <li><Link href="/" className="hover:text-white transition-colors cursor-pointer">Home</Link></li>
                            <li><Link href="/treks" className="hover:text-white transition-colors cursor-pointer">Treks</Link></li>
                            <li><Link href="/activities" className="hover:text-white transition-colors cursor-pointer">Activities</Link></li>
                            <li><Link href="/blog" className="hover:text-white transition-colors cursor-pointer">Blog</Link></li>
                            <li><Link href="/reviews" className="hover:text-white transition-colors cursor-pointer">Reviews</Link></li>
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-sky-100 text-sm">
                            <li className="flex items-start gap-2">
                                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                Lakeside, Pokhara, Nepal
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-5 h-5 flex-shrink-0" />
                                +977 984-6516188
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-5 h-5 flex-shrink-0" />
                                jamjamtreks@gmail.com
                            </li>
                        </ul>
                    </div>

                    {/* Follow Us */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-cyan-400 hover:scale-110 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="https://www.instagram.com/jamjamtreksnepal/" className="w-10 h-10 bg-gray-700 hover:bg-cyan-400 hover:scale-110 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
                    <p>© 2025 JamJam Trek. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
