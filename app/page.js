"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
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
  const { data: session } = authClient.useSession();
  const router = useRouter();


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromGoogle = params.get("fromGoogle");

    if (fromGoogle && session) {
      fetch("/api/users/me")
        .then(r => r.json())
        .then(data => {
          const role = data.user?.role;
          if (role === "admin") router.replace("/dashboard/admin/profile");
          else if (role === "creator") router.replace("/dashboard/creator/profile");
          else router.replace("/dashboard/user/profile");
        });
    }
  }, [session, router]);

  return (
    <main className="w-full flex flex-col items-center">
      <Navbar />
      
      {/* Banner Section */}
      <div className="w-full">
        <Banner />
      </div>

      {/* Dynamic Sections Mapping */}
      <div className="w-full max-w-7xl mx-auto px-6 flex flex-col gap-16 md:gap-24 py-16">
        {sections.map((Section, index) => (
          <div key={index} className="w-full flex justify-center">
             <Section />
          </div>
        ))}
      </div>

      {/* Footer Section */}
      <div className="w-full max-w-7xl mx-auto pt-16 md:pt-24 px-6">
        <Footer />
      </div>
    </main>
  );
}