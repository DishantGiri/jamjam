'use client';

import { useState, useEffect } from 'react';
import { getBlogs, type Blog } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Calendar, User, ImageIcon, ArrowRight } from 'lucide-react';

export default function BlogPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await getBlogs();
                // Handle multiple response formats
                let blogData = [];
                if (Array.isArray(response)) {
                    blogData = response;
                } else if (response && Array.isArray(response.data)) {
                    blogData = response.data;
                } else if (response && response.data && typeof response.data === 'object') {
                    blogData = response.data.blogs || response.data.items || [];
                }

                setBlogs(blogData);
                console.log('Loaded blogs:', blogData.map((b: any) => ({ id: b.id, title: b.title, slug: b.slug })));
            } catch (error) {
                console.error('Error fetching blogs:', error);
                setBlogs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Header Section */}
            <section className="bg-[#2C5F7D] text-white py-12 mt-16 md:mt-20">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Travel Blog</h1>
                    <p className="text-white/80 text-sm md:text-base max-w-2xl">
                        Tips, guides, and stories from the Himalayan trails
                    </p>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-6">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C5F7D]"></div>
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-xl text-gray-600">No blog posts available at the moment.</p>
                            <p className="text-gray-500 mt-2">Check back soon for stories and guides!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((blog) => (
                                <Link
                                    key={blog.id}
                                    href={`/blog/${blog.slug}`}
                                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer block group border border-gray-100 flex flex-col h-full"
                                >
                                    {/* Image */}
                                    <div className="relative h-56 bg-gray-200">
                                        {blog.image_url ? (
                                            <Image
                                                src={blog.image_url}
                                                alt={blog.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                <ImageIcon className="w-12 h-12" strokeWidth={1.5} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        {/* Meta Info */}
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                            <div className="flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5" />
                                                <span>{blog.author || 'Admin'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{formatDate(blog.created_at)}</span>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#2C5F7D] transition-colors">
                                            {blog.title}
                                        </h3>

                                        {/* Excerpt/Description */}
                                        <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed flex-grow">
                                            {blog.excerpt || blog.description || "Read more about this adventures in the Himalayas..."}
                                        </p>

                                        {/* Read More Link */}
                                        <div className="mt-auto text-sm font-semibold text-[#2C5F7D] flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Read More <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    );
}
