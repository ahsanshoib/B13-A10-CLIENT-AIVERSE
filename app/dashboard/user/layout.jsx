"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import UserSidebar from "@/components/dashboard/UserSidebar";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function UserDashboardLayout({ children }) {
  const { data: session, isPending } = authClient.useSession();
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
    if (session) {
      fetch("/api/users/me")
        .then((r) => r.json())
        .then((data) => setUserData(data.user));
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
    <div className="flex min-h-screen dashboard-bg">
      <UserSidebar user={userData || session?.user} />
      <main className="flex-1 p-8 relative overflow-auto">{children}</main>
    </div>
  );
}