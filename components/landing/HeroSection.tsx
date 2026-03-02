"use client";

import { motion } from "framer-motion";
import Link from "next/link";

// Trust ticker items
const tickerItems = [
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "REST API",
  "GraphQL",
  "WebSocket",
  "Snowflake",
  "BigQuery",
  "Redis",
  "Kafka",
];

export const HeroSection = () => {
  return (
    <section className="relative pt-28 pb-20 min-h-[75vh] flex items-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Proposition */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Eyebrow */}
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: 0.2 }}
            >
              <span className="w-5 h-[1.5px] bg-signal" />
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-signal font-medium">
                AI-Powered Data Synchronization
              </span>
            </motion.div>

            {/* Headline */}
            <div className="mb-6">
              <motion.h1
                className="font-sans font-extrabold text-[56px] lg:text-[72px] leading-[1.05] tracking-tight text-ink"
                style={{ letterSpacing: "-0.04em" }}
              >
                <motion.span
                  className="block"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.38, delay: 0.2 }}
                >
                  Connect Any System.
                </motion.span>
                <motion.span
                  className="block text-signal"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.38, delay: 0.255 }}
                >
                  In Minutes. Not Months.
                </motion.span>
              </motion.h1>
            </div>

            {/* Sub-copy */}
            <motion.p
              className="text-body text-[#64748B] max-w-[540px] mb-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.6 }}
            >
              The AI-powered integration platform that automatically generates connectors for ANY ERP system — even legacy on-premise applications behind firewalls.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-4 mb-10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.6 }}
            >
              <Link
                href="/sign-up"
                className="group inline-flex items-center gap-2 bg-signal text-white font-semibold text-[15px] px-8 py-4 rounded-[10px] hover:bg-signalDark hover:shadow-[0_0_0_4px_rgba(36,99,235,0.12)] transition-all duration-200"
              >
                Start Free Trial
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <button className="inline-flex items-center gap-2 text-ink font-semibold text-[15px] px-8 py-4 rounded-[10px] border-[1.5px] border-mist hover:bg-white hover:border-signal transition-all duration-200">
                <svg
                  className="w-4 h-4 text-signal"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch 2-min Demo
              </button>
            </motion.div>
            {/* Trust Badges */}
            <motion.div
              className="flex items-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.9 }}
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-mist flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  </div>
                ))}
              </div>
              <div className="text-[13px] text-[#64748B]">
                <span className="font-bold text-ink">Trusted by 500+ companies</span>
                <span className="mx-2">|</span>
                <span className="text-signal font-semibold">4.9/5 rating</span>
                <span className="mx-2">|</span>
                Setup in &lt;5min
              </div>
            </motion.div>
          </motion.div>

            {/* Right: Modern Hero Visual */}
            <motion.div
              className="relative hidden lg:flex justify-center items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="relative w-full max-w-[540px] aspect-square">
                {/* Decorative background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-blue-50/50 to-transparent blur-[80px] -z-10" />
                
                <svg viewBox="0 0 500 500" className="w-full h-full overflow-visible">
                  <defs>
                    <filter id="nodeShadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#1E293B" floodOpacity="0.08"/>
                    </filter>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
                      <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Connecting Lines with flow effect */}
                  <g>
                    {[
                      { x: 100, y: 150 },
                      { x: 400, y: 120 },
                      { x: 420, y: 350 },
                      { x: 80, y: 360 },
                      { x: 250, y: 80 },
                      { x: 250, y: 420 },
                    ].map((pos, i) => (
                      <g key={i}>
                        <motion.path
                          d={`M250,250 L${pos.x},${pos.y}`}
                          stroke="#E2E8F0"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                          fill="none"
                        />
                        <motion.circle
                          r="3"
                          fill="#3B82F6"
                          initial={{ offsetDistance: "0%" }}
                          animate={{ offsetDistance: "100%" }}
                          transition={{
                            duration: 3 + i,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 0.5
                          }}
                          style={{
                            offsetPath: `path('M250,250 L${pos.x},${pos.y}')`,
                          }}
                        />
                      </g>
                    ))}
                  </g>

                  {/* Central Node */}
                  <motion.g
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    filter="url(#nodeShadow)"
                  >
                    {/* Platform Base */}
                    <circle cx="250" cy="250" r="65" fill="white" />
                    <circle cx="250" cy="250" r="55" fill="#F8FAFC" />
                    
                    {/* Nia Logo Symbol */}
                    <g transform="translate(225, 225)">
                      <rect width="50" height="50" rx="12" fill="#2563EB" />
                      <path d="M15,15 L35,15 L35,35 L15,35 Z" fill="white" opacity="0.2" />
                      <path d="M20,20 L30,20 L30,30 L20,30 Z" fill="white" />
                      <motion.circle
                        cx="25" cy="25" r="15"
                        stroke="white" strokeWidth="2" fill="none"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </g>
                  </motion.g>

                  {/* Satellite Nodes */}
                  {[
                    { x: 100, y: 150, color: "#635BFF", label: "Stripe", delay: 0 },
                    { x: 400, y: 120, color: "#4A154B", label: "Slack", delay: 0.5 },
                    { x: 420, y: 350, color: "#00A1E0", label: "SF", delay: 1 },
                    { x: 80, y: 360, color: "#47A248", label: "Mongo", delay: 1.5 },
                    { x: 250, y: 80, color: "#EA4335", label: "Gmail", delay: 2 },
                    { x: 250, y: 420, color: "#336791", label: "SQL", delay: 2.5 },
                  ].map((node, i) => (
                    <motion.g
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        y: [0, i % 2 === 0 ? -12 : 12, 0]
                      }}
                      transition={{ 
                        opacity: { duration: 0.5, delay: 0.8 + i * 0.1 },
                        scale: { duration: 0.5, delay: 0.8 + i * 0.1 },
                        y: { duration: 3 + i, repeat: Infinity, ease: "easeInOut" }
                      }}
                      filter="url(#nodeShadow)"
                    >
                      <circle cx={node.x} cy={node.y} r="28" fill="white" />
                      <circle cx={node.x} cy={node.y} r="20" fill={node.color} opacity="0.1" />
                      <text
                        x={node.x}
                        y={node.y + 4}
                        textAnchor="middle"
                        className="font-sans font-bold text-[10px]"
                        fill={node.color}
                      >
                        {node.label}
                      </text>
                    </motion.g>
                  ))}
                </svg>

                {/* Floating Stats / Tags like in the image */}
                <motion.div
                  className="absolute top-[10%] left-0 bg-white/90 backdrop-blur-sm border border-mist p-3 rounded-xl shadow-card"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-[10px] font-mono text-ink">AI Agent Active</span>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute bottom-[15%] right-0 bg-white/90 backdrop-blur-sm border border-mist p-3 rounded-xl shadow-card"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-signal" />
                    <span className="text-[10px] font-mono text-ink">Syncing... 1.2k rps</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
        </div>

        {/* Trust Ticker - Added to match the image style */}
        <motion.div
          className="mt-24 pt-10 border-t border-mist/40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <p className="text-center text-[11px] font-bold text-[#94A3B8] uppercase tracking-[0.2em] mb-10">
            Trusted by teams at forward-thinking companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8 opacity-40 grayscale contrast-125">
            {tickerItems.slice(0, 6).map((item) => (
              <span key={item} className="font-sans text-xl lg:text-2xl font-black text-ink tracking-tighter italic">
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
