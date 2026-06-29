"use client";
import { useEffect } from "react";
import { Sparkles } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Sparkles className="w-16 h-16 text-red-300" />
        </div>
        <h1 className="text-4xl font-black text-red-600 mb-4">
          Something went wrong!
        </h1>
        <p className="text-gray-500 mb-8">{error?.message || "An unexpected error occurred."}</p>
        <button
          onClick={reset}
          className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}