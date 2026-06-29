"use client";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export function useUser() {
  const { data: session } = authClient.useSession();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetch("/api/users/me")
        .then((r) => r.json())
        .then((data) => {
          setUserData(data.user);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [session]);

  return { user: userData, session, loading };
}