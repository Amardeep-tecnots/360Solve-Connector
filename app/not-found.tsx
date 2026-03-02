"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  
  const terminalLines = [
    { text: "$ nia route:resolve [current_path]", type: "command" },
    { text: "✗ NODE_NOT_FOUND: route not in registry", type: "error" },
    { text: "status: 404 · code: ROUTE_UNREGISTERED", type: "info" },
    { text: "suggestion: did you mean /dashboard ?", type: "info" },
    { text: "$ nia route:list --available", type: "command" },
    { text: "→ / · /dashboard · /docs · /pricing", type: "success" },
  ];

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    terminalLines.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setVisibleLines(prev => [...prev, index]);
      }, index * 150);
      timeouts.push(timeout);
    });
    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center selection:bg-[#DBEAFE] selection:text-[#3B82F6] px-6 relative overflow-hidden">
      
      {/* Ghost 404 Numeral Background */}
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[240px] font-sans font-extrabold text-[#F0EEE9] leading-none select-none pointer-events-none z-0">
        404
      </span>

      {/* Broken Pipeline SVG Illustration */}
      <motion.div
        className="w-full max-w-md mb-10 relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <svg viewBox="0 0 400 240" className="w-full h-full overflow-visible">
          {/* Connection path - broken */}
          <path 
            d="M 60 120 L 180 120" 
            stroke="#E8EBF0" 
            strokeWidth="2" 
            fill="none"
          />
          <path 
            d="M 220 120 L 340 120" 
            stroke="#E8EBF0" 
            strokeWidth="2" 
            fill="none"
          />

          {/* SOURCE Node - Blue Cube */}
          <g transform="translate(30, 70)">
            {/* Shadow */}
            <ellipse cx="30" cy="75" rx="30" ry="8" fill="#CBD5E1" opacity="0.3" />
            {/* Top face */}
            <path d="M 30 20 L 55 30 L 30 40 L 5 30 Z" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
            {/* Left face */}
            <path d="M 5 30 L 30 40 L 30 65 L 5 55 Z" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
            {/* Right face */}
            <path d="M 30 40 L 55 30 L 55 55 L 30 65 Z" fill="#BFDBFE" stroke="#3B82F6" strokeWidth="1.5" />
            {/* Cable */}
            <path d="M 55 45 L 60 45" stroke="#3B82F6" strokeWidth="2" />
          </g>

          {/* ERROR Node - Red Circle with glow */}
            <g transform="translate(200, 95)">
              {/* Glow effect */}
              <motion.circle 
                cx="0" 
                cy="10" 
                r="24" 
                fill="#FCA5A5" 
                opacity="0.3"
                animate={{ r: [20, 28, 20] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              {/* Main circle */}
            <motion.circle 
              cx="0" 
              cy="10" 
              r="20" 
              fill="#FEF2F2" 
              stroke="#FECACA" 
              strokeWidth="1.5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            />
            {/* X mark */}
            <g>
              <line x1="-8" y1="2" x2="8" y2="18" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="8" y1="2" x2="-8" y2="18" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
            </g>
            {/* Spark particles */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <motion.path
                key={i}
                d={`M ${Math.cos(angle * Math.PI / 180) * 25} ${10 + Math.sin(angle * Math.PI / 180) * 25} L ${Math.cos((angle + 30) * Math.PI / 180) * 32} ${10 + Math.sin((angle + 30) * Math.PI / 180) * 32}`}
                stroke="#F59E0B"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1, repeat: Infinity }}
              />
            ))}
          </g>

          {/* DEST Node - Error state cube */}
          <g transform="translate(310, 70)" style={{ rotate: '-2deg' }}>
            {/* Shadow */}
            <ellipse cx="30" cy="75" rx="30" ry="8" fill="#CBD5E1" opacity="0.3" />
            {/* Top face */}
            <path d="M 30 20 L 55 30 L 30 40 L 5 30 Z" fill="#FFF1F2" stroke="#F87171" strokeWidth="1.5" />
            {/* Left face */}
            <path d="M 5 30 L 30 40 L 30 65 L 5 55 Z" fill="#FEE2E2" stroke="#F87171" strokeWidth="1.5" />
            {/* Right face */}
            <path d="M 30 40 L 55 30 L 55 55 L 30 65 Z" fill="#FECACA" stroke="#F87171" strokeWidth="1.5" />
            {/* Cable from error */}
            <path d="M -20 45 L 5 45" stroke="#F87171" strokeWidth="2" />
          </g>

          {/* Orphaned floating nodes */}
          <g transform="translate(100, 40)">
            <motion.rect
              x="0" y="0" width="20" height="20"
              fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1"
              opacity="0.4"
              animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </g>
          <g transform="translate(280, 50)">
            <motion.rect
              x="0" y="0" width="16" height="16"
              fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1"
              opacity="0.4"
              animate={{ y: [0, -10, 0], x: [0, -5, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </g>
          <g transform="translate(160, 180)">
            <motion.rect
              x="0" y="0" width="18" height="18"
              fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1"
              opacity="0.4"
              animate={{ y: [0, -6, 0], x: [0, 6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </g>
        </svg>
      </motion.div>

      {/* Typography */}
      <div className="text-center relative z-10 max-w-md">
        {/* Eyebrow */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="w-4 h-[1.5px] bg-[#EF4444]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#EF4444] font-medium">
            Connection Error
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-sans text-[42px] lg:text-[56px] font-extrabold text-ink tracking-tight mb-4"
          style={{ letterSpacing: "-0.03em" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          This node doesn't exist.
        </motion.h1>

        {/* Sub-copy */}
        <motion.p
          className="text-[17px] text-[#64748B] mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          The execution path you are looking for does not exist in the current workflow registry.
        </motion.p>

        {/* Terminal Card */}
        <motion.div
          className="bg-[#FFF8F8] border border-[#FECACA] rounded-lg p-4 mb-8 text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <div className="border-b border-[#FECACA] pb-2 mb-2">
            <span className="font-mono text-xs text-[#EF4444]">Error Details</span>
          </div>
          <div className="font-mono text-[13px] space-y-1">
            {terminalLines.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: visibleLines.includes(index) ? 1 : 0,
                  x: visibleLines.includes(index) ? 0 : -10
                }}
                transition={{ duration: 0.15 }}
              >
                {line.type === "command" && (
                  <span className="text-[#64748B]">{line.text}</span>
                )}
                {line.type === "error" && (
                  <span className="text-[#EF4444]">{line.text}</span>
                )}
                {line.type === "info" && (
                  <span className="text-[#64748B]">{line.text}</span>
                )}
                {line.type === "success" && (
                  <span className="text-[#22C55E]">{line.text}</span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <Link
            href="/"
            className="bg-signal text-white font-semibold text-[15px] px-6 py-3 rounded-[10px] hover:bg-signalDark hover:shadow-[0_0_0_4px_rgba(36,99,235,0.12)] transition-all duration-200"
          >
            Return home
          </Link>
          <button className="text-signal font-semibold text-[15px] px-6 py-3 rounded-[10px] border-[1.5px] border-signal hover:bg-[#F0F8FF] transition-colors duration-200">
            Open dashboard
          </button>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          className="flex items-center justify-center gap-3 text-xs font-mono text-[#64748B]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span className="text-mist">·</span>
          <Link href="/dashboard" className="hover:text-ink transition-colors">Dashboard</Link>
          <span className="text-mist">·</span>
          <Link href="/docs" className="hover:text-ink transition-colors">Docs</Link>
          <span className="text-mist">·</span>
          <Link href="/pricing" className="hover:text-ink transition-colors">Pricing</Link>
        </motion.div>
      </div>

      {/* Footer Strip - All Systems Operational */}
      <motion.div
        className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]">
          <motion.span
            className="block w-1.5 h-1.5 rounded-full bg-[#22C55E]"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </span>
        <span className="font-mono text-[12px] text-[#22C55E]">
          All systems operational
        </span>
      </motion.div>
    </div>
  );
}
