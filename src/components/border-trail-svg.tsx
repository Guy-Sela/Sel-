//"use client";

import { useState, useLayoutEffect, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type BorderTrailProps = {
  size?: number;
  duration?: number;
  className?: string;
};

export function BorderTrailSvg({
  size = 120,
  duration = 5,
  className = "",
}: BorderTrailProps) {
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const perimeter = 2 * (dimensions.width + dimensions.height);

  return (
    <svg
      ref={containerRef}
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-none",
        className,
      )}
      style={{
        // @ts-ignore
        "--perimeter": perimeter,
        "--trail-size": size,
      }}
    >
      <defs>
        <linearGradient
          id="border-trail-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor="rgb(113 113 122)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <motion.rect
        x="1"
        y="1"
        width="calc(100% - 2px)"
        height="calc(100% - 2px)"
        fill="none"
        stroke="url(#border-trail-gradient)"
        strokeWidth="2"
        strokeDasharray={`${size} ${perimeter}`}
        animate={{
          strokeDashoffset: [0, -perimeter],
        }}
        transition={{
          duration,
          repeat: 0,
          delay: 1.5,
          ease: "linear",
        }}
      />
    </svg>
  );
}
