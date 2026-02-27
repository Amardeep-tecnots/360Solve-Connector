"use client";

import { useEffect, useState } from "react";

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-canvas relative overflow-x-hidden">
            {/* Blueprint Grid Background */}
            <div 
                className="fixed inset-0 pointer-events-none blueprint-grid opacity-40"
                style={{ 
                    transform: `translateY(${scrollY * 0.02}px)`,
                    willChange: 'transform'
                }}
            />
            {/* Secondary grid (subtle) */}
            <div 
                className="fixed inset-0 pointer-events-none blueprint-grid-secondary opacity-60"
                style={{ 
                    transform: `translateY(${scrollY * 0.02}px)`,
                    willChange: 'transform'
                }}
            />
            
            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}
