"use client";

import Link from "next/link";
import { clocks } from "@/lib/clocks";
import { motion } from "framer-motion";

export default function ConceptualTimingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6"
          >
            Collection
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight mb-8"
          >
            Conceptual Timing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            A collection of meditative clocks. Each piece deconstructs the concept of time differently.
          </motion.p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {clocks.map((clock, index) => (
              <motion.div
                key={clock.slug}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Link href={`/conceptual-timing/${clock.slug}`} className="group block">
                  <article className="space-y-6">
                    {/* Clock Preview */}
                    <div className="aspect-[4/3] bg-card border border-border overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <div className="w-16 h-16 mx-auto border border-border/50 rounded-full flex items-center justify-center group-hover:border-foreground/50 transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1}
                              stroke="currentColor"
                              className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">
                            View Piece
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Clock Info */}
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-between gap-4">
                        <h2 className="text-xl sm:text-2xl font-light group-hover:opacity-70 transition-opacity">
                          {clock.title}
                        </h2>
                        <span className="text-sm text-muted-foreground tabular-nums">
                          {String(index + 1).padStart(2, "0")}
                        </span>
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
          <h2 className="text-2xl sm:text-3xl font-light">About the Collection</h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              These are not clocks in the functional sense. They are contemplations on temporality—visual meditations that use the language of timekeeping to explore deeper questions about presence, impermanence, and perception.
            </p>
            <p>
              Each piece is designed to reward prolonged attention. Rather than demanding focus, these works create ambient presence—transforming spaces into environments that invite pause, reflection, and presence.
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
