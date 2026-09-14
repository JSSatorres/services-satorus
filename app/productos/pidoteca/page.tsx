import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import styles from "../../project-detail.module.css";

export const metadata: Metadata = {
  title: "Pidoteca — producto para restauración",
  description: "Cómo construimos Pidoteca para conectar la experiencia de la mesa con el trabajo de sala, cocina y gestión.",
  alternates: { canonical: "/productos/pidoteca" },
};

const decisions = [
  ["Un QR con propósito", "La entrada no obliga a descargar nada. Cada mesa abre directamente su carta, conserva el contexto y puede pedir o solicitar la cuenta desde el móvil."],
  ["Una única realidad del turno", "El tablero reúne pedidos, reservas y estado de las mesas para que sala, barra y cocina no tengan que reconstruir lo ocurrido entre canales."],
  ["Profundidad sin ruido", "Menú, códigos QR, clientes, empleados, estadísticas e impresión existen como módulos del mismo sistema, pero el turno conserva la prioridad visual."],
];

export default function PidotecaPage() {
  return <>
    <SiteHeader />
    <main id="contenido" className={`${styles.page} ${styles.blue}`}>
      <div className={styles.backRow}><Link href="/productos#apps"><ArrowLeft size={18} aria-hidden="true" /> Volver a Apps</Link></div>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Producto propio · Restauración</p>
          <h1>El turno,<span>conectado.</span></h1>
          <p className={styles.lead}>Pidoteca une el QR de la mesa con pedidos, sala, cocina, barra y gestión. Menos pasos aislados; más contexto compartido.</p>
          <div className={styles.heroActions}>
            <a className={styles.primary} href="https://pidoteca.com" target="_blank" rel="noreferrer">Visitar Pidoteca <ArrowUpRight size={20} aria-hidden="true" /></a>
            <a className={styles.secondary} href="#decisiones">Ver cómo lo planteamos</a>
          </div>
        </div>
        <div className={`${styles.heroStage} ${styles.productStage}`}><div className={styles.heroShot}><Image src="/projects/pidoteca/dashboard.png" alt="Panel real de mesas y pedidos de Pidoteca" fill priority sizes="(max-width: 800px) 92vw, 54vw" /></div></div>
      </section>
      <section className={styles.intro}>
        <div><p className={styles.eyebrow}>El punto de partida</p><h2>Un servicio no debería depender de recordar qué falta.</h2></div>
        <div className={styles.introText}>
          <p><strong>El problema</strong>El cliente, la mesa, el camarero, cocina y caja suelen vivir en recorridos separados. Cada salto añade espera y obliga al equipo a preguntar de nuevo.</p>
          <p><strong>La respuesta</strong>Diseñamos una ruta continua: la mesa inicia el pedido, cada estación recibe lo que le corresponde y la gestión conserva una vista completa del negocio.</p>
        </div>
      </section>
      <section id="decisiones" className={styles.decisionSection}>
        <header className={styles.decisionHeading}><div><p className={styles.eyebrow}>Decisiones de producto</p><h2>Diseñado alrededor del turno.</h2></div><p>No queríamos sumar otra pantalla al restaurante. Queríamos que cada pantalla eliminara una duda concreta.</p></header>
        <ol className={styles.decisions}>{decisions.map(([title, body], i) => <li key={title}><span>{String(i + 1).padStart(2,"0")}</span><h3>{title}</h3><p>{body}</p></li>)}</ol>
      </section>
      <section className={styles.gallery}>
        <header className={styles.galleryHeading}><div><p className={styles.eyebrow}>El sistema en contexto</p><h2>De la mesa al panel.</h2></div><p>Las capturas muestran el producto real: una experiencia directa para el cliente y una vista operativa para el equipo.</p></header>
        <div className={styles.galleryGrid}>
          <figure><div className={styles.imageFrame}><Image src="/projects/pidoteca/customer-qr.webp" alt="Cliente usando el QR de Pidoteca en la mesa" fill sizes="(max-width:800px) 92vw,58vw" /></div><figcaption><span>01 · Cliente</span><span>Escanear, elegir y pedir</span></figcaption></figure>
          <figure><div className={styles.imageFrame} data-fit="contain"><Image src="/projects/pidoteca/overview.png" alt="Presentación del recorrido conectado de Pidoteca" fill sizes="(max-width:800px) 92vw,34vw" /></div><figcaption><span>02 · Equipo</span><span>El turno de un vistazo</span></figcaption></figure>
          <figure><div className={styles.imageFrame} data-fit="contain"><Image src="/projects/pidoteca/table-map.png" alt="Mapa visual de mesas de Pidoteca" fill sizes="92vw" /></div><figcaption><span>03 · Sala</span><span>Mesas situadas en el espacio real</span></figcaption></figure>
        </div>
      </section>
      <section className={styles.services}><p>Trabajo realizado</p><ul><li>Estrategia de producto</li><li>Arquitectura UX</li><li>Diseño de interfaz</li><li>Desarrollo web</li><li>Sistema operativo de restaurante</li></ul></section>
      <section className={styles.cta}><p className={styles.eyebrow}>¿Tienes un proceso que todavía vive a trozos?</p><h2>Podemos convertirlo en una herramienta clara.</h2><Link href="/#contacto">Hablemos de tu proyecto <ArrowUpRight size={22} aria-hidden="true" /></Link></section>
    </main>
    <SiteFooter />
  </>;
}
