"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    photoURL: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleRegister = async (e) => {
  e.preventDefault();
  if (form.password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return;
  }
  setLoading(true);
  try {
    
    const { error } = await authClient.signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
      photoURL: form.photoURL,
    });

    if (error) {
      toast.error(error.message || "Registration failed");
      setLoading(false);
      return;
    }

  
    if (form.role === "creator") {
      await new Promise((res) => setTimeout(res, 1000));
      await fetch("/api/users/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "creator" }),
      });
    }

    toast.success("Account created successfully!");
    await new Promise((res) => setTimeout(res, 500));

    if (form.role === "creator") {
      router.push("/dashboard/creator/profile");
    } else {
      router.push("/dashboard/user/profile");
    }
    router.refresh();
  } catch {
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <div className="relative w-40 h-11">
              <Image
                src="/logos/aiverselogo22.png"
                alt="AIVERSE"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

{/* Back Button */}
<button
  onClick={() => router.push("/")}
  className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors text-sm font-medium mb-6"
>
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
  Back to Home
</button>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join the AI prompt community</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-8">

          {/* Role Selector */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">I want to join as :</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "user" })}
                className={`py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all ${
                  form.role === "user"
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-gray-200 text-gray-500 hover:border-green-300"
                }`}
              >
                👤 Standard User
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "creator" })}
                className={`py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all ${
                  form.role === "creator"
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-gray-200 text-gray-500 hover:border-green-300"
                }`}
              >
                ✨ Creator
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {form.role === "creator"
                ? "Creators can publish and monetize AI prompts."
                : "Users can browse, bookmark and review prompts."}
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Photo URL <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="url"
                name="photoURL"
                value={form.photoURL}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 text-gray-700 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : `Create ${form.role === "creator" ? "Creator" : "User"} Account`}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-green-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
