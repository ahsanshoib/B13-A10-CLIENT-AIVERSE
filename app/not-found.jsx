"use client";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Sparkles className="w-16 h-16 text-green-300" />
        </div>
        <h1 className="text-8xl font-black text-green-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="bg-green-600 text-white px-20 py-4 rounded-xl font-bold hover:bg-green-700 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}