import Layout from "@/components/Layout";
import HeroSection from "@/components/landing/HeroSection";
import DiscoverSection from "@/components/landing/DiscoverSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ContactSection from "@/components/landing/ContactSection";
import FooterSection from "@/components/landing/FooterSection";

export default function HomePage() {
  return (
    <Layout>
      <HeroSection />
      <div className="w-full bg-white px-4 py-16 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-12">
          <DiscoverSection />
          <FeaturesSection />
          <ContactSection />
        </div>
      </div>
      <FooterSection />
    </Layout>
  );
}
