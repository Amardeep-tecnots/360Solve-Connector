"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "FREE",
    description: "Perfect for exploring Nia Connect's capabilities.",
    features: [
      "3 automated workflows",
      "1 system connector",
      "Basic AI mapping",
      "Community support",
      "Standard security",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Professional",
    price: "$29/month",
    description: "Ideal for growing businesses with multiple systems.",
    features: [
      "20 automated workflows",
      "10 system connectors",
      "Full AI SDK Generator",
      "Priority email/chat support",
      "Advanced error tracking",
      "24-hour data buffer",
    ],
    cta: "Start Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations requiring maximum scale and control.",
    features: [
      "Unlimited workflows",
      "Unlimited connectors",
      "Custom AI model training",
      "Dedicated account manager",
      "White-label options",
      "SLA guarantees",
      "On-premise deployment",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-canvas relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-signal/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[42px] font-bold text-ink mb-6"
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[#64748B]"
          >
            Start for free and scale as you grow. No hidden fees, no complexity.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative bg-white p-8 rounded-2xl border ${
                tier.popular ? 'border-signal ring-4 ring-signal/5 shadow-xl' : 'border-mist'
              } flex flex-col`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-signal text-white text-[12px] font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-ink mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-extrabold text-ink">{tier.price}</span>
                  {tier.price !== "FREE" && tier.price !== "Custom" && (
                    <span className="text-sm text-[#64748B]">/month</span>
                  )}
                </div>
                <p className="text-sm text-[#64748B]">{tier.description}</p>
              </div>

              <div className="space-y-4 mb-8 flex-grow">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-signal/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-signal" />
                    </div>
                    <span className="text-[15px] text-[#475569]">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-200 ${
                  tier.popular 
                    ? 'bg-signal text-white hover:bg-signalDark hover:shadow-lg' 
                    : 'bg-canvas text-ink border border-mist hover:border-signal hover:bg-white'
                }`}
              >
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
