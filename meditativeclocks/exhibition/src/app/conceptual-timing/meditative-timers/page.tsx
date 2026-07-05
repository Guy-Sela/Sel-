"use client";

import Link from "next/link";
import { Expand, ArrowRight } from "lucide-react";
import { InView } from "@/components/ui/in-view";
import { useState, useEffect } from "react";

const timers = [
  { slug: "hourglass-zero-gravity", title: "Hourglass Zero Gravity" },
  { slug: "tension", title: "Tension" },
  { slug: "never-touch", title: "Never Touch" },
  { slug: "never-touch-angles", title: "Never Touch Angles" },
  { slug: "fade", title: "Fade" },
  { slug: "hatching", title: "Hatching" },
  { slug: "coloring", title: "Coloring" },
  { slug: "coloring-svg", title: "Coloring SVG" },
];

export default function MeditativeTimersPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const timerRows = [];
  for (let i = 0; i < timers.length; i += 2) {
    timerRows.push(timers.slice(i, i + 2));
  }

  return (
    <div className="page-content is-visible min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-24 sm:pt-32 sm:pb-32 lg:pb-48 lg:pt-64">
        <InView
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewOptions={{ once: true, margin: "0px" }}
          as="div"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left"
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-12 sm:mb-16 lg:mb-20">
            Private Collection
          </p>

          <h1 className="text-4xl sm:text-7xl lg:text-8xl font-extralight tracking-tighter mb-12">
            Meditative Timers
          </h1>

          <div className="h-[1px] w-24 bg-foreground/40 mb-12 mx-auto sm:ml-0" />

          <p className="text-lg sm:text-xl text-muted-foreground max-w-md leading-relaxed mx-auto sm:ml-0 mb-8">
            A related collection to Conceptual Timing.
            <span className="block opacity-80 mt-2"></span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center sm:justify-start">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              Main Site
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              href="/conceptual-timing"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              Conceptual Timing Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </InView>
      </section>

      {/* Gallery Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-8 lg:space-y-12">
            {timerRows.map((row, rowIndex) => (
              <InView
                key={`row-${rowIndex}`}
                variants={{
                  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: rowIndex * 0.1,
                }}
                viewOptions={{ once: true, margin: "0px" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                  {row.map((timer) => (
                    <a
                      key={timer.slug}
                      href={`/meditativeclocks/exhibition/meditative-timers/${timer.slug}.html`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <article className="space-y-4">
                        {/* Preview (Iframe) */}
                        <div className="aspect-[4/3] bg-black border border-border overflow-hidden relative">
                          {isMounted && (
                            <iframe
                              src={`/meditativeclocks/exhibition/meditative-timers/${timer.slug}.html`}
                              title={`${timer.title} preview`}
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

                        {/* Info */}
                        <div className="space-y-2 pt-2">
                          <div className="flex items-baseline justify-between gap-4">
                            <h2 className="text-xl sm:text-2xl font-light group-hover:opacity-70 transition-opacity">
                              {timer.title}
                            </h2>
                            <Expand
                              aria-hidden="true"
                              className="w-4 h-4 text-muted-foreground group-hover:opacity-70 transition-opacity flex-shrink-0"
                            />
                          </div>
                        </div>
                      </article>
                    </a>
                  ))}
                </div>
              </InView>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
