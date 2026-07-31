"use client";

import { Children, type ReactNode, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type SectionCurtainStackProps = {
  children: ReactNode;
};

const MIN_VISIBLE_HEIGHT = 24;

function readHeaderHeight() {
  const value = getComputedStyle(document.documentElement).getPropertyValue(
    "--header-height",
  );
  return Number.parseFloat(value) || 74;
}

export function SectionCurtainStack({ children }: SectionCurtainStackProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panels = Children.toArray(children);

  useGSAP(
    () => {
      if (typeof window === "undefined") return;

      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();

      media.add(
        {
          desktop: "(min-width: 901px)",
          mobile: "(max-width: 900px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, mobile, reduceMotion } = context.conditions ?? {};
          const allPanels = gsap.utils.toArray<HTMLElement>(
            ".section-curtain-panel",
          );
          const visiblePanels = allPanels.filter((panel) => {
            const surface = panel.querySelector<HTMLElement>(
              ".section-curtain-surface",
            );
            return (
              panel.offsetHeight > MIN_VISIBLE_HEIGHT &&
              surface !== null &&
              getComputedStyle(surface).display !== "none"
            );
          });

          if (reduceMotion || visiblePanels.length < 2) return;

          rootRef.current?.classList.add("curtain-motion-enabled");

          visiblePanels.forEach((panel, index) => {
            gsap.set(panel, { zIndex: visiblePanels.length - index + 1 });
          });

          visiblePanels.slice(0, -1).forEach((panel, index) => {
            const nextPanel = visiblePanels[index + 1];
            const surface = panel.querySelector<HTMLElement>(
              ".section-curtain-surface",
            );
            if (!surface) return;

            panel.classList.add("curtain-panel--moving");

            gsap.to(surface, {
              y: () => {
                const radius = mobile ? 30 : 52;
                const availableHeight =
                  window.innerHeight - readHeaderHeight();
                return -(Math.min(panel.offsetHeight, availableHeight) + radius);
              },
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                start: () => {
                  const availableHeight =
                    window.innerHeight - readHeaderHeight();
                  return panel.offsetHeight <= availableHeight
                    ? `clamp(top ${readHeaderHeight()}px)`
                    : "clamp(bottom bottom)";
                },
                endTrigger: nextPanel,
                end: () => `top ${readHeaderHeight()}px`,
                pin: panel,
                pinSpacing: false,
                scrub: desktop ? 0.72 : 0.34,
                anticipatePin: 1,
                fastScrollEnd: true,
                invalidateOnRefresh: true,
                refreshPriority: -10,
                onEnter: () => gsap.set(surface, { willChange: "transform" }),
                onEnterBack: () =>
                  gsap.set(surface, { willChange: "transform" }),
                onLeave: () => gsap.set(surface, { willChange: "auto" }),
                onLeaveBack: () => gsap.set(surface, { willChange: "auto" }),
              },
            });
          });

          ScrollTrigger.sort();
          const refreshFrame = window.requestAnimationFrame(() => {
            ScrollTrigger.refresh();
          });

          return () => {
            window.cancelAnimationFrame(refreshFrame);
            rootRef.current?.classList.remove("curtain-motion-enabled");
            allPanels.forEach((panel) => {
              panel.classList.remove("curtain-panel--moving");
            });
          };
        },
      );

      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <div className="section-curtain-stack" ref={rootRef}>
      {panels.map((panel, index) => (
        <div className="section-curtain-panel" key={index}>
          <div className="section-curtain-surface">{panel}</div>
        </div>
      ))}
    </div>
  );
}
