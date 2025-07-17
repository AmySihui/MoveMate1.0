import Layout from "@/components/Layout";
import DiscoverSection from "@/components/Landing/DiscoverSection";
import FeaturesSection from "@/components/Landing/FeaturesSection";
import FooterSection from "@/components/Landing/FooterSection";
import HeroSection from "@/components/Landing/HeroSection";
import ContactSection from "@/components/Landing/ContactSection";

export default function HomePage() {
  return (
    <Layout>
      <div className="scrollbar-hide flex flex-col overflow-y-auto bg-white">
        <HeroSection />
        <DiscoverSection />
        <FeaturesSection />
        <ContactSection />
        <FooterSection />
      </div>
    </Layout>
  );
}
