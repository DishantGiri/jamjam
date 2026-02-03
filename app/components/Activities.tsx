'use client';

import { MapPin, Clock, ImageIcon, Users, Calendar, User } from 'lucide-react';
import { getActivities, type Activity } from '@/lib/api';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Activities() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await getActivities({ is_active: true });
                // Handle multiple response formats
                let activityData = [];
                if (Array.isArray(response)) {
                    activityData = response;
                } else if (response && Array.isArray(response.data)) {
                    activityData = response.data;
                } else if (response && response.data && typeof response.data === 'object') {
                    // If data is an object, try to get the array from common property names
                    activityData = response.data.activities || response.data.items || [];
                }

                // Limit to 3 activities for the homepage
                setActivities(activityData.slice(0, 3));
            } catch (error) {
                console.error('Error fetching activities:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Popular Activities
                        </h2>
                        <p className="text-gray-600">
                            Thrilling adventures beyond trekking
                        </p>
                    </div>
                    <Link
                        href="/activities"
                        className="hidden md:inline-block border border-gray-200 hover:border-[#2C5F7D] hover:text-[#2C5F7D] text-gray-600 px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                    >
                        View All Activities
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C5F7D]"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {activities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
                                >
                                    <div className="relative h-56 bg-gray-100">
                                        {activity.featured_image_url ? (
                                            <Image
                                                src={activity.featured_image_url}
                                                alt={activity.title}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                <ImageIcon className="w-16 h-16" strokeWidth={1.5} />
                                            </div>
                                        )}
                                        {activity.category && (
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-xs font-semibold shadow-sm">
                                                    {activity.category}
                                                </span>
                                            </div>
                                        )}
                                        {activity.is_featured && (
                                            <div className="absolute top-4 right-4">
                                                <span className="bg-orange-400 text-white px-3 py-1 rounded text-xs font-semibold shadow-sm">
                                                    Featured
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                                            <span className="flex items-center text-white text-sm font-medium drop-shadow-md">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                {activity.location}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-1">{activity.title}</h3>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Clock className="w-4 h-4 mr-3 text-gray-400" />
                                                {activity.duration}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <User className="w-4 h-4 mr-3 text-gray-400" />
                                                Max {activity.max_participants || 10} participants
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                                                {activity.season || "Year Round"}
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                                                {activity.difficulty || "Moderate"}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                            <div>
                                                <p className="text-xs text-gray-400 mb-0.5">From</p>
                                                <div className="text-xl font-bold text-[#2C5F7D]">
                                                    ${activity.price}
                                                </div>
                                            </div>
                                            <button className="bg-[#2C5F7D] hover:bg-[#244f68] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-8 md:hidden">
                            <Link
                                href="/activities"
                                className="inline-block border border-gray-200 hover:border-[#2C5F7D] hover:text-[#2C5F7D] text-gray-600 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200"
                            >
                                View All Activities
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
