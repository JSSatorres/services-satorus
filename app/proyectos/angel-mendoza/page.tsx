import type { Metadata } from "next";
import { WebsiteCaseStudy } from "@/components/website-case-study";

export const metadata: Metadata = {
  title: "Ángel Mendoza — caso de estudio web",
  description: "Cómo diseñamos la web personal de Ángel Mendoza para convertir experiencia en una propuesta clara para clínicas.",
  alternates: { canonical: "/proyectos/angel-mendoza" },
};

export default function AngelMendozaCase() {
  return <WebsiteCaseStudy
    tone="cyan"
    eyebrow="Web · Marca personal · Sector salud"
    title="Autoridad sin"
    accentTitle="distancia."
    lead="La web de Ángel Mendoza convierte una trayectoria de más de 25 años en una propuesta directa para clínicas: claridad, cercanía y una conversación como siguiente paso."
    heroImage="/projects/angel-mendoza/site-desktop.png"
    heroAlt="Web personal de Ángel Mendoza en escritorio"
    domainLabel="angelmendoza.es"
    challengeTitle="Hacer visible la experiencia sin sonar como otra consultora."
    problem="Ángel necesitaba explicar una especialización muy concreta —comunicación y marketing para el sector salud— con autoridad, pero manteniendo el trato personal que define su forma de trabajar."
    response="Construimos la página alrededor de su presencia y de una idea fácil de recordar: Tu consultor de cabecera. Desde ahí, cada bloque reduce una duda antes de invitar a una consulta inicial."
    decisionTitle="La persona es la propuesta."
    decisionIntro="La dirección visual, el orden del contenido y los llamados a la acción trabajan para que el visitante entienda pronto quién le puede ayudar y cómo empezar."
    decisions={[
      { title:"Una promesa con lenguaje propio", body:"“Tu consultor de cabecera” conecta el servicio con el mundo de las clínicas y evita una presentación genérica de marketing." },
      { title:"Ángel desde el primer segundo", body:"El retrato y la voz en primera persona hacen que la experiencia se perciba cercana. No escondemos a la persona detrás de una marca abstracta." },
      { title:"Una ruta hacia la conversación", body:"Problema, especialización, forma de trabajar y confianza aparecen antes de la consulta gratuita. El contacto llega cuando ya existe contexto." },
    ]}
    galleryTitle="Una historia que funciona en cada pantalla."
    galleryIntro="La versión móvil mantiene la jerarquía y la llamada principal; las imágenes de trabajo aportan prueba humana sin convertir la página en un currículum."
    gallery={[
      { src:"/projects/angel-mendoza/site-mobile.png", alt:"Portada móvil de la web de Ángel Mendoza", label:"01 · Móvil", caption:"Propuesta y acción desde el inicio", fit:"contain" },
      { src:"/projects/angel-mendoza/angel-consulta.png", alt:"Ángel Mendoza durante una consulta", label:"02 · Cercanía", caption:"La persona detrás del servicio" },
      { src:"/projects/angel-mendoza/angel-expodental.png", alt:"Ángel Mendoza en un evento del sector dental", label:"03 · Experiencia", caption:"Autoridad situada en su sector" },
    ]}
    services={["Estrategia y posicionamiento","Arquitectura de contenidos","Copywriting","Dirección visual","Diseño y desarrollo web"]}
    ctaEyebrow="Una web personal no tiene que parecer una plantilla"
    ctaTitle="Hagamos que tu experiencia sea fácil de entender y elegir."
  />;
}
