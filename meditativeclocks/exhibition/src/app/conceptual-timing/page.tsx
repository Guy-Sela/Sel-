"use client";

import Link from "next/link";
import { clocks } from "@/lib/clocks";
import { Expand } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { TransitionPanel } from "../../../components/motion-primitives/transition-panel";

export default function ConceptualTimingPage() {
  const [loadedPreviews, setLoadedPreviews] = useState<Record<string, boolean>>(
    {},
  );

  const hero = useMemo(
    () => (
      <section className="py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0 }}
            className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6"
          >
            Collection
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight mb-8"
          >
            Conceptual Timing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            A collection of meditative clocks. Each piece deconstructs the
            concept of time differently.
          </motion.p>
        </div>
      </section>
    ),
    [],
  );

  return (
    <div className="min-h-screen">
      {/* Hero stagger (line-by-line) */}
      <TransitionPanel activeIndex={0}>{[hero]}</TransitionPanel>

      {/* Gallery Grid (all pieces on the page) */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {clocks.map((clock, index) => (
              <motion.div
                key={clock.slug}
                initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.18 + index * 0.08,
                }}
              >
                <Link
                  href={`/conceptual-timing/${clock.slug}`}
                  className="group block"
                >
                  <article className="space-y-4">
                    {/* Clock Preview */}
                    <div className="aspect-[4/3] bg-black border border-border overflow-hidden relative">
                      <iframe
                        src={clock.iframeUrl}
                        title={`${clock.title} preview`}
                        loading="lazy"
                        tabIndex={-1}
                        aria-hidden="true"
                        scrolling="no"
                        onLoad={() => {
                          setLoadedPreviews((prev) => ({
                            ...prev,
                            [clock.slug]: true,
                          }));
                        }}
                        className={[
                          "absolute inset-0 w-full h-full pointer-events-none select-none border-0 block max-w-full",
                          "bg-black",
                          "transition-opacity duration-300",
                          loadedPreviews[clock.slug]
                            ? "opacity-100"
                            : "opacity-0",
                        ].join(" ")}
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-transparent pointer-events-none" />
                      <div className="hidden lg:block absolute bottom-2 left-2 bg-background/70 backdrop-blur-sm px-2 py-1 text-[9px] uppercase tracking-wider pointer-events-none">
                        Live Preview
                      </div>
                    </div>

                    {/* Mockup Thumbnails (signals expanded view) */}
                    <div className="grid grid-cols-3 gap-2">
                      {clock.mockups.slice(0, 3).map((mockup, i) => (
                        <div
                          key={mockup}
                          className="aspect-[4/3] bg-card border border-border overflow-hidden relative"
                        >
                          <img
                            src={mockup}
                            alt={`${clock.title} mockup ${i + 1}`}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Clock Info */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-baseline justify-between gap-4">
                        <h2 className="text-xl sm:text-2xl font-light group-hover:opacity-70 transition-opacity">
                          {clock.title}
                        </h2>
                        <Expand
                          aria-hidden="true"
                          className="w-4 h-4 text-muted-foreground group-hover:opacity-70 transition-opacity flex-shrink-0"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground italic">
                        {clock.subtitle}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {clock.description}
                      </p>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="border-t border-border py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-2xl sm:text-3xl font-light">
            About the Collection
          </h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              These are not clocks in the functional sense. They are
              contemplations on temporality—visual meditations that use the
              language of timekeeping to explore deeper questions about
              presence, impermanence, and perception.
            </p>
            <p>
              Each piece is designed to reward prolonged attention. Rather than
              demanding focus, these works create ambient presence—transforming
              spaces into environments that invite pause, reflection, and
              presence.
            </p>
          </div>
          <div className="pt-8">
            <a
              href="mailto:ops@selahq.com"
              className="inline-flex items-center gap-2 text-sm border border-border px-6 py-3 hover:bg-accent transition-colors"
            >
              Inquire About Licensing
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
