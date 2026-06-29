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
  }, [session]);

  return (
    <main>
      <Navbar />
      <Banner />
      <FeaturedPrompts />
      <AIEngines />
      <TopCreators />
      <PlatformStats />
      <WhyChooseUs />
      <CustomerReviews />
      <Footer />
    </main>
  );
}