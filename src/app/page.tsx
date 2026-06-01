"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { TransitionPanel } from "@/components/motion-primitives/transition-panel";
import { BorderTrailSvg } from "@/components/border-trail-svg";

import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [activeView, setActiveView] = useState<
    "hero" | "works" | "about" | "contact"
  >("hero");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [workIndex, setWorkIndex] = useState(0);

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
        {/* Persistent Frame (Mobile only) */}
        {activeView === "works" && (
          <div className="md:hidden pointer-events-none absolute inset-0 z-30 flex flex-col items-center">
            {/* Top gap with centered separator */}
            <div className="pt-16 flex-1 w-full flex items-center justify-center">
              <div className="h-px bg-white/50" style={{ width: "15vw" }} />
            </div>

            {/* Stage area placeholder to align vertical separators */}
            <div
              className="relative w-full"
              style={{ height: "calc(100dvh - 14rem)" }}
            >
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-px bg-white/50"
                style={{ height: "15vw" }}
              />
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-px bg-white/50"
                style={{ height: "15vw" }}
              />
            </div>

            {/* Bottom gap with centered separator */}
            <div className="pb-16 flex-1 w-full flex items-center justify-center">
              <div className="h-px bg-white/50" style={{ width: "15vw" }} />
            </div>
          </div>
        )}

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
                {/* Left Arrow — desktop only */}
                <button
                  onClick={prevWork}
                  className={cn(
                    "z-20 hidden md:flex items-center opacity-85 hover:opacity-100 transition-all",
                    "absolute left-6 lg:left-10 top-1/2 -translate-y-1/2",
                    workIndex === 0 && "opacity-0 pointer-events-none",
                  )}
                >
                  <svg
                    className="h-7 w-7 block"
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

                {/* Right Arrow — desktop only */}
                <button
                  onClick={nextWork}
                  className={cn(
                    "z-20 hidden md:flex items-center opacity-85 hover:opacity-100 transition-all",
                    "absolute right-6 lg:right-10 top-1/2 -translate-y-1/2",
                    workIndex === works.length - 1 &&
                      "opacity-0 pointer-events-none",
                  )}
                >
                  <svg
                    className="h-7 w-7 block"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18l6-6 6-6" />
                  </svg>
                </button>

                {/* Mobile Control Bar */}
                <div className="md:hidden z-20 absolute bottom-0 left-0 right-0 h-16 flex items-center justify-between px-6 bg-black">
                  <a
                    href={works[workIndex].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 flex items-center justify-center text-white/80 active:text-white"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 -960 960 960"
                      fill="currentColor"
                    >
                      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
                    </svg>
                  </a>
                  <div className="flex items-center gap-6 flex-shrink-0">
                    <button
                      onClick={prevWork}
                      disabled={workIndex === 0}
                      className={cn(
                        "h-10 w-10 flex items-center justify-center transition-opacity",
                        workIndex === 0 ? "opacity-25" : "opacity-100",
                      )}
                    >
                      <svg
                        className="h-6 w-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>

                    <div className="flex items-center gap-2 min-w-[32px] justify-center">
                      {works.map((_, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "transition-all duration-300",
                            idx === workIndex
                              ? "w-5 bg-white"
                              : "w-3 bg-white/50",
                          )}
                          style={{ height: "1.75px" }}
                        />
                      ))}
                    </div>

                    <button
                      onClick={nextWork}
                      disabled={workIndex === works.length - 1}
                      className={cn(
                        "h-10 w-10 flex items-center justify-center transition-opacity",
                        workIndex === works.length - 1
                          ? "opacity-25"
                          : "opacity-100",
                      )}
                    >
                      <svg
                        className="h-6 w-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                  <div className="w-10" /> {/* Spacer to balance the layout */}
                </div>

                {/* Desktop-only secondary controls */}
                <div className="hidden md:flex z-20 items-center gap-4 absolute bottom-8 left-1/2 -translate-x-1/2">
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
                            ? "w-8 opacity-100"
                            : "w-5 opacity-40 group-hover:opacity-70",
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

                <a
                  href={works[workIndex].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open work in new tab"
                  title="Open in new tab"
                  className="z-20 hidden md:flex absolute bottom-8 left-10 h-8 w-8 items-center justify-center text-white/70 hover:text-white transition-colors"
                >
                  <svg
                    className="h-5 w-5 block"
                    viewBox="0 -960 960 960"
                    fill="currentColor"
                  >
                    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
                  </svg>
                </a>

                {/* Exhibition Content */}
                <div className="relative w-full h-full flex items-center justify-center">
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
                          className="relative flex flex-col items-center w-full h-full pt-16 pb-16 md:pt-0 md:pb-0 md:flex-row md:justify-center md:items-center"
                        >
                          {/* Top gap (spacer for centering) */}
                          <div className="md:hidden flex-1 w-full" />

                          <div
                            className="relative overflow-hidden bg-black touch-auto md:mb-0"
                            style={{
                              width: "var(--stage-width, 100%)",
                              height: "var(--stage-height, 100%)",
                              transform: "var(--stage-scale, none)",
                            }}
                          >
                            <style jsx>{`
                              div {
                                --stage-width: calc(100vw - 3rem);
                                --stage-height: calc(100dvh - 14rem);
                                --stage-scale: none;
                              }
                              @media (min-width: 768px) {
                                div {
                                  --stage-width: min(1280px, 90vw);
                                  --stage-height: min(64dvh, 70vh);
                                  --stage-scale: scale(0.75);
                                }
                              }
                            `}</style>
                            <iframe
                              src={work.url}
                              className="w-full h-full border-none"
                              title={work.id}
                            />
                            {idx === 0 && (
                              <BorderTrailSvg size={200} duration={8} />
                            )}
                          </div>

                          {/* Bottom gap (spacer for centering) */}
                          <div className="md:hidden flex-1 w-full" />
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
