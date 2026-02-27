"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const terminalLines = [
  { text: "$ nia init --template=api-sync", type: "command" },
  { text: "✓ Project initialized", type: "success" },
  { text: "$ nia generate sdk --source=openapi.json", type: "command" },
  { text: "→ Analyzing OpenAPI spec...", type: "info" },
  { text: "→ Generating TypeScript types...", type: "info" },
  { text: "→ Compiling to WASM...", type: "info" },
  { text: "✓ SDK generated (234KB)", type: "success" },
  { text: "$ nia deploy --target=mini-connector", type: "command" },
];

export const SDKSection = () => {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate terminal lines appearing
    const timeouts: NodeJS.Timeout[] = [];
    
    terminalLines.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setVisibleLines(prev => [...prev, index]);
      }, index * 400);
      timeouts.push(timeout);
    });

    // Animate progress bar after lines start appearing
    const progressTimeout = setTimeout(() => {
      setProgress(78);
    }, 800);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(progressTimeout);
    };
  }, []);

  return (
    <section className="py-20 bg-canvas">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-signal font-medium mb-4 block">
            Developer Experience
          </span>
          <h2 className="font-sans text-section font-bold text-ink">
            Code at the speed of thought
          </h2>
        </motion.div>

        {/* Terminal Panel */}
        <motion.div
          className="bg-[#0D1117] rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#161B22] border-b border-[#30363D]">
            <div className="w-3 h-3 rounded-full bg-[#F87171]" />
            <div className="w-3 h-3 rounded-full bg-[#FBBF24]" />
            <div className="w-3 h-3 rounded-full bg-[#34D399]" />
            <span className="ml-3 font-mono text-xs text-[#8B949E]">nia — generate-sdk</span>
          </div>

          {/* Terminal Content */}
          <div className="p-6 font-mono text-sm min-h-[320px]">
            {terminalLines.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: visibleLines.includes(index) ? 1 : 0,
                  x: visibleLines.includes(index) ? 0 : -10
                }}
                transition={{ duration: 0.3 }}
                className="mb-2"
              >
                {line.type === "command" && (
                  <span className="text-[#8B949E]">{line.text}</span>
                )}
                {line.type === "success" && (
                  <span className="text-[#34D399]">✓ {line.text.replace("✓ ", "")}</span>
                )}
                {line.type === "info" && (
                  <span className="text-[#58A6FF]">→ {line.text.replace("→ ", "")}</span>
                )}
                {visibleLines.includes(index) && index < terminalLines.length - 2 && (
                  <span className="inline-block w-2 h-4 bg-[#8B949E] ml-1 animate-blink" />
                )}
              </motion.div>
            ))}

            {/* Progress Bar */}
            {visibleLines.length >= terminalLines.length && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[#8B949E] text-xs">Deploying to Mini Connector...</span>
                  <span className="text-[#58A6FF] text-xs">{progress}%</span>
                </div>
                <div className="h-1.5 bg-[#21262D] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: "linear-gradient(90deg, #2463EB 0%, #60A5FA 100%)",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 2.8, ease: [0.4, 0, 0.1, 1] }}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SDKSection;
