"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import SparkleDecor from "@/components/shared/SparkleDecor";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import toast from "react-hot-toast";
import { Camera, Save } from "lucide-react";

export default function AdminUpdateProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: "", photoURL: "" });
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    if (!session) { router.push("/login"); return; }
    fetch("/api/users/me")
      .then(r => r.json())
      .then(data => {
        setUserData(data.user);
        setForm({
          name: data.user?.name || "",
          photoURL: data.user?.image || data.user?.photoURL || "",
        });
        setLoading(false);
      });
  }, [session, isPending]);

  const handleImageUpload = async (e) => {
  const file = e.target.files[0];

    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be under 2MB"); return; }
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
        setForm(f => ({ ...f, photoURL: data.data.url }));
        toast.success("Photo uploaded!");
      } else {
        toast.error("Upload failed");
      }
    } catch { toast.error("Upload error"); }
    finally { setUploading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Name cannot be empty"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/users/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, photoURL: form.photoURL }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Profile updated!");
        router.push("/dashboard/admin/profile");
        router.refresh();
      } else {
        toast.error(data.error || "Failed to update");
      }
    } catch { toast.error("Something went wrong"); }
    finally { setSaving(false); }
  };

  if (isPending || loading) return <LoadingSpinner />;

  return (
    <div className="relative min-h-screen">
      <SparkleDecor />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Update Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Change your name and profile photo.</p>
      </div>

      <div className="bg-white rounded-2xl border border-green-100 p-8 shadow-sm max-w-lg">
        <form onSubmit={handleSave} className="space-y-6">

        
          <div className="flex items-center justify-between gap-4">
            
      
            <div className="flex items-center gap-4">
      
              <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-green-100 shrink-0">
                {form.photoURL ? (
                  <img
                    src={form.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-green-800 flex items-center justify-center text-white font-black text-xl">
                    {form.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
              </div>

        
              <p className="font-bold text-gray-900 text-lg">{form.name || "Your Name"}</p>
            </div>

            
            <div className="flex flex-col items-center gap-1">
              <label className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-700 transition-colors border-2 border-white shadow">
                <Camera className="w-5 h-5 text-white" />
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              {uploading && <p className="text-xs text-green-600 font-medium">Uploading...</p>}
              <p className="text-xs text-gray-400 text-center">Click the camera icon<br/>to change photo (Max 2MB)</p>
            </div>
          </div>

        
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Photo URL <span className="text-gray-400 font-normal">(or paste a URL)</span>
            </label>
            <input
              type="url"
              value={form.photoURL}
              onChange={e => setForm(f => ({ ...f, photoURL: e.target.value }))}
              placeholder="https://example.com/photo.jpg"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-sm text-gray-700"
            />
          </div>

      
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              placeholder="Your full name"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-sm text-gray-700"
            />
          </div>

        
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={userData?.email || ""}
              readOnly
              className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/dashboard/admin/profile")}
              className="flex-1 border border-gray-200 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}