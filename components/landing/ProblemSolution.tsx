"use client";

import { motion } from "framer-motion";
import { XCircle, CheckCircle2, ArrowRight } from "lucide-react";

export const ProblemSolution = () => {
  return (
    <section className="py-24 bg-ink relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Nightmare side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-[32px] font-bold text-white mb-8">
              The Integration Nightmare
            </h2>
            <div className="space-y-6">
              {[
                "$50,000 per custom connector",
                "2-3 months development time",
                "Total developer dependency",
                "On-premise systems inaccessible",
                "Constant maintenance & breaking APIs",
              ].map((item) => (
                <div key={item} className="flex items-center gap-4 text-red-400">
                  <XCircle className="w-6 h-6 shrink-0" />
                  <span className="text-lg font-medium opacity-80">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Solution side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#1E293B] p-10 rounded-[32px] border border-white/10 relative"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-signal/10 rounded-[32px] blur-2xl -z-10" />
            
            <h2 className="text-[32px] font-bold text-white mb-8 flex items-center gap-3">
              The <span className="text-signal">Nia Connect</span> Solution
            </h2>
            <div className="space-y-6">
              {[
                "$0 development cost + $29/mo",
                "30 minutes initial setup",
                "Intuitive no-code interface",
                "Firewall-friendly on-prem access",
                "Universal AI-powered platform",
              ].map((item) => (
                <div key={item} className="flex items-center gap-4 text-emerald-400">
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                  <span className="text-lg font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-white/60 mb-6 italic">
                "Reduced our integration time from 6 months to 2 hours while saving us $250,000 in development costs."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-signal/20 flex items-center justify-center">
                  <span className="text-signal font-bold">SC</span>
                </div>
                <div>
                  <div className="text-white font-bold">Sarah Chen</div>
                  <div className="text-white/40 text-sm">CTO, TechCorp</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-20 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 text-signal hover:text-signalLight transition-colors cursor-pointer group font-bold text-lg"
            >
                See how we transform your business <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.div>
        </div>
      </div>
    </section>
  );
};
