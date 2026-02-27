"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "AI Connector Generation",
    description: "Claude AI reads your documentation and automatically generates TypeScript SDKs, compiled to secure WASM for immediate execution.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12">
        <circle cx="24" cy="24" r="16" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
        <path d="M 24 12 L 24 20 M 24 28 L 24 36 M 12 24 L 20 24 M 28 24 L 36 24" stroke="#3B82F6" strokeWidth="1.5" />
        <circle cx="24" cy="24" r="4" fill="#3B82F6" />
      </svg>
    ),
  },
  {
    title: "Enterprise Security",
    description: "4-layer READ-ONLY enforcement with machine-specific AES-256-GCM encryption and comprehensive audit trails for every operation.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12">
        <path d="M 24 6 L 38 16 L 38 32 L 24 42 L 10 32 L 10 16 Z" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
        <path d="M 24 12 L 24 22" stroke="#3B82F6" strokeWidth="1.5" />
        <path d="M 18 17 L 24 22 L 30 17" stroke="#3B82F6" strokeWidth="1.5" fill="none" />
      </svg>
    ),
  },
  {
    title: "On-Premise Friendly",
    description: "Firewall-friendly design using outbound-only WebSocket connections. No inbound ports, no static IPs, and no IT approval nightmares.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12">
        <ellipse cx="24" cy="30" rx="16" ry="6" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
        <circle cx="24" cy="20" r="6" fill="#3B82F6" />
      </svg>
    ),
  },
  {
    title: "Visual Workflow Designer",
    description: "Drag-and-drop interface for building complex data pipelines. Transform, filter, and join data across disparate systems without writing code.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12">
        <rect x="8" y="14" width="32" height="20" rx="2" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
        <path d="M 14 24 L 34 24" stroke="#3B82F6" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "Universal Integration",
    description: "Connect to 500+ pre-built systems or any custom API. Support for MySQL, PostgreSQL, SQL Server, SAP, Salesforce, and legacy ERPs.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12">
        <circle cx="14" cy="24" r="3" fill="#3B82F6" />
        <circle cx="24" cy="24" r="3" fill="#3B82F6" />
        <circle cx="34" cy="24" r="3" fill="#3B82F6" />
        <path d="M 8 20 L 4 20 M 40 20 L 44 20" stroke="#3B82F6" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Compliance Ready",
    description: "HIPAA, GDPR, and SOC 2 ready infrastructure. Maintain strict data governance with user-created protected endpoints and audit logging.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12">
        <rect x="12" y="12" width="24" height="24" rx="2" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
        <path d="M 18 24 L 22 28 L 30 20" stroke="#3B82F6" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    title: "Multi-Tenant Engine",
    description: "Tier-based resource allocation with complete data isolation. Designed for scale with BullMQ sharding and backpressure control.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12">
        <rect x="10" y="10" width="12" height="12" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
        <rect x="26" y="10" width="12" height="12" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
        <rect x="10" y="26" width="12" height="12" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
        <rect x="26" y="26" width="12" height="12" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Advanced Analytics",
    description: "Real-time monitoring of every workflow. Track performance, error rates, and data throughput with granular observability.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12">
        <path d="M 8 40 L 40 40 M 8 40 L 8 8" stroke="#3B82F6" strokeWidth="1.5" />
        <path d="M 12 32 L 20 20 L 28 28 L 38 12" stroke="#3B82F6" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    title: "Lightning Fast",
    description: "Connect systems in minutes, not months. 99.9% uptime with ultra-low latency data transfer and temporary encrypted buffering.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12">
        <path d="M 28 4 L 14 26 L 22 26 L 18 44 L 34 18 L 26 18 Z" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
      </svg>
    ),
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-20 bg-white">
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
            Features
          </span>
          <h2 className="font-sans text-section font-bold text-ink">
            The Six Pillars
          </h2>
        </motion.div>

        {/* Features Grid - 3x2 with shared borders */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative bg-white border border-mist p-9 transition-all duration-250 hover:bg-[#F0F8FF]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ 
                borderColor: '#2463EB',
                transition: { duration: 0.25 }
              }}
              style={{
                borderRight: (index + 1) % 3 !== 0 ? 'none' : undefined,
                borderBottom: index < 3 ? 'none' : undefined,
              }}
            >
              {/* Icon */}
              <div className="mb-5 text-signal">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="font-sans text-lg font-semibold text-ink mb-2">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-[14px] text-[#64748B] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
