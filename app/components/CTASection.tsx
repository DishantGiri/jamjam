import Link from 'next/link';

export default function CTASection() {
    return (
        <section className="bg-[#2C5F7D] py-12 mb-8">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    Ready for Your Adventure?
                </h2>
                <p className="text-lg text-white/90 mb-6">
                    Join thousands of travelers who have discovered the magic of the Himalayas with us
                </p>
                <Link
                    href="/treks"
                    className="inline-block bg-white hover:bg-gray-100 hover:scale-105 text-[#2C5F7D] px-6 py-3 rounded-lg text-base font-bold transition-all duration-200 shadow-lg hover:shadow-2xl"
                >
                    Start Planning Your Trek
                </Link>
            </div>
        </section>
    );
}
