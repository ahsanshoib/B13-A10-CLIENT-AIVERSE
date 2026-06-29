"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Sarah Johnson",
    role: "AI Researcher",
    comment: "AIVERSE completely transformed my daily workflow. The quality of prompts is simply unmatched!",
    rating: 5,
    avatar: "S",
    color: "bg-green-600",
  },
  {
    name: "Marcus Chen",
    role: "Content Creator",
    comment: "Found incredible prompts for my YouTube scripts. It has been a massive time-saver for me.",
    rating: 5,
    avatar: "M",
    color: "bg-blue-600",
  },
  {
    name: "Priya Patel",
    role: "UX Designer",
    comment: "The Midjourney prompts saved me countless hours of work. Totally worth every penny!",
    rating: 5,
    avatar: "P",
    color: "bg-purple-600",
  },
];

export default function CustomerReviews() {
  return (
    <section className="w-full bg-white px-6">
      <div className="h-24 md:h-48" />

      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-black text-green-600 tracking-tight uppercase">
            Customer Reviews
          </h2>
        </motion.div>

        <div className="h-16 md:h-24" />
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
  {reviews.map((review, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1 }}
      
      className="bg-green-50 rounded-3xl border border-green-200"
      style={{ padding: "16px" }} 
    >
      
      <div 
        className="bg-white rounded-3xl"
        style={{ padding: "24px" }} 
      >
        <div className="flex items-center gap-5 mb-8">
          <div className={`w-16 h-16 rounded-full ${review.color} flex items-center justify-center text-white font-black text-2xl`}>
            {review.avatar}
          </div>
          <div>
            <p className="font-black text-gray-900 text-lg uppercase tracking-tight">{review.name}</p>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">{review.role}</p>
          </div>
        </div>
        
        <div className="flex gap-1 mb-6">
          {Array.from({ length: review.rating }).map((_, j) => (
            <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        
        <p className="text-gray-700 text-base leading-relaxed italic">
          "{review.comment}"
        </p>
      </div>
    </motion.div>
  ))}
</div>
      </div>
      <div className="h-24 md:h-32" />
    </section>
  );
}