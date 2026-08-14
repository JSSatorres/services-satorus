"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";

const links = [
  { href: "/#servicios", label: "Qué hacemos" },
  { href: "/productos", label: "Productos" },
  { href: "/#como-trabajamos", label: "Cómo trabajamos" },
  { href: "/#que-resolvemos", label: "Para quién" },
  { href: "/#contacto", label: "Contacto" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 901px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };

    closeOnDesktop();
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  function handleMenuKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!open) return;

    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      menuButtonRef.current?.focus();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = Array.from(
      headerRef.current?.querySelectorAll<HTMLElement>(
        '.menu-button, #mobile-navigation a[href]',
      ) ?? [],
    ).filter((element) => !element.hasAttribute("disabled"));
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

  return (
    <header className="site-header" ref={headerRef} onKeyDown={handleMenuKeyDown}>
      <Link className="wordmark" href="/" aria-label="Satorus, volver al inicio" translate="no">
        <BrandLogo />
      </Link>

      <nav className="desktop-nav" aria-label="Navegación principal">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>

      <Link className="header-cta" href="/#contacto">
        Hablemos
        <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2.2} />
      </Link>

      <button
        ref={menuButtonRef}
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
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href="/#contacto" onClick={() => setOpen(false)}>
            Cuéntanos qué te frena
            <ArrowUpRight aria-hidden="true" size={21} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
