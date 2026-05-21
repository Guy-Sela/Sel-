'use client';

import { cn } from '@/lib/utils';

interface NavbarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Navbar({ activeView, onViewChange }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-10 py-5">
        <button
          onClick={() => onViewChange('hero')}
          className="text-xs sm:text-sm md:text-base uppercase tracking-widest transition-opacity hover:opacity-70 font-josefin"
        >
          SELÀ
        </button>
        <div className="flex items-center gap-6 sm:gap-10">
          <button
            onClick={() => onViewChange('works')}
            className={cn(
              "text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] transition-colors font-josefin",
              activeView === 'works' ? "text-white" : "text-white/40 hover:text-white/70"
            )}
          >
            Works
          </button>
          <button
            onClick={() => onViewChange('about')}
            className={cn(
              "text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] transition-colors font-josefin",
              activeView === 'about' ? "text-white" : "text-white/40 hover:text-white/70"
            )}
          >
            About
          </button>
          <button
            onClick={() => onViewChange('contact')}
            className={cn(
              "text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] transition-colors font-josefin",
              activeView === 'contact' ? "text-white" : "text-white/40 hover:text-white/70"
            )}
          >
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
}
