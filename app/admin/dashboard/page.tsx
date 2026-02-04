'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mountain, Activity, FileText, MessageSquare, LogOut, Star, X, Plus, Edit, Trash2, Plane, MapPin, Clock, Users } from 'lucide-react';
import { verifyAuth as verifyAuthAPI, createTrek, createBlog, updateTrek, deleteTrek, updateBlog, deleteBlog, createTour, updateTour, deleteTour } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://161.97.167.73:8001/api';

type Tab = 'overview' | 'treks' | 'tours' | 'blogs' | 'reviews';

export default function AdminDashboard() {
    const router = useRouter();
    const [adminEmail, setAdminEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    useEffect(() => {
        verifyAuth();
    }, []);

    const verifyAuth = async () => {
        const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
        const token = localStorage.getItem('authToken');
        const email = localStorage.getItem('adminEmail');

        if (!isLoggedIn || !token) {
            router.push('/admin/login');
            return;
        }

        try {
            const data = await verifyAuthAPI(token);
            if (data.status && data.role === 'admin') {
                setAdminEmail(email || '');
                setLoading(false);
            } else {
                handleLogout();
            }
        } catch (error) {
            console.error('Auth verification error:', error);
            handleLogout();
        }
    };

    const handleLogout = async () => {
        const token = localStorage.getItem('authToken');

        if (token) {
            try {
                await fetch(`${API_BASE_URL}/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            } catch (error) {
                console.error('Logout error:', error);
            }
        }

        localStorage.removeItem('isAdminLoggedIn');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('authToken');
        router.push('/admin/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
                    <p className="mt-4 text-gray-600">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    const tabs: { id: Tab; label: string }[] = [
        { id: 'overview', label: 'Overview' },
        { id: 'treks', label: 'Treks' },
        { id: 'tours', label: 'Tours' },
        { id: 'blogs', label: 'Blogs' },
        { id: 'reviews', label: 'Reviews' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-[#1e3a5f] text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                <Mountain className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 flex-shrink-0" />
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">Admin Dashboard</h1>
                            </div>
                            <p className="text-gray-300 text-xs sm:text-sm hidden sm:block">Manage your content and monitor performance</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 text-xs sm:text-sm font-medium flex-shrink-0"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="bg-white border-b shadow-sm overflow-x-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex gap-1 sm:gap-2 min-w-max sm:min-w-0">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 sm:px-6 py-2 sm:py-3 font-medium text-xs sm:text-sm transition-colors duration-200 border-b-2 whitespace-nowrap ${activeTab === tab.id
                                    ? 'text-cyan-500 border-cyan-500'
                                    : 'text-gray-600 border-transparent hover:text-gray-900'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
                {activeTab === 'overview' && <OverviewTab />}
                {activeTab === 'treks' && <TreksTab />}
                {activeTab === 'tours' && <ToursTab />}
                {activeTab === 'blogs' && <BlogsTab />}
                {activeTab === 'reviews' && <ReviewsTab />}
            </main>
        </div>
    );
}

// Overview Tab Component
function OverviewTab() {
    const [stats, setStats] = useState({
        treks: 0,
        tours: 0,
        blogs: 0,
        reviews: 0,
        avgRating: 0,
        approvedReviews: 0,
        pendingReviews: 0,
        featuredTreks: 0,
        featuredTours: 0,
        publishedBlogs: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            // Fetch all data in parallel
            const [treksRes, toursRes, blogsRes, reviewsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/treks`, { headers }),
                fetch(`${API_BASE_URL}/tours`, { headers }),
                fetch(`${API_BASE_URL}/blogs`, { headers }),
                fetch(`${API_BASE_URL}/reviews`, { headers })
            ]);

            const treksData = await treksRes.json();
            const toursData = await toursRes.json();
            const blogsData = await blogsRes.json();
            const reviewsData = await reviewsRes.json();

            // Extract data from responses - handle API format: {success: true, data: {treks: [...], pagination: {...}}}
            let treks = [];
            if (treksData.success && treksData.data && Array.isArray(treksData.data.treks)) {
                treks = treksData.data.treks;
            } else if (Array.isArray(treksData)) {
                treks = treksData;
            } else if (treksData && Array.isArray(treksData.data)) {
                treks = treksData.data;
            } else if (treksData && typeof treksData === 'object') {
                treks = treksData.treks || treksData.items || [];
            }

            let tours = [];
            if (toursData.success && toursData.data && Array.isArray(toursData.data.tours)) {
                tours = toursData.data.tours;
            } else if (toursData.success && toursData.data && Array.isArray(toursData.data)) {
                tours = toursData.data;
            } else if (Array.isArray(toursData)) {
                tours = toursData;
            } else if (toursData && Array.isArray(toursData.data)) {
                tours = toursData.data;
            } else if (toursData && typeof toursData === 'object') {
                tours = toursData.tours || toursData.items || [];
            }

            let blogs = [];
            if (blogsData.success && blogsData.data && Array.isArray(blogsData.data)) {
                blogs = blogsData.data;
            } else if (Array.isArray(blogsData)) {
                blogs = blogsData;
            } else if (blogsData && Array.isArray(blogsData.data)) {
                blogs = blogsData.data;
            } else if (blogsData && typeof blogsData === 'object') {
                blogs = blogsData.blogs || blogsData.items || [];
            }

            let reviews = [];
            if (reviewsData.success && reviewsData.data && Array.isArray(reviewsData.data)) {
                reviews = reviewsData.data;
            } else if (Array.isArray(reviewsData)) {
                reviews = reviewsData;
            } else if (reviewsData && Array.isArray(reviewsData.data)) {
                reviews = reviewsData.data;
            } else if (reviewsData && typeof reviewsData === 'object') {
                reviews = reviewsData.reviews || reviewsData.items || [];
            }

            // Calculate stats
            const featuredTreks = treks.filter((t: any) => t.is_featured).length;
            const featuredTours = tours.filter((t: any) => t.is_featured || t.status?.is_featured).length;
            const publishedBlogs = blogs.filter((b: any) => b.is_active).length;
            const approvedReviews = reviews.filter((r: any) => r.status === true || r.status === 1).length;
            const pendingReviews = reviews.filter((r: any) => r.status === false || r.status === 0).length;

            // Calculate average rating
            const validReviews = reviews.filter((r: any) => r.rating);
            const avgRating = validReviews.length > 0
                ? validReviews.reduce((sum: number, r: any) => sum + Number(r.rating), 0) / validReviews.length
                : 0;

            setStats({
                treks: treks.length,
                tours: tours.length,
                blogs: blogs.length,
                reviews: reviews.length,
                avgRating: Math.round(avgRating * 10) / 10,
                approvedReviews,
                pendingReviews,
                featuredTreks,
                featuredTours,
                publishedBlogs
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Mountain} label="Total Treks" value={stats.treks.toString()} color="text-cyan-500" bgColor="bg-cyan-50" />
                <StatCard icon={Plane} label="Total Tours" value={stats.tours.toString()} color="text-blue-500" bgColor="bg-blue-50" />
                <StatCard icon={FileText} label="Blog Posts" value={stats.blogs.toString()} color="text-teal-500" bgColor="bg-teal-50" />
                <StatCard icon={MessageSquare} label="Reviews" value={stats.reviews.toString()} color="text-purple-500" bgColor="bg-purple-50" />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Review Statistics */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <h3 className="text-lg font-bold text-gray-900">Review Statistics</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">Average Rating</span>
                            <span className="font-semibold text-gray-900">{stats.avgRating.toFixed(1)} / 5.0</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">Approved Reviews</span>
                            <span className="font-semibold text-gray-900">{stats.approvedReviews}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">Pending Review</span>
                            <span className="font-semibold text-gray-900">{stats.pendingReviews}</span>
                        </div>
                    </div>
                </div>

                {/* Content Breakdown */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-teal-500" />
                        <h3 className="text-lg font-bold text-gray-900">Content Breakdown</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">Featured Treks</span>
                            <span className="font-semibold text-gray-900">{stats.featuredTreks}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">Featured Tours</span>
                            <span className="font-semibold text-gray-900">{stats.featuredTours}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">Published Blogs</span>
                            <span className="font-semibold text-gray-900">{stats.publishedBlogs}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Modal Components
interface ModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

function CreateTrekModal({ onClose, onSuccess }: ModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        price: '',
        currency: 'USD',
        duration: '',
        difficulty: 'Moderate',
        type: 'trek',
        distance_km: '',
        data_type: 'trek',
        description: '',
        is_featured: false,
        is_active: true
    });
    const [images, setImages] = useState<File[]>([]);
    const [trekDays, setTrekDays] = useState<string[]>(['Day 1: ']);
    const [submitting, setSubmitting] = useState(false);

    const addTrekDay = () => {
        setTrekDays([...trekDays, `Day ${trekDays.length + 1}: `]);
    };

    const removeTrekDay = (index: number) => {
        setTrekDays(trekDays.filter((_, i) => i !== index));
    };

    const updateTrekDay = (index: number, value: string) => {
        const updated = [...trekDays];
        updated[index] = value;
        setTrekDays(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('Authentication required. Please log in again.');
                return;
            }

            const formDataToSend = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                // Convert booleans to 1 or 0 for backend
                if (typeof value === 'boolean') {
                    formDataToSend.append(key, value ? '1' : '0');
                } else {
                    formDataToSend.append(key, value.toString());
                }
            });

            // Add trek_days as JSON array
            formDataToSend.append('trek_days', JSON.stringify(trekDays));

            // Add all images to FormData (first image will be used as featured image)
            images.forEach((image) => {
                formDataToSend.append('images[]', image);
            });

            await createTrek(token, formDataToSend);
            alert('Trek created successfully!');
            onSuccess();
        } catch (error: any) {
            console.error('Error creating trek:', error);
            alert(error.message || 'An error occurred while creating the trek');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-cyan-600 px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center">
                    <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                        <Mountain className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="truncate">Create New Trek</span>
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1 transition-all duration-200 flex-shrink-0"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(95vh-70px)] sm:max-h-[calc(90vh-80px)]">
                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 outline-none"
                                    placeholder="Enter trek title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 outline-none"
                                    placeholder="e.g., Everest Base Camp"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                <select
                                    value={formData.currency}
                                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="NPR">NPR</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., 10 Days"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                                <select
                                    value={formData.difficulty}
                                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Moderate">Moderate</option>
                                    <option value="Challenging">Challenging</option>
                                    <option value="Difficult">Difficult</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
                                <input
                                    type="number"
                                    value={formData.distance_km}
                                    onChange={(e) => setFormData({ ...formData, distance_km: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                            <textarea
                                required
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Images {images.length > 0 && <span className="text-green-600 text-xs">(✓ {images.length} image{images.length > 1 ? 's' : ''} selected)</span>}
                            </label>
                            <p className="text-xs text-gray-500 mb-2">Upload trek images. The first image will be used as the featured image.</p>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setImages(Array.from(e.target.files));
                                    }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            />
                            {images.length > 0 && (
                                <div className="mt-2 space-y-1">
                                    {images.map((img, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                            <span className="truncate flex-1">{img.name}</span>
                                            <span className="text-gray-500 ml-2">{(img.size / 1024).toFixed(1)} KB</span>
                                            <button
                                                type="button"
                                                onClick={() => setImages(images.filter((_, i) => i !== idx))}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.is_featured}
                                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                    className="w-4 h-4 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500"
                                />
                                <span className="text-sm text-gray-700">Featured Trek</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-4 h-4 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500"
                                />
                                <span className="text-sm text-gray-700">Active</span>
                            </label>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
                            >
                                {submitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </span>
                                ) : 'Create Trek'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold order-1 sm:order-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
}

// Edit Trek Modal
interface EditTrekModalProps {
    trek: any;
    onClose: () => void;
    onSuccess: () => void;
}

function EditTrekModal({ trek, onClose, onSuccess }: EditTrekModalProps) {
    const [formData, setFormData] = useState({
        title: trek.title || '',
        location: trek.location || '',
        price: trek.price?.toString() || '',
        currency: trek.currency || 'USD',
        duration: trek.duration || '',
        difficulty: trek.difficulty || 'Moderate',
        type: trek.type || 'trek',
        distance_km: trek.distance_km?.toString() || '',
        data_type: trek.data_type || 'trek',
        description: trek.description || '',
        is_featured: trek.is_featured || false,
        is_active: trek.is_active !== undefined ? trek.is_active : true
    });
    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>(
        Array.isArray(trek.image_urls) ? trek.image_urls :
            Array.isArray(trek.images) ? trek.images : []
    );

    // Parse trek_days - handle if it comes as a string or array with multiple layers of escaping
    const parseTrekDays = (days: any): string[] => {
        console.log('Parsing trek_days, input:', days, 'type:', typeof days);

        if (!days) return ['Day 1: '];

        // If it's already an array, check if items need parsing
        if (Array.isArray(days)) {
            console.log('Is an array:', days);

            // Parse each item in the array if it's an escaped string
            const parsedArray = days.map(item => {
                if (typeof item === 'string' && (item.startsWith('[') || item.startsWith('"['))) {
                    let current = item;
                    let maxAttempts = 10;

                    while (maxAttempts > 0 && typeof current === 'string') {
                        try {
                            const parsed = JSON.parse(current);
                            if (Array.isArray(parsed)) {
                                // If we get an array, flatten it or take first element
                                current = parsed.length > 0 ? parsed[0] : '';
                            } else {
                                current = parsed;
                            }
                            maxAttempts--;
                        } catch (e) {
                            break;
                        }
                    }
                    return current;
                }
                return item;
            });

            console.log('Parsed array items:', parsedArray);
            return parsedArray.length > 0 ? parsedArray : ['Day 1: '];
        }

        // If it's a string, try to parse it recursively (might be over-escaped JSON)
        if (typeof days === 'string') {
            let current = days;
            let maxAttempts = 10; // Prevent infinite loops

            while (maxAttempts > 0 && typeof current === 'string') {
                try {
                    const parsed = JSON.parse(current);
                    console.log(`Parse attempt ${11 - maxAttempts}:`, parsed);
                    if (Array.isArray(parsed)) {
                        // If we got an array, return it
                        console.log('Got array after parsing:', parsed);
                        return parsed.length > 0 ? parsed : ['Day 1: '];
                    }
                    // If parsed but not an array, continue parsing
                    current = parsed;
                    maxAttempts--;
                } catch (e) {
                    // If parsing fails, return what we have
                    console.log('Parse failed, returning:', current);
                    if (typeof current === 'string' && current.trim()) {
                        return [current];
                    }
                    return ['Day 1: '];
                }
            }

            // If we exhausted attempts or got something weird
            console.log('Exhausted attempts, final result:', current);
            return Array.isArray(current) ? current : ['Day 1: '];
        }

        return ['Day 1: '];
    }; const [trekDays, setTrekDays] = useState<string[]>(parseTrekDays(trek.trek_days));
    const [submitting, setSubmitting] = useState(false);

    const addTrekDay = () => {
        setTrekDays([...trekDays, `Day ${trekDays.length + 1}: `]);
    };

    const removeTrekDay = (index: number) => {
        setTrekDays(trekDays.filter((_, i) => i !== index));
    };

    const updateTrekDay = (index: number, value: string) => {
        const updated = [...trekDays];
        updated[index] = value;
        setTrekDays(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('Authentication required. Please log in again.');
                return;
            }

            const formDataToSend = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (typeof value === 'boolean') {
                    formDataToSend.append(key, value ? '1' : '0');
                } else {
                    formDataToSend.append(key, value.toString());
                }
            });

            console.log('Submitting trekDays:', trekDays);
            console.log('trekDays is array:', Array.isArray(trekDays));
            console.log('trekDays JSON:', JSON.stringify(trekDays));
            formDataToSend.append('trek_days', JSON.stringify(trekDays));

            // Only append NEW images (File objects), not existing URLs
            // Backend will preserve existing images automatically (same as tours)
            images.forEach((image) => {
                if (image instanceof File) {
                    formDataToSend.append('images[]', image);
                }
            });

            await updateTrek(token, trek.id, formDataToSend);
            alert('Trek updated successfully!');
            onSuccess();
        } catch (error: any) {
            console.error('Error updating trek:', error);
            alert(error.message || 'Failed to update trek. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-zoom-in" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-6 rounded-t-2xl z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">Edit Trek</h2>
                            <p className="text-cyan-50 text-sm">Update trek information</p>
                        </div>
                        <button onClick={onClose} className="text-white/90 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Same form fields as Create Trek Modal */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Currency *</label>
                                <select
                                    required
                                    value={formData.currency}
                                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="NPR">NPR</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., 12 days"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty *</label>
                                <select
                                    required
                                    value={formData.difficulty}
                                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Moderate">Moderate</option>
                                    <option value="Challenging">Challenging</option>
                                    <option value="Difficult">Difficult</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                                <select
                                    required
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                >
                                    <option value="trek">Trekking</option>
                                    <option value="hiking">Hiking</option>
                                    <option value="expedition">Expedition</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.distance_km}
                                    onChange={(e) => setFormData({ ...formData, distance_km: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Trek Days */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">Trek Days *</label>
                                <button
                                    type="button"
                                    onClick={addTrekDay}
                                    className="text-cyan-500 hover:text-cyan-600 text-sm font-medium flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Day
                                </button>
                            </div>
                            <div className="space-y-2">
                                {trekDays.map((day, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            required
                                            value={day}
                                            onChange={(e) => updateTrekDay(index, e.target.value)}
                                            placeholder={`Day ${index + 1}: Description`}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                        />
                                        {trekDays.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeTrekDay(index)}
                                                className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                            <textarea
                                required
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Images
                            </label>
                            <p className="text-xs text-gray-500 mb-2">
                                Manage trek images. Click the X button on any image to remove it. New images will be added to existing ones.
                            </p>

                            {/* Existing Images */}
                            {existingImages.length > 0 && (
                                <div className="mb-3">
                                    <p className="text-xs text-gray-500 mb-2">Current Images:</p>
                                    <div className="grid grid-cols-4 gap-3">
                                        {existingImages.map((imgUrl, idx) => (
                                            <div key={`existing-${idx}`} className="relative group">
                                                <img
                                                    src={imgUrl}
                                                    alt={`Gallery ${idx + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setExistingImages(existingImages.filter((_, i) => i !== idx))}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New Images */}
                            {images.length > 0 && (
                                <div className="mb-3">
                                    <p className="text-xs text-green-600 mb-2">✓ New Images ({images.length}):</p>
                                    <div className="grid grid-cols-4 gap-3">
                                        {images.map((img, idx) => (
                                            <div key={`new-${idx}`} className="relative group">
                                                <img
                                                    src={URL.createObjectURL(img)}
                                                    alt={`New ${idx + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg border-2 border-cyan-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1 py-0.5 rounded-b-lg">
                                                    {(img.size / 1024).toFixed(0)} KB
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => document.getElementById('gallery-images-input')?.click()}
                                className="w-full px-4 py-2 bg-cyan-50 text-cyan-600 border border-cyan-200 rounded-lg hover:bg-cyan-100 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add More Images
                            </button>
                            <input
                                id="gallery-images-input"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                    if (e.target.files) {
                                        // Append new files to existing images array
                                        setImages([...images, ...Array.from(e.target.files)]);
                                    }
                                }}
                                className="hidden"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                New images will be added to existing ones. Remove unwanted images by clicking the X button.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_featured}
                                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                    className="w-4 h-4 text-cyan-500 rounded focus:ring-2 focus:ring-cyan-500"
                                />
                                <span className="text-sm text-gray-700">Featured Trek</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-4 h-4 text-cyan-500 rounded focus:ring-2 focus:ring-cyan-500"
                                />
                                <span className="text-sm text-gray-700">Active</span>
                            </label>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Trek'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function CreateActivityModal({ onClose, onSuccess }: ModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        price: '',
        currency: 'USD',
        duration: '',
        difficulty: 'Moderate',
        category: 'Adventure',
        min_age: '',
        max_participants: '',
        description: '',
        inclusions: '',
        requirements: '',
        season: '',
        is_featured: false,
        is_active: true
    });
    const [featuredImage, setFeaturedImage] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('Authentication required. Please log in again.');
                return;
            }

            const formDataToSend = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                // Convert booleans to 1 or 0 for backend
                if (typeof value === 'boolean') {
                    formDataToSend.append(key, value ? '1' : '0');
                } else {
                    formDataToSend.append(key, value.toString());
                }
            });

            if (featuredImage) {
                formDataToSend.append('featured_image', featuredImage);
            }

        } catch (error: any) {
            console.error('Error creating activity:', error);
            alert(error.message || 'An error occurred while creating the activity');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Activity className="w-6 h-6" />
                        Create New Activity
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1 transition-all duration-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                <select
                                    value={formData.currency}
                                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="NPR">NPR</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., 3 Hours"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="Adventure">Adventure</option>
                                    <option value="Cultural">Cultural</option>
                                    <option value="Rafting">Rafting</option>
                                    <option value="Paragliding">Paragliding</option>
                                    <option value="Hiking">Hiking</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                                <select
                                    value={formData.difficulty}
                                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Moderate">Moderate</option>
                                    <option value="Challenging">Challenging</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Min Age</label>
                                <input
                                    type="number"
                                    value={formData.min_age}
                                    onChange={(e) => setFormData({ ...formData, min_age: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                                <input
                                    type="number"
                                    value={formData.max_participants}
                                    onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Season</label>
                            <input
                                type="text"
                                placeholder="e.g., All Year, Spring-Autumn"
                                value={formData.season}
                                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                            <textarea
                                required
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Inclusions</label>
                            <textarea
                                rows={2}
                                placeholder="Comma-separated items"
                                value={formData.inclusions}
                                onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                            <textarea
                                rows={2}
                                placeholder="Comma-separated requirements"
                                value={formData.requirements}
                                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Featured Image {featuredImage && <span className="text-green-600 text-xs">(✓ Selected: {featuredImage.name})</span>}
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFeaturedImage(e.target.files?.[0] || null)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                            {featuredImage && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Size: {(featuredImage.size / 1024).toFixed(1)} KB
                                </p>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.is_featured}
                                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                                />
                                <span className="text-sm text-gray-700">Featured Activity</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                                />
                                <span className="text-sm text-gray-700">Active</span>
                            </label>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </span>
                                ) : 'Create Activity'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function CreateBlogModal({ onClose, onSuccess }: ModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        excerpt: '',
        author: '',
        conclusion: '',
        slug: '',
        is_active: true
    });
    const [featuredImage, setFeaturedImage] = useState<File | null>(null);
    const [contentSections, setContentSections] = useState<Array<{ heading: string, paragraph: string }>>([
        { heading: '', paragraph: '' }
    ]);
    const [submitting, setSubmitting] = useState(false);

    const addContentSection = () => {
        setContentSections([...contentSections, { heading: '', paragraph: '' }]);
    };

    const removeContentSection = (index: number) => {
        setContentSections(contentSections.filter((_, i) => i !== index));
    };

    const updateContentSection = (index: number, field: 'heading' | 'paragraph', value: string) => {
        const updated = [...contentSections];
        updated[index][field] = value;
        setContentSections(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('Authentication required. Please log in again.');
                setSubmitting(false);
                return;
            }

            // Validate required fields
            if (!featuredImage) {
                alert('Please select a featured image');
                setSubmitting(false);
                return;
            }

            const formDataToSend = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                // Convert booleans to 1 or 0 for backend
                if (typeof value === 'boolean') {
                    formDataToSend.append(key, value ? '1' : '0');
                } else {
                    formDataToSend.append(key, value.toString());
                }
            });

            formDataToSend.append('content', JSON.stringify(contentSections));

            if (featuredImage) {
                formDataToSend.append('image', featuredImage);
            }

            await createBlog(token, formDataToSend);
            alert('Blog post created successfully!');
            onSuccess();
        } catch (error: any) {
            console.error('Error creating blog:', error);
            alert(error.message || 'An error occurred while creating the blog');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="sticky top-0 bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-5 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <FileText className="w-6 h-6" />
                        Create New Blog Post
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1 transition-all duration-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                            <input
                                type="text"
                                value={formData.subtitle}
                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="url-friendly-slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt *</label>
                            <textarea
                                required
                                rows={2}
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                            <textarea
                                required
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">Content Sections</label>
                                <button
                                    type="button"
                                    onClick={addContentSection}
                                    className="text-sm text-teal-500 hover:text-teal-600 flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Section
                                </button>
                            </div>
                            <div className="space-y-3">
                                {contentSections.map((section, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600">Section {index + 1}</span>
                                            {contentSections.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeContentSection(index)}
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Heading"
                                            value={section.heading}
                                            onChange={(e) => updateContentSection(index, 'heading', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                                        />
                                        <textarea
                                            rows={3}
                                            placeholder="Paragraph"
                                            value={section.paragraph}
                                            onChange={(e) => updateContentSection(index, 'paragraph', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Conclusion</label>
                            <textarea
                                rows={3}
                                value={formData.conclusion}
                                onChange={(e) => setFormData({ ...formData, conclusion: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Featured Image {featuredImage && <span className="text-green-600 text-xs">(✓ Selected: {featuredImage.name})</span>}
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFeaturedImage(e.target.files?.[0] || null)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                            {featuredImage && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Size: {(featuredImage.size / 1024).toFixed(1)} KB
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-4 h-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                                />
                                <span className="text-sm text-gray-700">Active</span>
                            </label>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </span>
                                ) : 'Create Blog Post'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Edit Blog Modal Component
function EditBlogModal({ blog, onClose, onSuccess }: { blog: any; onClose: () => void; onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        title: blog.title || '',
        subtitle: blog.subtitle || '',
        description: blog.description || '',
        excerpt: blog.excerpt || '',
        author: blog.author || '',
        conclusion: blog.conclusion || '',
        slug: blog.slug || '',
        is_active: blog.is_active || false
    });
    const [featuredImage, setFeaturedImage] = useState<File | null>(null);
    const [contentSections, setContentSections] = useState<Array<{ heading: string, paragraph: string }>>(
        Array.isArray(blog.content) && blog.content.length > 0
            ? blog.content
            : [{ heading: '', paragraph: '' }]
    );
    const [submitting, setSubmitting] = useState(false);

    const addContentSection = () => {
        setContentSections([...contentSections, { heading: '', paragraph: '' }]);
    };

    const removeContentSection = (index: number) => {
        setContentSections(contentSections.filter((_, i) => i !== index));
    };

    const updateContentSection = (index: number, field: 'heading' | 'paragraph', value: string) => {
        const updated = [...contentSections];
        updated[index][field] = value;
        setContentSections(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('Authentication required. Please log in again.');
                setSubmitting(false);
                return;
            }

            const formDataToSend = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                // Convert booleans to 1 or 0 for backend
                if (typeof value === 'boolean') {
                    formDataToSend.append(key, value ? '1' : '0');
                } else {
                    formDataToSend.append(key, value.toString());
                }
            });

            formDataToSend.append('content', JSON.stringify(contentSections));

            if (featuredImage) {
                formDataToSend.append('image', featuredImage);
            }

            await updateBlog(token, blog.id, formDataToSend);
            alert('Blog post updated successfully!');
            onSuccess();
        } catch (error: any) {
            console.error('Error updating blog:', error);
            alert(error.message || 'An error occurred while updating the blog');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="sticky top-0 bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-5 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Edit className="w-6 h-6" />
                        Edit Blog Post
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1 transition-all duration-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                            <input
                                type="text"
                                value={formData.subtitle}
                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="url-friendly-slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt *</label>
                            <textarea
                                required
                                rows={2}
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                            <textarea
                                required
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">Content Sections</label>
                                <button
                                    type="button"
                                    onClick={addContentSection}
                                    className="text-sm text-teal-500 hover:text-teal-600 flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Section
                                </button>
                            </div>
                            <div className="space-y-3">
                                {contentSections.map((section, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600">Section {index + 1}</span>
                                            {contentSections.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeContentSection(index)}
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Heading"
                                            value={section.heading}
                                            onChange={(e) => updateContentSection(index, 'heading', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                                        />
                                        <textarea
                                            rows={3}
                                            placeholder="Paragraph"
                                            value={section.paragraph}
                                            onChange={(e) => updateContentSection(index, 'paragraph', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Conclusion</label>
                            <textarea
                                rows={3}
                                value={formData.conclusion}
                                onChange={(e) => setFormData({ ...formData, conclusion: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Featured Image {featuredImage && <span className="text-green-600 text-xs">(✓ New image selected: {featuredImage.name})</span>}
                            </label>
                            {blog.image_url && !featuredImage && (
                                <div className="mb-2">
                                    <p className="text-xs text-gray-500 mb-1">Current image:</p>
                                    <img
                                        src={blog.image_url}
                                        alt="Current blog"
                                        className="h-20 w-auto object-cover rounded border border-gray-300"
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFeaturedImage(e.target.files?.[0] || null)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                            {featuredImage && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Size: {(featuredImage.size / 1024).toFixed(1)} KB
                                </p>
                            )}
                            {!featuredImage && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Leave empty to keep current image
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-4 h-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                                />
                                <span className="text-sm text-gray-700">Active</span>
                            </label>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </span>
                                ) : 'Update Blog Post'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, color, bgColor }: {
    icon: any;
    label: string;
    value: string;
    color: string;
    bgColor: string;
}) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className={`${bgColor} ${color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="text-gray-600 text-sm mb-1">{label}</div>
            <div className="text-3xl font-bold text-gray-900">{value}</div>
        </div>
    );
}

// Treks Tab Component
function TreksTab() {
    const [treks, setTreks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingTrek, setEditingTrek] = useState<any | null>(null);

    useEffect(() => {
        fetchTreks();
    }, []);

    const fetchTreks = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/treks`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error('Trek fetch failed with status:', response.status);
                const errorText = await response.text();
                console.error('Error response:', errorText);
                setTreks([]);
                setLoading(false);
                return;
            }

            const data = await response.json();
            console.log('Treks response:', data); // Debug log

            // Handle API response structure: {success: true, data: {treks: [...], pagination: {...}}}
            let treksData = [];
            if (data.success && data.data && Array.isArray(data.data.treks)) {
                treksData = data.data.treks;
            } else if (Array.isArray(data)) {
                treksData = data;
            } else if (data && Array.isArray(data.data)) {
                treksData = data.data;
            } else if (data && typeof data === 'object') {
                // Fallback: try to get array from common property names
                treksData = data.treks || data.items || [];
            }
            setTreks(treksData);
        } catch (error) {
            console.error('Error fetching treks:', error);
            setTreks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTrek = async (trekId: number, trekTitle: string) => {
        if (!confirm(`Are you sure you want to delete "${trekTitle}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('Authentication required. Please log in again.');
                return;
            }

            await deleteTrek(token, trekId);
            alert('Trek deleted successfully!');
            fetchTreks(); // Refresh the list
        } catch (error: any) {
            console.error('Error deleting trek:', error);
            alert(error.message || 'Failed to delete trek. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Manage Treks</h2>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                    <Plus className="w-4 h-4" />
                    Add New Trek
                </button>
            </div>

            {showCreateModal && (
                <CreateTrekModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        fetchTreks();
                    }}
                />
            )}

            {editingTrek && (
                <EditTrekModal
                    trek={editingTrek}
                    onClose={() => setEditingTrek(null)}
                    onSuccess={() => {
                        setEditingTrek(null);
                        fetchTreks();
                    }}
                />
            )}

            <div className="space-y-4">
                {treks.map((trek) => (
                    <div key={trek.id} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 truncate">{trek.title}</h3>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                                    <span className="truncate">{trek.location}</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="whitespace-nowrap">${trek.price} {trek.currency}</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className={`font-medium whitespace-nowrap ${trek.is_active ? 'text-green-600' : 'text-gray-500'}`}>
                                        {trek.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button
                                    onClick={() => setEditingTrek(trek)}
                                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-white border border-cyan-500 text-cyan-500 hover:bg-cyan-50 rounded-lg transition-colors duration-200 text-xs sm:text-sm font-medium shadow-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteTrek(trek.id, trek.title)}
                                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-white border border-red-500 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 text-xs sm:text-sm font-medium shadow-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Activities Tab Component
function ActivitiesTab() {
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/activities`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error('Activities fetch failed with status:', response.status);
                const errorText = await response.text();
                console.error('Error response:', errorText);
                setActivities([]);
                setLoading(false);
                return;
            }

            const data = await response.json();
            console.log('Activities response:', data); // Debug log

            // Handle API response structure: {success: true, data: {activities: [...], pagination: {...}}}
            let activitiesData = [];
            if (data.success && data.data && Array.isArray(data.data.activities)) {
                activitiesData = data.data.activities;
            } else if (Array.isArray(data)) {
                activitiesData = data;
            } else if (data && Array.isArray(data.data)) {
                activitiesData = data.data;
            } else if (data && typeof data === 'object') {
                // Fallback: try to get array from common property names
                activitiesData = data.activities || data.items || [];
            }
            setActivities(activitiesData);
        } catch (error) {
            console.error('Error fetching activities:', error);
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Manage Activities</h2>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add New Activity
                </button>
            </div>

            {showCreateModal && (
                <CreateActivityModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        fetchActivities();
                    }}
                />
            )}

            <div className="space-y-4">
                {activities.map((activity) => (
                    <div key={activity.id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{activity.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span>{activity.location}</span>
                                    <span>•</span>
                                    <span>${activity.price} {activity.currency}</span>
                                    <span>•</span>
                                    <span>{activity.category}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-white border border-orange-500 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors duration-200 text-sm font-medium shadow-sm">
                                    Edit
                                </button>
                                <button className="px-4 py-2 bg-white border border-red-500 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 text-sm font-medium shadow-sm">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Blogs Tab Component
function BlogsTab() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<any>(null);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/blogs`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            // Handle various response formats
            let blogsData = [];
            if (Array.isArray(data)) {
                blogsData = data;
            } else if (data && Array.isArray(data.data)) {
                blogsData = data.data;
            } else if (data && typeof data === 'object') {
                blogsData = data.blogs || data.items || [];
            }
            setBlogs(blogsData);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (blog: any) => {
        setSelectedBlog(blog);
        setShowEditModal(true);
    };

    const handleDelete = async (blogId: number, blogTitle: string) => {
        if (!confirm(`Are you sure you want to delete "${blogTitle}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('Authentication required. Please log in again.');
                return;
            }

            await deleteBlog(token, blogId);
            alert('Blog deleted successfully!');
            fetchBlogs(); // Refresh the list
        } catch (error: any) {
            console.error('Error deleting blog:', error);
            alert(error.message || 'Failed to delete blog');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Manage Blog Posts</h2>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Create New Post
                </button>
            </div>

            {showCreateModal && (
                <CreateBlogModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        fetchBlogs();
                    }}
                />
            )}

            {showEditModal && selectedBlog && (
                <EditBlogModal
                    blog={selectedBlog}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedBlog(null);
                    }}
                    onSuccess={() => {
                        setShowEditModal(false);
                        setSelectedBlog(null);
                        fetchBlogs();
                    }}
                />
            )}

            <div className="space-y-4">
                {blogs.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-10 text-center">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No blog posts yet</p>
                        <p className="text-gray-400 text-sm mt-2">Create your first blog post to get started</p>
                    </div>
                ) : (
                    blogs.map((blog) => (
                        <div key={blog.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-gray-900">{blog.title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${blog.is_active
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {blog.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    {blog.subtitle && (
                                        <p className="text-gray-600 text-sm mb-2">{blog.subtitle}</p>
                                    )}
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>{blog.author || 'Admin'}</span>
                                        <span>•</span>
                                        <span>{formatDate(blog.created_at)}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => handleEdit(blog)}
                                        className="px-4 py-2 bg-white border border-teal-500 text-teal-500 hover:bg-teal-50 rounded-lg transition-colors duration-200 text-sm font-medium shadow-sm flex items-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(blog.id, blog.title)}
                                        className="px-4 py-2 bg-white border border-red-500 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 text-sm font-medium shadow-sm flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

// Tours Tab Component
function ToursTab() {
    const [tours, setTours] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedTour, setSelectedTour] = useState<any>(null);

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/tours`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();

            console.log('Tours API Response:', result); // Debug log

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

            console.log('Processed tours for dashboard:', toursData); // Debug log
            setTours(toursData);
        } catch (error) {
            console.error('Error fetching tours:', error);
            setTours([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (tour: any) => {
        setSelectedTour(tour);
        setShowEditModal(true);
    };

    const handleDelete = async (tourId: number, tourTitle: string) => {
        if (!confirm(`Are you sure you want to delete "${tourTitle}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('Authentication required. Please log in again.');
                return;
            }

            await deleteTour(token, tourId);
            alert('Tour deleted successfully!');
            fetchTours();
        } catch (error: any) {
            console.error('Error deleting tour:', error);
            alert(error.message || 'Failed to delete tour');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Manage Tour Packages</h2>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Create New Tour
                </button>
            </div>

            {showCreateModal && (
                <CreateTourModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        fetchTours();
                    }}
                />
            )}

            {showEditModal && selectedTour && (
                <EditTourModal
                    tour={selectedTour}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedTour(null);
                    }}
                    onSuccess={() => {
                        setShowEditModal(false);
                        setSelectedTour(null);
                        fetchTours();
                    }}
                />
            )}

            <div className="space-y-4">
                {tours.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-10 text-center">
                        <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No tours yet</p>
                        <p className="text-gray-400 text-sm mt-2">Create your first tour package to get started</p>
                    </div>
                ) : (
                    tours.map((tour) => (
                        <div key={tour.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-gray-900">{tour.title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${(tour.is_active || tour.status?.is_active)
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {(tour.is_active || tour.status?.is_active) ? 'Active' : 'Inactive'}
                                        </span>
                                        {(tour.is_featured || tour.status?.is_featured) && (
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                Featured
                                            </span>
                                        )}
                                        {(tour.is_popular || tour.status?.is_popular) && (
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                Popular
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {tour.destination}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {tour.duration?.days || tour.duration_days}D/{tour.duration?.nights || tour.duration_nights}N
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3.5 h-3.5" />
                                            {tour.group_size?.min || tour.min_group_size}-{tour.group_size?.max || tour.max_group_size} people
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Plane className="w-3.5 h-3.5" />
                                            {tour.booking?.available_slots || tour.available_slots} slots
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className={`px-3 py-1 rounded-full font-medium ${tour.difficulty_level === 'Easy' ? 'bg-green-100 text-green-700' :
                                            tour.difficulty_level === 'Moderate' ? 'bg-blue-100 text-blue-700' :
                                                tour.difficulty_level === 'Challenging' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {tour.difficulty_level}
                                        </span>
                                        <span className="px-3 py-1 rounded-full font-medium bg-purple-100 text-purple-700">
                                            {tour.tour_type}
                                        </span>
                                        <span className="font-semibold text-blue-600">
                                            {tour.currency} {tour.discount_price || tour.price}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => handleEdit(tour)}
                                        className="px-4 py-2 bg-white border border-blue-500 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-200 text-sm font-medium shadow-sm flex items-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(tour.id, tour.title)}
                                        className="px-4 py-2 bg-white border border-red-500 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 text-sm font-medium shadow-sm flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

// Create Tour Modal Component
function CreateTourModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        title: '',
        destination: '',
        description: '',
        price: '',
        currency: 'USD',
        discount_price: '',
        duration_days: '',
        duration_nights: '',
        difficulty_level: 'Moderate',
        max_group_size: '',
        min_group_size: '',
        tour_type: '',
        available_slots: '',
        is_featured: false,
        is_popular: false,
        is_active: true
    });
    const [featuredImage, setFeaturedImage] = useState<File | null>(null);
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('Authentication required. Please log in again.');
                setSubmitting(false);
                return;
            }

            const formDataToSend = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (typeof value === 'boolean') {
                    formDataToSend.append(key, value ? '1' : '0');
                } else {
                    formDataToSend.append(key, value.toString());
                }
            });

            if (featuredImage) {
                formDataToSend.append('featured_image', featuredImage);
            }

            galleryImages.forEach((image) => {
                formDataToSend.append('gallery_images[]', image);
            });

            await createTour(token, formDataToSend);
            alert('Tour created successfully!');
            onSuccess();
        } catch (error: any) {
            console.error('Error creating tour:', error);
            alert(error.message || 'An error occurred while creating the tour');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-5 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Plane className="w-6 h-6" />
                        Create New Tour Package
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1 transition-all duration-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Destination *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.destination}
                                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                <select
                                    value={formData.currency}
                                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="NPR">NPR</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price</label>
                                <input
                                    type="number"
                                    value={formData.discount_price}
                                    onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration Days *</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.duration_days}
                                    onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration Nights *</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.duration_nights}
                                    onChange={(e) => setFormData({ ...formData, duration_nights: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level *</label>
                                <select
                                    required
                                    value={formData.difficulty_level}
                                    onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Moderate">Moderate</option>
                                    <option value="Challenging">Challenging</option>
                                    <option value="Extreme">Extreme</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tour Type *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., Adventure, Cultural"
                                    value={formData.tour_type}
                                    onChange={(e) => setFormData({ ...formData, tour_type: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Min Group Size *</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.min_group_size}
                                    onChange={(e) => setFormData({ ...formData, min_group_size: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Group Size *</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.max_group_size}
                                    onChange={(e) => setFormData({ ...formData, max_group_size: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Available Slots *</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.available_slots}
                                    onChange={(e) => setFormData({ ...formData, available_slots: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Featured Image {featuredImage && <span className="text-green-600 text-xs">(✓ Selected: {featuredImage.name})</span>}
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFeaturedImage(e.target.files?.[0] || null)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Gallery Images {galleryImages.length > 0 && <span className="text-green-600 text-xs">(✓ {galleryImages.length} selected)</span>}
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setGalleryImages(Array.from(e.target.files));
                                    }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.is_featured}
                                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Featured</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.is_popular}
                                    onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Popular</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Active</span>
                            </label>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </span>
                                ) : 'Create Tour'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Edit Tour Modal Component (similar structure to CreateTourModal)
function EditTourModal({ tour, onClose, onSuccess }: { tour: any; onClose: () => void; onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        title: tour.title || '',
        destination: tour.destination || '',
        description: tour.description || '',
        price: tour.price?.toString() || '',
        currency: tour.currency || 'USD',
        discount_price: tour.discount_price?.toString() || '',
        duration_days: tour.duration?.days?.toString() || tour.duration_days?.toString() || '',
        duration_nights: tour.duration?.nights?.toString() || tour.duration_nights?.toString() || '',
        difficulty_level: tour.difficulty_level || 'Moderate',
        max_group_size: tour.group_size?.max?.toString() || tour.max_group_size?.toString() || '',
        min_group_size: tour.group_size?.min?.toString() || tour.min_group_size?.toString() || '',
        tour_type: tour.tour_type || '',
        available_slots: tour.booking?.available_slots?.toString() || tour.available_slots?.toString() || '',
        is_featured: tour.is_featured || tour.status?.is_featured || false,
        is_popular: tour.is_popular || tour.status?.is_popular || false,
        is_active: tour.is_active !== undefined ? tour.is_active : (tour.status?.is_active !== undefined ? tour.status.is_active : true)
    });
    const [featuredImage, setFeaturedImage] = useState<File | null>(null);
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>(
        Array.isArray(tour.gallery_images) ? tour.gallery_images : []
    );
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('Authentication required. Please log in again.');
                setSubmitting(false);
                return;
            }

            const formDataToSend = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (typeof value === 'boolean') {
                    formDataToSend.append(key, value ? '1' : '0');
                } else {
                    formDataToSend.append(key, value.toString());
                }
            });

            if (featuredImage) {
                formDataToSend.append('featured_image', featuredImage);
            }

            // Only append NEW gallery images (File objects), not existing URLs
            galleryImages.forEach((image) => {
                if (image instanceof File) {
                    formDataToSend.append('gallery_images[]', image);
                }
            });

            await updateTour(token, tour.id, formDataToSend);
            alert('Tour updated successfully!');
            onSuccess();
        } catch (error: any) {
            console.error('Error updating tour:', error);
            alert(error.message || 'An error occurred while updating the tour');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-5 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Edit className="w-6 h-6" />
                        Edit Tour Package
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1 transition-all duration-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Same form fields as CreateTourModal */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Destination *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.destination}
                                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                <select
                                    value={formData.currency}
                                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="NPR">NPR</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price</label>
                                <input
                                    type="number"
                                    value={formData.discount_price}
                                    onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration Days *</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.duration_days}
                                    onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration Nights *</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.duration_nights}
                                    onChange={(e) => setFormData({ ...formData, duration_nights: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level *</label>
                                <select
                                    required
                                    value={formData.difficulty_level}
                                    onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Moderate">Moderate</option>
                                    <option value="Challenging">Challenging</option>
                                    <option value="Extreme">Extreme</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tour Type *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.tour_type}
                                    onChange={(e) => setFormData({ ...formData, tour_type: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Min Group Size *</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.min_group_size}
                                    onChange={(e) => setFormData({ ...formData, min_group_size: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Group Size *</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.max_group_size}
                                    onChange={(e) => setFormData({ ...formData, max_group_size: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Available Slots *</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.available_slots}
                                    onChange={(e) => setFormData({ ...formData, available_slots: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Featured Image {featuredImage && <span className="text-green-600 text-xs">(✓ New: {featuredImage.name})</span>}
                            </label>

                            {/* Show current featured image */}
                            {!featuredImage && (tour.featured_image || tour.featured_image_url) && (
                                <div className="mb-3">
                                    <p className="text-xs text-gray-500 mb-2">Current Image:</p>
                                    <div className="relative inline-block">
                                        <img
                                            src={tour.featured_image || tour.featured_image_url}
                                            alt="Featured"
                                            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Show preview of new featured image */}
                            {featuredImage && (
                                <div className="mb-3">
                                    <p className="text-xs text-gray-500 mb-2">New Image Preview:</p>
                                    <div className="relative inline-block">
                                        <img
                                            src={URL.createObjectURL(featuredImage)}
                                            alt="Preview"
                                            className="w-32 h-32 object-cover rounded-lg border-2 border-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFeaturedImage(null)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => document.getElementById('tour-featured-image-input')?.click()}
                                className="w-full px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                            >
                                {featuredImage || tour.featured_image || tour.featured_image_url ? 'Change Featured Image' : 'Choose Featured Image'}
                            </button>
                            <input
                                id="tour-featured-image-input"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFeaturedImage(e.target.files?.[0] || null)}
                                className="hidden"
                            />
                            {featuredImage && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Size: {(featuredImage.size / 1024).toFixed(1)} KB
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gallery Images
                            </label>

                            {/* Existing Images */}
                            {existingGalleryImages.length > 0 && (
                                <div className="mb-3">
                                    <p className="text-xs text-gray-500 mb-2">Current Images:</p>
                                    <div className="grid grid-cols-4 gap-3">
                                        {existingGalleryImages.map((imgUrl, idx) => (
                                            <div key={`existing-${idx}`} className="relative group">
                                                <img
                                                    src={imgUrl}
                                                    alt={`Gallery ${idx + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setExistingGalleryImages(existingGalleryImages.filter((_, i) => i !== idx))}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New Images */}
                            {galleryImages.length > 0 && (
                                <div className="mb-3">
                                    <p className="text-xs text-green-600 mb-2">✓ New Images ({galleryImages.length}):</p>
                                    <div className="grid grid-cols-4 gap-3">
                                        {galleryImages.map((img, idx) => (
                                            <div key={`new-${idx}`} className="relative group">
                                                <img
                                                    src={URL.createObjectURL(img)}
                                                    alt={`New ${idx + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg border-2 border-blue-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== idx))}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1 py-0.5 rounded-b-lg">
                                                    {(img.size / 1024).toFixed(0)} KB
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => document.getElementById('tour-gallery-images-input')?.click()}
                                className="w-full px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Gallery Images
                            </button>
                            <input
                                id="tour-gallery-images-input"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setGalleryImages([...galleryImages, ...Array.from(e.target.files)]);
                                    }
                                }}
                                className="hidden"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                You can select multiple images. Existing images will be kept unless removed.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.is_featured}
                                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Featured</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.is_popular}
                                    onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Popular</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Active</span>
                            </label>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </span>
                                ) : 'Update Tour'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Reviews Tab Component
function ReviewsTab() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/reviews`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            // Handle various response formats
            let reviewsData = [];
            if (Array.isArray(data)) {
                reviewsData = data;
            } else if (data && Array.isArray(data.data)) {
                reviewsData = data.data;
            } else if (data && typeof data === 'object') {
                reviewsData = data.reviews || data.items || [];
            }
            setReviews(reviewsData);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (reviewId: number) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/approve`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Refresh reviews list
                fetchReviews();
            }
        } catch (error) {
            console.error('Error approving review:', error);
        }
    };

    const handleDelete = async (reviewId: number) => {
        if (!confirm('Are you sure you want to delete this review?')) {
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Refresh reviews list
                fetchReviews();
            }
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Manage Reviews</h2>
            </div>

            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">{review.name}</h3>
                                {renderStars(review.rating)}
                            </div>
                            <span className={`px-3 py-1 rounded text-xs font-medium ${review.status === true || review.status === 1
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                {review.status === true || review.status === 1 ? 'Approved' : 'Pending'}
                            </span>
                        </div>
                        <p className="text-gray-700 text-sm mb-4">{review.review || review.comment || 'No review text'}</p>
                        <div className="flex gap-2">
                            {(review.status === false || review.status === 0) && (
                                <button
                                    onClick={() => handleApprove(review.id)}
                                    className="px-4 py-2 bg-white border border-green-500 text-green-500 hover:bg-green-50 rounded-lg transition-colors duration-200 text-sm font-medium shadow-sm"
                                >
                                    Approve
                                </button>
                            )}
                            <button
                                onClick={() => handleDelete(review.id)}
                                className="px-4 py-2 bg-white border border-red-500 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 text-sm font-medium shadow-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
