import type { Config } from "tailwindcss"
import tailwindcssAnimate from "tailwindcss-animate"

const config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nia Connect Design System
        canvas: "#F8F7F4",
        ink: "#0D1117",
        signal: "#2463EB",
        signalLight: "#93C5FD",
        signalDark: "#1D4ED8",
        mist: "#E8EBF0",
        mistLight: "#F0F2F5",
        
        // Semantic additions
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          border: "hsl(var(--sidebar-border))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          ring: "hsl(var(--sidebar-ring))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        sans: ["var(--font-sora)", "system-ui", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "hero": ["80px", { lineHeight: "1.05", letterSpacing: "-0.04em", fontWeight: "800" }],
        "section": ["52px", { lineHeight: "1.15", letterSpacing: "-0.025em", fontWeight: "700" }],
        "card": ["18px", { lineHeight: "1.4", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body": ["17px", { lineHeight: "1.75", fontWeight: "400" }],
        "mono-label": ["11px", { letterSpacing: "0.08em", fontWeight: "500" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "28": "7rem",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "20px",
      },
      boxShadow: {
        "card": "0 4px 48px rgba(13,17,23,0.07), 0 1px 4px rgba(13,17,23,0.04)",
        "card-hover": "0 8px 56px rgba(13,17,23,0.1), 0 2px 8px rgba(13,17,23,0.06)",
      },
      animation: {
        "grid-pulse": "gridPulse 800ms ease-out",
        "data-flow-1": "dataFlow1 2.4s ease-in-out infinite",
        "data-flow-2": "dataFlow2 3s ease-in-out infinite",
        "data-flow-3": "dataFlow3 2.8s ease-in-out infinite",
        "float-1": "float1 3s ease-in-out infinite",
        "float-2": "float2 4.5s ease-in-out infinite",
        "float-3": "float3 6s ease-in-out infinite",
        "breathe": "breathe 2.2s ease-in-out infinite",
        "pulse-dot": "pulseDot 1.8s ease-in-out infinite",
        "rotate-slow": "rotateSlow 80s linear infinite",
        "rotate-reverse": "rotateReverse 60s linear infinite",
        "status-pulse": "statusPulse 1.5s ease-in-out infinite",
        "typewriter": "typewriter 0.1s steps(1) forwards",
        "blink": "blink 0.75s steps(2) infinite",
        "underline-draw": "underlineDraw 220ms cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "ripple": "ripple 800ms ease-out forwards",
        "ticker-scroll": "tickerScroll 30s linear infinite",
        "drift-left": "driftLeft 600ms ease-out forwards",
        "drift-right": "driftRight 600ms ease-out forwards",
        "error-pop": "errorPop 400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "spark": "spark 0.5s ease-in-out infinite",
      },
      keyframes: {
        gridPulse: {
          "0%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.02)" },
          "100%": { opacity: "0.4", transform: "scale(1)" },
        },
        dataFlow1: {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(200px)" },
          "100%": { transform: "translateX(0)" },
        },
        dataFlow2: {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(200px)" },
          "100%": { transform: "translateX(0)" },
        },
        dataFlow3: {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(200px)" },
          "100%": { transform: "translateX(0)" },
        },
        float1: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        float2: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        float3: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        breathe: {
          "0%, 100%": { rx: "12", opacity: "0.15" },
          "50%": { rx: "20", opacity: "0.5" },
        },
        pulseDot: {
          "0%, 100%": { r: "4", opacity: "1" },
          "50%": { r: "7", opacity: "0.6" },
        },
        rotateSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        rotateReverse: {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        statusPulse: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        underlineDraw: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        ripple: {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
        tickerScroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        driftLeft: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-20px)" },
        },
        driftRight: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(20px)" },
        },
        errorPop: {
          "0%": { transform: "scale(0)" },
          "70%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
        spark: {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "1" },
        },
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "enter": "cubic-bezier(0.0, 0.0, 0.2, 1)",
        "exit": "cubic-bezier(0.4, 0.0, 1, 1)",
      },
      transitionDuration: {
        "250": "250ms",
        "350": "350ms",
        "400": "400ms",
        "500": "500ms",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config

export default config
