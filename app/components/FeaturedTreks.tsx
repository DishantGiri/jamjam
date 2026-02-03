'use client';

import { Clock, Zap, ImageIcon } from 'lucide-react';
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
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Featured Treks
                    </h2>
                    <p className="text-xl text-gray-600">
                        Explore our most popular trekking routes and packages
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
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
                                        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer block"
                                    >
                                        <div className="relative h-64 bg-gradient-to-br from-blue-200 to-purple-200">
                                            {imageUrl ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt={trek.title}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                    <ImageIcon className="w-20 h-20" strokeWidth={1.5} />
                                                </div>
                                            )}
                                            <div className="absolute top-4 right-4">
                                                <span className="bg-cyan-400 text-white px-4 py-2 rounded-full text-sm font-semibold capitalize">
                                                    {trek.data_type}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-gray-900 mb-3">{trek.title}</h3>

                                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {trek.duration}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Zap className="w-4 h-4" />
                                                    {trek.difficulty}
                                                </div>
                                            </div>

                                        <div className="flex items-center justify-between">
                                            <div className="text-2xl font-bold text-cyan-600">
                                                ${trek.price}
                                                <span className="text-sm text-gray-500 font-normal">/person</span>
                                            </div>
                                            <span className="bg-cyan-400 hover:bg-cyan-500 hover:scale-105 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200">
                                                View Details
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                                );
                            })}
                        </div>

                        <div className="text-center mt-12">
                            <Link 
                                href="/treks"
                                className="inline-block bg-cyan-400 hover:bg-cyan-500 hover:scale-105 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
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
