
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Sparkles, User, FileText, Bookmark, Star, LayoutGrid, LogOut, Gem } from "lucide-react";

const navItems = [
  { href: "/dashboard/user/profile", label: "My Profile", icon: User },
  { href: "/dashboard/user/my-prompts", label: "My Prompt", icon: FileText },
  { href: "/dashboard/user/my-reviews", label: "My Reviews", icon: Star },
  { href: "/prompts", label: "All Prompt", icon: LayoutGrid },
  { href: "/dashboard/user/saved-prompts", label: "Saved Prompt", icon: Bookmark },
];

export default function UserSidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="w-[280px] shrink-0 bg-white border-r border-green-100 min-h-screen flex flex-col">
      
      <div className="px-5 py-4 border-b border-green-50 mb-[30px]">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-green-600" />
          <span className="font-black text-green-700 text-lg tracking-wide">AIVERSE</span>
        </Link>
      </div>

      
      <div className="px-4 mb-[30px]">
        <div className="flex items-center gap-3 bg-green-50 rounded-xl px-3 py-2.5 relative">
          {user?.isPremium && (
            <span className="absolute top-2 right-2 text-[10px] font-bold text-green-700 bg-green-100 border border-green-300 px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <Gem className="w-2.5 h-2.5" /> PRO
            </span>
          )}
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{user?.name || "User"}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide">{user?.role || "USER"}</p>
          </div>
        </div>
      </div>

      {/* 3. Navigation with increased vertical spacing (gap-[8px] instead of space-y-0.5) */}
      <nav className="flex-1 px-3 flex flex-col gap-[8px]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active 
                  ? "bg-green-100 text-green-700 font-semibold" 
                  : "text-gray-500 hover:bg-green-50 hover:text-green-600"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* 4. Logout area with increased bottom padding */}
      <div className="px-4 py-4 border-t border-green-50 pb-[30px]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}