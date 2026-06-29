"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (session) {
      fetch("/api/users/me")
        .then((r) => r.json())
        .then((data) => {
          setUserRole(data.user?.role || "user");
          setUserImage(data.user?.image || data.user?.photoURL || null);
        })
        .catch(() => setUserRole("user"));
    }
  }, [session]);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  const getDashboardLink = () => {
    if (userRole === "admin") return "/dashboard/admin/profile";
    if (userRole === "creator") return "/dashboard/creator/profile";
    return "/dashboard/user/profile";
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20 flex items-center justify-center ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm"
          : "bg-[#F9FBF9] border-b border-transparent"
      }`}>
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center select-none">
              <div className="relative w-46 h-25">
                <Image
                  src="/logos/aiverselogo22.png"
                  alt="AIVERSE"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-10">
              <Link href="/" className="text-[#333D35] hover:text-[#15803d] text-[15px] font-medium transition-colors">HOME</Link>
              <Link href="/prompts" className="text-[#333D35] hover:text-[#15803d] text-[15px] font-medium transition-colors">ALL PROMPTS</Link>
              <Link href="/demo-accounts" className="text-[#333D35] hover:text-[#15803d] text-[15px] font-medium transition-colors">DEMO USERS</Link>
              {session && (
                <Link href={getDashboardLink()} className="flex items-center gap-1.5 text-[#333D35] hover:text-[#15803d] text-[15px] font-medium transition-colors">
                  <LayoutDashboard className="w-4 h-4" /> DASHBOARD
                </Link>
              )}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {session ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                    {userImage ? (
                      <img
                        src={userImage}
                        alt={session.user.name}
                        className="w-8 h-8 rounded-full object-cover border border-green-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#15803d] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-[14px] text-gray-700 font-medium">{session.user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{ padding: "4px 12px" }}
                    className="flex items-center gap-1.5 text-sm font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/login" style={{ padding: "6px 18px" }}
                    className="border border-[#15803d]/40 text-[#15803d] rounded-2xl text-[14px] font-black uppercase tracking-widest hover:bg-[#15803d]/5 transition-all flex items-center justify-center">
                    Login
                  </Link>
                  <Link href="/register" style={{ padding: "6px 18px" }}
                    className="bg-[#15803d] text-white rounded-2xl text-[14px] font-black uppercase tracking-widest hover:bg-[#166534] transition-all shadow-sm flex items-center justify-center">
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button className="md:hidden p-2 text-gray-600 hover:text-gray-900" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="absolute top-20 left-0 right-0 bg-white border-b border-gray-100 p-6 space-y-3 shadow-xl md:hidden z-50">
              <Link href="/" className="block text-[#333D35] hover:text-[#15803d] font-medium text-[15px] py-1" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link href="/prompts" className="block text-[#333D35] hover:text-[#15803d] font-medium text-[15px] py-1" onClick={() => setMenuOpen(false)}>All Prompt</Link>
              <Link href="/demo-accounts" className="block text-[#333D35] hover:text-[#15803d] font-medium text-[15px] py-1" onClick={() => setMenuOpen(false)}>Demo Users</Link>
              {session && (
                <Link href={getDashboardLink()} className="block text-[#333D35] hover:text-[#15803d] font-medium text-[15px] py-1" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              )}
              <div className="h-[1px] bg-gray-100 my-2" />
              {session ? (
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-medium text-[15px] py-1 w-full text-left">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link href="/login" className="border border-[#15803d]/40 text-[#15803d] text-center py-3 rounded-xl text-[14px] font-semibold" onClick={() => setMenuOpen(false)}>Login</Link>
                  <Link href="/register" className="bg-[#15803d] text-white text-center py-3 rounded-xl text-[14px] font-semibold" onClick={() => setMenuOpen(false)}>Register</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
      <div className="h-20" />
    </>
  );
}