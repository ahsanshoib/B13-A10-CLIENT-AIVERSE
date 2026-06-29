"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  Sparkles, User, Users, FileText,
  CreditCard, Shield, BarChart2, LogOut
} from "lucide-react";

const navItems = [
  { href: "/dashboard/admin/profile", label: "My Profile", icon: User },
  { href: "/dashboard/admin", label: "Admin Analytics", icon: BarChart2 },
  { href: "/dashboard/admin/users", label: "All Users", icon: Users },
  { href: "/dashboard/admin/prompts", label: "All Prompts", icon: FileText },
  { href: "/dashboard/admin/payments", label: "All Payments", icon: CreditCard },
  { href: "/dashboard/admin/reported", label: "Reported Prompts", icon: Shield },
];

export default function AdminSidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-green-100 min-h-screen flex flex-col">
  
      <div className="p-5 border-b border-green-100 mb-[30px]">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-green-600" />
          <span className="font-black text-green-700 text-lg">AIVERSE</span>
        </Link>
      </div>

      
      <div className="px-4 mb-[30px]">
        <div className="flex items-center gap-3 bg-green-50 rounded-xl p-3">
          <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{user?.name}</p>
            <p className="text-xs text-gray-500 uppercase">ADMIN</p>
          </div>
        </div>
      </div>

      
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
              <Icon className="w-3 h-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      
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