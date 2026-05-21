'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { TransitionPanel } from '@/components/motion-primitives/transition-panel';
import { cn } from '@/lib/utils';

export default function Home() {
  const [activeView, setActiveView] = useState('hero');
  const [workIndex, setWorkIndex] = useState(0);

  // For the prototype, we only have one work: Conceptual Timing
  const works = [
    {
      id: 'conceptual-timing',
      url: '/meditativeclocks/exhibition/',
    },
  ];

  const handleViewChange = (view: string) => {
    setActiveView(view);
    if (view === 'works') {
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
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <main className="flex flex-col h-screen bg-black text-white selection:bg-white selection:text-black">
      <Navbar activeView={activeView} onViewChange={handleViewChange} />

      {/* The Stage */}
      <div className="flex-1 relative mt-16 overflow-hidden">

        {/* Top Indicators & Controls */}
        {activeView === 'works' && (
          <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-center py-6 px-10">
            <div className="flex items-center gap-8">
              {/* Left Arrow */}
              <button
                onClick={prevWork}
                className={cn(
                  "transition-all duration-300 hover:scale-110 active:scale-95",
                  workIndex === 0 ? "opacity-0 pointer-events-none" : "opacity-40 hover:opacity-100"
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 rotate-180"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </button>

              {/* Line Indicators */}
              <div className="flex gap-2">
                {works.map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "h-[2px] w-12 transition-all duration-500",
                      idx === workIndex ? "bg-white" : "bg-white/10"
                    )}
                  />
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={nextWork}
                className={cn(
                  "transition-all duration-300 hover:scale-110 active:scale-95",
                  workIndex === works.length - 1 ? "opacity-0 pointer-events-none" : "opacity-40 hover:opacity-100"
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Content Slideshow */}
        <TransitionPanel
          activeIndex={activeView === 'hero' ? 0 : 1}
          variants={{
            enter: { x: '100%', opacity: 0 },
            center: { x: 0, opacity: 1 },
            exit: { x: '-100%', opacity: 0 },
          }}
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="w-full h-full"
        >
          {/* Hero View */}
          <div className="w-full h-full bg-black flex items-center justify-center" />

          {/* Works View */}
          <div className="w-full h-full relative">
            <TransitionPanel
              activeIndex={workIndex}
              variants={{
                enter: { x: '100%', opacity: 0 },
                center: { x: 0, opacity: 1 },
                exit: { x: '-100%', opacity: 0 },
              }}
              className="w-full h-full"
            >
              {works.map((work) => (
                <div key={work.id} className="w-full h-full p-4 sm:p-8 md:p-12 lg:p-16">
                  <div className="w-full h-full rounded-sm overflow-hidden bg-neutral-900 shadow-2xl">
                    <iframe
                      src={work.url}
                      className="w-full h-full border-none"
                      title={work.id}
                    />
                  </div>
                </div>
              ))}
            </TransitionPanel>
          </div>
        </TransitionPanel>
      </div>
    </main>
  );
}
