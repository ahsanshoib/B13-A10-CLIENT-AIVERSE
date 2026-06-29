
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Banner from "@/components/home/Banner";
import FeaturedPrompts from "@/components/home/FeaturedPrompts";
import AIEngines from "@/components/home/AIEngines";
import TopCreators from "@/components/home/TopCreators";
import PlatformStats from "@/components/home/PlatformStats";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CustomerReviews from "@/components/home/CustomerReviews";

const sections = [
  FeaturedPrompts,
  AIEngines,
  TopCreators,
  PlatformStats,
  WhyChooseUs,
  CustomerReviews,
];

export default function HomePage() {
  return (
    <main className="w-full flex flex-col items-center">
      <Navbar />
      
      <div className="w-full">
        <Banner />
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 flex flex-col gap-16 md:gap-24 py-16">
        {sections.map((Section, index) => (
          <div key={index} className="w-full flex justify-center">
             <Section />
          </div>
        ))}
      </div>
<div className="w-full max-w-7xl mx-auto pt-16 md:pt-24">
      <Footer />
      </div>
    </main>
  );
}