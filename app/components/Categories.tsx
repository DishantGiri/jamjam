'use client';

import { Footprints, Mountain, Compass, Flag } from 'lucide-react';
import Link from 'next/link';

export default function Categories() {
    const categories = [
        {
            icon: Footprints,
            title: 'Tours in Nepal',
            count: '12 Tours',
            color: 'text-sky-500',
            bgColor: 'bg-sky-50',
            href: '/tours'
        },
        {
            icon: Mountain,
            title: 'Trekking in Nepal',
            count: '25 Treks',
            color: 'text-[#2C5F7D]',
            bgColor: 'bg-[#2C5F7D]/10',
            href: '/treks'
        },
        {
            icon: Compass,
            title: 'Peak Climbing',
            count: '8 Peaks',
            color: 'text-purple-500',
            bgColor: 'bg-purple-50',
            href: '/peak-climbing'
        },
        {
            icon: Flag,
            title: 'Expeditions',
            count: '5 Expeditions',
            color: 'text-green-500',
            bgColor: 'bg-green-50',
            href: '/expeditions'
        }
    ];

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Adventure Categories</h2>
                    <p className="text-gray-500 text-sm">Find your perfect adventure</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {categories.map((category, index) => {
                        const Icon = category.icon;
                        return (
                            <Link
                                key={index}
                                href={category.href}
                                className="group flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 text-center"
                            >
                                <div className={`p-3 rounded-full ${category.bgColor} ${category.color} mb-3 group-hover:scale-105 transition-transform`}>
                                    <Icon size={24} />
                                </div>
                                <h3 className="font-semibold text-base text-gray-900 mb-0.5">{category.title}</h3>
                                <p className="text-xs text-gray-500">{category.count}</p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}