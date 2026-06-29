"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { authClient } from "@/lib/auth-client";
import { Copy, Star, Lock, Sparkles, Search } from "lucide-react";

const categories = ["All", "Coding", "Writing", "Marketing", "Graphics Design", "Other"];
const engines = ["All", "ChatGPT", "Gemini", "Claude", "Midjourney", "NotebookLM", "Other"];
const difficulties = ["All", "Beginner", "Intermediate", "Pro"];

function AllPromptsContent() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [aiTool, setAiTool] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [sort, setSort] = useState("latest");

  const { data: session } = authClient.useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("search");
    if (q) setSearch(q);
  }, [searchParams]);

  useEffect(() => {
    fetchPrompts();
  }, [search, category, aiTool, difficulty, sort, page]);

  const fetchPrompts = async () => {
    setLoading(true);
    const params = new URLSearchParams({ search, category, aiTool, difficulty, sort, page, limit: 8 });
    const res = await fetch(`/api/prompts?${params}`);
    const data = await res.json();
    setPrompts(data.prompts || []);
    setTotal(data.total || 0);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  };

  const handleViewDetails = (id) => {
    if (!session) router.push("/login");
    else router.push(`/prompts/${id}`);
  };

  return (
    <div className="min-h-screen bg-white pt-20 w-full flex justify-center">
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <aside className="w-full md:w-56 shrink-0">
          <div className="bg-green-50 rounded-2xl p-5 sticky top-24">
            <h2 className="text-xl font-black text-green-500 mb-5">FILTERS</h2>

            <div className="mb-8">
              <p className="text-xs font-black text-gray-700 uppercase tracking-wider mb-2">All Engine</p>
              <ul className="space-y-0.5">
                {engines.map(e => (
                  <li key={e} onClick={() => { setAiTool(e); setPage(1); }}
                    className={`cursor-pointer text-sm py-1 px-2 rounded-lg transition-colors ${aiTool === e ? "text-green-700 font-bold" : "text-gray-600 hover:text-green-600"}`}>
                    {e}
                  </li>
                ))}
              </ul>
            </div>

<div className="w-full h-px bg-green-200 mb-6" />

            <div className="mb-8">
              <p className="text-xs font-black text-gray-700 uppercase tracking-wider mb-2">Category</p>
              <ul className="space-y-0.5">
                {categories.map(c => (
                  <li key={c} onClick={() => { setCategory(c); setPage(1); }}
                    className={`cursor-pointer text-sm py-1 px-2 rounded-lg transition-colors ${category === c ? "text-green-700 font-bold" : "text-gray-600 hover:text-green-600"}`}>
                    {c}
                  </li>
                ))}
              </ul>
            </div>

          <div className="w-full h-px bg-green-200 mb-6" />

            <div className="mb-8">
              <p className="text-xs font-black text-gray-700 uppercase tracking-wider mb-2">Difficulty</p>
              <ul className="space-y-0.5">
                {difficulties.map(d => (
                  <li key={d} onClick={() => { setDifficulty(d); setPage(1); }}
                    className={`cursor-pointer text-sm py-1 px-2 rounded-lg transition-colors ${difficulty === d ? "text-green-700 font-bold" : "text-gray-600 hover:text-green-600"}`}>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-black text-green-600">EXPLORE PROMPTS</h1>
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search prompt"
                style={{ padding: "6px 18px" }}
                className="w-full border border-gray-400 rounded-xl focus:outline-none focus:border-green-500 text-sm font-black uppercase tracking-widest bg-white transition-all"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 mb-6 flex-wrap mt-3">
            <span className="text-sm text-gray-500 font-normal">Sort By</span>
            {[
              { key: "latest", label: "Latest" },
              { key: "popular", label: "Most Popular" },
              { key: "copied", label: "Most Copied" },
            ].map(s => (
              <button
                key={s.key}
                onClick={() => { setSort(s.key); setPage(1); }}
                style={{ padding: "2px 10px" }}
                className={`rounded-xl text-sm font-normal transition-colors ${sort === s.key ? "bg-green-600 text-white" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
    >
                {s.label}
              </button>
            ))}
          </div>

          <p className="text-sm text-gray-400 mb-4">{total} prompts found</p>

          {loading ? (
            <LoadingSpinner />
          ) : prompts.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No prompts found</p>
            </div>
          ) : (
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
  {prompts.map((prompt) => (
    
    <div key={prompt._id} className="p-[8px]">
      
      
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all h-full">
        {prompt.thumbnail ? (
          <img src={prompt.thumbnail} alt={prompt.title} className="w-full h-44 object-cover" />
        ) : (
          <div className="w-full h-44 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-green-400" />
          </div>
        )}

        <div className="p-5 flex flex-col gap-3">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-semibold text-green-700 border border-green-500 rounded-full px-3 py-1 flex items-center gap-1">
              &lt;/&gt; {prompt.category}
            </span>
            <span className="text-xs font-semibold text-gray-700 border border-gray-300 rounded-full px-3 py-1 flex items-center gap-1">
              ★★ {prompt.difficulty}
            </span>
            {prompt.visibility === "private" && (
              <span className="text-xs font-semibold text-red-600 border border-red-400 rounded-full px-3 py-1 flex items-center gap-1">
                <Lock className="w-3 h-3" /> PREMIUM
              </span>
            )}
          </div>

          {/* Title & Description */}
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-gray-900 text-base">{prompt.title}</h3>
            <p className="text-gray-500 text-sm line-clamp-2">{prompt.description}</p>
          </div>

          {/* Tag */}
          <div className="flex items-center gap-1 text-green-600 text-xs">
            <Sparkles className="w-3 h-3" />
            <span>#{prompt.tags?.[0] || prompt.category}</span>
          </div>

          {/* Creator & Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>👤 {prompt.creatorName}</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><Copy className="w-3 h-3" /> {prompt.copyCount}</span>
              <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {prompt.averageRating || "0"}</span>
            </div>
          </div>

          {/* Button */}
          <button onClick={() => handleViewDetails(prompt._id)}
            className="w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2 mt-1">
            VIEW DETAILS
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:border-green-400 transition-colors">
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-bold transition-colors ${page === p ? "bg-green-600 text-white" : "border border-gray-200 text-gray-600 hover:border-green-400"}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:border-green-400 transition-colors">
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// export default function AllPromptsPage() {
//   return (
//     <main className="w-full flex flex-col items-center">
//       <Navbar />
//       <Suspense fallback={<LoadingSpinner />}>
//         <AllPromptsContent />
//       </Suspense>
//       <div className="w-full max-w-7xl mx-auto">
//         <Footer />
//       </div>
//     </main>
//   );
// }


export default function AllPromptsPage() {
  return (
    <main className="w-full flex flex-col items-center">
      <Navbar />
      <Suspense fallback={<LoadingSpinner />}>
        <AllPromptsContent />
      </Suspense>
      <Footer />
    </main>
  );
}