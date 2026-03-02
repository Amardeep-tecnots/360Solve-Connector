"use client";

import { motion } from "framer-motion";
import { Database, Shield, Cpu, Zap, Lock, Globe } from "lucide-react";

const techItems = [
  { name: "NestJS", type: "Backend" },
  { name: "TypeScript", type: "Language" },
  { name: "PostgreSQL", type: "Database" },
  { name: "Redis", type: "Caching" },
  { name: "BullMQ", type: "Queuing" },
  { name: "Electron", type: "Desktop" },
  { name: "React", type: "Frontend" },
  { name: "WebSocket", type: "Real-time" },
  { name: "S3", type: "Storage" },
  { name: "WASM", type: "Runtime" },
];

export const TechnicalCredibility = () => {
  return (
    <section className="py-24 bg-canvas border-y border-mist relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[42px] font-bold text-ink mb-6"
          >
            Enterprise-Grade Infrastructure
          </motion.h2>
          <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
            Built with the world's most reliable technologies to ensure your data is always safe, secure, and available.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: <Shield className="w-6 h-6" />,
              title: "4-Layer Security",
              description: "Read-only enforcement at AI, WASM, Connector, and Database layers."
            },
            {
              icon: <Lock className="w-6 h-6" />,
              title: "Hardware Encryption",
              description: "Machine-specific AES-256-GCM encryption for all stored credentials."
            },
            {
              icon: <Globe className="w-6 h-6" />,
              title: "Firewall Friendly",
              description: "Outbound-only WebSocket connections. No static IP or inbound rules needed."
            },
            {
              icon: <Cpu className="w-6 h-6" />,
              title: "WASM Sandbox",
              description: "Generated code executes in a secure WebAssembly sandbox with restricted permissions."
            },
            {
              icon: <Zap className="w-6 h-6" />,
              title: "99.9% Uptime SLA",
              description: "Enterprise-grade reliability with automatic failover and status monitoring."
            },
            {
              icon: <Database className="w-6 h-6" />,
              title: "Multi-Tenant Isolation",
              description: "Complete schema-level isolation for every tenant with tier-based resources."
            }
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="p-8 bg-white border border-mist rounded-2xl hover:border-signal transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-canvas flex items-center justify-center text-signal mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-ink mb-3">{item.title}</h3>
              <p className="text-[#64748B] text-[15px] leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack Ticker */}
        <div className="pt-12 border-t border-mist">
          <p className="text-center text-sm font-mono uppercase tracking-widest text-[#94A3B8] mb-10">
            OUR TECHNOLOGY STACK
          </p>
          <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
            {techItems.map((item) => (
              <div key={item.name} className="flex flex-col items-center">
                <span className="text-lg font-bold text-[#475569]">{item.name}</span>
                <span className="text-[10px] font-mono text-signal uppercase tracking-tighter">{item.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
