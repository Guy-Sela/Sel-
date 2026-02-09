"use client";
import {
  type ElementType,
  type HTMLAttributes,
  ReactNode,
  useRef,
  useState,
} from "react";
import {
  motion,
  useInView,
  Variant,
  Transition,
  UseInViewOptions,
} from "motion/react";

export type InViewProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  variants?: {
    hidden: Variant;
    visible: Variant;
  };
  transition?: Transition;
  viewOptions?: UseInViewOptions;
  as?: ElementType;
  once?: boolean;
};

const defaultVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export function InView({
  children,
  variants = defaultVariants,
  transition,
  viewOptions,
  as = "div",
  once,
  ...props
}: InViewProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, viewOptions);
  const [isViewed, setIsViewed] = useState(false);

  const MotionComponent = motion[as as keyof typeof motion] as typeof as;

  return (
    <MotionComponent
      ref={ref}
      initial="hidden"
      onAnimationComplete={() => {
        if (once) setIsViewed(true);
      }}
      animate={isInView || isViewed ? "visible" : "hidden"}
      variants={variants}
      transition={transition}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}
