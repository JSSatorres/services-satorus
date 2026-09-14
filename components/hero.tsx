"use client";

import { ArrowRight } from "lucide-react";
import { HeroKineticLockup } from "@/components/hero-kinetic-lockup";
import { HeroMedia } from "@/components/hero-media";
import { RollLabel } from "@/components/roll-label"

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <HeroMedia />

      <HeroKineticLockup />

      <a
        className="hero-cta"
        href="#contacto"
      >
        <RollLabel>Hablemos de tu negocio</RollLabel>
        <ArrowRight aria-hidden="true" size={26} strokeWidth={2.2} />
      </a>

    </section>
  );
}
