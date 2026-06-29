"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TopCreators() {
  const [creators, setCreators] = useState([]);

  useEffect(() => {
    fetch("/api/prompts?limit=100")
      .then((r) => r.json())
      .then((data) => {
        const map = {};
        (data.prompts || []).forEach((p) => {
          if (!map[p.creatorId]) {
            map[p.creatorId] = {
              name: p.creatorName,
              email: p.creatorEmail,
              count: 0,
              tag: p.category,
              image: null,
            };
          }
          map[p.creatorId].count++;
        });

        const sorted = Object.values(map)
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);

        Promise.all(
          sorted.map(async (creator) => {
            try {
              const res = await fetch("/api/admin/users");
              const data = await res.json();
              const user = (data.users || []).find(
                (u) => u.email === creator.email
              );
              return { ...creator, image: user?.image || null };
            } catch {
              return creator;
            }
          })
        ).then(setCreators);
      });
  }, []);

  if (creators.length === 0) return null;

  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          
          <h2 className="text-4xl md:text-5xl font-black text-green-600 tracking-tight uppercase">
            Top Creators
          </h2>
        </motion.div>

      
        <div className="h-16 md:h-24" />

        {/* Cards */}
       <div className="flex justify-center w-full">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
    {creators.map((creator, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.1 }}
      
        style={{ padding: "8px" }}
      >
    
        <div 
          className="bg-white rounded-3xl flex flex-col items-start gap-6 h-full border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
          style={{ padding: "24px" }}
        >
          <div className="flex items-center gap-5 w-full">
            {/* Profile Picture */}
            {creator.image ? (
              <img
                src={creator.image}
                alt={creator.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-green-50 shadow-inner shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center text-white font-black text-3xl shrink-0 border-4 border-green-100">
                {creator.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-black text-gray-900 uppercase text-lg truncate mb-1">
                {creator.name}
              </p>
              <p className="text-green-600 font-black text-xl">
                {creator.count}+ Prompts
              </p>
            </div>
          </div>
          
          <span className="text-xs bg-green-50 border border-green-100 text-green-700 px-5 py-2 rounded-full font-black uppercase tracking-widest">
            {creator.tag}
          </span>
        </div>
      </motion.div>
    ))}
  </div>
</div>
      </div>
    </section>
  );
}