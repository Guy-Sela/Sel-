"use client";

import Image from "next/image";
import Link from "next/link";
import { clocks } from "@/lib/clocks";
import { Expand } from "lucide-react";
import { InView } from "@/components/ui/in-view";
import {
  MorphingPopover,
  MorphingPopoverContent,
  MorphingPopoverTrigger,
} from "@/components/ui/morphing-popover";
import { useState, useEffect } from "react";

export default function ConceptualTimingPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const clockRows: (typeof clocks)[] = [];
  for (let i = 0; i < clocks.length; i += 2) {
    clockRows.push(clocks.slice(i, i + 2));
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
            Collection
          </p>

          <h1 className="text-4xl sm:text-7xl lg:text-8xl font-extralight tracking-tighter mb-12">
            Conceptual Timing
          </h1>

          <div className="h-[1px] w-24 bg-foreground/40 mb-12 mx-auto sm:ml-0" />

          <p className="text-lg sm:text-xl text-muted-foreground max-w-md leading-relaxed mx-auto sm:ml-0">
            A collection of meditative clocks.
            <span className="block opacity-80">
              Each piece deconstructs the concept of time differently.
            </span>
          </p>
        </InView>
      </section>

      {/* Gallery Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-8 lg:space-y-12">
            {clockRows.map((row, rowIndex) => (
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
                  {row.map((clock) => (
                    <Link
                      key={clock.slug}
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
                            <MorphingPopover key={mockup} className="w-full">
                              <MorphingPopoverTrigger asChild>
                                <div className="aspect-[4/3] w-full bg-card border border-border overflow-hidden relative cursor-zoom-in">
                                  <Image
                                    src={mockup}
                                    alt={`${clock.title} mockup ${i + 1}`}
                                    fill
                                    sizes="(min-width: 1024px) 20vw, (min-width: 768px) 30vw, 40vw"
                                    className="object-cover"
                                    priority={i === 0}
                                    loading={i > 0 ? "eager" : undefined}
                                  />
                                </div>
                              </MorphingPopoverTrigger>
                              <MorphingPopoverContent className="p-0">
                                <div className="relative aspect-[4/3] w-[90vw] max-w-3xl overflow-hidden">
                                  <Image
                                    src={mockup}
                                    alt={`${clock.title} mockup ${i + 1}`}
                                    fill
                                    sizes="90vw"
                                    className="object-cover"
                                  />
                                </div>
                              </MorphingPopoverContent>
                            </MorphingPopover>
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
                  ))}
                </div>
              </InView>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <InView
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewOptions={{ once: true, margin: "0px" }}
        >
          <div className="max-w-7xl mx-auto flex flex-col items-start text-left space-y-8">
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
          </div>
        </InView>
      </section>
    </div>
  );
}
