"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import SparkleDecor from "@/components/shared/SparkleDecor";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import toast from "react-hot-toast";
import { Trash2, Eye, Star, Gear } from "lucide-react";

export default function SavedPromptsPage() {
  const { data: session } = authClient.useSession();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (session) fetchSaved();
  }, [session]);

  const fetchSaved = async () => {
    const res = await fetch("/api/bookmarks");
    const data = await res.json();
    setPrompts(data.prompts || []);
    setLoading(false);
  };

  const handleRemove = async (promptId) => {
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptId }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Bookmark removed");
      fetchSaved();
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="relative">
      <SparkleDecor />
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900">
          Saved Prompt Templates
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Browse your bookmarked templates
        </p>
      </div>

      {prompts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-green-100 p-16 text-center">
          <p className="font-bold text-gray-700">No saved prompts yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Bookmark prompts to see them here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {prompts.map((prompt) => (
            <div
              key={prompt._id}
              className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm relative overflow-hidden"
            >
              {/* Decorative icon */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10">
                <Star className="w-16 h-16 text-green-600" />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex gap-2 mb-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      {prompt.aiTool}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      {prompt.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    {prompt.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{prompt.description}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                <button
  onClick={() => router.push(`/prompts/${prompt._id}`)}
  style={{ padding: "3px 15px" }}
  className="bg-green-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-green-700 transition-all flex items-center justify-center"
>
  View Details
</button>
                  <button
                    onClick={() => handleRemove(prompt._id)}
                    className="p-2 border border-red-100 rounded-xl hover:border-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}