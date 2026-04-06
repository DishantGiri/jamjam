import Image from 'next/image';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://jamjamtreks.com';

export interface LegalDocument {
    id: number;
    image: string;
    image_url: string;
    title: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

async function getLegalDocuments(): Promise<LegalDocument[]> {
    try {
        const baseUrl = API_BASE_URL?.endsWith('/api') ? API_BASE_URL.replace(/\/api$/, '') : API_BASE_URL;
        const res = await fetch(`${baseUrl}/api/legal-documents`, {
            next: { revalidate: 60 }, // Revalidate every 60 seconds
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!res.ok) {
            console.error('Failed to fetch legal docs:', res.status, res.statusText);
            return [];
        }

        const data = await res.json();
        if (data.status && data.data) {
            return data.data;
        }
        return [];
    } catch (error) {
        console.error('Error fetching legal documents:', error);
        return [];
    }
}

export default async function LegalPage() {
    const documents = await getLegalDocuments();

    return (
        <main className="min-h-screen pt-28 pb-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#1B3B36] mb-4">Legal Documents & Certifications</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        View our official company registrations, licenses, and operating certificates for JamJam Treks.
                    </p>
                </div>

                {documents.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                        <p className="text-gray-500 text-lg">No legal documents available at the moment.</p>
                    </div>
                ) : (
                    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                        {documents.map((doc) => (
                            <div key={doc.id} className="break-inside-avoid bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
                                <div className="relative w-full">
                                    <img
                                        src={doc.image_url}
                                        alt={doc.title || 'Legal Document'}
                                        className="w-full h-auto object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                {doc.title && (
                                    <div className="p-4 bg-white border-t border-gray-100">
                                        <h3 className="text-gray-800 font-medium text-center">
                                            {doc.title}
                                        </h3>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
