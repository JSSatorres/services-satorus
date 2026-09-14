"use client";

import { MotionConfig, type Transition } from "motion/react";
import { useHydratedReducedMotion } from "@/components/use-hydrated-reduced-motion";

const sharedTransition: Transition = {
  duration: 0.22,
  ease: [0.16, 1, 0.3, 1],
};

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const reduceMotion = useHydratedReducedMotion();

  return (
    <MotionConfig
      reducedMotion={reduceMotion ? "always" : "never"}
      transition={sharedTransition}
    >
      {children}
    </MotionConfig>
  );
}
