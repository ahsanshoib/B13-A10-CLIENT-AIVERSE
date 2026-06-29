"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import CreatorSidebar from "@/components/dashboard/CreatorSidebar";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function CreatorDashboardLayout({ children }) {
  const { data: session, isPending } = authClient.useSession();
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
      return;
    }
    if (session) {
      const role = session.user.role;
      if (role !== "creator" && role !== "admin") {
        router.push("/dashboard/user");
        return;
      }
      fetch("/api/users/me")
        .then((r) => r.json())
        .then((data) => setUserData(data.user))
        .catch(() => {});
    }
  }, [session, isPending]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session) return null;

  return (
    
    <div className="flex min-h-screen dashboard-bg justify-center">
      <div className="w-full max-w-7xl flex">

        <CreatorSidebar user={userData || session?.user} />
        
  
        <main className="flex-1 p-8 md:p-12 relative overflow-auto">
          
          <div className="flex flex-col gap-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}