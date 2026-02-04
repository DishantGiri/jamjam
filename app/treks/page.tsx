'use client';

import { useState, useEffect } from 'react';
import { getTreks, type Trek } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, ImageIcon, Clock, Zap, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TreksPage() {
    const [treks, setTreks] = useState<Trek[]>([]);
    const [filteredTreks, setFilteredTreks] = useState<Trek[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [filters, setFilters] = useState({
        featuredOnly: false,
        types: {
            trek: false,
            package: false
        },
        difficulty: {
            easy: false,
            moderate: false,
            hard: false
        }
    });

    useEffect(() => {
        const fetchTreks = async () => {
            try {
                // Fetch all active treks initially
                const response = await getTreks({ is_active: true });
                // Handle multiple response formats
                let trekData = [];
                if (Array.isArray(response)) {
                    trekData = response;
                } else if (response && Array.isArray(response.data)) {
                    trekData = response.data;
                } else if (response && response.data && typeof response.data === 'object') {
                    trekData = response.data.treks || response.data.items || [];
                }

                setTreks(trekData || []);
                setFilteredTreks(trekData || []);
            } catch (error) {
                console.error('Error fetching treks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTreks();
    }, []);

    useEffect(() => {
        let result = [...treks];

        // 1. Filter by Featured
        if (filters.featuredOnly) {
            result = result.filter(trek => trek.is_featured);
        }

        // 2. Filter by Type
        const activeTypes = Object.entries(filters.types)
            .filter(([_, isActive]) => isActive)
            .map(([type]) => type);

        if (activeTypes.length > 0) {
            result = result.filter(trek => activeTypes.includes(trek.data_type.toLowerCase()));
        }

        // 3. Filter by Difficulty
        const activeDifficulties = Object.entries(filters.difficulty)
            .filter(([_, isActive]) => isActive)
            .map(([diff]) => diff);

        if (activeDifficulties.length > 0) {
            result = result.filter(trek => {
                const diff = trek.difficulty.toLowerCase();
                // Simple matching - could be more robust
                return activeDifficulties.some(d => diff.includes(d));
            });
        }

        setFilteredTreks(result);
    }, [filters, treks]);

    const handleTypeChange = (type: 'trek' | 'package') => {
        setFilters(prev => ({
            ...prev,
            types: { ...prev.types, [type]: !prev.types[type] }
        }));
    };

    const handleDifficultyChange = (diff: 'easy' | 'moderate' | 'hard') => {
        setFilters(prev => ({
            ...prev,
            difficulty: { ...prev.difficulty, [diff]: !prev.difficulty[diff] }
        }));
    };

    const getDifficultyColor = (difficulty: string) => {
        const lower = difficulty.toLowerCase();
        if (lower.includes('easy')) return 'bg-green-100 text-green-700';
        if (lower.includes('moderate')) return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'; // "Moderate" style in image is yellowish
        if (lower.includes('hard') || lower.includes('challenging')) return 'bg-red-100 text-red-600';
        return 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Header Section */}
            <section className="bg-[#2C5F7D] text-white py-12 mt-16 md:mt-20">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Explore Our Treks</h1>
                    <p className="text-white/80 text-sm md:text-base max-w-2xl">
                        Discover & incredible trekking routes in the Himalayas
                    </p>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Filters */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="font-bold text-gray-900 mb-6">Filters</h2>

                            {/* Featured Filter */}
                            <div className="mb-8">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.featuredOnly ? 'bg-[#2C5F7D] border-[#2C5F7D]' : 'border-gray-300 bg-white'}`}>
                                        {filters.featuredOnly && <Check className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={filters.featuredOnly}
                                        onChange={() => setFilters(prev => ({ ...prev, featuredOnly: !prev.featuredOnly }))
                                        }
                                    />
                                    <span className="text-sm text-gray-600 group-hover:text-gray-900">Featured Treks Only</span>
                                </label>
                            </div>

                            {/* Trek Type */}
                            <div className="mb-8">
                                <h3 className="font-semibold text-sm text-gray-900 mb-4">Trek Type</h3>
                                <div className="space-y-3">
                                    {['trek', 'package'].map((type) => (
                                        <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.types[type as keyof typeof filters.types] ? 'bg-[#2C5F7D] border-[#2C5F7D]' : 'border-gray-300 bg-white'}`}>
                                                {filters.types[type as keyof typeof filters.types] && <Check className="w-3.5 h-3.5 text-white" />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={filters.types[type as keyof typeof filters.types]}
                                                onChange={() => handleTypeChange(type as 'trek' | 'package')}
                                            />
                                            <span className="text-sm text-gray-600 capitalize group-hover:text-gray-900">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Difficulty */}
                            <div className="mb-8">
                                <h3 className="font-semibold text-sm text-gray-900 mb-4">Difficulty Level</h3>
                                <div className="space-y-3">
                                    {['easy', 'moderate', 'hard'].map((diff) => (
                                        <label key={diff} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.difficulty[diff as keyof typeof filters.difficulty] ? 'bg-[#2C5F7D] border-[#2C5F7D]' : 'border-gray-300 bg-white'}`}>
                                                {filters.difficulty[diff as keyof typeof filters.difficulty] && <Check className="w-3.5 h-3.5 text-white" />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={filters.difficulty[diff as keyof typeof filters.difficulty]}
                                                onChange={() => handleDifficultyChange(diff as 'easy' | 'moderate' | 'hard')}
                                            />
                                            <span className="text-sm text-gray-600 capitalize group-hover:text-gray-900">{diff}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Sort Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <p className="text-sm text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{filteredTreks.length}</span> of {treks.length} treks
                            </p>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="text-center py-20">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C5F7D]"></div>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && filteredTreks.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-lg border border-gray-100">
                                <p className="text-lg text-gray-600">No treks found matching your filters.</p>
                                <button
                                    onClick={() => setFilters({
                                        featuredOnly: false,
                                        types: { trek: false, package: false },
                                        difficulty: { easy: false, moderate: false, hard: false }
                                    })}
                                    className="mt-4 text-[#2C5F7D] font-medium hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredTreks.map((trek) => {
                                const imageUrl = trek.featured_image_url ||
                                    (trek.image_urls && trek.image_urls.length > 0 ? trek.image_urls[0] : null);

                                return (
                                    <Link
                                        key={trek.id}
                                        href={`/treks/${trek.id}`}
                                        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col"
                                    >
                                        <div className="relative h-48 bg-gray-200">
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
                                                    <ImageIcon className="w-10 h-10" strokeWidth={1.5} />
                                                </div>
                                            )}

                                            {trek.is_featured && (
                                                <div className="absolute top-3 right-3">
                                                    <span className="bg-orange-400 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide shadow-sm">
                                                        Featured
                                                    </span>
                                                </div>
                                            )}

                                            <div className="absolute bottom-3 left-3 text-white flex items-center text-xs font-medium drop-shadow-md">
                                                <MapPin className="w-3.5 h-3.5 mr-1" />
                                                {trek.location || "Nepal"}
                                            </div>
                                        </div>

                                        <div className="p-4 flex flex-col flex-grow">
                                            <h3 className="text-base font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-[#2C5F7D] transition-colors">
                                                {trek.title}
                                            </h3>

                                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {trek.duration}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Zap className="w-3.5 h-3.5" />
                                                    {trek.distance_km ? `${trek.distance_km} km` : "100 km"}
                                                </div>
                                            </div>

                                            <div className="flex items-baseline justify-between mb-4">
                                                <span className="flex items-center text-xs text-gray-500">
                                                    <span className="mr-2">↗</span> {trek.data_type === 'trek' ? 'Trek' : 'Package'}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getDifficultyColor(trek.difficulty)}`}>
                                                    {trek.difficulty}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-end mt-auto pt-4 border-t border-gray-50">
                                                <button className="bg-[#2C5F7D] hover:bg-[#234d66] text-white px-4 py-2 rounded text-xs font-semibold transition-colors">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
