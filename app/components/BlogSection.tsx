'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ImageIcon, Calendar, User, Clock } from 'lucide-react';
import { getBlogs, type Blog } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function BlogSection() {
    const [posts, setPosts] = useState<Blog[]>([]);
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
                    // If data is an object, try to get the array from common property names
                    blogData = response.data.blogs || response.data.items || [];
                }

                // Limit to 3 posts for the homepage
                setPosts(blogData.slice(0, 3));
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Travel Blog</h2>
                        <p className="text-gray-600">Tips, guides, and stories from the trails</p>
                    </div>
                    <Link
                        href="/blog"
                        className="hidden md:inline-block border border-gray-200 hover:border-[#2C5F7D] hover:text-[#2C5F7D] text-gray-600 px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                    >
                        View All Articles
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C5F7D]"></div>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No blog posts available at the moment.
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.slug || post.id}`}
                                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full border border-gray-100"
                                >
                                    <div className="relative h-48 w-full bg-gray-200">
                                        {post.image_url ? (
                                            <Image
                                                src={post.image_url}
                                                alt={post.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
                                                <ImageIcon className="w-12 h-12" strokeWidth={1.5} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                            <span className="flex items-center gap-1">
                                                <User className="w-3.5 h-3.5" />
                                                {post.author || 'Admin'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(post.created_at).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#2C5F7D] transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>

                                        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                                            {post.description || post.excerpt || "Read more about this amazing adventure..."}
                                        </p>

                                        <div className="mt-auto text-sm font-semibold text-[#2C5F7D] flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Read More <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="text-center mt-8 md:hidden">
                            <Link
                                href="/blog"
                                className="inline-block border border-gray-200 hover:border-[#2C5F7D] hover:text-[#2C5F7D] text-gray-600 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200"
                            >
                                View All Articles
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}