"use client"

import gsap from "gsap"
import {
  resumeCurtainTakeover,
  suspendCurtainTakeover,
} from "@/lib/curtain-nav"
import { jumpToScrollTop } from "@/lib/lenis"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowUpRight, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react"
import { BrandLogo } from "@/components/brand-logo"
import { RollLabel } from "@/components/roll-label"
import { useHydratedReducedMotion } from "@/components/use-hydrated-reduced-motion"

const links = [
  { href: "/#como-trabajamos", label: "Cómo trabajamos" },
  { href: "/#proyectos", label: "Proyectos" },
  { href: "/#diagnostico", label: "Soluciones" },
]

const SECTION_TRANSITION_DURATION = 0.62
const SECTION_SCROLL_SETTLE_DURATION = 0.8
const SECTION_HANDOFF_DURATION = 0.14

function getSectionId(href: string) {
  return href.startsWith("/#") ? href.slice(2) : null
}

function getSectionElements(sectionId: string) {
  const section = document.getElementById(sectionId)
  return section ? [section] : []
}

function findVisibleSection(sectionId: string) {
  const sections = getSectionElements(sectionId)
  return (
    sections.find((section) => section.getClientRects().length > 0) ??
    sections[0] ??
    null
  )
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

function createSectionPreview(section: HTMLElement) {
  const preview = section.cloneNode(true) as HTMLElement
  preview.classList.add("section-transition-preview")
  preview.classList.remove("curtain-panel--masked")
  preview.removeAttribute("id")
  preview.setAttribute("aria-hidden", "true")
  preview.inert = true

  preview
    .querySelectorAll("[id]")
    .forEach((element) => element.removeAttribute("id"))
  preview
    .querySelectorAll<HTMLElement>(
      "a, button, input, select, summary, textarea",
    )
    .forEach((element) => element.setAttribute("tabindex", "-1"))
  preview
    .querySelectorAll<HTMLElement>(".section-curtain-surface")
    .forEach((surface) => {
      surface.style.setProperty("mask-image", "none")
      surface.style.setProperty("-webkit-mask-image", "none")
    })

  return preview
}

function getSectionScrollTop(section: HTMLElement) {
  return Math.max(0, window.scrollY + section.getBoundingClientRect().top)
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const pathname = usePathname()
  const reducedMotion = useHydratedReducedMotion()
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const activeTransitionRef = useRef<gsap.core.Animation | null>(null)
  const transitionStageRef = useRef<HTMLDivElement | null>(null)
  const resumeScrollTriggersRef = useRef<(() => void) | null>(null)

  function removeTransitionStage() {
    activeTransitionRef.current?.kill()
    activeTransitionRef.current = null
    transitionStageRef.current?.remove()
    transitionStageRef.current = null
    document.documentElement.removeAttribute("data-section-transition")
  }

  function handOffToSection() {
    const stage = transitionStageRef.current
    if (!stage) {
      removeTransitionStage()
      return
    }

    activeTransitionRef.current = gsap.to(stage, {
      autoAlpha: 0,
      duration: SECTION_HANDOFF_DURATION,
      ease: "power1.out",
      onComplete: removeTransitionStage,
    })
  }

  function resumeSectionScrollTriggers() {
    resumeScrollTriggersRef.current?.()
    resumeScrollTriggersRef.current = null
    resumeCurtainTakeover()
  }

  function suspendSectionScrollTriggers(section: HTMLElement) {
    resumeSectionScrollTriggers()
    gsap.registerPlugin(ScrollTrigger)
    suspendCurtainTakeover()

    const panel = section.closest<HTMLElement>(".section-curtain-panel")
    // Los triggers del relevo por gesto sólo publican geometría: deshabilitarlos
    // dejaría al stack sin fronteras con las que decidir, y el salto del header
    // ya queda cubierto suspendiendo el relevo.
    const triggers = panel
      ? ScrollTrigger.getAll().filter(
          (trigger) =>
            trigger.vars.id !== "curtain-relay" &&
            (trigger.trigger === panel || trigger.vars.endTrigger === panel),
        )
      : []

    triggers.forEach((trigger) => {
      trigger.disable(true)
      trigger.animation?.progress(1).pause()
    })

    const resume = () => {
      window.removeEventListener("wheel", resume)
      window.removeEventListener("touchstart", resume)
      triggers.forEach((trigger) => trigger.enable())
      ScrollTrigger.refresh()
      resumeCurtainTakeover()
      resumeScrollTriggersRef.current = null
    }

    resumeScrollTriggersRef.current = resume
    window.addEventListener("wheel", resume, { passive: true, once: true })
    window.addEventListener("touchstart", resume, { passive: true, once: true })
  }

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

  useEffect(() => removeTransitionStage, [])

  useEffect(() => resumeSectionScrollTriggers, [])

  function navigateToSection(section: HTMLElement, hashId = section.id) {
    resumeSectionScrollTriggers()
    // El salto del header cruza varias fronteras de golpe; sin esto el stack
    // de cortinas encadenaría relevos por debajo de su propia cobertura.
    suspendCurtainTakeover()

    // Única pieza que coloca la sección, y a propósito: corrige el SCROLL, no
    // la sección. Antes se remataba con un `transform` sobre la propia sección
    // que se quedaba puesto hasta el primer gesto de rueda. Eso hacía dos
    // daños: un elemento transformado crea bloque contenedor y le rompe el
    // `position: fixed` a sus descendientes —el pin de la historia de
    // escritorio y el vídeo del hero viven ahí dentro—, y al limpiarlo en el
    // primer `wheel` la sección se desplazaba de golpe justo cuando el usuario
    // empezaba a moverse. `getSectionScrollTop` ya es `scrollY + rect.top`, así
    // que repetirlo converge a `rect.top = 0` sin tocar el DOM.
    const alignSectionWithViewport = () => {
      jumpToScrollTop(getSectionScrollTop(section))
    }
    const settleSectionPosition = (onSettled: () => void) => {
      let remainingFrames = 6

      const alignAfterScrollTriggerUpdate = () => {
        alignSectionWithViewport()
        remainingFrames -= 1

        if (remainingFrames > 0) {
          window.requestAnimationFrame(alignAfterScrollTriggerUpdate)
          return
        }

        onSettled()
      }

      alignAfterScrollTriggerUpdate()
    }

    if (reducedMotion) {
      suspendSectionScrollTriggers(section)
      settleSectionPosition(() => {
        window.history.pushState(null, "", `/#${hashId}`)
      })
      return
    }

    removeTransitionStage()

    const stage = document.createElement("div")
    const preview = createSectionPreview(section)
    stage.className = "section-transition-stage"
    stage.append(preview)
    document.body.append(stage)
    document.documentElement.setAttribute("data-section-transition", "true")
    transitionStageRef.current = stage

    const transition = gsap.timeline({
      onComplete: () => {
        suspendSectionScrollTriggers(section)
        settleSectionPosition(() => {
          window.history.pushState(null, "", `/#${hashId}`)
          activeTransitionRef.current = gsap.delayedCall(
            SECTION_SCROLL_SETTLE_DURATION,
            handOffToSection,
          )
        })
      },
    })

    transition.fromTo(
      preview,
      {
        y: stage.clientHeight,
        scale: 1.03,
      },
      {
        y: 0,
        scale: 1,
        duration: SECTION_TRANSITION_DURATION,
        ease: "power4.out",
      },
    )

    activeTransitionRef.current = transition
  }

  function handleSectionLinkClick(
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    const sectionId = getSectionId(href)
    if (!sectionId || pathname !== "/" || !canHandleSectionLink(event)) return

    const section = findVisibleSection(sectionId)
    if (!section) return

    event.preventDefault()
    setOpen(false)
    navigateToSection(section, sectionId)
  }

  useEffect(() => {
    const sectionId = window.location.hash.slice(1)
    if (!sectionId || pathname !== "/") return

    const target = document.getElementById(sectionId)
    if (target && target.getClientRects().length > 0) return

    const visible = findVisibleSection(sectionId)
    if (!visible || visible === target) return

    jumpToScrollTop(getSectionScrollTop(visible))
  }, [pathname])

  useEffect(() => {
    const sections = links
      .map((link) => getSectionId(link.href))
      .filter((sectionId): sectionId is string => sectionId !== null)
      .flatMap((sectionId) => getSectionElements(sectionId))

    if (sections.length === 0 || !("IntersectionObserver" in window)) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0]

        if (visibleSection) {
          setActiveSection(visibleSection.target.id.replace(/-movil$/, ""))
        }
      },
      { rootMargin: "-28% 0px -58%", threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

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
