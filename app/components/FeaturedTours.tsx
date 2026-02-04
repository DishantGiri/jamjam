'use client';

import { Clock, Users, ImageIcon, MapPin, Plane } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Tour {
    id: number;
    title: string;
    destination: string;
    description?: string;
    featured_image?: string;
    gallery_images?: string[];
    price: number;
    currency: string;
    discount_price?: number;
    has_discount?: boolean;
    duration: {
        days: number;
        nights: number;
        formatted: string;
    };
    difficulty_level: string;
    group_size: {
        min: number;
        max: number;
    };
    tour_type: string;
    status: {
        is_active: boolean;
        is_featured: boolean;
        is_popular: boolean;
    };
    booking: {
        available_slots: number;
        instant_booking: boolean;
    };
    slug: string;
}

export default function FeaturedTours() {
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
                // Fetch active tours (remove is_featured filter since no tours are marked as featured yet)
                const response = await fetch(`${API_BASE_URL}/tours?is_active=1`);
                const data = await response.json();

                console.log('Tours API Response:', data); // Debug log

                let toursData = [];
                if (data.success && data.data && Array.isArray(data.data.tours)) {
                    toursData = data.data.tours;
                } else if (data.success && data.data && Array.isArray(data.data)) {
                    toursData = data.data;
                } else if (Array.isArray(data)) {
                    toursData = data;
                } else if (data && Array.isArray(data.data)) {
                    toursData = data.data;
                } else if (data && typeof data === 'object') {
                    toursData = data.tours || data.items || [];
                }

                console.log('Parsed tours data:', toursData); // Debug log
                setTours(toursData.slice(0, 3));
            } catch (error) {
                console.error('Error fetching tours:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTours();
    }, []);

    const getDifficultyColor = (difficulty: string) => {
        const lower = difficulty.toLowerCase();
        if (lower.includes('easy')) return 'bg-green-50 text-green-600';
        if (lower.includes('moderate')) return 'bg-yellow-50 text-yellow-600';
        if (lower.includes('challenging')) return 'bg-orange-50 text-orange-600';
        if (lower.includes('extreme')) return 'bg-red-50 text-red-500';
        return 'bg-gray-50 text-gray-600';
    };

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Featured Tours
                        </h2>
                        <p className="text-gray-600">
                            Discover our most popular tour packages
                        </p>
                    </div>
                    <Link
                        href="/tours"
                        className="hidden md:inline-block border border-gray-200 hover:border-[#2C5F7D] hover:text-[#2C5F7D] text-gray-600 px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                    >
                        View All Tours
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C5F7D]"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {tours.map((tour) => {
                                return (
                                    <Link
                                        key={tour.id}
                                        href={`/tours/${tour.id}`}
                                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer block group flex flex-col h-full"
                                    >
                                        <div className="relative h-56 bg-gray-100">
                                            {tour.featured_image ? (
                                                <Image
                                                    src={tour.featured_image}
                                                    alt={tour.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    unoptimized
                                                />
                                            ) : tour.gallery_images && tour.gallery_images.length > 0 ? (
                                                <Image
                                                    src={tour.gallery_images[0]}
                                                    alt={tour.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                    <ImageIcon className="w-12 h-12" strokeWidth={1.5} />
                                                </div>
                                            )}
                                            {tour.status.is_featured && (
                                                <div className="absolute top-4 right-4">
                                                    <span className="bg-orange-400 text-white px-3 py-1 rounded text-xs font-semibold shadow-sm">
                                                        Featured
                                                    </span>
                                                </div>
                                            )}
                                            <div className="absolute bottom-4 left-4">
                                                <span className="flex items-center text-white text-sm font-medium drop-shadow-md">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    {tour.destination}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-5 flex flex-col flex-grow">
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1" title={tour.title}>
                                                {tour.title}
                                            </h3>

                                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="w-4 h-4" />
                                                        {tour.duration.days}D/{tour.duration.nights}N
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Users className="w-4 h-4" />
                                                        {tour.group_size.min}-{tour.group_size.max}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 mb-6">
                                                <span className="flex items-center gap-1 text-sm text-gray-500">
                                                    <Plane className="w-4 h-4" />
                                                    {tour.tour_type}
                                                </span>
                                                <span className={'text-xs px-2 py-1 rounded font-medium ' + getDifficultyColor(tour.difficulty_level)}>
                                                    {tour.difficulty_level}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                                <div>
                                                    <p className="text-xs text-gray-400 mb-0.5">From</p>
                                                    <div className="text-xl font-bold text-[#2C5F7D]">
                                                        {tour.currency} {tour.price}
                                                    </div>
                                                    {tour.discount_price && (
                                                        <span className="text-xs text-gray-400 line-through">
                                                            {tour.currency} {tour.discount_price}
                                                        </span>
                                                    )}
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

                        <div className="mt-8 text-center md:hidden">
                            <Link
                                href="/tours"
                                className="inline-block border border-gray-200 hover:border-[#2C5F7D] hover:text-[#2C5F7D] text-gray-600 px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                            >
                                View All Tours
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
