"use client";

import { Children, type ReactNode, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type SectionCurtainStackProps = {
  children: ReactNode;
};

const MIN_VISIBLE_HEIGHT = 24;

function readSeamDepth(isMobile: boolean) {
  return isMobile ? 24 : 38;
}

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
            panel.classList.add("curtain-panel--visible");
            gsap.set(panel, { zIndex: index + 1 });
          });

          visiblePanels.slice(0, -1).forEach((panel, index) => {
            const nextPanel = visiblePanels[index + 1];
            const nextSurface = nextPanel.querySelector<HTMLElement>(
              ".section-curtain-surface",
            );
            if (!nextSurface) return;

            const activateSeam = () => {
              nextPanel.classList.add("curtain-panel--seam-active");
              gsap.set(nextSurface, { willChange: "transform" });
            };
            const releaseSeam = () => {
              nextPanel.classList.remove("curtain-panel--seam-active");
              gsap.set(nextSurface, { willChange: "auto" });
            };

            ScrollTrigger.create({
              trigger: panel,
              start: () => {
                const availableHeight =
                  window.innerHeight - readHeaderHeight();
                return panel.offsetHeight <= availableHeight
                  ? `clamp(top ${readHeaderHeight()}px)`
                  : "clamp(bottom bottom)";
              },
              endTrigger: nextPanel,
              end: () =>
                `top ${readHeaderHeight() - readSeamDepth(Boolean(mobile))}px`,
              pin: panel,
              pinSpacing: false,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              refreshPriority: -10,
            });

            gsap.fromTo(
              nextSurface,
              { y: () => readSeamDepth(Boolean(mobile)) * 0.7 },
              {
                y: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: nextPanel,
                  start: "clamp(top bottom)",
                  end: () =>
                    `top ${readHeaderHeight() - readSeamDepth(Boolean(mobile))}px`,
                  scrub: desktop ? 0.5 : 0.24,
                  invalidateOnRefresh: true,
                  refreshPriority: -10,
                  onEnter: activateSeam,
                  onEnterBack: activateSeam,
                  onLeave: releaseSeam,
                  onLeaveBack: releaseSeam,
                },
              },
            );
          });

          ScrollTrigger.sort();
          const refreshFrame = window.requestAnimationFrame(() => {
            ScrollTrigger.refresh();
          });

          return () => {
            window.cancelAnimationFrame(refreshFrame);
            rootRef.current?.classList.remove("curtain-motion-enabled");
            allPanels.forEach((panel) => {
              panel.classList.remove(
                "curtain-panel--seam-active",
                "curtain-panel--visible",
              );
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
        <div
          className={`section-curtain-panel${
            index < panels.length - 1 ? " curtain-panel--has-next" : ""
          }`}
          key={index}
        >
          <div className="section-curtain-surface">{panel}</div>
        </div>
      ))}
    </div>
  );
}
