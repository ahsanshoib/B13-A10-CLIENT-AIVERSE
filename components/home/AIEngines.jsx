"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const engines = [
  { name: "ChatGPT", src: "/engines/cgpt1.png" },
  { name: "Gemini", src: "/engines/gemini2.png" },
  { name: "Claude", src: "/engines/claude3.png" },
  { name: "NotebookLM", src: "/engines/notebooklm5.png" },
  { name: "Midjourney", src: "/engines/midjourney6.png" },
  { name: "DeepSeek", src: "/engines/deepseek4.png" },
  { name: "Perplexity", src: "/engines/perplexity9.png" },
  { name: "AntiGravity", src: "/engines/antigravity7.png" },
  { name: "Grok", src: "/engines/grok10.png" },
  { name: "Runway", src: "/engines/runway8.png" },
];

export default function AIEngines() {
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
            Engines
          </h2>
        </motion.div>

      
        <div className="h-16 md:h-20" />

        {/* Engines Grid - 10 items in a row */}
        <div className="grid grid-cols-5 md:grid-cols-10 gap-4 md:gap-6 w-full">
          {engines.map((engine, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center gap-3 group cursor-pointer"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 relative group-hover:scale-110 transition-transform duration-300">
                <Image
                  src={engine.src}
                  alt={engine.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[9px] md:text-xs text-gray-700 font-bold tracking-wider text-center">
                {engine.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}