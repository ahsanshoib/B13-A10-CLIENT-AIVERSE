"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Copy, Star, Lock, Sparkles } from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function FeaturedPrompts() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/prompts?featured=true&limit=6")
      .then((r) => r.json())
      .then((data) => {
        setPrompts(data.prompts || []);
        setLoading(false);
      });
  }, []);

  const handleViewDetails = (id) => {
    if (!session) router.push("/login");
    else router.push(`/prompts/${id}`);
  };

  return (
    <section className="w-full py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          
          <h2 className="text-4xl md:text-5xl font-black text-green-600 tracking-tight uppercase">
            Featured Prompts
          </h2>
        </motion.div>

    
        <div className="h-16 md:h-24" />

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {prompts.map((prompt, i) => (
              <motion.div
                key={prompt._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {prompt.thumbnail ? (
                  <img src={prompt.thumbnail} alt={prompt.title} className="w-full h-52 object-cover" />
                ) : (
                  <div className="w-full h-52 bg-green-50 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-green-400" />
                  </div>
                )}

                <div className="p-8">
                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 rounded-full px-4 py-1 uppercase tracking-wider">
                      {prompt.category}
                    </span>
                    {prompt.visibility === "private" && (
                      <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-full px-4 py-1 flex items-center gap-1 uppercase tracking-wider">
                        <Lock className="w-4 h-4" /> Premium
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-gray-900 text-xl mb-3 line-clamp-1">{prompt.title}</h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {prompt.description}
                  </p>

                  <div className="border-t border-gray-100 pt-6 flex items-center justify-between">
                    <div className="flex items-center gap-5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <span className="flex items-center gap-2"><Copy className="w-4 h-4" /> {prompt.copyCount}</span>
                      <span className="flex items-center gap-2"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {prompt.averageRating || "0"}</span>
                    </div>
                    <button
                      onClick={() => handleViewDetails(prompt._id)}
                      className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold text-sm uppercase hover:bg-black transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}