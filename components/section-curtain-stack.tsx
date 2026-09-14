"use client";

import { Children, type ReactNode, useRef, useSyncExternalStore } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { isCurtainTakeoverSuspended } from "@/lib/curtain-nav";
import { getLenis, jumpToScrollTop } from "@/lib/lenis";

type SectionCurtainStackProps = {
  children: ReactNode;
};

type EntranceDirection = "right" | "bottom" | "left";

const MIN_VISIBLE_HEIGHT = 24;
const OUTGOING_DIM = 0.26;
const DIM_PROPERTY = "--curtain-dim";

// La entrada ya no se arrastra con el scroll: se reproduce entera con su propio
// tiempo, como en la referencia (GreenSock, "Animated Continuous Sections with
// GSAP Observer": 1.25s / power1.inOut). Se acorta un poco porque aquí la
// sección entrante trae contenido real y no sólo un titular sobre una foto.
const TRANSITION_DURATION = 1.1;
const TRANSITION_EASE = "power1.inOut";
const HEADING_STAGGER_SPAN = 0.42;

// Un gesto = una sección. Dos eventos de rueda separados por menos que esto son
// el mismo gesto —inercia del trackpad, rueda girada en continuo— y no deben
// encadenar relevos. Una muesca suelta de rueda sí supera el hueco.
const GESTURE_GAP_MS = 90;
const TOUCH_THRESHOLD = 30;
// Margen para comparar posiciones de scroll contra las fronteras calculadas.
const EDGE_EPSILON = 2;

// Alterna lado / frente / lado opuesto para que ninguna entrada se repita seguida.
const DIRECTIONS: EntranceDirection[] = ["right", "bottom", "left", "bottom"];

const SCROLL_KEYS_FORWARD = new Set([" ", "Spacebar", "PageDown", "ArrowDown", "End"]);
const SCROLL_KEYS_BACKWARD = new Set(["PageUp", "ArrowUp", "Home"]);

const MOBILE_QUERY = "(max-width: 900px)";

function subscribeToMobileQuery(onChange: () => void) {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getMobileSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

// El servidor no tiene viewport: se asume escritorio y el primer render del
// cliente corrige. Lo que importa es que esto sea una dependencia de `useGSAP`
// con `revertOnUpdate`: cruzar el breakpoint desmonta el relevo y lo vuelve a
// montar, que es lo único que recalcula `visiblePanels`. Sin eso, al girar el
// móvil `.desktop-scroll-story` seguía participando en el relevo con su sección
// ya en `display: none`: un panel fantasma de una pantalla entera.
function getMobileServerSnapshot() {
  return false;
}

function getEntranceDirection(index: number) {
  return DIRECTIONS[index % DIRECTIONS.length];
}

// Fija el color del panel en la propia superficie para que el lienzo del
// documento no asome mientras la sección entrante todavía está desplazada.
function lockSurfaceBackground(surface: HTMLElement) {
  const section = surface.firstElementChild;
  if (!(section instanceof HTMLElement)) return;

  const background = getComputedStyle(section).backgroundColor;
  if (!background || background === "rgba(0, 0, 0, 0)" || background === "transparent") {
    return;
  }

  surface.style.setProperty("--curtain-panel-background", background);
}

function isEditableTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    target.closest("input, textarea, select, [contenteditable='true']") !== null
  );
}

