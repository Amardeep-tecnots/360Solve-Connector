"use client";

import React from "react";

// Colors: Primary #3B82F6, Secondary #DBEAFE, Background #FFFFFF
// Isometric SVG Transformation is typically better done geometrically or via SVG transforms.
// For these, we will use a base SVG with a transform matrix to create the authentic 30-degree isometric feel,
// combined with precise strokes.

const strokeColor = "#3B82F6";
const fillColor = "#DBEAFE";
const strokeWidth = 1.5;

// Wrapping SVG with standard Isometric Projection
export const IsometricContainer = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <svg
        viewBox="0 0 400 400"
        className={`w-full h-full ${className}`}
        style={{ overflow: "visible" }}
    >
        <g transform="translate(200, 100) scale(1, 0.5) rotate(45)">
            {children}
        </g>
    </svg>
);

export const AISDKNode = () => {
    return (
        <IsometricContainer>
            {/* Document Base */}
            <rect x="-80" y="-80" width="160" height="160" rx="4" fill="#FFFFFF" stroke={strokeColor} strokeWidth={strokeWidth} />

            {/* Folded corner */}
            <polygon points="40,-80 80,-40 80,-80" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />

            {/* Grid of code lines projected upwards - achieved by standard lines since it's already in transform */}
            <g opacity="0.6">
                {[...Array(5)].map((_, i) => (
                    <line key={i} x1="-50" y1={-40 + i * 20} x2="40" y2={-40 + i * 20} stroke={strokeColor} strokeWidth="1" strokeDasharray="4, 4" />
                ))}
                {/* Glow spark */}
                <circle cx="0" cy="0" r="12" fill={strokeColor} opacity="0.8" />
                <circle cx="0" cy="0" r="24" fill={strokeColor} opacity="0.2" className="animate-pulse" />
            </g>

            {/* Circuit lines */}
            <path d="M-60,-20 L-40,-20 L-20,0 L0,0" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            <path d="M60,40 L40,40 L20,20 L0,20" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
        </IsometricContainer>
    );
};

export const MiniConnectorNode = () => {
    return (
        <IsometricContainer>
            {/* Database Cylinder (rendered pseudo-3D inside the isometric transform) */}
            <g transform="translate(60, -60)">
                <ellipse cx="0" cy="-40" rx="40" ry="40" fill="#FFFFFF" stroke={strokeColor} strokeWidth={strokeWidth} />
                <path d="M-40,-40 L-40,40 A40,40 0 0,0 40,40 L40,-40" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} opacity="0.5" />
                <line x1="-40" y1="0" x2="40" y2="0" stroke={strokeColor} strokeWidth={strokeWidth} opacity="0.3" />
            </g>

            {/* Dashed Connection Line */}
            <line x1="-30" y1="30" x2="60" y2="-60" stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray="6, 4" className="animate-[dash_1s_linear_infinite]" />

            {/* Modular Cube */}
            <g transform="translate(-50, 50)">
                <rect x="-30" y="-30" width="60" height="60" fill="#FFFFFF" stroke={strokeColor} strokeWidth={strokeWidth} />
                <rect x="-20" y="-20" width="40" height="40" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} opacity="0.5" />
                {/* Port */}
                <circle cx="10" cy="-10" r="8" fill="#FFFFFF" stroke={strokeColor} strokeWidth={strokeWidth} />
            </g>
        </IsometricContainer>
    );
};

export const AggregatorNode = () => {
    return (
        <IsometricContainer>
            {/* Three paths */}
            <path d="M-100,-100 L0,0" stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray="4,4" opacity="0.5" />
            <path d="M100,-100 L0,0" stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray="4,4" opacity="0.5" />
            <path d="M-100,100 L0,0" stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray="4,4" opacity="0.5" />

            {/* Moving data packets (cubes represented as rects in isometric) */}
            <rect x="-70" y="-70" width="16" height="16" fill={strokeColor} />
            <rect x="54" y="-70" width="16" height="16" fill={strokeColor} />
            <rect x="-70" y="54" width="16" height="16" fill={strokeColor} />

            {/* Central Collector Sphere */}
            <circle cx="0" cy="0" r="30" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} opacity="0.8" />
            <circle cx="0" cy="0" r="15" fill="#FFFFFF" stroke={strokeColor} strokeWidth={strokeWidth} />
        </IsometricContainer>
    );
};

export const WasmSandboxNode = () => {
    return (
        <IsometricContainer>
            {/* Hexagonal Shield */}
            <polygon
                points="0,-60 52,-30 52,30 0,60 -52,30 -52,-30"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                opacity="0.3"
            />
            <polygon
                points="0,-80 70,-40 70,40 0,80 -70,40 -70,-40"
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray="8,4"
                opacity="0.6"
            />

            {/* Inner Data Packet */}
            <rect x="-20" y="-20" width="40" height="40" fill="#FFFFFF" stroke={strokeColor} strokeWidth={strokeWidth} />
            <circle cx="0" cy="0" r="8" fill={strokeColor} />
        </IsometricContainer>
    );
};
