import Navbar from './Navbar';
import Hero from './Hero';
import TrustedBy from './TrustedBy';
import Features from './Features';
import DashboardPreview from './DashboardPreview';
import HowItWorks from './HowItWorks';
import Security from './Security';
import Testimonials from './Testimonials';
import Pricing from './Pricing';
import FAQ from './FAQ';
import CTA from './CTA';
import Footer from './Footer';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar onGetStarted={onGetStarted} />
      <Hero onGetStarted={onGetStarted} />
      <TrustedBy />
      <Features />
      <DashboardPreview />
      <HowItWorks />
      <Security />
      <Testimonials />
      <Pricing onGetStarted={onGetStarted} />
      <FAQ />
      <CTA onGetStarted={onGetStarted} />
      <Footer />
    </div>
  );
}
