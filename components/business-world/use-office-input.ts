"use client";

import { useEffect, type RefObject } from "react";
import {
  nextDestination,
  shouldLeavePanel,
  type OfficePhase,
} from "@/lib/office-route";

function editable(target: EventTarget | null) {
  return (
    target instanceof Element &&
    !!target.closest("input, textarea, select, [contenteditable='true']")
  );
}
export function useOfficeInput(
  root: RefObject<HTMLDivElement | null>,
  panels: RefObject<(HTMLDivElement | null)[]>,
  state: RefObject<{ index: number; phase: OfficePhase; arrived: number }>,
  navigate: (index: number) => void,
) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let touchForward = false,
      touchBack = false,
      heldGesture = false;
    let total = 0,
      lastWheel = 0,
      startY = 0,
      startX = 0;
    let releaseFrame = 0;
    let idle = 0;
    let previousFrame = 0;
    // Measure idle frames rather than wall-clock gaps: compiling/rendering the
    // first office frame can stall the main thread while wheel inertia continues.
    const releaseWheel = (time: number) => {
      idle += Math.min(50, time - previousFrame);
      previousFrame = time;
      if (idle >= 160) {
        heldGesture = false;
        releaseFrame = 0;
      } else releaseFrame = requestAnimationFrame(releaseWheel);
    };
    const holdWheel = () => {
      heldGesture = true;
      idle = 0;
      if (!releaseFrame) {
        previousFrame = performance.now();
        releaseFrame = requestAnimationFrame(releaseWheel);
      }
    };
    const canLeave = (direction: 1 | -1) => {
      const { index, phase } = state.current;
      if (phase === "office") return true;
      const panel = panels.current[index];
      return (
        phase === "reading" &&
        !!panel &&
        shouldLeavePanel(
          panel.scrollTop,
          panel.clientHeight,
          panel.scrollHeight,
          direction,
        )
      );
    };
    const advance = (direction: 1 | -1) => {
      const next = nextDestination(state.current.index, direction);
      if (next !== state.current.index) navigate(next);
    };
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY))
        return;
      const now = performance.now();
      const gap = now - lastWheel;
      lastWheel = now;
      const { phase } = state.current;
      idle = 0;
      if (phase !== "reading" && phase !== "office") {
        event.preventDefault();
        total = 0;
        holdWheel();
        return;
      }
      if (heldGesture) {
        event.preventDefault();
        total = 0;
        return;
      }
      const direction = event.deltaY > 0 ? 1 : -1;
      if (!canLeave(direction) || editable(event.target)) {
        total = 0;
        return;
      }
      event.preventDefault();
      if (gap > 160 || Math.sign(total) !== direction) total = 0;
      total +=
        event.deltaY *
        (event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? element.clientHeight
            : 1);
      if (Math.abs(total) >= 60) {
        total = 0;
        holdWheel();
        advance(direction);
      }
    };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (state.current.index >= 0) navigate(-1);
        return;
      }
      if (
        editable(event.target) ||
        (event.target instanceof Element &&
          event.target.closest("button, a, summary"))
      )
        return;
      const direction = ["ArrowDown", "PageDown", " "].includes(event.key)
        ? 1
        : ["ArrowUp", "PageUp"].includes(event.key)
          ? -1
          : 0;
      if (!direction) return;
      event.preventDefault();
      if (state.current.phase !== "reading" && state.current.phase !== "office")
        return;
      if (canLeave(direction)) advance(direction);
      else
        panels.current[state.current.index]?.scrollBy({
          top:
            direction *
            (event.key.startsWith("Arrow") ? 70 : element.clientHeight * 0.8),
          behavior: "auto",
        });
    };
    const touchStart = (event: TouchEvent) => {
      touchForward = canLeave(1);
      touchBack = canLeave(-1);
      startY = event.touches[0].clientY;
      startX = event.touches[0].clientX;
    };
    const touchMove = (event: TouchEvent) => {
      if (state.current.phase !== "reading" && state.current.phase !== "office")
        event.preventDefault();
    };
    const touchEnd = (event: TouchEvent) => {
      const dy = startY - event.changedTouches[0].clientY,
        dx = startX - event.changedTouches[0].clientX;
      if (
        Math.abs(dy) < 36 ||
        Math.abs(dx) > Math.abs(dy) ||
        editable(event.target)
      )
        return;
      const direction = dy > 0 ? 1 : -1;
      if ((direction > 0 ? touchForward : touchBack) && canLeave(direction))
        advance(direction);
    };
    element.addEventListener("wheel", wheel, { passive: false });
    element.addEventListener("keydown", keyboard);
    element.addEventListener("touchstart", touchStart, { passive: true });
    element.addEventListener("touchmove", touchMove, { passive: false });
    element.addEventListener("touchend", touchEnd, { passive: true });
    return () => {
      cancelAnimationFrame(releaseFrame);
      element.removeEventListener("wheel", wheel);
      element.removeEventListener("keydown", keyboard);
      element.removeEventListener("touchstart", touchStart);
      element.removeEventListener("touchmove", touchMove);
      element.removeEventListener("touchend", touchEnd);
    };
  }, [root, panels, state, navigate]);
}
