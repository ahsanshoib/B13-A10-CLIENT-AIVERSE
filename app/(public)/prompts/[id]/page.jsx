"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Copy, Bookmark, BookmarkCheck, Star, Lock, ArrowLeft, Flag, Lightbulb, Eye } from "lucide-react";

export default function PromptDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [userPremium, setUserPremium] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchPrompt();
    if (session) {
      fetchBookmarkStatus();
      fetchUserStatus();
    }
  }, [id, session]);

  const fetchPrompt = async () => {
    const res = await fetch(`/api/prompts/${id}`);
    if (!res.ok) { setLoading(false); return; }
    const data = await res.json();
    setPrompt(data.prompt);
    setLoading(false);
    if (data.prompt) fetchReviews();
  };

  const fetchReviews = async () => {
    const res = await fetch(`/api/reviews?promptId=${id}`);
    const data = await res.json();
    setReviews(data.reviews || []);
  };

  const fetchBookmarkStatus = async () => {
    const res = await fetch(`/api/bookmarks/${id}`);
    const data = await res.json();
    setBookmarked(data.bookmarked || false);
  };

  const fetchUserStatus = async () => {
    const res = await fetch("/api/users/me");
    const data = await res.json();
    setUserPremium(data.user?.isPremium || false);
  };

  const handleCopy = async () => {
    if (!session) return router.push("/login");
    if (isLocked) return toast.error("Subscribe to Premium to copy this prompt");
    navigator.clipboard.writeText(prompt.content);
    await fetch(`/api/prompts/${id}/copy`, { method: "POST" });
    setCopied(true);
    toast.success("Prompt copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
    setPrompt(p => ({ ...p, copyCount: p.copyCount + 1 }));
  };

  const handleBookmark = async () => {
    if (!session) return router.push("/login");
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptId: id }),
    });
    const data = await res.json();
    setBookmarked(data.bookmarked);
    toast.success(data.message);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!rating) return toast.error("Please select a rating");
    setSubmittingReview(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptId: id, rating, comment }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Review submitted!");
      setRating(0);
      setComment("");
      fetchReviews();
      fetchPrompt();
    } else {
      toast.error(data.error || "Failed to submit review");
    }
    setSubmittingReview(false);
  };

  const handleReport = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptId: id, promptTitle: prompt.title, reason: reportReason, description: reportDesc }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Report submitted!");
      setReportModal(false);
      setReportReason("");
      setReportDesc("");
    } else {
      toast.error("Failed to submit report");
    }
  };

  const isLocked = prompt?.visibility === "private" && !userPremium;

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  if (!prompt) return <div className="min-h-screen flex items-center justify-center text-gray-500">Prompt not found</div>;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center">
      <Navbar />
      <div className="w-full max-w-5xl px-4 py-8 mt-12">

        <button onClick={() => router.back()} className="flex items-center gap-2 text-green-600 font-medium mb-6 hover:underline text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to previous page
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-green-700 rounded-2xl flex items-center justify-center text-white font-black text-xl">AI</div>
                <div>
                  <h1 className="text-xl font-black text-gray-900 leading-tight">{prompt.title}</h1>
                  <p className="text-gray-500 text-sm mt-1">{prompt.description}</p>
                </div>
              </div>
              {session && (
                <div className="flex gap-2 shrink-0">
                  <button onClick={handleBookmark} className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center hover:border-green-400 transition-colors">
                    {bookmarked ? <BookmarkCheck className="w-5 h-5 text-green-600" /> : <Bookmark className="w-5 h-5 text-gray-400" />}
                  </button>
                  <button onClick={() => setReportModal(true)} className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center hover:border-red-400 transition-colors">
                    <Flag className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              )}
            </div>

            {/* Prompt Content */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-gray-700 font-black uppercase tracking-wider text-[10px]">
                  <Eye className="w-4 h-4 text-green-600" /> Prompt Template
                </div>
                {!isLocked && (
                  <button onClick={handleCopy} className="flex items-center gap-1 text-xs border border-gray-200 px-4 py-2 rounded-xl hover:border-green-400 transition-colors">
                    <Copy className="w-3.5 h-3.5" /> {copied ? "Copied!" : "Copy"}
                  </button>
                )}
              </div>

              {isLocked ? (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
                  <Lock className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="font-black text-gray-700 mb-4">Premium Prompt Content Locked</p>
                  <button onClick={() => router.push("/payment")} className="bg-green-600 text-white px-8 py-3 rounded-xl font-black hover:bg-green-700 transition-colors text-sm">
                    Subscribe ($5)
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{prompt.content}</p>
                </div>
              )}
            </div>

            {/* Usage */}
            <div>
              <div className="flex items-center gap-2 text-gray-700 font-black uppercase tracking-wider text-[10px] mb-3">
                <Lightbulb className="w-4 h-4 text-green-600" /> Usage Instruction
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
                <p className="text-gray-600 text-sm">{prompt.usageInstructions || "Use this prompt directly with your preferred AI tool for best results."}</p>
              </div>
            </div>
          </div>

          {/* Right Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-900 mb-6 pb-3 border-b-2 border-green-500 inline-block">Prompt Details</h2>
            <div className="space-y-6">
              {[
                { icon: "🤖", label: "AI Engine", value: prompt.aiTool, color: "text-green-600 font-semibold" },
                { icon: "📋", label: "Category", value: prompt.category },
                { icon: "📊", label: "Difficulty", value: prompt.difficulty, badge: true },
                { icon: "👁️", label: "Visibility", value: prompt.visibility, badge: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-xl w-6">{item.icon}</span>
                  <span className="text-gray-400 text-xs uppercase tracking-wider font-bold w-24">{item.label}</span>
                  {item.badge ? (
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">{item.value}</span>
                  ) : (
                    <span className={`text-sm ${item.color || "text-gray-900 font-bold"}`}>{item.value}</span>
                  )}
                </div>
              ))}

              <div className="border-t border-gray-100 pt-4 space-y-4">
                <div className="flex items-center gap-4">
                  <Copy className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-xs uppercase tracking-wider font-bold w-24">Copied</span>
                  <span className="font-black text-gray-900">{prompt.copyCount || 0}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Bookmark className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-xs uppercase tracking-wider font-bold w-24">Bookmark</span>
                  <span className="font-black text-gray-900">{prompt.bookmarkCount || 0}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Star className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-xs uppercase tracking-wider font-bold w-24">Rating</span>
                  <div>
                    <span className="font-black text-green-600 text-lg">{prompt.averageRating || "0"}</span>
                    <div className="flex gap-0.5 mt-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.round(prompt.averageRating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-3">Creator Info</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-white font-bold">
                    {prompt.creatorName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-gray-900 text-sm">{prompt.creatorName}</p>
                    <p className="text-xs text-gray-400">{prompt.creatorEmail}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-green-700 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-black text-gray-900">Community Reviews</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Submit Review */}
            {session && !isLocked && (
              <div>
                <h3 className="font-black text-gray-700 mb-4 text-sm uppercase tracking-wider">Submit a Review</h3>
                <form onSubmit={handleReview} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-2">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} type="button" onClick={() => setRating(star)}>
                          <Star className={`w-7 h-7 transition-colors ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-2">Comment</label>
                    <textarea
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      required
                      rows={4}
                      placeholder="Write your comment..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-sm resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-black hover:bg-green-700 transition-colors disabled:opacity-60 text-sm"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            )}

            {/* Reviews List */}
            <div>
              {reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-3">
                    <Star className="w-8 h-8 text-green-200" />
                  </div>
                  <p className="font-black text-gray-600">No reviews yet.</p>
                  <p className="text-sm">Be first to share your thought</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review._id} className="border border-gray-100 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-black text-gray-900 text-sm">{review.userName}</p>
                          <p className="text-xs text-gray-400">{review.userEmail}</p>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                      <p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {reportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-black text-gray-900 mb-4">Report Prompt</h3>
            <form onSubmit={handleReport} className="space-y-4">
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">Reason</label>
                <select
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-sm"
                >
                  <option value="">Select a reason</option>
                  <option value="Inappropriate Content">Inappropriate Content</option>
                  <option value="Spam">Spam</option>
                  <option value="Copyright Violation">Copyright Violation</option>
                  <option value="Misleading">Misleading</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  value={reportDesc}
                  onChange={e => setReportDesc(e.target.value)}
                  rows={3}
                  placeholder="Additional details..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-sm resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setReportModal(false)} className="flex-1 border border-gray-200 py-2.5 rounded-xl font-black text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-black hover:bg-red-600">Submit Report</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}