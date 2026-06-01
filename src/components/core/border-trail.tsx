"use client";
import { cn } from "@/lib/utils";
import { Transition } from "motion/react";
import { useEffect, useRef, useState } from "react";

export type BorderTrailProps = {
  className?: string;
  size?: number;
  transition?: Transition;
  onAnimationComplete?: () => void;
  style?: React.CSSProperties;
};

let hasPlayed = false;

export function BorderTrail({ className, size = 60, style }: BorderTrailProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [pathD, setPathD] = useState("");
  const [shouldPlay, setShouldPlay] = useState(false);

  useEffect(() => {
    if (hasPlayed) return;
    hasPlayed = true;
    setShouldPlay(true);
  }, []);

  useEffect(() => {
    if (!shouldPlay || !wrapperRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setPathD(`M 0,0 H ${width} V ${height} H 0 Z`);
    });
    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, [shouldPlay]);

  if (!shouldPlay) return null;

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
    >
      <style>{`
        @keyframes border-trail-move {
          0%   { offset-distance: 0%;   opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
      `}</style>
      {pathD && (
        <div
          className={cn("absolute aspect-square bg-zinc-500", className)}
          style={{
            width: size,
            offsetPath: `path("${pathD}")`,
            animation: "border-trail-move 5s linear 1 forwards",
            ...style,
          }}
        />
      )}
    </div>
  );
}
