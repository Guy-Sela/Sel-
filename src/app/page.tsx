"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { TransitionPanel } from "@/components/motion-primitives/transition-panel";
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

      {/* Dedicated Control Strip */}
      {activeView === "works" && (
        <div className="mt-16 w-full flex items-center justify-center py-6 bg-black border-b border-white/5">
          <div className="flex items-center gap-12 h-10">
            {/* Left Arrow */}
            <button
              onClick={prevWork}
              className={cn(
                "h-full flex items-center text-3xl transition-all duration-300 hover:scale-110 active:scale-90 font-light font-inter",
                workIndex === 0
                  ? "opacity-0 pointer-events-none"
                  : "opacity-40 hover:opacity-100",
              )}
            >
              ←
            </button>

            {/* Typographic Line Indicators using Em-Dashes */}
            <div className="flex items-center gap-1 h-full font-inter font-light text-3xl tracking-[-0.1em]">
              {works.map((_, idx) => (
                <span
                  key={idx}
                  className={cn(
                    "transition-all duration-500",
                    idx === workIndex ? "text-white" : "text-white/20",
                  )}
                >
                  —
                </span>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={nextWork}
              className={cn(
                "h-full flex items-center text-3xl transition-all duration-300 hover:scale-110 active:scale-90 font-light font-inter",
                workIndex === works.length - 1
                  ? "opacity-0 pointer-events-none"
                  : "opacity-40 hover:opacity-100",
              )}
            >
              →
            </button>
          </div>
        </div>
      )}

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
            <div className="w-full h-full scale-[0.75] origin-center">
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
                    className="w-full h-full overflow-hidden bg-black ring-1 ring-white/10 shadow-2xl"
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
