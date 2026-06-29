"use client";
import { motion } from "framer-motion";

const stats = [
  { value: "10K+", label: "Active Users", color: "text-green-600" },
  { value: "50K+", label: "Copied Prompts", color: "text-gray-900" },
  { value: "500+", label: "Expert Creators", color: "text-green-600" },
  { value: "4.9/5", label: "Average Rating", color: "text-gray-900" },
];

export default function PlatformStats() {
  return (
    <section className="w-full py-24 bg-white px-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          
          <h2 className="text-4xl md:text-5xl font-black text-green-600 tracking-tight uppercase">
            Platform Stats
          </h2>
        </motion.div>

    
        <div className="h-16 md:h-24" />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className={`text-4xl md:text-6xl font-black mb-4 ${s.color}`}>
                {s.value}
              </p>
              <p className="text-sm md:text-base text-gray-500 font-black uppercase tracking-widest">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}