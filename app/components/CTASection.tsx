import Link from 'next/link';

export default function CTASection() {
    return (
        <section className="bg-cyan-400 py-20">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Ready for Your Adventure?
                </h2>
                <p className="text-xl text-white/90 mb-8">
                    Join thousands of travelers who have discovered the magic of the Himalayas with us
                </p>
                <Link 
                    href="/treks"
                    className="inline-block bg-white hover:bg-gray-100 hover:scale-105 text-cyan-600 px-8 py-4 rounded-lg text-lg font-bold transition-all duration-200 shadow-lg hover:shadow-2xl"
                >
                    Start Planning Your Trek
                </Link>
            </div>
        </section>
    );
}
