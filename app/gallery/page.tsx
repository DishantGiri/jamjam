import Image from 'next/image';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://jamjamtreks.com';

export interface GalleryImage {
    id: number;
    image: string;
    image_url: string;
    caption: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

async function getGalleryImages(): Promise<GalleryImage[]> {
    try {
        const baseUrl = API_BASE_URL?.endsWith('/api') ? API_BASE_URL.replace(/\/api$/, '') : API_BASE_URL;
        const res = await fetch(`${baseUrl}/api/gallery`, {
            next: { revalidate: 60 }, // Revalidate every 60 seconds
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!res.ok) {
            console.error('Failed to fetch gallery:', res.status, res.statusText);
            try {
                const errorData = await res.text();
                console.error('Error details:', errorData);
            } catch (e) {
                // Ignore
            }
            return [];
        }

        const data = await res.json();
        if (data.status && data.data) {
            return data.data;
        }
        return [];
    } catch (error) {
        console.error('Error fetching gallery:', error);
        return [];
    }
}

export default async function GalleryPage() {
    const images = await getGalleryImages();

    return (
        <main className="min-h-screen pt-28 pb-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#2C5F7D] mb-4">Our Gallery</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Explore the breathtaking landscapes and unforgettable moments captured during our treks and tours.
                    </p>
                </div>

                {images.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                        <p className="text-gray-500 text-lg">No gallery images available at the moment.</p>
                    </div>
                ) : (
                    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                        {images.map((img) => (
                            <div key={img.id} className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="relative w-full">
                                    <img
                                        src={img.image_url}
                                        alt={img.caption || 'JamJam Treks Gallery Image'}
                                        className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    {img.caption && (
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                            <p className="text-white text-sm font-medium leading-snug">
                                                {img.caption}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
