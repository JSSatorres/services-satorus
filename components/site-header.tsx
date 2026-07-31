"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";

const links = [
  { href: "#servicios", label: "Qué hacemos" },
  { href: "#como-trabajamos", label: "Cómo trabajamos" },
  { href: "#que-resolvemos", label: "Para quién" },
  { href: "#preguntas", label: "Recursos" },
  { href: "#contacto", label: "Contacto" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Satorus, volver al inicio" translate="no">
        <BrandLogo />
      </a>

      <nav className="desktop-nav" aria-label="Navegación principal">
        {links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>

      <a className="header-cta" href="#contacto">
        Hablemos
        <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2.2} />
      </a>

      <button
        className="menu-button"
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>

      <div className="mobile-nav" id="mobile-navigation" data-open={open}>
        <nav aria-label="Navegación móvil">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a href="#contacto" onClick={() => setOpen(false)}>
            Cuéntanos qué te frena
            <ArrowUpRight aria-hidden="true" size={21} />
          </a>
        </nav>
      </div>
    </header>
  );
}
