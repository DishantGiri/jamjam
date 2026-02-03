'use client';

import { Clock, Zap, ImageIcon, MapPin, TrendingUp } from 'lucide-react';
import { getTreks, type Trek } from '@/lib/api';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function FeaturedTreks() {
    const [treks, setTreks] = useState<Trek[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTreks = async () => {
            try {
                // Fetch featured and active treks from the API
                const response = await getTreks({ is_active: true, is_featured: true });
                // Handle multiple response formats
                let trekData = [];
                if (Array.isArray(response)) {
                    trekData = response;
                } else if (response && Array.isArray(response.data)) {
                    trekData = response.data;
                } else if (response && response.data && typeof response.data === 'object') {
                    // If data is an object, try to get the array from common property names
                    trekData = response.data.treks || response.data.items || [];
                }

                // Limit to 3 featured treks for homepage display
                setTreks(trekData.slice(0, 3));
                console.log('Featured Treks loaded:', trekData.slice(0, 3));
                console.log('Image URLs:', trekData.slice(0, 3).map((t: Trek) => ({
                    id: t.id,
                    featured: t.featured_image_url,
                    images: t.image_urls
                })));
            } catch (error) {
                console.error('Error fetching treks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTreks();
    }, []);

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Featured Treks
                        </h2>
                        <p className="text-gray-600">
                            Explore our most popular trekking routes
                        </p>
                    </div>
                    <Link
                        href="/treks"
                        className="hidden md:inline-block border border-gray-200 hover:border-[#2C5F7D] hover:text-[#2C5F7D] text-gray-600 px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                    >
                        View All Treks
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C5F7D]"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {treks.map((trek) => {
                                // Get the first available image
                                const imageUrl = trek.featured_image_url ||
                                    (trek.image_urls && trek.image_urls.length > 0 ? trek.image_urls[0] : null);

                                return (
                                    <Link
                                        key={trek.id}
                                        href={`/treks/${trek.id}`}
                                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer block group flex flex-col h-full"
                                    >
                                        <div className="relative h-56 bg-gray-100">
                                            {imageUrl ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt={trek.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                    <ImageIcon className="w-12 h-12" strokeWidth={1.5} />
                                                </div>
                                            )}
                                            <div className="absolute top-4 right-4">
                                                <span className="bg-orange-400 text-white px-3 py-1 rounded text-xs font-semibold shadow-sm">
                                                    Featured
                                                </span>
                                            </div>
                                            <div className="absolute bottom-4 left-4">
                                                <span className="flex items-center text-white text-sm font-medium drop-shadow-md">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    {trek.location || "Nepal"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-5 flex flex-col flex-grow">
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1" title={trek.title}>{trek.title}</h3>

                                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="w-4 h-4" />
                                                        {trek.duration}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Zap className="w-4 h-4" />
                                                        {"100 km"}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 mb-6">
                                                <span className="flex items-center gap-1 text-sm text-gray-500">
                                                    <TrendingUp className="w-4 h-4" />
                                                    Trek
                                                </span>
                                                <span className="bg-red-50 text-red-500 text-xs px-2 py-1 rounded font-medium">
                                                    {trek.difficulty}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                                <div>
                                                    <p className="text-xs text-gray-400 mb-0.5">From</p>
                                                    <div className="text-xl font-bold text-[#2C5F7D]">
                                                        ${trek.price}
                                                    </div>
                                                </div>
                                                <button className="bg-[#2C5F7D] hover:bg-[#244f68] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="text-center mt-8 md:hidden">
                            <Link
                                href="/treks"
                                className="inline-block border border-gray-200 hover:border-[#2C5F7D] hover:text-[#2C5F7D] text-gray-600 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200"
                            >
                                View All Treks
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
