"use client";

import { motion } from "framer-motion";

export const ExplodedView = () => {
    return (
        <section className="py-24 bg-[#FAFAF9] border-y border-blue-50 overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between">

                {/* Left text */}
                <div className="lg:w-1/2 mb-16 lg:mb-0 lg:pr-12">
                    <span className="font-mono text-xs uppercase tracking-widest text-[#3B82F6] mb-4 block">Architecture</span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 font-sans tracking-tight">
                        The Three-Plane Architecture
                    </h2>
                    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                        Nia Connect separates concerns geographically. Your UI sits in the cloud, generating artifact SDKs that compile to the registry, which are then pulled down by the local execution plane.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] mt-2.5 mr-3 flex-shrink-0" />
                            <div>
                                <strong className="text-slate-900 font-mono text-sm block mb-1">Top: Control Plane</strong>
                                <span className="text-slate-600 text-sm">UI, AI generating code, and workflow orchestration logic.</span>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] mt-2.5 mr-3 flex-shrink-0" />
                            <div>
                                <strong className="text-slate-900 font-mono text-sm block mb-1">Middle: Artifact Registry</strong>
                                <span className="text-slate-600 text-sm">Compiled WASM modules stored perfectly versioned in the cloud.</span>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] mt-2.5 mr-3 flex-shrink-0" />
                            <div>
                                <strong className="text-slate-900 font-mono text-sm block mb-1">Bottom: Data Plane</strong>
                                <span className="text-slate-600 text-sm">Agents behind your firewall pulling WASM modules to execute safely locally.</span>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Right Exploded Isometric SVG */}
                <div className="lg:w-1/2 relative w-full h-[500px] flex items-center justify-center">
                    <svg viewBox="0 0 600 600" className="w-full h-full overflow-visible">
                        <g transform="translate(300, 150) scale(1, 0.5) rotate(45)">

                            {/* Layer 3: Data Plane (Bottom) */}
                            <motion.g
                                initial={{ y: 0 }}
                                whileInView={{ y: 200 }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                {/* Base Plate */}
                                <rect x="-120" y="-120" width="240" height="240" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="1.5" />
                                <rect x="-110" y="-110" width="220" height="220" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" opacity="0.3" />
                                {/* Nodes on plate */}
                                <rect x="-80" y="-80" width="40" height="40" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="1.5" />
                                <rect x="40" y="40" width="40" height="40" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="1.5" />
                                {/* Connecting wire */}
                                <path d="M-40,-60 L60,40" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4,4" />
                                {/* Label text placed in SVG perspective */}
                                <text transform="translate(-180, 130) rotate(-90)" fill="#7F92B0" fontSize="14" fontFamily="monospace" letterSpacing="2">LAYER 3: DATA PLANE</text>
                            </motion.g>

                            {/* Connecting Dashed Lines across layers */}
                            <motion.g
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 1.2 }}
                                viewport={{ once: true }}
                            >
                                <path d="M0,0 L0,-400" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="6,6" className="opacity-40" />
                                <path d="M-80,-80 L-80,-480" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="6,6" className="opacity-40" />
                                <path d="M80,80 L80,-320" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="6,6" className="opacity-40" />
                            </motion.g>

                            {/* Layer 2: Artifact Registry (Middle) */}
                            <motion.g
                                initial={{ y: 0 }}
                                whileInView={{ y: 100 }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                {/* Middle Plate */}
                                <rect x="-100" y="-100" width="200" height="200" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="1.5" />
                                <rect x="-90" y="-90" width="180" height="180" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4,4" />
                                {/* Artifact icon */}
                                <polygon points="0,-40 40,0 0,40 -40,0" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
                                <text transform="translate(-160, 110) rotate(-90)" fill="#7F92B0" fontSize="14" fontFamily="monospace" letterSpacing="2">LAYER 2: ARTIFACT REG.</text>
                            </motion.g>

                            {/* Layer 1: Control Plane (Top) */}
                            <motion.g
                                initial={{ y: 0 }}
                                whileInView={{ y: 0 }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <rect x="-120" y="-120" width="240" height="240" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="1.5" />
                                <rect x="-110" y="-110" width="220" height="220" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" opacity="0.1" />
                                {/* UI Elements */}
                                <rect x="-80" y="-80" width="160" height="30" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="1.5" />
                                <circle cx="-60" cy="-65" r="5" fill="#3B82F6" />
                                <circle cx="-40" cy="-65" r="5" fill="#3B82F6" opacity="0.5" />
                                <circle cx="-20" cy="-65" r="5" fill="#3B82F6" opacity="0.2" />
                                <rect x="-80" y="-30" width="70" height="100" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="1.5" />
                                <rect x="10" y="-30" width="70" height="100" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="1.5" />

                                <text transform="translate(-180, 130) rotate(-90)" fill="#7F92B0" fontSize="14" fontFamily="monospace" letterSpacing="2">LAYER 1: CONTROL PLANE</text>
                            </motion.g>

                        </g>
                    </svg>
                </div>

            </div>
        </section>
    );
};
