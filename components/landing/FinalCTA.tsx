"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export const FinalCTA = () => {
  return (
    <section className="py-24 bg-canvas relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 blueprint-grid opacity-20" />
      
      <div className="max-w-5xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-signal rounded-[40px] p-12 lg:p-20 text-center text-white shadow-2xl relative overflow-hidden"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-ink/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <h2 className="text-[42px] lg:text-[56px] font-extrabold leading-[1.1] mb-8 relative z-10">
            Ready to Transform Your <br className="hidden md:block" /> Data Integration?
          </h2>
          
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-12 relative z-10">
            Join 500+ companies that have reduced integration costs by 95% and deployment time by 99% with Nia Connect.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 relative z-10">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto bg-white text-signal hover:bg-mist transition-colors font-bold text-lg px-8 py-5 rounded-2xl flex items-center justify-center gap-2 group"
            >
              Start Your Free 14-Day Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              className="w-full sm:w-auto bg-ink/20 hover:bg-ink/30 transition-colors text-white font-bold text-lg px-8 py-5 rounded-2xl border border-white/20"
            >
              Schedule Personal Demo
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {[
              "No credit card required",
              "Full feature access",
              "Cancel anytime",
              "Setup in <5 minutes"
            ].map((text) => (
              <div key={text} className="flex items-center justify-center gap-2 text-white/70 text-sm">
                <Check className="w-4 h-4 text-white" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="mt-16 flex flex-wrap justify-center gap-x-12 gap-y-6 text-[#64748B] font-medium">
          <Link href="mailto:sales@niaconnect.com" className="hover:text-signal transition-colors flex items-center gap-2">
            sales@niaconnect.com
          </Link>
          <Link href="tel:1800CONNECT" className="hover:text-signal transition-colors flex items-center gap-2">
            1-800-CONNECT
          </Link>
          <Link href="/chat" className="hover:text-signal transition-colors flex items-center gap-2">
            Live Chat
          </Link>
        </div>
      </div>
    </section>
  );
};
