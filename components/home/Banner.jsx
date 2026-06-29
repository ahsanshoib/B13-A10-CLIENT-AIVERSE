"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const trendingTags = [
  { name: "#Coding", color: "bg-[#D2E9FA] text-[#2563EB] hover:bg-[#C3E0F8]" },
  { name: "#Marketing", color: "bg-[#FCE6BE] text-[#D97706] hover:bg-[#FBE0B0]" },
  { name: "#Copywriting", color: "bg-[#FBCFE8] text-[#DB2777] hover:bg-[#F9C0DF]" },
  // { name: "#Creative", color: "bg-[#BAF3E6] text-[#0D9488] hover:bg-[#A8E6D8]" },
  { name: "#Design", color: "bg-[#E9D5FF] text-[#9333EA] hover:bg-[#DFC6F8]" },
  { name: "#Writing", color: "bg-[#DCFCE7] text-[#16A34A] hover:bg-[#CFF8D8]" },
];

export default function Banner() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   if (search.trim()) router.push(`/prompts?search=${encodeURIComponent(search)}`);
  // };

  const handleSearch = (e) => {
  e.preventDefault();
  router.push(`/prompts${search.trim() ? `?search=${encodeURIComponent(search)}` : ""}`);
};

  return (
    <section className="w-full min-h-[80vh] flex flex-col items-center justify-center bg-white px-6 py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-5xl mx-auto w-full z-10 flex flex-col items-center"
      >
        <motion.h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter leading-tight">
          BOOST YOUR <span className="text-green-600">WORKFLOW</span>
        </motion.h1>

        <motion.p className="text-gray-600 text-lg md:text-xl font-bold tracking-widest uppercase mb-16">
          Discover, Bookmark, and Run Engineering by Using AI
        </motion.p>

        {/* Centered Search Form */}
        <motion.form
          onSubmit={handleSearch}
          className="flex flex-col items-center justify-center gap-4 max-w-xl mx-auto mb-20 w-full px-4"
        >
         <div className="relative w-full">
  <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search Prompts..."
    style={{ padding: "6px 18px" }}
    className="w-full border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-green-600 text-gray-800 bg-white text-sm font-black tracking-widest transition-all shadow-sm pr-12"
  />
  {/* <div className="absolute right-4 top-1/2 -translate-y-1/2">
    <Search 
      className="w-5 h-5 text-gray-400 cursor-pointer hover:text-green-600 transition-colors" 
      onClick={handleSearch} 
    />
  </div> */}
</div>

        <div className="flex items-center justify-center gap-6 w-full">
  <button 
    type="submit" 
    style={{ padding: "8px 20px" }} 
    className="bg-green-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-green-700 transition-all flex items-center justify-center"
  >
    Explore
  </button>
  
  <button 
    type="button" 
    onClick={() => router.push("/register")} 
    style={{ padding: "8px 20px" }}
    className="bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center"
  >
    Creator
  </button>
</div>

        </motion.form>

        {/* Trending Tags Section */}
        <motion.div className="flex flex-col items-center gap-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-gray-400"></p>
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl">
           {trendingTags.map((tag, i) => (
  <motion.button
    key={tag.name}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.3 + i * 0.05 }}
    style={{ padding: "2px 8px" }}
    onClick={() => router.push(`/prompts?search=${tag.name.replace("#", "")}`)}
    className={`rounded-full text-sm font-black uppercase tracking-widest transition-all hover:scale-105 ${tag.color}`}
  >
    {tag.name}
  </motion.button>
))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}