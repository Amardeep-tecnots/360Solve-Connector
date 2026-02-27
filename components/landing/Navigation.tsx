"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const navLinks = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
];

export const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-canvas transition-all duration-300 ${
        scrolled ? "border-b border-[#CBD5E1]" : "border-b border-mist"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + Wordmark */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Isometric Cube Logomark */}
            <div className="w-7 h-7 relative">
              <svg viewBox="0 0 28 28" className="w-full h-full">
                {/* Top face */}
                <path
                  d="M14 2 L26 8 L14 14 L2 8 Z"
                  fill="#DBEAFE"
                  stroke="#2463EB"
                  strokeWidth="1"
                  className="transition-colors group-hover:fill-[#BFDBFE]"
                />
                {/* Left face */}
                <path
                  d="M2 8 L14 14 L14 24 L2 18 Z"
                  fill="#93C5FD"
                  stroke="#2463EB"
                  strokeWidth="1"
                  className="transition-colors group-hover:fill-[#60A5FA]"
                />
                {/* Right face */}
                <path
                  d="M14 14 L26 8 L26 18 L14 24 Z"
                  fill="#60A5FA"
                  stroke="#2463EB"
                  strokeWidth="1"
                  className="transition-colors group-hover:fill-[#3B82F6]"
                />
              </svg>
            </div>
            <span className="font-sans font-semibold text-lg text-ink tracking-tight">
              Nia Connect
            </span>
          </Link>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </div>

            {/* Right: Auth Buttons */}
            <div className="flex items-center gap-4">
              <Link
                href="/demo"
                className="text-sm font-medium text-[#6B7280] hover:text-ink transition-colors hidden lg:block"
              >
                Demo
              </Link>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-[#6B7280] hover:text-ink transition-colors hidden sm:block"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="bg-signal text-white text-sm font-semibold px-4 py-2 rounded-[10px] hover:bg-signalDark hover:shadow-[0_0_0_4px_rgba(36,99,235,0.12)] transition-all duration-200"
              >
                Get Started Free
              </Link>
            </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link
      href={href}
      className="relative text-sm font-medium text-[#6B7280] hover:text-ink transition-colors duration-180 group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-signal group-hover:w-full transition-all duration-220 ease-[cubic-bezier(0.4,0,0.2,1)]" />
    </Link>
  );
};

export default Navigation;
