"use client";

import Image from "next/image";
import Link from "next/link";
import { clocks, getClockBySlug } from "@/lib/clocks";
import { useEffect, useRef, useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ClockPageClientProps {
  slug: string;
}

export default function ClockPageClient({ slug }: ClockPageClientProps) {
  const clock = getClockBySlug(slug);
  const [selectedMockup, setSelectedMockup] = useState<string | null>(null);

  // Match main-site modal behavior:
  // - lock scroll while open
  // - restore scroll + padding after close (after transition)
  // - clear selected image after close delay (avoids flicker during close anim)
  const scrollLockRef = useRef<{
    bodyOverflow: string;
    bodyPaddingRight: string;
    htmlOverflow: string;
    locked: boolean;
    clearTimer: number | null;
  }>({
    bodyOverflow: "",
    bodyPaddingRight: "",
    htmlOverflow: "",
    locked: false,
    clearTimer: null,
  });

  const LOCK_DELAY_MS = 0;
  const UNLOCK_DELAY_MS = 320;

  function lockScroll() {
    const s = scrollLockRef.current;
    if (s.locked) return;

    s.bodyOverflow = document.body.style.overflow;
    s.bodyPaddingRight = document.body.style.paddingRight;
    s.htmlOverflow = document.documentElement.style.overflow;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    s.locked = true;
  }

  function unlockScroll() {
    const s = scrollLockRef.current;
    if (!s.locked) return;

    document.body.style.overflow = s.bodyOverflow;
    document.body.style.paddingRight = s.bodyPaddingRight;
    document.documentElement.style.overflow = s.htmlOverflow;

    s.locked = false;
  }

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

  useEffect(() => {
    const s = scrollLockRef.current;

    if (selectedMockup) {
      if (s.clearTimer) {
        window.clearTimeout(s.clearTimer);
        s.clearTimer = null;
      }
      // ensure lock happens after React commits open state
      window.setTimeout(() => lockScroll(), LOCK_DELAY_MS);
      return;
    }

    // closing: restore scroll + clear image after close transition
    window.setTimeout(() => unlockScroll(), UNLOCK_DELAY_MS);

    s.clearTimer = window.setTimeout(() => {
      s.clearTimer = null;
      // already null, but keep symmetry if future changes set a "closing" sentinel
    }, UNLOCK_DELAY_MS);

    return () => {
      if (s.clearTimer) {
        window.clearTimeout(s.clearTimer);
        s.clearTimer = null;
      }
    };
  }, [selectedMockup]);

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

      {/* Mosaic Section */}
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
                <button
                  key={mockup}
                  onClick={() => setSelectedMockup(mockup)}
                  className="aspect-[4/3] bg-card border border-border overflow-hidden relative group cursor-pointer"
                >
                  <Image
                    src={mockup}
                    alt={`${clock.title} mockup ${index + 1}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors" />
                </button>
              ))}
            </div>

            {/* Second row of mockups */}
            <div className="lg:col-span-3 grid grid-cols-3 gap-4">
              {clock.mockups.slice(2, 5).map((mockup, index) => (
                <button
                  key={mockup}
                  onClick={() => setSelectedMockup(mockup)}
                  className="aspect-[4/3] bg-card border border-border overflow-hidden relative group cursor-pointer"
                >
                  <Image
                    src={mockup}
                    alt={`${clock.title} mockup ${index + 3}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-light">About This Piece</h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                {clock.longDescription.split("\n\n").map((paragraph, index) => (
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

      {/* Navigation */}
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

      {/* Lightbox Dialog */}
      <Dialog
        open={!!selectedMockup}
        onOpenChange={(open) => {
          // keep "selectedMockup" until close animation finishes (like main site)
          if (open) return;
          window.setTimeout(() => setSelectedMockup(null), UNLOCK_DELAY_MS);
        }}
      >
        <DialogContent className="max-w-5xl p-0 bg-background border-border">
          <VisuallyHidden>
            <DialogTitle>Mockup Preview</DialogTitle>
          </VisuallyHidden>

          {selectedMockup && (
            <div className="aspect-video bg-muted relative">
              <Image
                src={selectedMockup}
                alt="Mockup Preview"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
