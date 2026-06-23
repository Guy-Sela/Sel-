"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { TransitionPanel } from "@/components/motion-primitives/transition-panel";
import { BorderTrail } from "@/components/core/border-trail";

import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

// Two words that slide past each other and swap sides, kept symmetric about
// the center. The travel distance is based on the text size, guaranteeing
// consistent separation on all devices (mobile, tablet, desktop).
function CrossingWords({
  axis,
  containerClassName,
  spanClassName,
}: {
  axis: "x" | "y";
  containerClassName: string;
  spanClassName: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLSpanElement>(null);
  const codeRef = useRef<HTMLSpanElement>(null);
  const [amps, setAmps] = useState<{ art: number; code: number } | null>(null);

  useEffect(() => {
    const measure = () => {
      const c = containerRef.current;
      const a = artRef.current;
      const co = codeRef.current;
      if (!c || !a || !co) return;

      const size = (el: HTMLElement) =>
        axis === "x" ? el.offsetWidth : el.offsetHeight;
      const extent = axis === "x" ? c.offsetWidth : c.offsetHeight;

      if (extent === 0) return;

      const maxSize = Math.max(size(a), size(co));

      // 1. Base travel distance dynamically on text size.
      // Use 0.75x for horizontal (tablets/desktop) for a tighter, gentler spread.
      // Use 0.85x for vertical (mobile) to ensure they clear each other.
      let amplitude = maxSize * (axis === "x" ? 0.55 : 0.75);

      // 2. Safety check: Prevent them from clipping outside the screen edges
      const maxAllowed = Math.max(0, extent / 2 - maxSize / 2 - 16);
      amplitude = Math.min(amplitude, maxAllowed);

      setAmps({
        art: amplitude,
        code: amplitude,
      });
    };

    measure();

    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);

    // Re-measure once the web font has loaded
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(measure);
    }
    return () => ro.disconnect();
  }, [axis]);

  const transition = {
    duration: 8,
    delay: 1.5,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: [0.65, 0, 0.35, 1] as const,
  };

  return (
    <div ref={containerRef} className={containerClassName}>
      {/* Invisible measurement layer */}
      <div className="absolute inset-0 pointer-events-none">
        <span ref={artRef} className={cn(spanClassName, "absolute opacity-0")}>
          Art
        </span>
        <span ref={codeRef} className={cn(spanClassName, "absolute opacity-0")}>
          Code
        </span>
      </div>

      {amps && (
        <>
          {/* Art */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ mixBlendMode: "difference" }}
          >
            <motion.div
              initial={{ [axis]: -amps.art }}
              animate={{ [axis]: amps.art }}
              transition={transition}
              style={{ isolation: "auto" }}
            >
              <span className={spanClassName}>Art</span>
            </motion.div>
          </div>

          {/* Code */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ mixBlendMode: "difference" }}
          >
            <motion.div
              initial={{ [axis]: amps.code }}
              animate={{ [axis]: -amps.code }}
              transition={transition}
              style={{ isolation: "auto" }}
            >
              <span className={spanClassName}>Code</span>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
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
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
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
                    className="h-6 w-6 block"
                    viewBox="0 -960 960 960"
                    fill="currentColor"
                  >
                    <path d="M639-80l71-71-329-329 329-329-71-71-400 400L639-80Z" />
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
                    className="h-6 w-6 block"
                    viewBox="0 -960 960 960"
                    fill="currentColor"
                  >
                    <path d="M321-80l-71-71 329-329-329-329 71-71 400 400L321-80Z" />
                  </svg>
                </button>

                {/* Mobile Control Bar */}
                <div className="md:hidden z-20 absolute bottom-0 left-0 right-0 h-16 flex items-center justify-center bg-black px-6">
                  <a
                    href={works[workIndex].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute left-6 h-10 flex items-center text-white/80 active:text-white"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 -960 960 960"
                      fill="currentColor"
                    >
                      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
                    </svg>
                  </a>
                  <div className="flex items-center justify-center gap-6">
                    <button
                      onClick={prevWork}
                      disabled={workIndex === 0}
                      className={cn(
                        "h-10 w-10 flex items-center justify-center transition-opacity",
                        workIndex === 0 ? "opacity-25" : "opacity-100",
                      )}
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                      >
                        <path d="M639-80l71-71-329-329 329-329-71-71-400 400L639-80Z" />
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
                        className="h-5 w-5"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                      >
                        <path d="M321-80l-71-71 329-329-329-329 71-71 400 400L321-80Z" />
                      </svg>
                    </button>
                  </div>
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
                          stiffness: 80,
                          damping: 20,
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
                        stiffness: 80,
                        damping: 20,
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
                          className="relative flex flex-col items-center w-full h-full md:flex-row md:justify-center md:items-center"
                        >
                          {/* Top gap (spacer for centering) */}
                          <div className="md:hidden flex-1 w-full" />

                          <div
                            className="relative rounded-none bg-black touch-auto md:mb-0"
                            style={{
                              width: "var(--stage-width, 100%)",
                              height: "var(--stage-height, 100%)",
                            }}
                          >
                            <style jsx>{`
                              /* Portrait: lock 4:5 (taller than wide) */
                              div {
                                --stage-width: min(
                                  100vw - 2rem,
                                  (100dvh - 9rem) * 4 / 5
                                );
                                --stage-height: calc(
                                  var(--stage-width) * 5 / 4
                                );
                              }
                              @media (min-width: 768px) {
                                div {
                                  --stage-width: min(
                                    100vw - 2rem,
                                    (100dvh - 10rem) * 4 / 5
                                  );
                                  --stage-height: calc(
                                    var(--stage-width) * 5 / 4
                                  );
                                }
                              }
                              /* Landscape: lock 16:9 */
                              @media (orientation: landscape) {
                                div {
                                  --stage-width: min(
                                    100vw - 2rem,
                                    (100dvh - 9rem) * 16 / 9
                                  );
                                  --stage-height: calc(
                                    var(--stage-width) * 9 / 16
                                  );
                                }
                              }
                              @media (orientation: landscape) and (min-width: 768px) {
                                div {
                                  --stage-width: min(
                                    1280px,
                                    88vw,
                                    (100dvh - 10rem) * 16 / 9
                                  );
                                  --stage-height: calc(
                                    var(--stage-width) * 9 / 16
                                  );
                                }
                              }
                            `}</style>
                            <iframe
                              src={work.url}
                              className="w-full h-full border-none"
                              title={work.id}
                            />
                            {idx === 0 && (
                              <BorderTrail
                                style={{
                                  boxShadow:
                                    "0px 0px 60px 30px rgb(255 255 255 / 50%), 0 0 100px 60px rgb(0 0 0 / 50%), 0 0 140px 90px rgb(0 0 0 / 50%)",
                                }}
                                size={100}
                              />
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
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 20,
              }}
              className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden pt-16 md:pt-24"
            >
              <div className="relative flex items-center justify-center w-full h-full">
                {/* Desktop: Horizontal Slide */}
                <CrossingWords
                  axis="x"
                  containerClassName="hidden md:flex absolute inset-0 items-center justify-center"
                  spanClassName="block font-josefin text-[clamp(2.5rem,12vw,8rem)] font-light text-white uppercase whitespace-nowrap"
                />

                {/* Mobile: Vertical Slide */}
                <CrossingWords
                  axis="y"
                  containerClassName="flex md:hidden absolute inset-0 items-center justify-center"
                  spanClassName="block font-josefin text-[clamp(2rem,15vw,6rem)] font-light text-white uppercase whitespace-nowrap"
                />
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
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className="absolute inset-0 bg-black flex flex-col pt-16 md:pt-24 px-6 md:px-10"
            >
              <div className="flex-1" />
              <nav className="flex flex-col gap-3 mb-10">
                {[
                  { label: "Email", href: "mailto:ops@selahq.com" },
                  { label: "X", href: "https://x.com/selaonx" },
                  { label: "GitHub", href: "https://github.com/Guy-Sela" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.label !== "Email" ? "_blank" : undefined}
                    rel={link.label !== "Email" ? "noopener" : undefined}
                    className="text-[clamp(28px,5vw,48px)] font-light tracking-[0.1em] uppercase text-[#999] hover:text-white transition-colors w-fit font-josefin"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <footer className="h-16 md:h-24 flex items-center text-sm font-light tracking-[0.08em] text-[#999] font-josefin">
                <span>© Selà {new Date().getFullYear()}</span>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
