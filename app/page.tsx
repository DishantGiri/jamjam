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
      <main className="pt-16 bg-white">
        <HeroSection />
        <StatsSection />
        <FeaturedTreks />
        <FeaturedTours />
        <BlogSection />
        <AboutUs />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
