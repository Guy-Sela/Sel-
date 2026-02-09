"use client";

import Image from "next/image";
import Link from "next/link";
import { clocks } from "@/lib/clocks";
import { Expand } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

/**
 * ConceptualTimingPage
 *
 * Optimized Loading Strategy:
 * 1. Synchronous Font & Image Check: Uses document.fonts.ready and Image.decode()
 *    to ensure all visual assets are ready to paint before the overlay fades.
 * 2. Full Asset Wait: Waits for ALL clock iframes and ALL primary mockups to load
 *    before revealing the page to ensure zero layout shift or pop-in.
 */

let hasInitiallyLoaded = false;

export default function ConceptualTimingPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isReady, setIsReady] = useState(hasInitiallyLoaded);

  // Tracking counters for all required assets
  const [loadedCount, setLoadedCount] = useState({
    iframes: 0,
    images: 0,
    fonts: false,
  });

  const totalClocks = clocks.length;
  // We wait for the primary mockup of every clock
  const totalRequiredImages = totalClocks;

  useEffect(() => {
    setIsMounted(true);
    if (hasInitiallyLoaded) return;

    // Wait for fonts
    document.fonts.ready.then(() => {
      setLoadedCount((prev) => ({ ...prev, fonts: true }));
    });

    // Safety fallback: Reveal anyway after 6s if something hangs
    const timer = setTimeout(() => {
      setIsReady(true);
      hasInitiallyLoaded = true;
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  // Check if everything is loaded
  useEffect(() => {
    if (
      !isReady &&
      loadedCount.fonts &&
      loadedCount.iframes >= totalClocks &&
      loadedCount.images >= totalRequiredImages
    ) {
      const timer = setTimeout(() => {
        setIsReady(true);
        hasInitiallyLoaded = true;
      }, 400); // Final paint buffer
      return () => clearTimeout(timer);
    }
  }, [loadedCount, isReady, totalClocks, totalRequiredImages]);

  const incrementIframes = () =>
    setLoadedCount((prev) => ({ ...prev, iframes: prev.iframes + 1 }));
  const incrementImages = () =>
    setLoadedCount((prev) => ({ ...prev, images: prev.images + 1 }));

  return (
    <>
      {/* Branded Loading Overlay */}
      <div className={`loading-overlay ${isReady ? "is-hidden" : ""}`}>
        <div className="loader-pulse" />
      </div>

      <div
        className={`page-content ${isReady ? "is-visible" : ""} min-h-screen`}
      >
        {/* Hero Section */}
        <section className="py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={
              hasInitiallyLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            animate={isReady ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="max-w-7xl mx-auto text-center"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6 text-center">
              Collection
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight mb-8">
              Conceptual Timing
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed text-center mx-auto">
              A collection of meditative clocks.
              <span className="block">
                Each piece deconstructs the concept of time differently.
              </span>
            </p>
          </motion.div>
        </section>

        {/* Gallery Grid */}
        <section className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {clocks.map((clock, index) => (
                <motion.div
                  key={clock.slug}
                  initial={
                    hasInitiallyLoaded
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 18, filter: "blur(6px)" }
                  }
                  animate={
                    isReady ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
                  }
                  transition={{
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.3 + index * 0.1,
                  }}
                >
                  <Link
                    href={`/conceptual-timing/${clock.slug}`}
                    className="group block"
                  >
                    <article className="space-y-4">
                      {/* Clock Preview (Iframe) */}
                      <div className="aspect-[4/3] bg-black border border-border overflow-hidden relative">
                        {isMounted && (
                          <iframe
                            src={clock.iframeUrl}
                            title={`${clock.title} preview`}
                            onLoad={incrementIframes}
                            className="absolute inset-0 w-full h-full pointer-events-none select-none border-0 block max-w-full bg-black"
                            tabIndex={-1}
                            aria-hidden="true"
                            scrolling="no"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-transparent pointer-events-none" />
                        <div className="hidden lg:block absolute bottom-2 left-2 bg-background/70 backdrop-blur-sm px-2 py-1 text-[9px] uppercase tracking-wider pointer-events-none">
                          Live Preview
                        </div>
                      </div>

                      {/* Mockup Thumbnails */}
                      <div className="grid grid-cols-3 gap-2">
                        {clock.mockups.slice(0, 3).map((mockup, i) => (
                          <div
                            key={mockup}
                            className="aspect-[4/3] bg-card border border-border overflow-hidden relative"
                          >
                            <Image
                              src={mockup}
                              alt={`${clock.title} mockup ${i + 1}`}
                              fill
                              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 30vw, 40vw"
                              className="object-cover"
                              priority={index < 2 && i === 0}
                              onLoadingComplete={
                                i === 0 ? incrementImages : undefined
                              }
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
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={
              hasInitiallyLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            whileInView={isReady ? { opacity: 1, y: 0 } : {}}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="max-w-7xl mx-auto flex flex-col items-start text-left space-y-8"
          >
            <h2 className="text-2xl sm:text-3xl font-light">
              About the Collection
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Conceptual Timing is an evolving collection of clocks whose
                subject matter is the essence of time itself. The pieces are
                code based, and even the most technically far fetched clock in
                the collection — Universe Clock — is a real clock nonetheless.
                It <i>will</i> run the next moment, as long as it&apos;s still
                in tact when the next moment comes (86 billion years from now).
              </p>
              <p>
                The conceptual clocks can appear anywhere there&apos;s a screen.
                They are set to be hypnotic, friendly to the contemplative mind
                and to the sublime ambiance seeking soul.
              </p>
            </div>
            <div className="pt-0">
              <a
                href="mailto:ops@selahq.com"
                className="inline-flex items-center gap-2 text-sm pl-0 pr-6 py-3 hover:bg-accent transition-colors"
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
          </motion.div>
        </section>
      </div>
    </>
  );
}
