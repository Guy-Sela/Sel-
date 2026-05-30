"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { TransitionPanel } from "@/components/motion-primitives/transition-panel";

import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [activeView, setActiveView] = useState<
    "hero" | "works" | "about" | "contact"
  >("hero");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [workIndex, setWorkIndex] = useState(0);
  const [trailVisible, setTrailVisible] = useState(false);
  const [trailFading, setTrailFading] = useState(false);
  const [trailPath, setTrailPath] = useState("");

  useEffect(() => {
    if (activeView === "works" && workIndex === 0) {
      const t = setTimeout(() => setTrailVisible(true), 1000);
      return () => clearTimeout(t);
    }
  }, [activeView, workIndex]);

  // For the prototype, we only have one work: Conceptual Timing
  const works = [
    {
      id: "conceptual-timing",
      url: "/meditativeclocks/exhibition/conceptual-timing/index.html",
    },
    {
      id: "pxsoul",
      url: "https://pxsoul.selà.com/",
    },
  ];

  const handleViewChange = (view: "hero" | "works" | "about" | "contact") => {
    setActiveView(view);
    if (view === "works") {
      setWorkIndex(0);
    }
  };

  const nextWork = () => {
    if (workIndex < works.length - 1) {
      setWorkIndex(workIndex + 1);
    }
  };

  const prevWork = () => {
    if (workIndex > 0) {
      setWorkIndex(workIndex - 1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <main className="flex flex-col h-[100dvh] bg-black text-white selection:bg-white selection:text-black">
      <Navbar
        activeView={activeView}
        onViewChange={handleViewChange}
        onMenuStateChange={setIsMenuOpen}
      />

      {/* Preload each work's iframe in the background */}
      <div className="hidden pointer-events-none" aria-hidden="true">
        {works.map((work) => (
          <iframe key={`preload-${work.id}`} src={work.url} />
        ))}
      </div>

      {/* The Stage */}
      <div className="flex-1 relative overflow-hidden">
        {/* Main View Controller */}
        <AnimatePresence mode="wait" initial={false}>
          {/* Hero View */}
          {activeView === "hero" && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-black flex items-center justify-center pt-24 md:pt-0"
            />
          )}

          {/* Works View */}
          {activeView === "works" && (
            <motion.div
              key="works"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 125, damping: 17 }}
              className="absolute inset-0"
            >
              <div className="w-full h-full relative flex items-center justify-center px-4 md:px-6">
                {/* Left Arrow — always visible, responsive positioning + size */}
                <button
                  onClick={prevWork}
                  className={cn(
                    "z-20 flex items-center opacity-85 hover:opacity-100 transition-all",
                    "absolute left-4 md:left-6 lg:left-10 top-1/2 -translate-y-1/2",
                    workIndex === 0 && "opacity-0 pointer-events-none",
                  )}
                >
                  <svg
                    className="h-6 w-6 md:h-7 md:w-7 block"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                {/* Progress Indicators — always visible, responsive sizing + position */}
                <div className="z-20 flex items-center gap-3 md:gap-4 absolute bottom-5 md:bottom-8 left-1/2 -translate-x-1/2">
                  {works.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setWorkIndex(idx)}
                      className="group"
                      disabled={idx === workIndex}
                    >
                      <motion.div
                        className={cn(
                          "h-px rounded-full bg-white",
                          idx === workIndex
                            ? "w-6 md:w-8 opacity-100"
                            : "w-4 md:w-5 opacity-40 group-hover:opacity-70",
                        )}
                        animate={{ scaleX: idx === workIndex ? 1.2 : 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 125,
                          damping: 17,
                        }}
                      />
                    </button>
                  ))}
                </div>

                {/* Right Arrow — always visible, responsive positioning + size */}
                <button
                  onClick={nextWork}
                  className={cn(
                    "z-20 flex items-center opacity-85 hover:opacity-100 transition-all",
                    "absolute right-4 md:left-auto right-4 md:right-6 lg:right-10 top-1/2 -translate-y-1/2",
                    workIndex === works.length - 1 &&
                      "opacity-0 pointer-events-none",
                  )}
                >
                  <svg
                    className="h-6 w-6 md:h-7 md:w-7 block"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>

                {/* Exhibition Content — always dead center, properly constrained */}
                <div
                  ref={(node) => {
                    if (node) {
                      const { width, height } = node.getBoundingClientRect();
                      const path = `M 0,0 H ${width} V ${height} H 0 Z`;
                      if (trailPath !== path) setTrailPath(path);
                    }
                  }}
                  className="relative"
                  style={{
                    transform: "scale(0.75)",
                    minWidth: "min(1280px, 90vw)",
                    minHeight: "min(64dvh, 70vh)",
                    maxHeight: "calc(100dvh - 200px)",
                  }}
                >
                  {/* Trail — travels along the border once, then fades */}
                  {trailVisible && trailPath && (
                    <motion.div
                      className="absolute pointer-events-none rounded-full"
                      style={
                        {
                          width: 60,
                          height: 60,
                          offsetPath: `path("${trailPath}")`,
                          offsetAnchor: "50% 50%",
                          background:
                            "radial-gradient(circle, rgba(255,255,255,0.65) 0%, transparent 70%)",
                          opacity: trailFading ? 0 : 1,
                          transition: "opacity 1s ease",
                        } as React.CSSProperties
                      }
                      initial={{ offsetDistance: "0%" }}
                      animate={{ offsetDistance: "100%" }}
                      transition={{ duration: 4, ease: "linear" }}
                      onAnimationComplete={() => setTrailFading(true)}
                      onTransitionEnd={() => setTrailVisible(false)}
                    />
                  )}
                  <div className="relative flex items-center justify-center overflow-hidden w-full h-full">
                    <TransitionPanel
                      activeIndex={workIndex}
                      transition={{
                        type: "spring",
                        stiffness: 125,
                        damping: 17,
                      }}
                      variants={{
                        enter: { x: "100%", opacity: 0 },
                        center: { x: 0, opacity: 1 },
                        exit: { x: "-100%", opacity: 0 },
                      }}
                      className="w-full h-full"
                    >
                      {works.map((work, idx) => (
                        <div
                          key={work.id}
                          className="relative overflow-hidden bg-black touch-auto"
                          style={{
                            width: "min(1280px, 90vw)",
                            height: "min(64dvh, 70vh)",
                            maxHeight: "calc(100dvh - 240px)",
                          }}
                        >
                          <iframe
                            src={work.url}
                            className="w-full h-full border-none"
                            title={work.id}
                          />
                        </div>
                      ))}
                    </TransitionPanel>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* About View — slides from right */}
          {activeView === "about" && (
            <motion.div
              key="about"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 125, damping: 17 }}
              className="absolute inset-0 bg-black flex items-center justify-center pt-24 md:pt-0 px-6"
            >
              <div className="text-center max-w-lg">
                <div className="text-5xl md:text-7xl font-josefin tracking-[2px] mb-8">
                  About
                </div>
                <div className="text-white/60 text-lg leading-relaxed">
                  Placeholder content for About. This panel slides in from the
                  right.
                </div>
              </div>
            </motion.div>
          )}

          {/* Contact View — slides from right */}
          {activeView === "contact" && (
            <motion.div
              key="contact"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 125, damping: 17 }}
              className="absolute inset-0 bg-black flex items-center justify-center pt-24 md:pt-0 px-6"
            >
              <div className="text-center max-w-lg">
                <div className="text-5xl md:text-7xl font-josefin tracking-[2px] mb-8">
                  Contact
                </div>
                <div className="text-white/60 text-lg leading-relaxed">
                  Placeholder content for Contact. This panel slides in from the
                  right.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
