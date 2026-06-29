"use client";
import { motion } from "framer-motion";
import { Rocket, Shield, Users } from "lucide-react";

const features = [
  {
    icon: <Rocket className="w-10 h-10 text-green-600" />,
    title: "SPEED & EFFICIENCY",
    desc: "Access optimized prompts instantly to supercharge your workflow with lightning-fast results.",
  },
  {
    icon: <Shield className="w-10 h-10 text-green-600" />,
    title: "CURATED & SECURE",
    desc: "Only quality-vetted prompts from industry experts provided in a safe and secure ecosystem.",
  },
  {
    icon: <Users className="w-10 h-10 text-green-600" />,
    title: "COMMUNITY & INNOVATION",
    desc: "Join a thriving global community to share, review, and discover the absolute latest in AI.",
  },
];

export default function WhyChooseUs() {
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
            Why Choose Us
          </h2>
        </motion.div>

        
        <div className="h-16 md:h-24" />

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-6 bg-white border border-gray-50 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="w-20 h-20 border border-green-100 rounded-3xl flex items-center justify-center bg-green-50">
                {f.icon}
              </div>
              <h3 className="font-black text-gray-900 text-xl tracking-wider uppercase">
                {f.title}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed max-w-xs">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}