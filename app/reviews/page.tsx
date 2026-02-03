'use client';

import { useState, useEffect } from 'react';
import { getPublishableReviews, submitReview, type Review } from '@/lib/api';
import Navbar from '../components/Navbar';
import { Star, Send } from 'lucide-react';
import Footer from '../components/Footer';

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        rating: 5,
        comment: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await getPublishableReviews();
            // Handle multiple response formats
            let reviewData = [];
            if (Array.isArray(response)) {
                reviewData = response;
            } else if (response && Array.isArray(response.data)) {
                reviewData = response.data;
            } else if (response && response.data && typeof response.data === 'object') {
                reviewData = response.data.reviews || response.data.items || [];
            }

            setReviews(reviewData);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitMessage(null);

        try {
            await submitReview({
                name: formData.name,
                email: formData.email,
                rating: formData.rating,
                review: formData.comment
            });

            setSubmitMessage({
                type: 'success',
                text: 'Review submitted successfully! It will be published after approval.'
            });

            // Reset form
            setFormData({
                name: '',
                email: '',
                rating: 5,
                comment: ''
            });

            // Refresh reviews
            setTimeout(() => {
                fetchReviews();
            }, 1000);
        } catch (error) {
            setSubmitMessage({
                type: 'error',
                text: 'Failed to submit review. Please try again.'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-6 h-6 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
                        onClick={() => interactive && onRatingChange?.(star)}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Header Section */}
            <section className="bg-[#2C5F7D] text-white py-12 mt-16 md:mt-20">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Travel Reviews</h1>
                    <p className="text-white/80 text-sm md:text-base max-w-2xl">
                        See what our happy travelers have to say about their adventures
                    </p>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Review Stats & Submit Button */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Stats Cards - Left Side */}
                    <div className="md:col-span-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Total Reviews Card */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Total Reviews</h3>
                                    <p className="text-3xl font-bold text-[#2C5F7D]">{reviews.length}</p>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-full text-[#2C5F7D]">
                                    <Star className="w-6 h-6 fill-current" />
                                </div>
                            </div>

                            {/* Average Rating Card */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Average Rating</h3>
                                    <p className="text-3xl font-bold text-[#2C5F7D]">
                                        {reviews.length > 0 ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1) : '5.0'}
                                    </p>
                                </div>
                                <div className="p-3 bg-yellow-50 rounded-full text-yellow-500">
                                    <Star className="w-6 h-6 fill-current" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C5F7D]"></div>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-lg border border-gray-100">
                        <p className="text-xl text-gray-600">No reviews yet. Be the first to share your experience!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                                        />
                                    ))}
                                </div>

                                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-4">
                                    "{review.review}"
                                </p>

                                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-50">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-[#2C5F7D] flex items-center justify-center font-bold text-sm">
                                        {review.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{review.name}</p>
                                        <p className="text-xs text-gray-400">{formatDate(review.created_at)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Submit Review Form */}
                <div className="mt-16 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 max-w-2xl mx-auto">
                    <div className="bg-[#2C5F7D] px-8 py-6 text-white text-center">
                        <h2 className="text-2xl font-bold mb-2">Share Your Experience</h2>
                        <p className="text-white/80 text-sm">We'd love to hear about your adventure with us!</p>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name & Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Your name"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F7D] focus:border-transparent outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F7D] focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Rating <span className="text-red-500">*</span>
                                </label>
                                <div className="bg-gray-50 p-4 rounded-lg flex justify-center">
                                    {renderStars(formData.rating, true, (rating) => setFormData({ ...formData, rating }))}
                                </div>
                            </div>

                            {/* Review */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Your Review <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    value={formData.comment}
                                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                    placeholder="Tell us about your trip..."
                                    rows={5}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F7D] focus:border-transparent outline-none resize-none transition-all"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-[#2C5F7D] text-white py-4 rounded-lg font-bold hover:bg-[#234d66] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
                            >
                                <Send className="w-5 h-5" />
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </button>

                            {/* Disclaimer */}
                            <p className="text-xs text-gray-400 text-center">
                                Your email will not be published. Reviews are moderated before appearing on the site.
                            </p>
                        </form>
                    </div>
                </div>
            </main>

            {/* Custom Modal for Status Messages */}
            {submitMessage && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] animate-in fade-in duration-200 px-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in-95 duration-300 text-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${submitMessage.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                            {submitMessage.type === 'success' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {submitMessage.type === 'success' ? 'Thank You!' : 'Oops!'}
                        </h3>

                        <p className="text-gray-600 mb-8">
                            {submitMessage.text}
                        </p>

                        <button
                            onClick={() => setSubmitMessage(null)}
                            className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${submitMessage.type === 'success'
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-red-600 hover:bg-red-700'
                                }`}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
