'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Users, ImageIcon, Check, Plane } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Tour {
    id: number;
    title: string;
    destination: string;
    description?: string;
    featured_image?: string;
    featured_image_url?: string;
    gallery_images?: string[];
    price: number;
    currency: string;
    discount_price?: number;
    duration?: {
        days: number;
        nights: number;
        formatted: string;
    };
    duration_days?: number;
    duration_nights?: number;
    difficulty_level: string;
    group_size?: {
        min: number;
        max: number;
    };
    max_group_size?: number;
    min_group_size?: number;
    tour_type: string;
    booking?: {
        available_slots: number;
        instant_booking: boolean;
    };
    available_slots?: number;
    status?: {
        is_active: boolean;
        is_featured: boolean;
        is_popular: boolean;
    };
    is_featured?: boolean;
    is_popular?: boolean;
    is_active?: boolean;
}

export default function ToursPage() {
    const [tours, setTours] = useState<Tour[]>([]);
    const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        featuredOnly: false,
        popularOnly: false,
        difficulty: {
            easy: false,
            moderate: false,
            challenging: false,
            extreme: false
        }
    });

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await fetch(`${API_BASE_URL}/tours?is_active=1`);
                const result = await response.json();

                console.log('API Response:', result); // Debug log

                let toursData = [];
                if (result.success && result.data && Array.isArray(result.data.tours)) {
                    toursData = result.data.tours;
                } else if (Array.isArray(result)) {
                    toursData = result;
                } else if (result && Array.isArray(result.data)) {
                    toursData = result.data;
                } else if (result && typeof result === 'object') {
                    toursData = result.tours || result.items || [];
                }

                console.log('Processed tours:', toursData); // Debug log

                setTours(toursData || []);
                setFilteredTours(toursData || []);
            } catch (error) {
                console.error('Error fetching tours:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTours();
    }, []); useEffect(() => {
        let result = [...tours];

        if (filters.featuredOnly) {
            result = result.filter(tour => tour.is_featured || tour.status?.is_featured);
        }

        if (filters.popularOnly) {
            result = result.filter(tour => tour.is_popular || tour.status?.is_popular);
        }

        const activeDifficulties = Object.entries(filters.difficulty)
            .filter(([_, isActive]) => isActive)
            .map(([diff]) => diff);

        if (activeDifficulties.length > 0) {
            result = result.filter(tour => {
                const diff = tour.difficulty_level.toLowerCase();
                return activeDifficulties.some(d => diff.includes(d));
            });
        }

        setFilteredTours(result);
    }, [filters, tours]);

    const handleDifficultyChange = (diff: 'easy' | 'moderate' | 'challenging' | 'extreme') => {
        setFilters(prev => ({
            ...prev,
            difficulty: {
                ...prev.difficulty,
                [diff]: !prev.difficulty[diff]
            }
        }));
    };

    const getDifficultyColor = (difficulty: string) => {
        const lower = difficulty.toLowerCase();
        if (lower.includes('easy')) return 'bg-green-100 text-green-700';
        if (lower.includes('moderate')) return 'bg-yellow-100 text-yellow-700';
        if (lower.includes('challenging')) return 'bg-orange-100 text-orange-700';
        if (lower.includes('extreme')) return 'bg-red-100 text-red-600';
        return 'bg-gray-100 text-gray-700';
    };

    return (
        <>
            <Navbar />

            <div className="bg-gradient-to-r from-[#2C5F7D] to-[#1a3a4d] py-16 mt-16">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Explore Our Tour Packages</h1>
                    <p className="text-white/80 text-sm md:text-base max-w-2xl">
                        Discover amazing destinations with our carefully curated tour packages
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="font-bold text-gray-900 mb-6">Filters</h2>

                            <div className="mb-6 space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.featuredOnly ? 'bg-[#2C5F7D] border-[#2C5F7D]' : 'border-gray-300'
                                        }`}>
                                        {filters.featuredOnly && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={filters.featuredOnly}
                                        onChange={() => setFilters(prev => ({ ...prev, featuredOnly: !prev.featuredOnly }))}
                                    />
                                    <span className="text-sm text-gray-600 group-hover:text-gray-900">Featured Tours Only</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.popularOnly ? 'bg-[#2C5F7D] border-[#2C5F7D]' : 'border-gray-300'
                                        }`}>
                                        {filters.popularOnly && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={filters.popularOnly}
                                        onChange={() => setFilters(prev => ({ ...prev, popularOnly: !prev.popularOnly }))}
                                    />
                                    <span className="text-sm text-gray-600 group-hover:text-gray-900">Popular Tours Only</span>
                                </label>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-semibold text-sm text-gray-900 mb-4">Difficulty Level</h3>
                                <div className="space-y-3">
                                    {['easy', 'moderate', 'challenging', 'extreme'].map((diff) => (
                                        <label key={diff} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.difficulty[diff as keyof typeof filters.difficulty]
                                                ? 'bg-[#2C5F7D] border-[#2C5F7D]'
                                                : 'border-gray-300'
                                                }`}>
                                                {filters.difficulty[diff as keyof typeof filters.difficulty] && (
                                                    <Check className="w-3 h-3 text-white" />
                                                )}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={filters.difficulty[diff as keyof typeof filters.difficulty]}
                                                onChange={() => handleDifficultyChange(diff as 'easy' | 'moderate' | 'challenging' | 'extreme')}
                                            />
                                            <span className="text-sm text-gray-600 capitalize group-hover:text-gray-900">{diff}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tours Grid */}
                    <div className="lg:col-span-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <p className="text-sm text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{filteredTours.length}</span> of{' '}
                                <span className="font-semibold text-gray-900">{tours.length}</span> tours
                            </p>
                        </div>

                        {loading && (
                            <div className="flex justify-center items-center py-20">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C5F7D]"></div>
                            </div>
                        )}

                        {!loading && filteredTours.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-lg text-gray-600">No tours found matching your filters.</p>
                                <button
                                    onClick={() => setFilters({
                                        featuredOnly: false,
                                        popularOnly: false,
                                        difficulty: { easy: false, moderate: false, challenging: false, extreme: false }
                                    })}
                                    className="mt-4 text-[#2C5F7D] font-medium hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredTours.map((tour) => (
                                <Link
                                    key={tour.id}
                                    href={`/tours/${tour.id}`}
                                    className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                                >
                                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                                        {(tour.featured_image_url || tour.featured_image) ? (
                                            <Image
                                                src={tour.featured_image_url || tour.featured_image || ''}
                                                alt={tour.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <ImageIcon className="w-10 h-10" strokeWidth={1.5} />
                                            </div>
                                        )}

                                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                                            {(tour.is_featured || tour.status?.is_featured) && (
                                                <span className="bg-orange-400 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide shadow-sm">
                                                    Featured
                                                </span>
                                            )}
                                            {(tour.is_popular || tour.status?.is_popular) && (
                                                <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide shadow-sm">
                                                    Popular
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="flex items-center text-xs text-gray-500 mb-2">
                                            <MapPin className="w-3.5 h-3.5 mr-1" />
                                            {tour.destination}
                                        </div>

                                        <h3 className="text-base font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-[#2C5F7D] transition-colors">
                                            {tour.title}
                                        </h3>

                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{tour.duration?.days || tour.duration_days}D / {tour.duration?.nights || tour.duration_nights}N</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Users className="w-3.5 h-3.5" />
                                                <span>{tour.group_size?.min || tour.min_group_size}-{tour.group_size?.max || tour.max_group_size}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="flex items-center text-xs text-gray-500">
                                                <Plane className="mr-1.5 w-3 h-3" />
                                                {tour.tour_type}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getDifficultyColor(tour.difficulty_level)}`}>
                                                {tour.difficulty_level}
                                            </span>
                                        </div>

                                        <div className="flex items-end justify-end pt-3 border-t border-gray-100">
                                            <span className="text-sm font-medium text-[#2C5F7D] group-hover:underline">
                                                View Details
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}