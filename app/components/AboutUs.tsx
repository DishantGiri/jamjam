'use client';

import { Shield, Users, Mountain, Award } from 'lucide-react';

export default function AboutUs() {
    const features = [
        {
            icon: Shield,
            title: "Licensed & Insured",
            description: "JamJam Trek is a fully licensed and insured trekking company operating in Nepal.",
            link: "#"
        },
        {
            icon: Users,
            title: "Expert Local Guides",
            description: "Our guides are certified professionals with years of mountain experience and local knowledge.",
            link: "#"
        },
        {
            icon: Mountain,
            title: "200+ Adventure Packages",
            description: "Choose from our extensive collection of carefully curated trekking and tour experiences.",
            link: "#"
        },
        {
            icon: Award,
            title: "Guaranteed Departures",
            description: "All scheduled departures are 100% guaranteed with no last-minute cancellations.",
            link: "#"
        }
    ];

    return (
        <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-16">
                    {/* Left Column - Main Content */}
                    <div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a3a52] mb-6 uppercase">
                            JamJam Trek
                        </h2>
                        <div className="text-gray-700 space-y-4">
                            <p className="leading-relaxed text-justify">
                                We are a passionate, experienced, and customer-focused adventure travel company based in
                                the heart of Nepal. Specializing in trekking expeditions, cultural tours, mountain hiking,
                                and authentic city explorations, we bring you closer to the breathtaking beauty of the
                                Himalayan region.
                            </p>
                            <p className="leading-relaxed text-justify">
                                At JamJam Trek, transparency and innovation drive everything we do. We are deeply committed
                                to promoting sustainable tourism that allows you to discover and connect with the majestic
                                Nepalese Himalayas while contributing to local communities, especially in remote areas.
                            </p>
                            <p className="leading-relaxed text-justify">
                                Our mission extends beyond adventure we actively support education and healthcare initiatives
                                for women and children in underserved regions. Every journey with us makes a positive impact.
                                By choosing JamJam Trek, you're not just embarking on an unforgettable adventure; you're
                                helping build a brighter future for Nepal's most vulnerable communities.
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Feature Grid (2 columns, 2 rows) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 lg:pt-16">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="flex flex-col"
                                >
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-[#2C5F7D] rounded-full flex items-center justify-center">
                                            <Icon className="w-6 h-6 text-[#2C5F7D]" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-[#1a3a52] mb-2">
                                                {feature.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <p className="text-sm text-justify text-gray-600 leading-relaxed mb-3">
                                        {feature.description}
                                    </p>
                                    <a
                                        href={feature.link}
                                        className="inline-flex items-center text-sm font-semibold text-[#2C5F7D] hover:text-[#244f68] transition-colors group"
                                    >                                        
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
