import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SportAppWaitlistForm } from "@/components/sportapp-waitlist-form";
import styles from "../../project-detail.module.css";
import localStyles from "./sportapp.module.css";

export const metadata: Metadata = {
  title: "SportApp — gestión para clubes",
  description: "SportApp conecta sedes, equipos, jugadores, entrenadores, sesiones y documentos en un solo espacio.",
  alternates: { canonical: "/productos/sportapp" },
};

const decisions = [
  ["El club antes que el calendario", "Las sesiones importan, pero cobran sentido junto a la sede, el equipo, las personas y los documentos que las rodean."],
  ["La nota viaja con el contexto", "Una observación guardada en el campo queda visible para quien coordina desde la oficina, sin llamadas ni mensajes que luego desaparecen."],
  ["Crecer sin perder la estructura", "El producto se plantea para varios equipos y sedes: cada usuario ve el trabajo que le corresponde dentro de un sistema compartido."],
];

export default function SportAppPage() {
  return <>
    <SiteHeader />
    <main id="contenido" className={`${styles.page} ${styles.orange}`}>
      <div className={styles.backRow}><Link href="/productos#apps"><ArrowLeft size={18} aria-hidden="true" /> Volver a Apps</Link></div>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Producto propio · Acceso anticipado</p>
          <h1>El club entero,<span>al día.</span></h1>
          <p className={styles.lead}>SportApp reúne sedes, equipos, jugadores, entrenadores, sesiones y documentos para que el trabajo del club no se quede disperso.</p>
          <div className={styles.heroActions}><a className={styles.primary} href="#lista-espera">Quiero probarlo</a><a className={styles.secondary} href="#decisiones">Ver el planteamiento</a></div>
        </div>
        <div className={`${styles.heroStage} ${styles.productStage}`}><div className={styles.heroShot}><Image src="/projects/sportapp/dashboard.png" alt="Dashboard semanal de SportApp" fill priority sizes="(max-width:800px) 92vw,54vw" /></div></div>
      </section>
      <section className={styles.intro}>
        <div><p className={styles.eyebrow}>El punto de partida</p><h2>El trabajo ocurre en el campo. El contexto no debería quedarse allí.</h2></div>
        <div className={styles.introText}>
          <p><strong>El problema</strong>Calendarios, notas, documentos y datos de jugadores terminan repartidos entre hojas, chats y la memoria de varias personas.</p>
          <p><strong>La respuesta</strong>Una vista común donde cada sesión queda relacionada con su equipo y toda la información necesaria para preparar el siguiente turno.</p>
        </div>
      </section>
      <section id="decisiones" className={styles.decisionSection}>
        <header className={styles.decisionHeading}><div><p className={styles.eyebrow}>Decisiones de producto</p><h2>Conectar sin complicar.</h2></div><p>La aplicación está en desarrollo. Enseñamos lo que ya existe y la lógica que guía las siguientes piezas.</p></header>
        <ol className={styles.decisions}>{decisions.map(([title, body], i) => <li key={title}><span>{String(i + 1).padStart(2,"0")}</span><h3>{title}</h3><p>{body}</p></li>)}</ol>
      </section>
      <section className={styles.gallery}>
        <header className={styles.galleryHeading}><div><p className={styles.eyebrow}>Campo y oficina</p><h2>La misma historia, vista desde dos lugares.</h2></div><p>SportApp convierte lo que pasa en una sesión en información útil para todo el club.</p></header>
        <div className={localStyles.splitScene}>
          <figure><div className={localStyles.training}><Image src="/projects/sportapp/training.png" alt="Equipo de fútbol entrenando en el campo" fill sizes="(max-width:800px) 92vw,55vw" /></div><figcaption>Donde ocurre el trabajo</figcaption></figure>
          <figure><div className={localStyles.dashboard}><Image src="/projects/sportapp/dashboard.png" alt="Calendario y sesiones en SportApp" fill sizes="(max-width:800px) 92vw,38vw" /></div><figcaption>Donde el club conserva el contexto</figcaption></figure>
        </div>
      </section>
      <section className={styles.services}><p>Información conectada</p><ul><li>Sedes</li><li>Equipos y personas</li><li>Sesiones</li><li>Notas del entrenador</li><li>Documentos</li></ul></section>
      <section id="lista-espera" className={localStyles.waitlist}>
        <div><p className={styles.eyebrow}>Primeras pruebas</p><h2>Sé de los primeros en probar SportApp.</h2><p>Estamos cerrando las últimas piezas. Déjanos tu correo y te avisaremos cuando abramos el acceso para clubes y academias.</p></div>
        <div className={localStyles.formSheet}><SportAppWaitlistForm /></div>
      </section>
      <section className={styles.cta}><p className={styles.eyebrow}>¿Tu equipo también trabaja entre demasiadas herramientas?</p><h2>Podemos diseñar una ruta mejor.</h2><Link href="/#contacto">Cuéntanos el problema <ArrowUpRight size={22} aria-hidden="true" /></Link></section>
    </main>
    <SiteFooter />
  </>;
}
