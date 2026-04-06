import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import FeaturedTreks from './components/FeaturedTreks';
import FeaturedTours from './components/FeaturedTours';
import AboutUs from './components/AboutUs';
import Testimonials from './components/Testimonials';
import BlogSection from './components/BlogSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-20 bg-neutral-50 overflow-hidden font-sans">
        <HeroSection />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
          <StatsSection />
          <FeaturedTreks />
          <FeaturedTours />
          <AboutUs />
        </div>
        <div className="bg-[#f0f9f6] py-20 text-gray-900 w-full">
          <Testimonials />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <BlogSection />
        </div>
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
