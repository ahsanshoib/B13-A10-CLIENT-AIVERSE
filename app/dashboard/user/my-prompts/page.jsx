"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import SparkleDecor from "@/components/shared/SparkleDecor";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import toast from "react-hot-toast";
import { Pencil, Trash2, Eye, AlertCircle } from "lucide-react";

export default function UserMyPromptsPage() {
  const { data: session } = authClient.useSession();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPrompt, setEditPrompt] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (session) fetchPrompts();
  }, [session]);

  const fetchPrompts = async () => {
    const res = await fetch("/api/prompts?limit=100");
    const data = await res.json();
    const mine = (data.prompts || []).filter(
      (p) => p.creatorId === session.user.id
    );
    setPrompts(mine);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this prompt?")) return;
    const res = await fetch(`/api/prompts/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      toast.success("Prompt deleted");
      fetchPrompts();
    } else {
      toast.error(data.error || "Failed to delete");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/prompts/${editPrompt._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editPrompt),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Prompt updated!");
      setEditPrompt(null);
      fetchPrompts();
    } else {
      toast.error(data.error || "Failed to update");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="relative">
      <SparkleDecor />
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900">
          My Prompt Templates
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Review approval statuses, change details, and check analytics.
        </p>
      </div>

      {prompts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-green-100 p-16 text-center">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-bold text-gray-700 text-lg">No Prompts Found</p>
          <p className="text-gray-400 text-sm mt-1">
            You have not published any prompts yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {prompts.map((prompt) => (
            <div
              key={prompt._id}
              className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-900">{prompt.title}</h3>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        prompt.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : prompt.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {prompt.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {prompt.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {prompt.description}
                  </p>
                  {prompt.rejectionFeedback && (
                    <p className="text-red-500 text-xs mt-2">
                      Rejection reason: {prompt.rejectionFeedback}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-400 font-medium">
                    Category: {prompt.category}
                  </span>
                  <button
                    onClick={() => setEditPrompt({ ...prompt })}
                    className="p-2 border border-gray-200 rounded-xl hover:border-green-400 transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => router.push(`/prompts/${prompt._id}`)}
                    className="p-2 border border-gray-200 rounded-xl hover:border-green-400 transition-colors"
                  >
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(prompt._id)}
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

      {/* Edit Modal */}
      {editPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black text-gray-900 mb-4">
              Edit Prompt
            </h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editPrompt.title}
                  onChange={(e) =>
                    setEditPrompt({ ...editPrompt, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editPrompt.description}
                  onChange={(e) =>
                    setEditPrompt({
                      ...editPrompt,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Visibility
                </label>
                <select
                  value={editPrompt.visibility}
                  onChange={(e) =>
                    setEditPrompt({
                      ...editPrompt,
                      visibility: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-sm"
                >
                  <option value="public">Public</option>
                  <option value="private">Private (Premium)</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditPrompt(null)}
                  className="flex-1 border border-gray-200 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}