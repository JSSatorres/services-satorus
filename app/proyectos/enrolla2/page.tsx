import type { Metadata } from "next";
import { WebsiteCaseStudy } from "@/components/website-case-study";

export const metadata: Metadata = {
  title: "Enrolla2 — caso de estudio web",
  description: "Cómo llevamos la personalidad y el producto de Enrolla2 a una experiencia web que abre el apetito.",
  alternates: { canonical: "/proyectos/enrolla2" },
};

export default function Enrolla2Case() {
  return <WebsiteCaseStudy
    tone="rose"
    eyebrow="Web · Restauración · Valencia"
    title="Una web que"
    accentTitle="abre el apetito."
    lead="Enrolla2 necesitaba que su web tuviera el mismo descaro que sus cinnamon rolls. La construimos como un recorrido visual desde el antojo hasta la tienda."
    heroImage="/projects/enrolla2/hero-desktop.png"
    heroAlt="Portada de la web de Enrolla2 con cinnamon rolls"
    domainLabel="Enrolla2 · Valencia"
    challengeTitle="Traducir una experiencia de mostrador a una pantalla."
    problem="El producto entra por los ojos y la marca vive del tono, del obrador y del trato cercano. Una web convencional de restauración habría apagado justo aquello que la hace reconocible."
    response="Usamos fotografía a gran escala, titulares breves, color y movimiento para construir apetito. Carta, encargos, proceso y ubicación aparecen en el orden natural de una visita."
    decisionTitle="Primero se desea. Luego se decide."
    decisionIntro="La interfaz no intenta explicar demasiado antes de enseñar el producto. Cada sección responde a la siguiente pregunta del visitante."
    decisions={[
      { title:"Producto a tamaño protagonista", body:"El roll abre la página sin competir con párrafos largos. La marca se entiende antes de leerla y la carta queda a un gesto." },
      { title:"El obrador como prueba", body:"Mostrar ingredientes, elaboración diaria y acabado a mano convierte el proceso en una razón tangible para elegir." },
      { title:"De la pantalla al local", body:"Encargos, Instagram, reseñas y ubicación no son extras del pie: forman parte del recorrido y acercan una acción real." },
    ]}
    galleryTitle="Color, producto y oficio."
    galleryIntro="Las capturas conservan la intensidad de la marca en escritorio y móvil, y abren espacio para que la carta y el obrador cuenten el resto."
    gallery={[
      { src:"/projects/enrolla2/carta-desktop.png", alt:"Carta de cinnamon rolls en la web de Enrolla2", label:"01 · Carta", caption:"El producto ordena la elección", position:"top" },
      { src:"/projects/enrolla2/hero-mobile.png", alt:"Portada móvil de la web de Enrolla2", label:"02 · Móvil", caption:"El antojo cabe en una pantalla", fit:"contain" },
      { src:"/projects/enrolla2/obrador-poster.jpg", alt:"Cinnamon roll recién hecho en el obrador", label:"03 · Obrador", caption:"El proceso también comunica" },
    ]}
    services={["Estrategia digital","Arquitectura UX","Dirección visual","Diseño responsive","Desarrollo web"]}
    ctaEyebrow="Tu web también puede tener el sabor de tu negocio"
    ctaTitle="Construyamos una experiencia imposible de confundir."
  />;
}
