"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import SparkleDecor from "@/components/shared/SparkleDecor";
import toast from "react-hot-toast";
import { Upload, PlusCircle } from "lucide-react";

const categories = ["Coding", "Writing", "Marketing", "Graphics Design", "Other"];
const engines = ["ChatGPT", "Gemini", "Claude", "Midjourney", "NotebookLM", "Other"];
const difficulties = ["Beginner", "Intermediate", "Pro"];

export default function AddPromptPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    aiTool: "",
    difficulty: "",
    visibility: "public",
    tags: "",
    thumbnail: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.success) {
        setForm((f) => ({ ...f, thumbnail: data.data.url }));
        toast.success("Image uploaded!");
      } else {
        toast.error("Image upload failed");
      }
    } catch {
      toast.error("Upload error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category || !form.aiTool || !form.difficulty) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    const tagsArray = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const res = await fetch("/api/prompts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, tags: tagsArray }),
    });
    const data = await res.json();

    if (data.success) {
      toast.success("Prompt submitted for review!");
      router.push("/dashboard/creator/my-prompts");
    } else {
      toast.error(data.error || "Failed to submit");
    }
    setLoading(false);
  };

  return (
    <div className="relative">
      <SparkleDecor />
      <div className="mb-6 text-start">
        <h1 className="text-3xl font-black uppercase text-green-500">Add Prompt</h1>
      </div>

    
      <div className="bg-white rounded-2xl border border-green-100 p-6 shadow-sm max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Prompt Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:border-green-500 text-sm bg-green-50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Short Description
            </label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:border-green-500 text-sm bg-green-50"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Prompt Content Template
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:border-green-500 text-sm bg-green-50 resize-none"
            />
          </div>

          {/* Category & Engine */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:border-green-500 text-sm bg-green-50"
              >
                <option value="">Select</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Engine
              </label>
              <select
                name="aiTool"
                value={form.aiTool}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:border-green-500 text-sm bg-green-50"
              >
                <option value="">Select</option>
                {engines.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Difficulty & Visibility */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:border-green-500 text-sm bg-green-50"
              >
                <option value="">Select</option>
                {difficulties.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Visibility
              </label>
              <select
                name="visibility"
                value={form.visibility}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:border-green-500 text-sm bg-green-50"
              >
                <option value="public">Public</option>
                <option value="private">Private (Premium)</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="coding, python, backend"
              className="w-full px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:border-green-500 text-sm bg-green-50"
            />
          </div>

        
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Thumbnail
              </label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-green-200 rounded-xl p-3 cursor-pointer hover:border-green-400 transition-colors bg-green-50">
                <Upload className="w-5 h-5 text-green-500 mb-1" />
                <span className="text-[10px] text-gray-500 text-center">
                  {uploading ? "Uploading..." : form.thumbnail ? "Image uploaded ✓" : "Choose (Max 2MB)"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              style={{ padding: "10px 20px" }}
              className="bg-green-500 text-white rounded-xl font-black uppercase hover:bg-gray-800 transition-all disabled:opacity-60 flex flex-col items-center justify-center"
            >
              <span className="text-[9px]">Submit for review</span>
              <span className="flex items-center gap-1 text-sm">
                <PlusCircle className="w-4 h-4" />
                {loading ? "Adding..." : "Add"}
              </span>
            </button>
          </div>

          {form.thumbnail && (
            <img
              src={form.thumbnail}
              alt="Thumbnail preview"
              className="w-full h-32 object-cover rounded-xl mt-2"
            />
          )}
        </form>
      </div>
    </div>
  );
}