"use client";

import { motion, Variants } from "framer-motion";
import { AISDKNode, MiniConnectorNode, AggregatorNode, WasmSandboxNode } from "./isometric/Nodes";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const nodes = [
    {
        title: "AI-SDK Generation",
        description: "Automated generation of TypeScript SDKs compiled to WASM. Built instantly from OpenAPI specs.",
        Icon: AISDKNode,
    },
    {
        title: "The Aggregator",
        description: "Multi-stream data collection routing into a secure, unified execution pipeline.",
        Icon: AggregatorNode,
    },
    {
        title: "The Mini-Connector",
        description: "Lightweight, firewall-friendly on-premise agent connecting local databases to the cloud.",
        Icon: MiniConnectorNode,
    },
    {
        title: "WASM Sandbox",
        description: "Hexagonal glass-shielded execution environment guaranteeing 100% secure computations.",
        Icon: WasmSandboxNode,
    }
];

export const ProcessGrid = () => {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4 font-sans tracking-tight">Isolated, AI-Generated Nodes</h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        The fundamental building blocks of the Nia Connect ecosystem, designed for maximum security and composability.
                    </p>
                </div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {nodes.map((node, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="group relative bg-[#FAFAF9] rounded-xl border border-blue-100 p-8 hover:shadow-sm hover:border-blue-200 transition-colors"
                        >
                            {/* Isometric SVG Container floating effect */}
                            <motion.div
                                className="w-full h-48 mb-6"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
                            >
                                <node.Icon />
                            </motion.div>

                            <h3 className="text-xl font-semibold text-slate-900 mb-2 font-mono tracking-tight">{node.title}</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                {node.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