export function SectionCurtainStack({ children }: SectionCurtainStackProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panels = Children.toArray(children);
  const mobile = useSyncExternalStore(
    subscribeToMobileQuery,
    getMobileSnapshot,
    getMobileServerSnapshot,
  );

  useGSAP(
    () => {
      if (typeof window === "undefined") return;

      gsap.registerPlugin(ScrollTrigger, SplitText);
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) return;

      const allPanels = Array.from(
        rootRef.current?.querySelectorAll<HTMLElement>(".section-curtain-panel") ?? [],
      );
      const visiblePanels = allPanels.filter((panel) => {
        const surface = panel.querySelector<HTMLElement>(".section-curtain-surface");
        return (
          panel.offsetHeight > MIN_VISIBLE_HEIGHT &&
          surface !== null &&
          getComputedStyle(surface).display !== "none"
        );
      });

      if (visiblePanels.length < 2) return;

      rootRef.current?.classList.add("section-gently-enabled");
      visiblePanels.forEach((panel, index) => {
        panel.classList.add("section-gently-panel");
        gsap.set(panel, { zIndex: index + 1 });

        const surface = panel.querySelector<HTMLElement>(".section-curtain-surface");
        if (surface) lockSurfaceBackground(surface);
      });

      // El titular de cada sección entrante lo trocea el relevo en caracteres.
      // `MaskedHeadings` trocea en líneas cualquier h1/h2 del ámbito y los dos
      // troceados no pueden convivir sobre el mismo nodo, así que se marcan
      // aquí —antes de que aquél corra, que espera a `document.fonts.ready`—
      // para que los deje en paz. El panel inicial queda fuera: nunca entra por
      // relevo y conserva su revelado por líneas de la carga.
      visiblePanels.slice(1).forEach((panel) => {
        panel
          .querySelector<HTMLElement>(".section-curtain-surface")
          ?.querySelector<HTMLElement>("h1, h2")
          ?.setAttribute("data-reveal", "off");
      });

      type Pair = {
        direction: EntranceDirection;
        incoming: HTMLElement;
        outgoing: HTMLElement;
        relay: ScrollTrigger;
        chars: HTMLElement[];
        split: SplitText | null;
        timeline: gsap.core.Timeline | null;
      };

      const pairs: Pair[] = [];
      // `abort` es la salida de emergencia del relevo en curso. Matar la
      // timeline no dispara su `onComplete`, así que sin esto un
      // `ScrollTrigger.refresh()` a media animación dejaba `active` encendido
      // para siempre: a partir de ahí `handleIntent` se tragaba todos los
      // gestos y el scroll parecía muerto.
      const takeover = {
        active: false,
        lastGestureAt: 0,
        abort: null as (() => void) | null,
      };

      // Un refresh a mitad de relevo es justo lo que rompe la animación: los
      // que dispara la propia página (abrir el FAQ, terminar de cargar las
      // fuentes) esperan a que el relevo cierre en vez de cortarlo.
      let pendingRefresh = false;

      function requestRefresh() {
        if (takeover.active) {
          pendingRefresh = true;
          return;
        }
        ScrollTrigger.refresh();
      }

      // Fuera de la pila de quien cerró el relevo: `settle` puede estar
      // corriendo dentro del propio `onRefreshInit`, y reentrar en
      // `ScrollTrigger.refresh()` desde ahí lo deja midiendo sobre sí mismo.
      let disposed = false;

      function flushPendingRefresh() {
        if (!pendingRefresh) return;
        pendingRefresh = false;
        window.requestAnimationFrame(() => {
          if (disposed) return;
          ScrollTrigger.refresh();
        });
      }

      function abortTakeover() {
        const abort = takeover.abort;
        if (!abort) return;
        takeover.abort = null;
        abort();
      }

      function resetPair(pair: Pair) {
        pair.timeline?.kill();
        pair.timeline = null;
        gsap.set(pair.incoming, { clearProps: "transform,transformOrigin" });
        pair.outgoing.style.removeProperty(DIM_PROPERTY);
        if (pair.chars.length > 0) {
          gsap.set(pair.chars, { clearProps: "transform,opacity,visibility" });
        } else {
          gsap.set(pair.incoming.querySelectorAll("h1, h2"), {
            clearProps: "transform,opacity,visibility",
          });
        }
      }

      // La entrada se construye para un viewport concreto y sin compensar el
      // scroll: durante el relevo el documento está quieto, así que el panel
      // entrante no se mueve solo y basta con traerlo de fuera hasta su sitio.
      // En reposo la superficie no lleva transform, y eso es lo que permite que
      // los pins anidados y el vídeo fijo del hero sigan anclados al viewport.
      function buildTimeline(pair: Pair, dFactor: 1 | -1) {
        // Distancia real que le queda al panel entrante hasta cubrir, medida
        // en el momento del gesto y con la superficie ya sin transform.
        //
        // Antes esto era `window.innerHeight`, y eso fallaba por dos lados a la
        // vez. Uno: los paneles miden `100svh` —el viewport *pequeño*, con la
        // barra de URL desplegada— mientras que `innerHeight` es el viewport
        // actual, así que en un móvil real diferían en la altura de la barra y
        // el panel aterrizaba desplazado justo esa diferencia. Dos: el scroll no
        // siempre está exactamente en `relay.start` cuando llega el gesto (la
        // inercia de Lenis se lleva un frame por delante), así que la distancia
        // pendiente no era una pantalla entera.
        //
        // Medirla resuelve las dos: `to - scrollActual` es exactamente este
        // `travel`, que es lo que hace que el salto final de `settle` quede
        // tapado al milímetro por el panel ya colocado.
        const travel = pair.incoming.getBoundingClientRect().top;
        const timeline = gsap.timeline({
          paused: true,
          defaults: { duration: TRANSITION_DURATION, ease: TRANSITION_EASE },
        });

        timeline.fromTo(
          pair.outgoing,
          { [DIM_PROPERTY]: 0 },
          { [DIM_PROPERTY]: OUTGOING_DIM, ease: "none" },
          0,
        );

        if (pair.direction === "bottom") {
          // Posición natural del panel entrante al inicio del relevo: asomando
          // por abajo. Subirlo lo que le queda pendiente lo deja cubriendo.
          timeline.fromTo(pair.incoming, { y: 0 }, { y: -travel }, 0);
        } else {
          const sign = pair.direction === "right" ? 1 : -1;

          // Una entrada lateral tiene que ser lateral y nada más: primero se
          // alinea con el viewport en vertical —de una vez, no animado— y el
          // único movimiento visible es el horizontal.
          timeline.set(pair.incoming, { y: -travel, transformOrigin: "50% 0%" }, 0);
          timeline.fromTo(
            pair.incoming,
            { xPercent: sign * 100, scale: mobile ? 1.03 : 1.06 },
            { xPercent: 0, scale: 1, ease: "power2.out" },
            0,
          );
        }

        if (pair.chars.length > 0) {
          // Igual que la referencia: los caracteres suben desde debajo de su
          // propia máscara en orden aleatorio, ya con la sección colocándose.
          timeline.fromTo(
            pair.chars,
            { autoAlpha: 0, yPercent: 150 * dFactor },
            {
              autoAlpha: 1,
              yPercent: 0,
              duration: TRANSITION_DURATION * 0.55,
              ease: "power2",
              // `amount` y no `each`: la referencia escalona titulares de tres
              // palabras sobre una foto, pero aquí los hay de cuarenta
              // caracteres, y a 0.02 por carácter el reparto duraba más que la
              // propia entrada y alargaba el bloqueo del gesto hasta 1,7 s.
              // Repartir un total fijo mantiene el ritmo sea cual sea el largo.
              stagger: { amount: HEADING_STAGGER_SPAN, from: "random" },
            },
            TRANSITION_DURATION * 0.18,
          );
        } else {
          const title = pair.incoming.querySelector<HTMLElement>("h1, h2");
          if (title) {
            timeline.fromTo(
              title,
              { yPercent: mobile ? 24 : 44, autoAlpha: 0.25 },
              {
                yPercent: 0,
                autoAlpha: 1,
                duration: TRANSITION_DURATION * 0.45,
                ease: "power2.out",
              },
              TRANSITION_DURATION * 0.22,
            );
          }
        }

        return timeline;
      }

      visiblePanels.slice(0, -1).forEach((panel, index) => {
        const outgoing = panel.querySelector<HTMLElement>(".section-curtain-surface");
        const nextPanel = visiblePanels[index + 1];
        const incoming = nextPanel.querySelector<HTMLElement>(".section-curtain-surface");
        if (!outgoing || !incoming) return;

        // El par se construye antes que su trigger a propósito: `create()`
        // dispara `onRefreshInit` en el acto, y esa llamada necesita el par ya
        // existente.
        const pair = {
          direction: getEntranceDirection(index),
          incoming,
          outgoing,
          chars: [] as HTMLElement[],
          split: null,
          timeline: null,
        } as Pair;

        // El trigger ya no arrastra nada: sólo publica la geometría del relevo
        // —dónde empieza a asomar la sección entrante y dónde acaba de cubrir—,
        // recalculada en cada refresh. El gesto se atiende aparte.
        pair.relay = ScrollTrigger.create({
          id: "curtain-relay",
          trigger: nextPanel,
          start: "top bottom",
          end: "top top",
          invalidateOnRefresh: true,
          refreshPriority: -10,
          onRefreshInit: () => {
            // Ya estamos dentro de un refresh: cualquier otro que estuviera en
            // cola queda servido por éste.
            pendingRefresh = false;
            // Cerrar el relevo en curso ANTES de que ScrollTrigger mida. Si no,
            // `resetPair` le arranca el transform a media animación —el panel
            // aparece de golpe en su sitio— y, peor, la timeline muere sin
            // disparar su `onComplete`, dejando el takeover encendido.
            abortTakeover();
            resetPair(pair);
          },
        });

        pairs.push(pair);
      });

      if (pairs.length === 0) return;

      // ── Troceado de titulares ───────────────────────────────────────────
      // Hay que esperar a las fuentes: con la de reserva las palabras se parten
      // donde no toca y el troceado cambia la altura del titular.
      function splitHeadings() {
        if (disposed) return;

        pairs.forEach((pair) => {
          const heading = pair.incoming.querySelector<HTMLElement>("h1, h2");
          if (!heading) return;

          const split = new SplitText(heading, {
            type: "chars,words",
            mask: "words",
            wordsClass: "curtain-word",
            charsClass: "curtain-char",
          });

          pair.split = split;
          pair.chars = split.chars as HTMLElement[];
        });

        requestRefresh();
      }

      // Si las fuentes ya están (visita repetida, caché), se trocea en el acto:
      // esperar al microtask dejaba una ventana en la que un relevo temprano
      // animaba el titular entero en vez de carácter a carácter. La misma
      // sección se veía de dos maneras distintas según lo rápido que llegases.
      if (document.fonts.status === "loaded") {
        splitHeadings();
      } else {
        document.fonts.ready.then(splitHeadings);
      }

      // ── Relevo por gesto ────────────────────────────────────────────────
      // Las fronteras nunca se solapan y son adyacentes cuando una sección mide
      // justo un viewport, así que la búsqueda va por el extremo que todavía
      // queda por cruzar en el sentido del gesto: eso deja un único par válido
      // incluso estando parado exactamente encima de una frontera.
      function findForwardPair(scroll: number) {
        for (const pair of pairs) {
          if (pair.relay.end > scroll + EDGE_EPSILON) {
            return scroll >= pair.relay.start - EDGE_EPSILON ? pair : null;
          }
        }
        return null;
      }

      function findBackwardPair(scroll: number) {
        for (let index = pairs.length - 1; index >= 0; index -= 1) {
          const pair = pairs[index];
          if (pair.relay.start < scroll - EDGE_EPSILON) {
            return scroll <= pair.relay.end + EDGE_EPSILON ? pair : null;
          }
        }
        return null;
      }

      function findPair(direction: 1 | -1) {
        const scroll = window.scrollY;
        return direction === 1 ? findForwardPair(scroll) : findBackwardPair(scroll);
      }

      function swallow(event: Event) {
        event.preventDefault();
        // `stopImmediatePropagation` y no `stopPropagation`: Lenis escucha la
        // rueda en el MISMO target (window), y `stopPropagation` sólo corta la
        // propagación a otros targets, no a los listeners vecinos. Sin esto
        // Lenis atendía la misma rueda justo después de nosotros y desplazaba
        // el documento mientras el relevo lo daba por congelado: el panel
        // entrante acababa tantos píxeles por encima del viewport como hubiera
        // avanzado el scroll (medido: -120px con una muesca de rueda).
        event.stopImmediatePropagation();
      }

      function runTakeover(pair: Pair, direction: 1 | -1) {
        const from = pair.relay.start;
        const to = pair.relay.end;
        if (!(to > from)) return;

        takeover.active = true;
        // Matar la inercia pendiente de Lenis antes de empezar, o seguiría
        // moviendo el documento por debajo de la animación.
        getLenis()?.scrollTo(window.scrollY, { immediate: true, force: true });

        // La superficie tiene que estar limpia antes de medir: un transform
        // residual de un relevo anterior falsearía el `travel`.
        resetPair(pair);

        // El salto de scroll y la limpieza del transform ocurren en la misma
        // tarea: entre las dos no hay pintado, así que la sección no parpadea
        // aunque el documento se mueva una altura de viewport entera.
        //
        // El transform se limpia ANTES de saltar, y el orden no es cosmético:
        // `jumpToScrollTop` emite el scroll de Lenis, que actualiza los
        // ScrollTrigger en el acto. Los pins que viven dentro de la sección
        // entrante —la historia de escritorio, que además reparenta— se activan
        // justo en ese punto, y si midieran con la superficie todavía
        // desplazada se anclarían fuera de la pantalla y la sección aparecería
        // en blanco.
        const settle = (target: number) => {
          takeover.abort = null;
          takeover.active = false;
          resetPair(pair);
          jumpToScrollTop(target);
          ScrollTrigger.update();
          flushPendingRefresh();
        };

        if (direction === 1) {
          // El scroll no se toca al empezar. Antes se saltaba a `from` con la
          // timeline todavía en progreso 0 —sin nada cubriendo la pantalla—, y
          // como el gesto llega con el scroll ya un frame de inercia por
          // delante de la frontera, eso era un salto hacia atrás visible. Al
          // medir el recorrido pendiente en `buildTimeline`, el relevo arranca
          // exactamente donde está el usuario y no hace falta mover nada: el
          // único salto es el de `settle`, y ese va tapado por el panel.
          const timeline = buildTimeline(pair, direction);
          pair.timeline = timeline;
          takeover.abort = () => settle(to);
          timeline.eventCallback("onComplete", () => settle(to));
          timeline.play(0);
          return;
        }

        // Hacia atrás el salto va primero y la medida después, en la misma
        // tarea: entre las dos no hay pintado, así que el usuario nunca ve el
        // documento moverse con la pantalla descubierta, y el `travel` se mide
        // ya sobre la geometría de destino.
        jumpToScrollTop(from);
        ScrollTrigger.update();

        const timeline = buildTimeline(pair, direction);
        pair.timeline = timeline;
        takeover.abort = () => settle(from);
        timeline.eventCallback("onReverseComplete", () => settle(from));
        timeline.progress(1, true);
        timeline.reverse();
      }

      function handleIntent(direction: 1 | -1, event: Event, discrete: boolean) {
        if (isCurtainTakeoverSuspended()) return;

        if (takeover.active) {
          swallow(event);
          takeover.lastGestureAt = performance.now();
          return;
        }

        const pair = findPair(direction);
        if (!pair) return; // Dentro de una sección alta: el scroll es suyo.

        // A partir de aquí el documento no puede moverse por su cuenta: pasada
        // esta frontera el scroll nativo metería la sección entrante a trozos,
        // que es justo lo que el relevo sustituye.
        swallow(event);

        const now = performance.now();
        const fresh = discrete || now - takeover.lastGestureAt > GESTURE_GAP_MS;
        takeover.lastGestureAt = now;
        if (!fresh) return;

        runTakeover(pair, direction);
      }

      const onWheel = (event: WheelEvent) => {
        if (event.ctrlKey) return; // zoom del navegador
        if (Math.abs(event.deltaY) < 1) return;
        handleIntent(event.deltaY > 0 ? 1 : -1, event, false);
      };

      let touchStartY = 0;
      let touchConsumed = false;

      const onTouchStart = (event: TouchEvent) => {
        touchStartY = event.touches[0]?.clientY ?? 0;
        touchConsumed = false;
      };

      const onTouchMove = (event: TouchEvent) => {
        if (isEditableTarget(event.target)) return;

        const current = event.touches[0]?.clientY ?? touchStartY;
        const delta = touchStartY - current;
        if (Math.abs(delta) < TOUCH_THRESHOLD) return;

        // Un deslizamiento = una sección: el resto del mismo dedo se traga.
        if (touchConsumed) {
          if (takeover.active) swallow(event);
          return;
        }

        const direction: 1 | -1 = delta > 0 ? 1 : -1;
        if (!takeover.active && !findPair(direction)) return;

        touchConsumed = true;
        handleIntent(direction, event, true);
      };

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.repeat || isEditableTarget(event.target)) return;
        if (event.metaKey || event.ctrlKey || event.altKey) return;

        const forward = SCROLL_KEYS_FORWARD.has(event.key);
        const backward = SCROLL_KEYS_BACKWARD.has(event.key);
        if (!forward && !backward) return;
        if (forward && event.shiftKey) return; // Shift+Espacio sube

        handleIntent(forward ? 1 : -1, event, true);
      };

      const capture = { capture: true, passive: false } as const;
      window.addEventListener("wheel", onWheel, capture);
      window.addEventListener("touchstart", onTouchStart, { capture: true, passive: true });
      window.addEventListener("touchmove", onTouchMove, capture);
      window.addEventListener("keydown", onKeyDown, capture);

      ScrollTrigger.sort();
      const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

      // Abrir una pregunta del FAQ cabe en la pantalla, pero abrir varias hace
      // crecer el panel y deja las fronteras medidas sobre una altura que ya no
      // es. `toggle` de <details> no burbujea, así que se escucha en captura.
      const root = rootRef.current;
      const onToggle = () => requestRefresh();
      root?.addEventListener("toggle", onToggle, true);

      return () => {
        // No se llama a `abortTakeover`: cerrar el relevo mueve el scroll, y al
        // desmontar —cambio de ruta, o el remontaje al cruzar el breakpoint—
        // eso dejaría la página siguiente en una posición arbitraria. El bucle
        // de abajo ya mata las timelines y limpia los transforms, y el estado
        // del takeover muere con el closure.
        disposed = true;
        takeover.abort = null;
        takeover.active = false;
        window.removeEventListener("wheel", onWheel, capture);
        window.removeEventListener("touchstart", onTouchStart, { capture: true });
        window.removeEventListener("touchmove", onTouchMove, capture);
        window.removeEventListener("keydown", onKeyDown, capture);
        root?.removeEventListener("toggle", onToggle, true);
        window.cancelAnimationFrame(refreshFrame);
        pairs.forEach((pair) => {
          resetPair(pair);
          pair.relay.kill();
          pair.split?.revert();
        });
        rootRef.current?.classList.remove("section-gently-enabled");
        allPanels.forEach((panel) => {
          panel.classList.remove("section-gently-panel");
          panel
            .querySelector<HTMLElement>(".section-curtain-surface")
            ?.style.removeProperty("--curtain-panel-background");
        });
      };
    },
    { scope: rootRef, dependencies: [mobile], revertOnUpdate: true },
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
