"use client";

import Link from "next/link";
import { clocks, getClockBySlug } from "@/lib/clocks";
import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ClockPageClientProps {
  slug: string;
}

export default function ClockPageClient({ slug }: ClockPageClientProps) {
  const clock = getClockBySlug(slug);
  const [selectedMockup, setSelectedMockup] = useState<string | null>(null);

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 mb-8"
          >
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4 max-w-3xl"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight">
              {clock.title}
            </h1>
            <p className="text-lg text-muted-foreground italic">
              {clock.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mosaic Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-4"
          >
            {/* Main iframe - Takes 2/3 on desktop */}
            <div className="lg:col-span-2 lg:row-span-2">
              <div className="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[600px] bg-card border border-border overflow-hidden relative">
                <iframe
                  src={clock.iframeUrl}
                  className="w-full h-full"
                  title={clock.title}
                  loading="lazy"
                />
                <div className="hidden lg:block absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 text-xs">
                  Live Preview
                </div>
              </div>
            </div>

            {/* Mockups Grid - 5 smaller images */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {clock.mockups.slice(0, 2).map((mockup, index) => (
                <motion.button
                  key={mockup}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  onClick={() => setSelectedMockup(mockup)}
                  className="aspect-[4/3] bg-card border border-border overflow-hidden relative group cursor-pointer"
                >
                  <img
                    src={mockup}
                    alt={`${clock.title} mockup ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors" />
                </motion.button>
              ))}
            </div>

            {/* Second row of mockups */}
            <div className="lg:col-span-3 grid grid-cols-3 gap-4">
              {clock.mockups.slice(2, 5).map((mockup, index) => (
                <motion.button
                  key={mockup}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  onClick={() => setSelectedMockup(mockup)}
                  className="aspect-[4/3] bg-card border border-border overflow-hidden relative group cursor-pointer"
                >
                  <img
                    src={mockup}
                    alt={`${clock.title} mockup ${index + 3}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Description Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
          >
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
                    <dd>Web-based (HTML5/JS)</dd>
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
                  className="inline-flex items-center gap-2 text-sm border border-border px-4 py-2 hover:bg-accent transition-colors w-full justify-center"
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
          </motion.div>
        </div>
      </section>

      {/* Navigation */}
      <section className="border-t border-border px-4 sm:px-6 lg:px-8 py-12">
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
        onOpenChange={() => setSelectedMockup(null)}
      >
        <DialogContent className="max-w-5xl p-0 bg-background border-border">
          <VisuallyHidden>
            <DialogTitle>Mockup Preview</DialogTitle>
          </VisuallyHidden>
          {selectedMockup && (
            <div className="aspect-video bg-muted relative">
              <img
                src={selectedMockup}
                alt="Mockup Preview"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
