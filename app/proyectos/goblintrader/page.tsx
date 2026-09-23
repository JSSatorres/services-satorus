import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, LockKeyhole } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import styles from "@/app/project-detail.module.css";
import own from "./goblintrader.module.css";

export const metadata: Metadata = {
  title: "GoblinTrader — aplicación de gestión a medida",
  description: "Cómo desarrollamos a medida la aplicación de GoblinTrader: caja y tickets con Verifactu, compras, stock, empleados, fichaje y control de accesos en un solo sistema.",
  alternates: { canonical: "/proyectos/goblintrader" },
  openGraph: {
    title: "GoblinTrader, desarrollo a medida",
    description: "Caja, tickets con Verifactu, compras, stock, empleados, fichaje y accesos en una misma aplicación.",
    url: "/proyectos/goblintrader",
    images: [{ url: "/projects/goblintrader/overview-desktop.webp" }],
  },
};

const modules = [
  { title: "Caja y tickets", body: "Apertura y cierre de caja, cobros, reservas y devoluciones desde el mostrador, con el histórico de cada ticket a mano." },
  { title: "Verifactu", body: "Cada ticket se registra conforme a Verifactu y sale impreso con su código QR verificable ante la Agencia Tributaria." },
  { title: "Compras", body: "Pedidos a proveedor, material pendiente de recibir y solicitudes de clientes siguen su estado hasta que llegan a tienda." },
  { title: "Stock y almacén", body: "Existencias por tienda y almacén, avisos de stock bajo y movimientos de material con su trazabilidad." },
  { title: "Pedidos web", body: "Los pedidos de la tienda online entran en el mismo flujo que la venta física, sin duplicar trabajo." },
  { title: "Empleados", body: "Fichas del equipo, permisos por rol y tareas asignadas: cada persona ve lo que necesita para su puesto." },
  { title: "Fichaje", body: "Control horario de entradas, pausas y salidas, con registro fiable y reglas propias de la empresa." },
  { title: "Control de accesos", body: "Quién entra a qué parte del sistema y desde dónde, para que la información sensible quede protegida." },
];

const shots = [
  { src: "/projects/goblintrader/historico-material.webp", alt: "Histórico de material de GoblinTrader con los datos de pedidos, productos y clientes ocultos", label: "01 · Histórico de material", caption: "Estados de cada pedido y cantidades por tienda" },
  { src: "/projects/goblintrader/panel-inicio.webp", alt: "Panel de inicio de un empleado en GoblinTrader con los avisos internos ocultos", label: "02 · Panel del empleado", caption: "Accesos directos a pedidos, reservas y solicitudes" },
];

export default function GoblinTraderCase() {
  return <>
    <SiteHeader />
    <main id="contenido" className={`${styles.page} ${styles.green}`}>
      <div className={styles.backRow}><Link href="/productos#apps"><ArrowLeft size={18} aria-hidden="true" /> Volver a Proyectos</Link></div>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>App · Desarrollo a medida · Comercio</p>
          <h1>Toda la tienda,<span>un sistema.</span></h1>
          <p className={styles.lead}>GoblinTrader es la aplicación que desarrollamos a medida para que un negocio lleve su día a día en un solo lugar: caja y tickets con Verifactu, compras, stock, empleados, fichaje y control de accesos.</p>
          <div className={styles.heroActions}><a className={styles.primary} href="#modulos">Ver qué incluye</a><Link className={styles.secondary} href="/#contacto">Quiero una app así</Link></div>
        </div>
        <div className={`${styles.heroStage} ${styles.productStage}`}>
          <div className={`${styles.heroShot} ${own.heroShot}`}>
            <Image src="/projects/goblintrader/overview-desktop.webp" alt="Panel de GoblinTrader con la caja del día, un móvil con el control horario y un ticket con código Verifactu" fill priority sizes="(max-width:800px) 92vw,54vw" />
          </div>
        </div>
      </section>
      <section className={styles.intro}>
        <div><p className={styles.eyebrow}>El reto</p><h2>Un negocio que no cabía en un programa estándar.</h2></div>
        <div className={styles.introText}>
          <p><strong>Lo que había que resolver</strong>Ventas, pedidos a proveedor, material pendiente, almacén, turnos y fichajes vivían repartidos entre herramientas que no se hablaban. Cada cierre de caja y cada pedido pedía reconstruir la información a mano.</p>
          <p><strong>La dirección</strong>Diseñamos una aplicación a medida alrededor de cómo trabaja el equipo: cada módulo comparte los mismos datos, cada rol ve lo que necesita y los tickets cumplen Verifactu desde el primer día.</p>
        </div>
      </section>
      <section id="modulos" className={styles.decisionSection}>
        <header className={styles.decisionHeading}><div><p className={styles.eyebrow}>Qué incluye</p><h2>Ocho áreas, una sola fuente de verdad.</h2></div><p>No es un TPV con extras: es la herramienta de trabajo diaria de la empresa. Lo que se vende en caja actualiza el stock, lo que se pide a proveedor aparece como pendiente y cada fichaje queda asociado a su persona.</p></header>
        <ol className={own.modules}>{modules.map((module, index) => <li key={module.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{module.title}</h3><p>{module.body}</p></li>)}</ol>
      </section>
      <section className={styles.gallery}>
        <header className={styles.galleryHeading}><div><p className={styles.eyebrow}>La app en uso</p><h2>Capturas reales, datos protegidos.</h2></div><p>Estas pantallas son de la aplicación en producción. Por confidencialidad del cliente, pedidos, productos, clientes y avisos internos aparecen difuminados.</p></header>
        <div className={own.shots}>{shots.map((shot) => <figure key={shot.src}><div className={own.shot}><Image src={shot.src} alt={shot.alt} fill sizes="(max-width:800px) 92vw,90vw" /></div><figcaption><span>{shot.label} · {shot.caption}</span><span className={own.reserved}><LockKeyhole size={16} aria-hidden="true" /> Información reservada</span></figcaption></figure>)}</div>
        <p className={own.note}>GoblinTrader es un desarrollo privado para un cliente particular: no tiene acceso público. Si quieres verla funcionando, te la enseñamos en una llamada.</p>
      </section>
      <section className={styles.services}><p>Trabajo realizado</p><ul>{["Análisis de procesos", "Diseño de producto", "Desarrollo a medida", "Integración Verifactu", "Control horario y accesos", "Soporte y evolución continua"].map((service) => <li key={service}>{service}</li>)}</ul></section>
      <section className={styles.cta}><p className={styles.eyebrow}>Cuando el software estándar se queda corto</p><h2>Construyamos la herramienta que tu negocio necesita.</h2><Link href="/#contacto">Hablemos de tu app <ArrowUpRight size={22} aria-hidden="true" /></Link></section>
    </main>
    <SiteFooter />
  </>;
}
