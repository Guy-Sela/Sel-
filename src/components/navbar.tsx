"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  activeView: "hero" | "works" | "about" | "contact";
  onViewChange: (view: "hero" | "works" | "about" | "contact") => void;
  onMenuStateChange?: (isOpen: boolean) => void;
}

export function Navbar({
  activeView,
  onViewChange,
  onMenuStateChange,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    const newState = !mobileMenuOpen;
    setMobileMenuOpen(newState);
    onMenuStateChange?.(newState);
  };

  const handleNavClick = (view: "hero" | "works" | "about" | "contact") => {
    onViewChange(view);
    setMobileMenuOpen(false);
    onMenuStateChange?.(false);
  };

  const navLinks: { label: string; view: "works" | "about" | "contact" }[] = [
    { label: "Works", view: "works" },
    { label: "About", view: "about" },
    { label: "Contact", view: "contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100]">
      <div className="relative z-[110] w-full h-24 flex items-center justify-between px-6 md:px-10 bg-black/80 backdrop-blur-sm">
        {/* Logo */}
        <button
          onClick={() => handleNavClick("hero")}
          className="text-base uppercase tracking-normal transition-opacity hover:opacity-70 font-josefin"
        >
          SELÀ
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => (
            <button
              key={link.view}
              onClick={() => handleNavClick(link.view)}
              className={cn(
                "text-base uppercase tracking-normal transition-colors font-josefin",
                activeView === link.view
                  ? "text-white"
                  : "text-white/70 hover:text-white",
              )}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={toggleMenu}
          className="md:hidden relative z-[120] flex h-8 w-8 items-center justify-center"
          aria-label="Toggle menu"
        >
          <div className="relative h-4 w-5">
            <motion.span
              animate={{
                rotate: mobileMenuOpen ? 45 : 0,
                y: mobileMenuOpen ? 6 : 0,
              }}
              className="absolute left-0 top-0 h-px w-5 bg-white"
              transition={{ duration: 0.2 }}
            />
            <motion.span
              animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
              className="absolute left-0 top-[7px] h-px w-5 bg-white"
              transition={{ duration: 0.15 }}
            />
            <motion.span
              animate={{
                rotate: mobileMenuOpen ? -45 : 0,
                y: mobileMenuOpen ? -6 : 0,
              }}
              className="absolute left-0 top-[14px] h-px w-5 bg-white"
              transition={{ duration: 0.2 }}
            />
          </div>
        </button>
      </div>

      {/* Elegant Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "linear" }}
            className="fixed inset-0 z-[105] bg-black md:hidden flex flex-col"
          >
            <div className="flex-1 flex flex-col px-8 sm:px-12 pt-[20dvh]">
              <div className="flex flex-col items-start gap-10 sm:gap-12">
                {/* Home */}
                <button
                  onClick={() => handleNavClick("hero")}
                  className={cn(
                    "text-4xl sm:text-5xl uppercase tracking-[4px] font-josefin transition-all",
                    activeView === "hero"
                      ? "text-white"
                      : "text-white/40 hover:text-white",
                  )}
                >
                  Home
                </button>

                {navLinks.map((link) => (
                  <button
                    key={link.view}
                    onClick={() => handleNavClick(link.view)}
                    className={cn(
                      "text-4xl sm:text-5xl uppercase tracking-[4px] font-josefin transition-all",
                      activeView === link.view
                        ? "text-white"
                        : "text-white/40 hover:text-white",
                    )}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
