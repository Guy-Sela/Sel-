"use client";
import {
  AnimatePresence,
  Transition,
  Variant,
  motion,
  MotionProps,
} from "motion/react";
import { cn } from "@/lib/utils";

export type TransitionPanelProps = {
  children: React.ReactNode[];
  className?: string;
  transition?: Transition;
  activeIndex: number;
  variants?: { enter: Variant; center: Variant; exit: Variant };
  /**
   * When true, play the enter animation on first mount.
   * Defaults to true.
   */
  initial?: boolean;
} & MotionProps;

const defaultHeroVariants: { enter: Variant; center: Variant; exit: Variant } =
  {
    enter: { opacity: 0, y: 12, filter: "blur(6px)" },
    center: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -8, filter: "blur(6px)" },
  };

const defaultHeroTransition: Transition = {
  duration: 0.6,
  ease: [0.16, 1, 0.3, 1],
};

export function TransitionPanel({
  children,
  className,
  transition,
  variants,
  activeIndex,
  initial = true,
  ...motionProps
}: TransitionPanelProps) {
  const resolvedVariants = variants ?? defaultHeroVariants;
  const resolvedTransition = transition ?? defaultHeroTransition;

  return (
    <div className={cn("relative", className)}>
      <AnimatePresence
        initial={initial}
        mode="popLayout"
        custom={motionProps.custom}
      >
        <motion.div
          key={activeIndex}
          variants={resolvedVariants}
          transition={resolvedTransition}
          initial="enter"
          animate="center"
          exit="exit"
          {...motionProps}
        >
          {children[activeIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
