"use client"

import { ArrowUpRight, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react"
import { BrandLogo } from "@/components/brand-logo"
import { RollLabel } from "@/components/roll-label"
import { BOOK_SPREAD_EVENT } from "@/lib/book-content"
import { scrollToSection } from "@/lib/lenis"

const links = [
  { href: "/#como-trabajamos", label: "Cómo trabajamos" },
  { href: "/#que-hacemos", label: "Qué hacemos" },
  { href: "/#preguntas", label: "Preguntas" },
]

function getSectionId(href: string) {
  return href.startsWith("/#") ? href.slice(2) : null
}

function canHandleSectionLink(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.body.classList.toggle("menu-open", open)
    return () => document.body.classList.remove("menu-open")
  }, [open])

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 901px)")
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false)
    }

    closeOnDesktop()
    desktop.addEventListener("change", closeOnDesktop)
    return () => desktop.removeEventListener("change", closeOnDesktop)
  }, [])

  // En el home, los enlaces a secciones pasan de página con el mismo scroll
  // que la rueda: sin cortinas ni clones de la sección.
  function handleSectionLinkClick(
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    // El libro atiende en captura los enlaces a sus historias: si ya ha
    // pasado las hojas, aquí sólo queda cerrar el menú.
    if (event.defaultPrevented) {
      setOpen(false)
      return
    }

    const sectionId = getSectionId(href)
    if (!sectionId || pathname !== "/" || !canHandleSectionLink(event)) return

    const section = document.getElementById(sectionId)
    if (!section) return

    event.preventDefault()
    setOpen(false)
    window.history.pushState(null, "", `/#${sectionId}`)
    scrollToSection(section)
  }

  useEffect(() => {
    if (pathname !== "/") return

    const sections = links
      .map((link) => getSectionId(link.href))
      .filter((sectionId): sectionId is string => sectionId !== null)
      .map((sectionId) => document.getElementById(sectionId))
      // Las historias del libro no pasan por el viewport: las anuncia el libro.
      .filter(
        (section): section is HTMLElement =>
          section !== null && !section.closest(".bk"),
      )

    if (sections.length === 0 || !("IntersectionObserver" in window)) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0]

        if (visibleSection) setActiveSection(visibleSection.target.id)
      },
      { rootMargin: "-28% 0px -58%", threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))

    const onSpread = (event: Event) => {
      const id = (event as CustomEvent<string | null>).detail
      if (links.some((link) => getSectionId(link.href) === id)) setActiveSection(id)
      else setActiveSection(null)
    }
    window.addEventListener(BOOK_SPREAD_EVENT, onSpread)

    return () => {
      observer.disconnect()
      window.removeEventListener(BOOK_SPREAD_EVENT, onSpread)
    }
  }, [pathname])

  function handleMenuKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!open) return

    if (event.key === "Escape") {
      event.preventDefault()
      setOpen(false)
      menuButtonRef.current?.focus()
      return
    }

    if (event.key !== "Tab") return

    const focusable = Array.from(
      headerRef.current?.querySelectorAll<HTMLElement>(
        ".menu-button, #mobile-navigation a[href]",
      ) ?? [],
    ).filter((element) => !element.hasAttribute("disabled"))
    const first = focusable[0]
    const last = focusable.at(-1)

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
  }

  return (
    <header
      className="site-header"
      ref={headerRef}
      onKeyDown={handleMenuKeyDown}
    >
      <Link
        className="wordmark"
        href="/"
        aria-label="Satorus, volver al inicio"
        translate="no"
      >
        <BrandLogo />
      </Link>

      <nav className="desktop-nav" aria-label="Navegación principal">
        {links.map((link) => {
          const sectionId = getSectionId(link.href)
          const isActive = sectionId
            ? sectionId === activeSection
            : pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "location" : undefined}
              data-active={isActive}
              onClick={(event) => handleSectionLinkClick(event, link.href)}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="header-actions">
        <Link className="header-secondary-cta" href="/productos">
          <RollLabel>Mira algunos de nuestros proyectos</RollLabel>
          <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2.2} />
        </Link>

        <Link
          className="header-cta"
          href="/#contacto"
          onClick={(event) => handleSectionLinkClick(event, "/#contacto")}
        >
          <RollLabel>Hablemos de tu negocio</RollLabel>
          <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2.2} />
        </Link>
      </div>

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
          {links.map((link) => {
            const sectionId = getSectionId(link.href)
            const isActive = sectionId
              ? sectionId === activeSection
              : pathname === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "location" : undefined}
                data-active={isActive}
                onClick={(event) => {
                  handleSectionLinkClick(event, link.href)
                  setOpen(false)
                }}
              >
                {link.label}
              </Link>
            )
          })}
          <Link
            className="mobile-nav-secondary"
            href="/productos"
            aria-current={pathname === "/productos" ? "location" : undefined}
            data-active={pathname === "/productos"}
            onClick={() => setOpen(false)}
          >
            Mira algunos de nuestros proyectos
            <ArrowUpRight aria-hidden="true" size={21} />
          </Link>
          <Link
            href="/#contacto"
            onClick={(event) => {
              handleSectionLinkClick(event, "/#contacto")
              setOpen(false)
            }}
          >
            Hablemos de tu negocio
            <ArrowUpRight aria-hidden="true" size={21} />
          </Link>
        </nav>
      </div>
    </header>
  )
}
