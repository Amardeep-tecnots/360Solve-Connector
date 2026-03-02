"use client";

import { motion } from "framer-motion";

const acts = [
  {
    number: "01",
    title: "Connect",
    description: "Link any data source or destination in minutes. Nia supports databases, APIs, SaaS tools, and on-premise systems through a unified interface.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12">
        <circle cx="12" cy="24" r="8" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
        <circle cx="36" cy="24" r="8" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
        <path d="M 20 24 L 28 24" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="3,3" />
        <circle cx="20" cy="24" r="2" fill="#3B82F6" />
        <circle cx="28" cy="24" r="2" fill="#3B82F6" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Map",
    description: "Our AI analyzes your schemas and automatically generates intelligent field mappings. Review, approve, or adjust with natural language.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12">
        <rect x="6" y="10" width="14" height="28" rx="2" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
        <rect x="28" y="10" width="14" height="28" rx="2" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
        {/* Arrow from left to right */}
        <path d="M 20 20 L 28 20" stroke="#3B82F6" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
        <path d="M 20 28 L 28 28" stroke="#3B82F6" strokeWidth="1.5" />
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 Z" fill="#3B82F6" />
          </marker>
        </defs>
        {/* Checkmarks */}
        <path d="M 22 23 L 24 25 L 27 21" stroke="#22C55E" strokeWidth="1.5" fill="none" />
        <path d="M 22 31 L 24 33 L 27 29" stroke="#22C55E" strokeWidth="1.5" fill="none" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Execute",
    description: "Deploy secure, auto-scaling workflows that move your data reliably. Monitor in real-time with granular logs and alerting.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12">
        {/* Pipeline nodes */}
        <rect x="4" y="18" width="12" height="12" rx="2" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
        <rect x="32" y="18" width="12" height="12" rx="2" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
        {/* Animated dots on path */}
        <motion.circle 
          r="3" 
          fill="#3B82F6" 
          animate={{ cx: [16, 32] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle 
          r="2" 
          fill="#3B82F6" 
          opacity="0.6"
          animate={{ cx: [16, 32] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
        />
        {/* Pulse effect */}
        <motion.circle 
          cx="24" 
          cy="24" 
          r="8" 
          fill="none" 
          stroke="#3B82F6" 
          strokeWidth="1" 
          opacity="0.3"
          animate={{ r: [6, 12], opacity: [0.3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
        />
      </svg>
    ),
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-canvas">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-signal font-medium mb-4 block">
            How It Works
          </span>
          <h2 className="font-sans text-section font-bold text-ink">
            Three acts. Infinite possibility.
          </h2>
        </motion.div>

        {/* Acts Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {acts.map((act, index) => (
            <motion.div
              key={act.number}
              className="group relative bg-white border border-mist p-9 rounded-xl transition-all duration-250"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -4 }}
            >
              {/* Number */}
              <span className="font-mono text-xs text-[#CBD5E1] font-medium mb-4 block group-hover:text-[#94A3B8] transition-colors">
                {act.number}
              </span>

              {/* Icon */}
              <div className="mb-5">
                {act.icon}
              </div>

              {/* Title */}
              <h3 className="font-sans text-card font-semibold text-ink mb-3">
                {act.title}
              </h3>

              {/* Description */}
              <p className="text-[15px] text-[#64748B] leading-relaxed">
                {act.description}
              </p>

              {/* Hover highlight border */}
              <div className="absolute inset-0 rounded-xl border-2 border-signal opacity-0 group-hover:opacity-100 transition-opacity duration-250 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
