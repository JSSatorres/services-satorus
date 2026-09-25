"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";

const links = [
  { href: "/#diagnostico", label: "Soluciones" },
  { href: "/#proyectos", label: "Proyectos" },
  { href: "/#como-trabajamos", label: "Cómo trabajamos" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 901px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!open) return;
    if (event.key === "Escape") {
      setOpen(false);
      menuButton.current?.focus();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = Array.from(
      header.current?.querySelectorAll<HTMLElement>("a[href], button") ?? [],
    ).filter(
      (element) =>
        element.getClientRects().length > 0 && !element.closest("[inert]"),
    );
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  function sectionHref(href: string) {
    return pathname === "/" ? href.slice(1) : href;
  }
  return (
    <header className="site-header" ref={header} onKeyDown={handleKeyDown}>
      <Link
        className="wordmark"
        href="/"
        aria-label="Satorus, volver al inicio"
        translate="no"
        onClick={() => setOpen(false)}
      >
        <BrandLogo />
      </Link>
      <nav className="desktop-nav" aria-label="Navegación principal">
        {links.map((link) => (
          <a key={link.href} href={sectionHref(link.href)}>
            {link.label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <a
          className="header-cta"
          href={sectionHref("/#contacto")}
          onClick={() => setOpen(false)}
        >
          Hablemos de tu negocio <ArrowUpRight aria-hidden="true" size={18} />
        </a>
      </div>
      <button
        ref={menuButton}
        className="menu-button"
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      <div
        className="mobile-nav"
        id="mobile-navigation"
        data-open={open}
        inert={!open ? true : undefined}
      >
        <nav aria-label="Navegación móvil">
          {links.map((link) => (
            <a
              key={link.href}
              href={sectionHref(link.href)}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link href="/productos" onClick={() => setOpen(false)}>
            Todos los proyectos <ArrowUpRight aria-hidden="true" size={21} />
          </Link>
          <a href={sectionHref("/#contacto")} onClick={() => setOpen(false)}>
            Hablemos de tu negocio <ArrowUpRight aria-hidden="true" size={21} />
          </a>
        </nav>
      </div>
    </header>
  );
}
