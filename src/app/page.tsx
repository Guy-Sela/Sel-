"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { TransitionPanel } from "@/components/motion-primitives/transition-panel";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [activeView, setActiveView] = useState("hero");
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

  const handleViewChange = (view: string) => {
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
      <Navbar activeView={activeView} onViewChange={handleViewChange} />

      {/* Preload each work's iframe in the background */}
      <div className="hidden pointer-events-none" aria-hidden="true">
        {works.map((work) => (
          <iframe key={`preload-${work.id}`} src={work.url} />
        ))}
      </div>

      {/* The Stage */}
      <div
        className={cn(
          "flex-1 relative overflow-hidden",
          activeView !== "works" && "pt-16",
        )}
      >
        {/* Content Slideshow */}
        <TransitionPanel
          activeIndex={activeView === "hero" ? 0 : 1}
          variants={{
            enter: { x: "100%", opacity: 0 },
            center: { x: 0, opacity: 1 },
            exit: { x: "-100%", opacity: 0 },
          }}
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="w-full h-full"
        >
          {/* Hero View */}
          <div className="w-full h-full bg-black flex items-center justify-center" />

          {/* Works View */}
          <div className="w-full h-full relative flex items-center justify-center">
            {/* Left Arrow — elegant chevron */}
            <motion.button
              onClick={prevWork}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={cn(
                "absolute left-10 top-1/2 -translate-y-1/2 z-10 flex items-center opacity-85 hover:opacity-100",
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
            </motion.button>

            {/* Progress Indicators — horizontal elegant lines */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4">
              {works.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setWorkIndex(idx)}
                  className="group"
                  disabled={idx === workIndex}
                >
                  <motion.div
                    className={cn(
                      "h-px rounded-full bg-current",
                      idx === workIndex ? "w-8 text-white" : "w-5 text-white/55",
                    )}
                    animate={{ scaleX: idx === workIndex ? 1.2 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                </button>
              ))}
            </div>

            {/* Right Arrow — elegant chevron */}
            <motion.button
              onClick={nextWork}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={cn(
                "absolute right-10 top-1/2 -translate-y-1/2 z-10 flex items-center opacity-85 hover:opacity-100",
                workIndex === works.length - 1 && "opacity-0 pointer-events-none",
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
                <path d="M9 18l6-6-6-6" />
              </svg>
            </motion.button>

            <div className="scale-[0.75] origin-center">
              <TransitionPanel
                activeIndex={workIndex}
                variants={{
                  enter: { x: "100%", opacity: 0 },
                  center: { x: 0, opacity: 1 },
                  exit: { x: "-100%", opacity: 0 },
                }}
                className="w-full h-full"
              >
                {works.map((work) => (
                  <div
                    key={work.id}
                    className="overflow-hidden bg-black"
                    style={{
                      width: "min(1360px, 92vw)",
                      height: "min(82dvh, 92vh)",
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
        </TransitionPanel>
      </div>
    </main>
  );
}
