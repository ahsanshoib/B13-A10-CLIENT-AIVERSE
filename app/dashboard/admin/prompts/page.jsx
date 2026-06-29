"use client";
import { useEffect, useState } from "react";
import SparkleDecor from "@/components/shared/SparkleDecor";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import toast from "react-hot-toast";
import { Eye, CheckCircle, XCircle, Trash2, Star } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminPromptsPage() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState(null);
  const [feedback, setFeedback] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    const res = await fetch("/api/admin/prompts");
    const data = await res.json();
    setPrompts(data.prompts || []);
    setLoading(false);
  };

  const handleAction = async (id, updates) => {
    const res = await fetch(`/api/admin/prompts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Prompt status adjusted successfully.");
      fetchPrompts();
    } else {
      toast.error(data.error || "Action failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this prompt?")) return;
    const res = await fetch(`/api/admin/prompts/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      toast.success("Deleted!");
      fetchPrompts();
    } else {
      toast.error(data.error);
    }
  };

  const handleReject = async () => {
    await handleAction(rejectModal, {
      status: "rejected",
      rejectionFeedback: feedback,
    });
    setRejectModal(null);
    setFeedback("");
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="relative">
      <SparkleDecor />
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">
          Prompt Template Submissions Moderation
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Approve templates, reject with feedback, or tag featured highlights.
        </p>
      </div>

    
      <div className="bg-white rounded-3xl border border-green-100 shadow-sm p-2 overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-1">
          <thead>
            <tr>
              {["...Template Title", "Creator", "AI Engine", "Visibility", "Featured", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {prompts.map((prompt) => (
              <tr key={prompt._id} className="hover:bg-green-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-800 text-sm">{prompt.title}</p>
                  <p className="text-xs text-gray-400 font-medium">Category: {prompt.category}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-700 font-medium">{prompt.creatorName}</p>
                  <p className="text-xs text-gray-400 font-medium">{prompt.creatorEmail}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-purple-100 text-purple-700">
                    {prompt.aiTool?.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 font-medium capitalize">
                  {prompt.visibility}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleAction(prompt._id, { isFeatured: !prompt.isFeatured })}
                    className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border transition-colors ${
                      prompt.isFeatured
                        ? "bg-yellow-50 border-yellow-400 text-yellow-700"
                        : "border-gray-200 text-gray-400 hover:border-yellow-400"
                    }`}
                  >
                    <Star className={`w-3 h-3 ${prompt.isFeatured ? "fill-yellow-400" : ""}`} />
                    {prompt.isFeatured ? "FEATURED" : "FEATURE"}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
                      prompt.status === "approved" ? "bg-green-100 text-green-700" :
                      prompt.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {prompt.status?.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => router.push(`/prompts/${prompt._id}`)} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors" title="View"><Eye className="w-4 h-4 text-gray-500" /></button>
                    <button onClick={() => handleAction(prompt._id, { status: "approved" })} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-green-100 transition-colors" title="Approve"><CheckCircle className="w-4 h-4 text-green-500" /></button>
                    <button onClick={() => setRejectModal(prompt._id)} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors" title="Reject"><XCircle className="w-4 h-4 text-red-400" /></button>
                    <button onClick={() => handleDelete(prompt._id)} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all text-gray-500" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-black text-gray-900 mb-4">Rejection Feedback</h3>
            <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={4} placeholder="Provide feedback..." className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-sm mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setRejectModal(null)} className="flex-1 border border-gray-200 py-2.5 rounded-xl font-semibold text-gray-600">Cancel</button>
              <button onClick={handleReject} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-semibold hover:bg-red-600">Reject Prompt</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}