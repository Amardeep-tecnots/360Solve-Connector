"use client";

import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-canvas border-t border-mist py-12">
      <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Left: Logo + Copyright */}
            <div className="flex items-center gap-4">
              <div className="w-6 h-6">
                <svg viewBox="0 0 28 28" className="w-full h-full">
                  <path d="M14 2 L26 8 L14 14 L2 8 Z" fill="#DBEAFE" stroke="#2463EB" strokeWidth="1" />
                  <path d="M2 8 L14 14 L14 24 L2 18 Z" fill="#93C5FD" stroke="#2463EB" strokeWidth="1" />
                  <path d="M14 14 L26 8 L26 18 L14 24 Z" fill="#60A5FA" stroke="#2463EB" strokeWidth="1" />
                </svg>
              </div>
              <span className="text-sm text-[#64748B]">
                © {new Date().getFullYear()} Nia Connect. All rights reserved.
              </span>
            </div>

          {/* Right: Links */}
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm font-mono text-[#64748B] hover:text-ink transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm font-mono text-[#64748B] hover:text-ink transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
