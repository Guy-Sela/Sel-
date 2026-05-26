"use client";

import { cn } from "@/lib/utils";

interface NavbarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Navbar({ activeView, onViewChange }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="w-full h-16 flex items-center justify-between px-10">
        <button
          onClick={() => onViewChange("hero")}
          className="text-base sm:text-xs md:text-sm uppercase tracking-wide transition-opacity hover:opacity-70 font-josefin"
        >
          SELÀ
        </button>
        <div className="flex items-center gap-6 sm:gap-10">
          <button
            onClick={() => onViewChange("works")}
            className={cn(
              "text-[10px] sm:text-xs md:text-sm uppercase tracking-wide transition-colors font-josefin",
              activeView === "works"
                ? "text-white"
                : "text-white/70 hover:text-white",
            )}
          >
            Works
          </button>
          <button
            onClick={() => onViewChange("about")}
            className={cn(
              "text-[10px] sm:text-xs md:text-sm uppercase tracking-wide transition-colors font-josefin",
              activeView === "about"
                ? "text-white"
                : "text-white/70 hover:text-white",
            )}
          >
            About
          </button>
          <button
            onClick={() => onViewChange("contact")}
            className={cn(
              "text-[10px] sm:text-xs md:text-sm uppercase tracking-wide transition-colors font-josefin",
              activeView === "contact"
                ? "text-white"
                : "text-white/70 hover:text-white",
            )}
          >
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
}
