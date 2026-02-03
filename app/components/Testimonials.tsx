'use client';

import { getLatestReviews, type Review } from '@/lib/api';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Testimonials() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await getLatestReviews();
                // Handle multiple response formats
                let reviewData = [];
                if (Array.isArray(response)) {
                    reviewData = response;
                } else if (response && Array.isArray(response.data)) {
                    reviewData = response.data;
                } else if (response && response.data && typeof response.data === 'object') {
                    // If data is an object, try to get the array from common property names
                    reviewData = response.data.reviews || response.data.items || [];
                }

                setReviews(reviewData);
            } catch (error) {
                console.error('Error fetching reviews:', error);
                // Set empty array on error to prevent UI breaking
                setReviews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                            What Our Travelers Say
                        </h2>
                        <p className="text-sm text-gray-500">
                            Read experiences from our happy travelers
                        </p>
                    </div>
                    <Link
                        href="/reviews"
                        className="hidden md:inline-block border border-gray-200 hover:border-[#2C5F7D] hover:text-[#2C5F7D] text-gray-600 px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                    >
                        View All Reviews
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C5F7D]"></div>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No reviews available at the moment.</p>
                        <p className="text-gray-500 text-sm mt-2">Check back soon for customer testimonials!</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                >
                                    <div className="flex gap-1 mb-3">
                                        {[...Array(Math.floor(review.rating))].map((_, i) => (
                                            <svg
                                                key={i}
                                                className="w-5 h-5 text-yellow-400 fill-current"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                            </svg>
                                        ))}
                                    </div>

                                    <p className="text-gray-700 mb-4 text-sm leading-relaxed line-clamp-4">
                                        "{review.review}"
                                    </p>

                                    <div className="border-t pt-4">
                                        <p className="font-semibold text-gray-900">{review.name}</p>
                                        {review.trek && (
                                            <p className="text-sm text-gray-500">{review.trek}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-8 md:hidden">
                            <Link
                                href="/reviews"
                                className="inline-block border border-gray-200 hover:border-[#2C5F7D] hover:text-[#2C5F7D] text-gray-600 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200"
                            >
                                View All Reviews
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
