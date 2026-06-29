"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
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
    
    <div className="w-full flex justify-center bg-gray-50 min-h-screen">
      
      <div className="w-full max-w-7xl px-6 py-8">
        {children}
      </div>
    </div>
  );
}