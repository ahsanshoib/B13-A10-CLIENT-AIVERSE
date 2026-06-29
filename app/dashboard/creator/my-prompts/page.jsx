"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import SparkleDecor from "@/components/shared/SparkleDecor";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import toast from "react-hot-toast";
import { Pencil, Eye, Trash2, PlusCircle } from "lucide-react";

const ITEMS_PER_PAGE = 5;

export default function CreatorMyPromptsPage() {
  const { data: session } = authClient.useSession();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPrompt, setEditPrompt] = useState(null);
  const [page, setPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    if (session) fetchPrompts();
  }, [session]);

  const fetchPrompts = async () => {
    const res = await fetch("/api/creator/my-prompts");
    const data = await res.json();
    setPrompts(data.prompts || []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this prompt?")) return;
    const res = await fetch(`/api/prompts/${id}, { method: "DELETE" }`);
    const data = await res.json();
    if (data.success) {
      toast.success("Deleted!");
      fetchPrompts();
    } else {
      toast.error(data.error);
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
      toast.success("Updated!");
      setEditPrompt(null);
      fetchPrompts();
    } else {
      toast.error(data.error);
    }
  };

  const getStatusStyle = (status) => {
    if (status === "approved") return "bg-green-100 text-green-700 border border-green-300";
    if (status === "rejected") return "bg-red-100 text-red-700 border border-red-300";
    if (status === "warned") return "bg-orange-100 text-orange-700 border border-orange-300";
    return "bg-yellow-100 text-yellow-700 border border-yellow-300";
  };

  if (loading) return <LoadingSpinner />;

  const totalPages = Math.ceil(prompts.length / ITEMS_PER_PAGE);
  const paginated = prompts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="relative">
      <SparkleDecor />
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900">My Prompts</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage and view your published and saved prompt templates.
        </p>
      </div>

      {prompts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-green-100 p-16 text-center">
          <p className="font-bold text-gray-700">No prompts yet</p>
          <button
            onClick={() => router.push("/dashboard/creator/add-prompt")}
            className="mt-4 bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700"
          >
            Add Your First Prompt
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {paginated.map((prompt) => (
              <div
                key={prompt._id}
                className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-bold text-gray-900">{prompt.title}</h3>
                      <span
                        style={{ padding: "2px 8px" }}
                        className="text-xs font-black text-gray-700 border border-gray-200 rounded-full uppercase tracking-widest"
                      >
                        {prompt.category}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {prompt.tags?.map((tag) => (
                        <span
                          key={tag}
                          style={{ padding: "2px 10px" }}
                          className="text-[10px] bg-gray-100 text-gray-600 rounded-full font-black uppercase tracking-widest"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span
                      style={{ padding: "2px 10px" }}
                      className={`text-xs font-black uppercase tracking-widest rounded-full ${getStatusStyle(prompt.status)}`}
                    >
                      STATUS: {prompt.status?.toUpperCase()}
                    </span>

                    {prompt.status === "rejected" && prompt.rejectionFeedback && (
                      <p className="text-xs text-red-500 mt-2">
                        Feedback: {prompt.rejectionFeedback}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setEditPrompt({ ...prompt })}
                      className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center hover:border-green-400 transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => router.push(`/prompts/${prompt._id}`)}
                      className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center hover:border-green-400 transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(prompt._id)}
                      className="w-9 h-9 border border-red-100 rounded-xl flex items-center justify-center hover:border-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push("/dashboard/creator/add-prompt")}
            className="w-full bg-gray-900 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors mb-4"
          >
            <PlusCircle className="w-5 h-5" /> Add New Prompt
          </button>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ padding: "6px 18px" }}
                className="rounded-2xl border border-gray-200 text-sm font-black uppercase tracking-widest disabled:opacity-40 transition-all hover:bg-gray-50"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-bold ${
                    page === p
                      ? "bg-green-600 text-white"
                      : "border border-gray-200 text-gray-600"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{ padding: "6px 18px" }}
                className="rounded-2xl border border-gray-200 text-sm font-black uppercase tracking-widest disabled:opacity-40 transition-all hover:bg-gray-50"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {editPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black text-gray-900 mb-4">Edit Prompt</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editPrompt.title}
                  onChange={(e) => setEditPrompt({ ...editPrompt, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  value={editPrompt.description}
                  onChange={(e) => setEditPrompt({ ...editPrompt, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Content</label>
                <textarea
                  value={editPrompt.content}
                  onChange={(e) => setEditPrompt({ ...editPrompt, content: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Visibility</label>
                <select
                  value={editPrompt.visibility}
                  onChange={(e) => setEditPrompt({ ...editPrompt, visibility: e.target.value })}
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
                  className="flex-1 border border-gray-200 py-2.5 rounded-xl font-semibold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-semibold"
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