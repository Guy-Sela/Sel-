"use client";

import Image from "next/image";
import Link from "next/link";
import { clocks, getClockBySlug } from "@/lib/clocks";
import { useEffect, useState } from "react";
import { InView } from "@/components/ui/in-view";
import {
  MorphingPopover,
  MorphingPopoverTrigger,
  MorphingPopoverContent,
} from "@/components/ui/morphing-popover";

interface ClockPageClientProps {
  slug: string;
}

type FullscreenMockupPopoverProps = {
  mockup: string;
  alt: string;
  sizes: string;
};

function FullscreenMockupPopover({
  mockup,
  alt,
  sizes,
}: FullscreenMockupPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <MorphingPopover open={open} onOpenChange={setOpen} className="w-full">
      <MorphingPopoverTrigger asChild>
        <button className="aspect-[4/3] w-full bg-card border border-border overflow-hidden relative group cursor-pointer">
          <Image
            src={mockup}
            alt={alt}
            fill
            sizes={sizes}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors" />
        </button>
      </MorphingPopoverTrigger>
      <MorphingPopoverContent
        className="fixed inset-0 z-50 rounded-none border-0 bg-black p-0"
        style={{ backgroundColor: "#000" }}
        onClick={() => setOpen(false)}
      >
        <button
          type="button"
          aria-label="Close"
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          onClick={(event) => {
            event.stopPropagation();
            setOpen(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M6 6l12 12M18 6l-12 12" />
          </svg>
        </button>
        <div
          className="relative h-full w-full bg-black"
          onClick={(event) => event.stopPropagation()}
        >
          <Image
            src={mockup}
            alt={alt}
            fill
            sizes="100vw"
            className="object-contain"
          />
        </div>
      </MorphingPopoverContent>
    </MorphingPopover>
  );
}

export default function ClockPageClient({ slug }: ClockPageClientProps) {
  const clock = getClockBySlug(slug);

  // Iframe flash prevention (match main site behavior):
  // - start as about:blank
  // - swap to real src on next frame
  // - fade in once loaded
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeSrc, setIframeSrc] = useState<string>("about:blank");

  useEffect(() => {
    setIframeLoaded(false);
    setIframeSrc("about:blank");

    const next = clock?.iframeUrl;
    if (!next) return;

    const raf = requestAnimationFrame(() => setIframeSrc(next));
    return () => cancelAnimationFrame(raf);
  }, [clock?.iframeUrl]);

  if (!clock) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-light">Clock not found</h1>
          <Link
            href="/conceptual-timing"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to collection
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = clocks.findIndex((c) => c.slug === slug);
  const prevClock = currentIndex > 0 ? clocks[currentIndex - 1] : null;
  const nextClock =
    currentIndex < clocks.length - 1 ? clocks[currentIndex + 1] : null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <InView
        variants={{
          hidden: { opacity: 0, y: 12 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewOptions={{ once: true, margin: "0px" }}
      >
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Link
                href="/conceptual-timing"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Collection
              </Link>
              <span className="text-muted-foreground/50">|</span>
              <span className="text-sm text-muted-foreground tabular-nums">
                {String(currentIndex + 1).padStart(2, "0")} /{" "}
                {String(clocks.length).padStart(2, "0")}
              </span>
            </div>

            <div className="space-y-4 max-w-3xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight">
                {clock.title}
              </h1>
            </div>
          </div>
        </section>
      </InView>

      {/* Mosaic Section */}
      <InView
        variants={{
          hidden: { opacity: 0, y: 16 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewOptions={{ once: true, margin: "0px" }}
      >
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Main iframe - Takes 2/3 on desktop */}
              <div className="lg:col-span-2 lg:row-span-2">
                <div className="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[600px] bg-black border border-border overflow-hidden relative">
                  <iframe
                    src={iframeSrc}
                    onLoad={() => setIframeLoaded(true)}
                    className={[
                      "w-full h-full block",
                      "bg-black",
                      "transition-opacity duration-300",
                      iframeLoaded ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                    title={clock.title}
                    loading="eager"
                  />
                  <div className="hidden lg:block absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 text-xs pointer-events-none">
                    Live Preview
                  </div>
                </div>
              </div>

              {/* Mockups Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                {clock.mockups.slice(0, 2).map((mockup, index) => (
                  <FullscreenMockupPopover
                    key={mockup}
                    mockup={mockup}
                    alt={`${clock.title} mockup ${index + 1}`}
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                ))}
              </div>

              {/* Second row of mockups */}
              <div className="lg:col-span-3 grid grid-cols-3 gap-4">
                {clock.mockups.slice(2, 5).map((mockup, index) => (
                  <FullscreenMockupPopover
                    key={mockup}
                    mockup={mockup}
                    alt={`${clock.title} mockup ${index + 3}`}
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </InView>

      {/* Description Section */}
      <InView
        variants={{
          hidden: { opacity: 0, y: 16 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewOptions={{ once: true, margin: "0px" }}
      >
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-xl font-light">About This Piece</h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  {clock.longDescription
                    .split("\n\n")
                    .map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-muted-foreground leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-sm uppercase tracking-wider text-muted-foreground">
                    Technical
                  </h3>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Format</dt>
                      <dd>
                        Web-based (HTML5/JS)
                        {clock.slug === "universe-clock"
                          ? " | E-paper–compatible"
                          : ""}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Aspect Ratio</dt>
                      <dd>Responsive</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Resolution</dt>
                      <dd>Up to 4K</dd>
                    </div>
                  </dl>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm uppercase tracking-wider text-muted-foreground">
                    Licensing
                  </h3>
                  <a
                    href="mailto:ops@selahq.com"
                    className="inline-flex items-center gap-2 text-sm px-4 py-2 hover:bg-accent transition-colors w-full justify-center"
                  >
                    Inquire
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
            </div>
          </div>
        </section>
      </InView>

      {/* Navigation */}
      <InView
        variants={{
          hidden: { opacity: 0, y: 16 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewOptions={{ once: true, margin: "0px" }}
      >
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 gap-8">
              {prevClock ? (
                <Link
                  href={`/conceptual-timing/${prevClock.slug}`}
                  className="group space-y-2"
                >
                  <p className="text-sm text-muted-foreground">← Previous</p>
                  <p className="text-lg font-light group-hover:opacity-70 transition-opacity">
                    {prevClock.title}
                  </p>
                </Link>
              ) : (
                <div />
              )}

              {nextClock ? (
                <Link
                  href={`/conceptual-timing/${nextClock.slug}`}
                  className="group space-y-2 text-right"
                >
                  <p className="text-sm text-muted-foreground">Next →</p>
                  <p className="text-lg font-light group-hover:opacity-70 transition-opacity">
                    {nextClock.title}
                  </p>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </section>
      </InView>
    </div>
  );
}
