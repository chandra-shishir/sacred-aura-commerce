import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import BestSellers from "@/components/BestSellers";
import ProductGrid from "@/components/ProductGrid";
import PremiumSection from "@/components/PremiumSection";
import StorySection from "@/components/StorySection";
import CoursesPreview from "@/components/CoursesPreview";
import TestimonialSection from "@/components/TestimonialSection";
import BlogPreview from "@/components/BlogPreview";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Sacred Aura — Premium Crystals, Healing Tools & Spiritual Courses"
        description="Shop curated healing crystals, chakra bracelets, rudraksha malas, feng shui items, and certified Reiki courses. Ethically sourced, luxury quality. Free shipping worldwide."
        canonical="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Sacred Aura",
          url: "https://sacredaura.com",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://sacredaura.com/shop?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <Navbar />
      <CartDrawer />
      <HeroSection />
      <CategoryGrid />
      <BestSellers />
      <ProductGrid />
      <PremiumSection />
      <StorySection />
      <CoursesPreview />
      <TestimonialSection />
      <BlogPreview />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;
