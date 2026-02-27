"use client";

import { motion } from "framer-motion";
import { Terminal, Cpu, Database, ArrowRight } from "lucide-react";
import { useState } from "react";

const steps = [
  {
    title: "1. AI Documentation Scan",
    description: "Simply paste your API documentation URL. Claude AI reads and understands the entire schema, including complex auth flows.",
    icon: <Terminal className="w-6 h-6" />,
    preview: (
      <div className="bg-[#0D1117] rounded-xl p-6 font-mono text-[13px] text-white/80 shadow-2xl border border-white/10">
        <div className="flex gap-2 mb-4 opacity-50">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="space-y-2">
          <p className="text-signal">$ nia-ai scan https://api.sap.com/docs</p>
          <p className="text-emerald-400">✓ Found 142 endpoints</p>
          <p className="text-emerald-400">✓ Analyzed OData structures</p>
          <p className="text-emerald-400">✓ Generating TypeScript SDK...</p>
          <div className="w-full bg-white/10 h-1 rounded-full mt-4 overflow-hidden">
            <motion.div 
              className="bg-signal h-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </div>
      </div>
    )
  },
  {
    title: "2. WASM Compilation",
    description: "The generated SDK is automatically compiled into a secure WebAssembly sandbox, ensuring lightning-fast execution and zero-trust security.",
    icon: <Cpu className="w-6 h-6" />,
    preview: (
      <div className="relative">
        <div className="absolute inset-0 bg-signal/20 blur-3xl rounded-full" />
        <div className="bg-white rounded-2xl p-8 border border-mist shadow-xl relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-signal flex items-center justify-center text-white mb-6">
            <Cpu className="w-10 h-10" />
          </div>
          <div className="text-center">
            <div className="font-bold text-ink mb-1">connector_sdk.wasm</div>
            <div className="text-xs text-[#64748B] font-mono">Size: 1.2MB | Optimization: Level 3</div>
            <div className="mt-4 flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              COMPILED & READY
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "3. Visual Orchestration",
    description: "Drag and drop your new connector into any workflow. Map data, apply filters, and join with other systems in real-time.",
    icon: <Database className="w-6 h-6" />,
    preview: (
      <div className="bg-canvas rounded-2xl p-4 border border-mist shadow-lg aspect-video overflow-hidden relative">
        <div className="absolute inset-0 blueprint-grid-secondary opacity-50" />
        <div className="relative flex items-center justify-between h-full px-8">
            <div className="w-24 h-16 bg-white border border-mist rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-[10px] font-bold text-ink">SAP ERP</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-signal to-emerald-500 relative mx-4">
                <motion.div 
                    className="absolute -top-1 w-2 h-2 rounded-full bg-signal"
                    animate={{ left: ["0%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
            </div>
            <div className="w-24 h-16 bg-white border-2 border-signal rounded-xl flex items-center justify-center shadow-md">
                <span className="text-[10px] font-bold text-signal">Transform</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-emerald-500 to-purple-500 relative mx-4">
                <motion.div 
                    className="absolute -top-1 w-2 h-2 rounded-full bg-emerald-500"
                    animate={{ left: ["0%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
                />
            </div>
            <div className="w-24 h-16 bg-white border border-mist rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-[10px] font-bold text-ink">Salesforce</span>
            </div>
        </div>
      </div>
    )
  }
];

export const InteractiveDemo = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[42px] font-bold text-ink mb-6"
          >
            How it works
          </motion.h2>
          <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
            From documentation to production deployment in three simple steps.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            {steps.map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onMouseEnter={() => setActiveStep(idx)}
                className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  activeStep === idx 
                    ? 'bg-canvas border-signal shadow-lg translate-x-2' 
                    : 'bg-white border-mist hover:border-signalLight'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                  activeStep === idx ? 'bg-signal text-white' : 'bg-canvas text-[#64748B]'
                }`}>
                  {step.icon}
                </div>
                <h3 className={`text-xl font-bold mb-2 transition-colors ${
                  activeStep === idx ? 'text-signal' : 'text-ink'
                }`}>
                  {step.title}
                </h3>
                <p className="text-[#64748B] text-[15px] leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="relative min-h-[400px] flex items-center justify-center">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                animate={{ 
                  opacity: activeStep === idx ? 1 : 0,
                  scale: activeStep === idx ? 1 : 0.9,
                  rotateY: activeStep === idx ? 0 : 20,
                  pointerEvents: activeStep === idx ? 'auto' : 'none'
                }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-full">
                  {step.preview}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-20 text-center">
            <button className="bg-signal text-white font-bold py-4 px-10 rounded-2xl hover:bg-signalDark transition-all shadow-xl shadow-signal/20 flex items-center gap-2 mx-auto">
                Try it for yourself <ArrowRight className="w-5 h-5" />
            </button>
        </div>
      </div>
    </section>
  );
};
