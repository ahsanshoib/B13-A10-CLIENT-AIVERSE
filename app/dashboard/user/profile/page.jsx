"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import SparkleDecor from "@/components/shared/SparkleDecor";
import { FileText, Settings, Gem, Crown, Pencil } from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function UserProfilePage() {
  const { data: session } = authClient.useSession();
  const [userData, setUserData] = useState(null);
  const [promptCount, setPromptCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (session) {
      Promise.all([
        fetch("/api/users/me").then((r) => r.json()),
        fetch("/api/prompts?limit=100").then((r) => r.json()),
      ]).then(([userData, promptData]) => {
        setUserData(userData.user);
        const myPrompts = (promptData.prompts || []).filter(
          (p) => p.creatorId === session.user.id
        );
        setPromptCount(myPrompts.length);
        setLoading(false);
      });
    }
  }, [session]);

  if (loading) return <LoadingSpinner />;

  const user = userData || session?.user;

  return (
    <div className="relative">
      <SparkleDecor />
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-green-500">USER ACCOUNT PROFILE</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your plan, credentials, and published prompt details.</p>
        </div>
        <button
          onClick={() => router.push("/dashboard/user/update-profile")}
          className="flex items-center gap-2 border border-green-300 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-50 transition-colors"
        >
          <Pencil className="w-4 h-4" /> Edit Profile
        </button>
      </div>

    
      <div className="bg-white border-2 border-green-100 rounded-3xl p-2 shadow-sm">
        
  
        <div className="bg-white rounded-2xl border border-green-100 p-6">
          
          {/* User Info */}
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100 mb-6">
            <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center text-white font-black text-2xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">{user?.name}</h2>
              <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                <span>✉️</span>
                <span>{user?.email}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <span 
                  style={{ padding: "4px 16px" }}
                  className="text-xs border border-green-400 text-green-700 rounded-full font-black uppercase tracking-widest flex items-center justify-center"
                >
                  ROLE : {user?.role || "User"}
                </span>
                <span 
                  style={{ padding: "4px 16px" }}
                  className="text-xs border border-gray-300 text-gray-600 rounded-full font-black uppercase tracking-widest flex items-center justify-center"
                >
                  PLAN : {user?.isPremium ? "PREMIUM" : "FREE"}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border border-gray-100 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-gray-400 font-semibold tracking-wider mb-1">
                  Prompt Published
                </p>
                <p className="text-4xl font-black text-gray-900">{promptCount}</p>
              </div>
              <FileText className="w-12 h-12 text-green-100" />
            </div>
            <div className="border border-gray-100 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-gray-400 font-semibold tracking-wider mb-1">
                  Account Status
                </p>
                <p className="text-xl font-black text-green-600">
                  Verified Member
                </p>
              </div>
              <Settings className="w-12 h-12 text-green-100" />
            </div>
          </div>

          {/* Upgrade Banner (Double Layered Wrapper) */}
          {!user?.isPremium && (
            <div className="bg-white border-2 border-green-100 rounded-3xl p-2">
              <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Gem className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-gray-900">Upgrade to Pro Lifetime</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Unlock access to all private prompt templates, parameter sets,
                      and community reviews for a single one time contribution of $5.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Gem className="w-8 h-8 text-green-600" />
                  <Crown className="w-8 h-8 text-green-600" />
                  <button
                    onClick={() => router.push("/payment")}
                    style={{ padding: "4px 14px" }}
                    className="bg-green-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-green-800 transition-all whitespace-nowrap flex items-center justify-center"
                  >
                    Upgrade Now ($5)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Premium Status */}
          {user?.isPremium && (
            <div className="bg-white border-2 border-green-100 rounded-3xl p-2">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-3">
                <Gem className="w-6 h-6 text-green-600" />
                <p className="font-bold text-green-700">
                  You are a Premium Member! Enjoy all features.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}