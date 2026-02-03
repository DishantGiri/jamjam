'use client';

import { useState, useEffect, use } from 'react';
import { getBlog, type Blog } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Calendar, User, ArrowLeft, ImageIcon } from 'lucide-react';

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await getBlog(resolvedParams.slug);
                // Handle API response structure
                const blogData = response.data || response;
                setBlog(blogData);
            } catch (error) {
                console.error('Error fetching blog:', error);
                setBlog(null);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [resolvedParams.slug]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {loading ? (
                <div className="text-center py-40 mt-20">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
                </div>
            ) : !blog ? (
                <div className="text-center py-40 mt-20">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
                    <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
                    <Link href="/blog" className="text-cyan-600 hover:text-cyan-700 font-medium">
                        ← Back to Blog
                    </Link>
                </div>
            ) : (
                <>
                    {/* Header */}
                    <div className="bg-white border-b mt-20">
                        <div className="max-w-4xl mx-auto px-6 py-6">
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium mb-6 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Blog
                            </Link>

                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {blog.title}
                            </h1>

                            {blog.subtitle && (
                                <p className="text-lg text-gray-600 mb-6">
                                    {blog.subtitle}
                                </p>
                            )}

                            {/* Meta Info */}
                            <div className="flex items-center gap-6 text-sm text-gray-600">
                                {blog.author && (
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span>{blog.author}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(blog.created_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    {blog.image_url && (
                        <div className="max-w-4xl mx-auto px-6 py-8">
                            <div className="relative h-96">
                                <Image
                                    src={blog.image_url}
                                    alt={blog.title}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <article className="max-w-4xl mx-auto px-6 py-12">
                        {/* Excerpt/Introduction */}
                        {blog.excerpt && (
                            <div className="bg-cyan-50 border-l-4 border-cyan-400 p-6 mb-8 rounded-r-lg">
                                <p className="text-gray-700 italic leading-relaxed">
                                    {blog.excerpt}
                                </p>
                            </div>
                        )}

                        {/* Description */}
                        {blog.description && (
                            <div className="mb-8">
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    {blog.description}
                                </p>
                            </div>
                        )}

                        {/* Content Sections */}
                        {blog.content && blog.content.length > 0 && (
                            <div className="space-y-8">
                                {blog.content
                                    .filter(section => section.heading?.toLowerCase() !== 'conclusion')
                                    .map((section, index) => (
                                        <div key={index} className="space-y-4">
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                {section.heading}
                                            </h2>
                                            <p className="text-gray-700 leading-relaxed text-lg">
                                                {section.paragraph}
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        )}

                        {/* Conclusion */}
                        {blog.conclusion && (
                            <div className="mt-12 pt-8 border-t border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Conclusion</h2>
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    {blog.conclusion}
                                </p>
                            </div>
                        )}

                        {/* Read More Articles Button */}
                        <div className="mt-12 text-center">
                            <Link
                                href="/blog"
                                className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                            >
                                Read More Articles
                            </Link>
                        </div>
                    </article>
                </>
            )}

            <Footer />
        </div>
    );
}
