"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserDashboardPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/user/profile");
  }, []);
  return null;
}