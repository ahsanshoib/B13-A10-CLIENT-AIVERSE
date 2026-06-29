"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  Sparkles, User, FileText, PlusCircle,
  LayoutDashboard, LogOut, Gem
} from "lucide-react";

const navItems = [
  { href: "/dashboard/creator/profile", label: "My Profile", icon: User },
  { href: "/dashboard/creator", label: "Creator Home", icon: LayoutDashboard },
  { href: "/dashboard/creator/add-prompt", label: "Add Prompt", icon: PlusCircle },
  { href: "/dashboard/creator/my-prompts", label: "My Prompts", icon: FileText },
];

export default function CreatorSidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-green-100 min-h-screen flex flex-col">
      {/* 1. Logo area with increased bottom margin */}
      <div className="p-5 border-b border-green-100 flex items-center justify-between mb-[30px]">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-green-600" />
          <span className="font-black text-green-700 text-lg">AIVERSE</span>
        </Link>
        {user?.isPremium && (
          <span className="text-xs font-bold text-green-600 bg-green-100 border border-green-300 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Gem className="w-3 h-3" /> PRO
          </span>
        )}
      </div>

      {/* 2. User profile area with increased bottom margin */}
      <div className="px-4 mb-[30px]">
        <div className="flex items-center gap-3 bg-green-50 rounded-xl p-3">
          <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{user?.name}</p>
            <p className="text-xs text-gray-500 uppercase">CREATOR</p>
          </div>
        </div>
      </div>

      {/* 3. Navigation with increased vertical spacing (gap-2 instead of space-y-1) */}
      <nav className="flex-1 px-3 flex flex-col gap-[8px]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-green-100 text-green-700"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-600"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* 4. Logout area with increased bottom padding */}
      <div className="p-4 border-t border-green-100 pb-[30px]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}