"use client";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <motion.div
        className="hero-photo"
        initial={reduceMotion ? false : { clipPath: "inset(0 0 8% 0)" }}
        animate={{ clipPath: "inset(0 0 0% 0)" }}
        transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src="/images/hero-workbench.png"
          alt="Mesa de trabajo azul vista desde arriba con un móvil, papeles, etiquetas, llaves y una mano escribiendo."
          fill
          priority
          sizes="100vw"
        />
      </motion.div>

      <div className="hero-copy">
        <motion.h1
          id="hero-title"
          initial={reduceMotion ? false : { y: 24 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="hero-title-line">Tu negocio,</span>
          <span className="hero-title-line">menos enredado.</span>
        </motion.h1>

        <motion.p
          className="hero-description"
          initial={reduceMotion ? false : { y: 14 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          Creamos webs, herramientas y automatizaciones para pymes. Tú nos cuentas
          qué te frena; nosotros resolvemos la parte técnica.
        </motion.p>
      </div>

      <svg
        className="hero-route"
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path
          d="M -80 520 C 150 430, 300 595, 520 515 S 820 445, 1010 520 S 1260 620, 1510 495"
          fill="none"
          stroke="currentColor"
          strokeWidth="22"
          strokeLinecap="round"
          initial={reduceMotion ? false : { pathLength: 0.18 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>

      <motion.a
        className="hero-cta"
        href="#contacto"
        initial={reduceMotion ? false : { scale: 0.92 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.55, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        Cuéntanos qué te frena
        <ArrowRight aria-hidden="true" size={26} strokeWidth={2.2} />
      </motion.a>

    </section>
  );
}
