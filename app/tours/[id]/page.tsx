'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { MapPin, Calendar, ArrowLeft, ChevronLeft, ChevronRight, X, Phone, Mail, MessageCircle, Plane, Clock, Users } from 'lucide-react';

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
    has_discount?: boolean;
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
    status?: {
        is_active: boolean;
        is_featured: boolean;
        is_popular: boolean;
    };
    booking?: {
        available_slots: number;
        instant_booking: boolean;
    };
    available_slots?: number;
    is_featured?: boolean;
    is_popular?: boolean;
    is_active?: boolean;
}

export default function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [tour, setTour] = useState<Tour | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showContactModal, setShowContactModal] = useState(false);

    useEffect(() => {
        const fetchTour = async () => {
            try {
                const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await fetch(`${API_BASE_URL}/tours/${resolvedParams.id}`);
                const data = await response.json();

                let foundTour = null;
                if (data.success && data.data) {
                    foundTour = data.data;
                } else if (data.id) {
                    foundTour = data;
                }

                setTour(foundTour);
            } catch (error) {
                console.error('Error fetching tour:', error);
                setTour(null);
            } finally {
                setLoading(false);
            }
        };

        fetchTour();
    }, [resolvedParams.id]);

    const getDifficultyColor = (difficulty: string) => {
        const lower = difficulty.toLowerCase();
        if (lower.includes('easy')) return 'bg-green-100 text-green-700';
        if (lower.includes('moderate')) return 'bg-yellow-100 text-yellow-700';
        if (lower.includes('challenging')) return 'bg-orange-100 text-orange-700';
        if (lower.includes('extreme')) return 'bg-red-100 text-red-700';
        return 'bg-gray-100 text-gray-700';
    };

    const nextImage = () => {
        const featuredImg = tour?.featured_image || tour?.featured_image_url;
        const totalImages = (featuredImg ? 1 : 0) + (tour?.gallery_images?.length || 0);
        if (totalImages > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % totalImages);
        }
    };

    const prevImage = () => {
        const featuredImg = tour?.featured_image || tour?.featured_image_url;
        const totalImages = (featuredImg ? 1 : 0) + (tour?.gallery_images?.length || 0);
        if (totalImages > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
        }
    };

    const getAllImages = () => {
        const imageUrls: string[] = [];
        const featuredImg = tour?.featured_image || tour?.featured_image_url;
        if (featuredImg) {
            imageUrls.push(featuredImg);
        }
        if (tour?.gallery_images && tour.gallery_images.length > 0) {
            imageUrls.push(...tour.gallery_images);
        }
        return imageUrls;
    };

    const allImages = tour ? getAllImages() : [];
    const hasMultipleImages = allImages.length > 1;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {loading ? (
                <div className="text-center py-40 mt-20">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
                </div>
            ) : !tour ? (
                <div className="text-center py-40 mt-20">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Tour Not Found</h1>
                    <p className="text-gray-600 mb-8">The tour you're looking for doesn't exist.</p>
                    <Link href="/tours" className="text-cyan-600 hover:text-cyan-700 font-medium">
                        ← Back to Tours
                    </Link>
                </div>
            ) : (
                <>
                    {/* Header */}
                    <div className="bg-white border-b mt-20">
                        <div className="max-w-7xl mx-auto px-6 py-6">
                            <Link
                                href="/tours"
                                className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium mb-6 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Tours
                            </Link>

                            <div className="flex items-start justify-between gap-6 flex-wrap">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                            Tour Package
                                        </span>
                                        <span className={`px-3 py-1 rounded text-xs font-medium ${getDifficultyColor(tour.difficulty_level)}`}>
                                            {tour.difficulty_level}
                                        </span>
                                        {(tour.is_featured || tour.status?.is_featured) && (
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                                                Featured
                                            </span>
                                        )}
                                        {(tour.is_popular || tour.status?.is_popular) && (
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                                Popular
                                            </span>
                                        )}
                                    </div>

                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                        {tour.title}
                                    </h1>

                                    <div className="flex items-center gap-6 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>{tour.destination}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            <span>
                                                {tour.duration?.days || tour.duration_days}D / {tour.duration?.nights || tour.duration_nights}N
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            <span>
                                                {tour.group_size?.min || tour.min_group_size}-{tour.group_size?.max || tour.max_group_size} people
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image Slider */}
                    {allImages.length > 0 ? (
                        <div className="relative bg-gray-900">
                            <div className="relative h-[500px] max-w-7xl mx-auto">
                                {allImages.map((imageUrl, index) => (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 transition-opacity duration-500 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                                            }`}
                                    >
                                        <Image
                                            src={imageUrl}
                                            alt={`${tour.title} - Image ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                ))}

                                {/* Navigation Arrows */}
                                {hasMultipleImages && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 z-10"
                                            aria-label="Previous image"
                                        >
                                            <ChevronLeft className="w-6 h-6 text-gray-900" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 z-10"
                                            aria-label="Next image"
                                        >
                                            <ChevronRight className="w-6 h-6 text-gray-900" />
                                        </button>
                                    </>
                                )}

                                {/* Dots Indicator */}
                                {hasMultipleImages && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                        {allImages.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentImageIndex
                                                    ? 'bg-white w-8'
                                                    : 'bg-white/50 hover:bg-white/75'
                                                    }`}
                                                aria-label={`Go to image ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Image Counter */}
                                {hasMultipleImages && (
                                    <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
                                        {currentImageIndex + 1} / {allImages.length}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800">
                            <div className="relative h-[500px] max-w-7xl mx-auto flex items-center justify-center">
                                <div className="text-center text-white">
                                    <Plane className="w-24 h-24 mx-auto mb-4 opacity-50" />
                                    <p className="text-xl font-semibold">No images available</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <article className="max-w-7xl mx-auto px-6 py-12">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Description */}
                                {tour.description && (
                                    <div className="bg-white rounded-lg p-6 shadow-sm">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                            {tour.description}
                                        </p>
                                    </div>
                                )}

                                {/* Tour Highlights */}
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Highlights</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                            <div className="flex-shrink-0 w-8 h-8 bg-cyan-100 text-cyan-700 rounded-full flex items-center justify-center">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">Duration</div>
                                                <div className="text-sm text-gray-600">
                                                    {tour.duration?.days || tour.duration_days} Days / {tour.duration?.nights || tour.duration_nights} Nights
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                            <div className="flex-shrink-0 w-8 h-8 bg-cyan-100 text-cyan-700 rounded-full flex items-center justify-center">
                                                <Users className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">Group Size</div>
                                                <div className="text-sm text-gray-600">
                                                    {tour.group_size?.min || tour.min_group_size} - {tour.group_size?.max || tour.max_group_size} People
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                            <div className="flex-shrink-0 w-8 h-8 bg-cyan-100 text-cyan-700 rounded-full flex items-center justify-center">
                                                <Plane className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">Tour Type</div>
                                                <div className="text-sm text-gray-600 capitalize">{tour.tour_type}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                            <div className="flex-shrink-0 w-8 h-8 bg-cyan-100 text-cyan-700 rounded-full flex items-center justify-center">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">Available Slots</div>
                                                <div className="text-sm text-gray-600">
                                                    {tour.booking?.available_slots || tour.available_slots} Slots Remaining
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Tour Details</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Duration</div>
                                            <div className="font-semibold text-gray-900">
                                                {tour.duration?.days || tour.duration_days} Days / {tour.duration?.nights || tour.duration_nights} Nights
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Difficulty</div>
                                            <div className="font-semibold text-gray-900">{tour.difficulty_level}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Destination</div>
                                            <div className="font-semibold text-gray-900 capitalize">{tour.destination}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Group Size</div>
                                            <div className="font-semibold text-gray-900">
                                                {tour.group_size?.min || tour.min_group_size} - {tour.group_size?.max || tour.max_group_size} people
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Tour Type</div>
                                            <div className="font-semibold text-gray-900 capitalize">{tour.tour_type}</div>
                                        </div>
                                        <button
                                            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-semibold transition-colors duration-200 mt-4"
                                            onClick={() => setShowContactModal(true)}
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                </>
            )}

            {/* Contact Modal */}
            {showContactModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowContactModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-zoom-in" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-6 rounded-t-2xl relative">
                            <button
                                onClick={() => setShowContactModal(false)}
                                className="absolute top-4 right-4 text-white/90 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <h2 className="text-2xl font-bold mb-2">Contact Us</h2>
                            <p className="text-cyan-50 text-sm">Get in touch to book your adventure</p>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            <div className="text-center pb-4 border-b">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Book?</h3>
                                <p className="text-gray-600 text-sm">Reach out to us through any of these channels</p>
                            </div>

                            <div className="space-y-4">
                                {/* Phone */}
                                <a
                                    href="tel:+9779851234567"
                                    className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-cyan-500 hover:bg-cyan-50 transition-all duration-200 group"
                                >
                                    <div className="bg-cyan-100 p-3 rounded-full group-hover:bg-cyan-500 transition-colors">
                                        <Phone className="w-6 h-6 text-cyan-600 group-hover:text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">Call Us</div>
                                        <div className="text-gray-600 text-sm">+977 985-1234567</div>
                                    </div>
                                </a>

                                {/* Email */}
                                <a
                                    href="mailto:info@jamjamtrek.com"
                                    className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-cyan-500 hover:bg-cyan-50 transition-all duration-200 group"
                                >
                                    <div className="bg-cyan-100 p-3 rounded-full group-hover:bg-cyan-500 transition-colors">
                                        <Mail className="w-6 h-6 text-cyan-600 group-hover:text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">Email Us</div>
                                        <div className="text-gray-600 text-sm">info@jamjamtrek.com</div>
                                    </div>
                                </a>

                                {/* WhatsApp */}
                                <a
                                    href="https://wa.me/9779851234567"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all duration-200 group"
                                >
                                    <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-500 transition-colors">
                                        <MessageCircle className="w-6 h-6 text-green-600 group-hover:text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">WhatsApp</div>
                                        <div className="text-gray-600 text-sm">Chat with us instantly</div>
                                    </div>
                                </a>
                            </div>

                            <div className="pt-4 border-t">
                                <p className="text-xs text-gray-500 text-center">
                                    We typically respond within 24 hours
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
