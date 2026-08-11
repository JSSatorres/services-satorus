import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChefHat,
  ClipboardCheck,
  FileText,
  MapPinned,
  QrCode,
  UsersRound,
} from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PidotecaJourneyScene } from "@/components/pidoteca-journey-scene";
import { SectionCurtainStack } from "@/components/section-curtain-stack";
import { SportAppWaitlistForm } from "@/components/sportapp-waitlist-form";
import styles from "./productos.module.css";

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Conoce Pidoteca y SportApp, dos productos de Satorus creados para ordenar el trabajo cotidiano de restaurantes y clubes deportivos.",
  openGraph: {
    title: "Productos de Satorus",
    description:
      "Pidoteca conecta el turno de un restaurante. SportApp conecta el trabajo completo de un club deportivo.",
    images: [{ url: "/products/pidoteca-dashboard.png" }],
  },
};

const directionContract = `<!--
THESIS: Dos productos salen del mismo taller y convierten recorridos cotidianos dispersos en una ruta visible; se rechaza el catálogo de tarjetas SaaS.
OWN-WORLD: Papel frío, naranja, lima y grafito dominan; el color propio de cada producto solo vive dentro de su interfaz real.
STORY: El visitante entiende qué resuelve Pidoteca, visita su producto, descubre SportApp y se apunta para probarlo antes de su salida.
FIRST VIEWPORT: Titular comprimido a la izquierda y dos hojas de producto sobre una mesa lima sin cuadrícula; los dos destinos están visibles sin desplazarse.
FORM: Dossier en tres cortinas largas; Pidoteca se explica con el recorrido animado real de su primera escena.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

const pidotecaSteps = [
  {
    icon: QrCode,
    title: "La mesa abre el turno",
    body: "El cliente entra desde el QR, consulta carta y menú diario y pide desde el móvil sin instalar una app.",
  },
  {
    icon: ChefHat,
    title: "El pedido llega donde toca",
    body: "Sala, cocina y barra siguen el mismo pedido. Las impresoras separan platos, bebidas, QR y recibos.",
  },
  {
    icon: ClipboardCheck,
    title: "El turno deja información útil",
    body: "Mesas, reservas, ventas, costes, horas punta y retorno de clientes quedan reunidos para decidir con contexto.",
  },
];

const sportAppParts = [
  { icon: MapPinned, label: "Sedes" },
  { icon: UsersRound, label: "Equipos y personas" },
  { icon: CalendarDays, label: "Sesiones" },
  { icon: ClipboardCheck, label: "Notas del entrenador" },
  { icon: FileText, label: "Documentos" },
];

export default function ProductsPage() {
  return (
    <>
      <SiteHeader />
      <main id="contenido" className={styles.page}>
        <div
          hidden
          aria-hidden="true"
          data-direction-contract="27190dbd"
          dangerouslySetInnerHTML={{ __html: directionContract }}
        />

        <SectionCurtainStack>
          <section className={styles.hero} aria-labelledby="products-title">
          <div className={styles.heroCopy}>
            <h1 id="products-title">
              Dos productos.
              <span>Menos trabajo suelto.</span>
            </h1>
            <p>
              Creamos herramientas cuando vemos un problema que merece algo mejor:
              una ruta clara, menos copia y pega y todo el equipo mirando la misma realidad.
            </p>
            <nav className={styles.productJump} aria-label="Ver productos">
              <a href="#pidoteca">
                Pidoteca
                <span>Ya disponible</span>
                <ArrowDown aria-hidden="true" size={20} />
              </a>
              <a href="#sportapp">
                SportApp
                <span>Acceso anticipado</span>
                <ArrowDown aria-hidden="true" size={20} />
              </a>
            </nav>
          </div>

          <div className={styles.heroWorkbench} aria-label="Vistas de Pidoteca y SportApp">
            <div className={styles.heroColorField} aria-hidden="true" />
            <figure className={styles.heroPidotecaSheet}>
              <div className={styles.sheetImage}>
                <Image
                  src="/products/pidoteca-dashboard.png"
                  alt="Tablero real de mesas y pedidos de Pidoteca"
                  fill
                  priority
                  loading="eager"
                  sizes="(max-width: 900px) 78vw, 42vw"
                />
              </div>
              <figcaption>Pidoteca · turno en curso</figcaption>
            </figure>
            <figure className={styles.heroSportSheet}>
              <div className={styles.sheetImage}>
                <Image
                  src="/products/sportapp-dashboard.png"
                  alt="Dashboard semanal de SportApp con sesiones de un club"
                  fill
                  priority
                  loading="eager"
                  sizes="(max-width: 900px) 68vw, 34vw"
                />
              </div>
              <figcaption>SportApp · construyendo el siguiente turno</figcaption>
            </figure>
            <svg
              className={styles.heroRoute}
              viewBox="0 0 760 620"
              aria-hidden="true"
              preserveAspectRatio="none"
            >
              <path d="M-30 535 C120 560 82 245 275 320 S460 545 520 385 S630 115 790 160" />
              <circle cx="275" cy="320" r="9" />
              <circle cx="520" cy="385" r="9" />
            </svg>
          </div>
        </section>

        <section id="pidoteca" className={styles.pidoteca} aria-labelledby="pidoteca-title">
          <div className={styles.productHeading}>
            <div>
              <h2 id="pidoteca-title">
                <span>Pidoteca</span>
                Del QR de la mesa al turno que ve todo el equipo.
              </h2>
            </div>
            <div className={styles.productIntro}>
              <p>
                Pidoteca conecta carta, sala, cocina, barra y gestión para que un
                restaurante deje de reconstruir el servicio entre papeles, memoria y
                mensajes sueltos.
              </p>
              <a
                className={styles.primaryCta}
                href="https://pidoteca.com"
                target="_blank"
                rel="noreferrer"
              >
                Ver la landing de Pidoteca
                <ArrowUpRight aria-hidden="true" size={23} />
              </a>
            </div>
          </div>

          <div className={styles.pidotecaDetails}>
            <PidotecaJourneyScene className={styles.pidotecaJourney} />

            <ol className={styles.pidotecaFlow}>
              {pidotecaSteps.map(({ icon: Icon, title, body }, index) => (
                <li key={title}>
                  <span className={styles.flowNumber}>{index + 1}</span>
                  <Icon aria-hidden="true" size={24} />
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="sportapp" className={styles.sportApp} aria-labelledby="sportapp-title">
          <div className={styles.sportHeading}>
            <h2 id="sportapp-title">
              <span>SportApp</span>
              El club entero, al día y conectado.
            </h2>
            <div>
              <p>
                Estamos construyendo SportApp para reunir sedes, equipos, jugadores,
                entrenadores, sesiones y documentos en un solo lugar. Aún no está a la
                venta, pero ya queda poco para las primeras pruebas.
              </p>
              <a href="#lista-espera">
                Apuntarme para probarlo
                <ArrowDown aria-hidden="true" size={21} />
              </a>
            </div>
          </div>

          <div className={styles.sportScene}>
            <figure className={styles.trainingPhoto}>
              <Image
                src="/products/sportapp-training.png"
                alt="Equipo de fútbol entrenando en el campo"
                fill
                sizes="(max-width: 900px) 100vw, 58vw"
              />
              <figcaption>El trabajo ocurre en el campo. El contexto no debería quedarse allí.</figcaption>
            </figure>
            <figure className={styles.sportDashboard}>
              <span>Lo que ve el club</span>
              <div>
                <Image
                  src="/products/sportapp-dashboard.png"
                  alt="Dashboard real de SportApp con calendario y sesiones"
                  fill
                  sizes="(max-width: 900px) 82vw, 38vw"
                />
              </div>
              <figcaption>Interfaz actual de SportApp</figcaption>
            </figure>
          </div>

          <div className={styles.connectedStrip} aria-label="Información conectada en SportApp">
            {sportAppParts.map(({ icon: Icon, label }) => (
              <div key={label}>
                <Icon aria-hidden="true" size={22} />
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className={styles.noteJourney}>
            <div className={styles.noteSource}>
              <span>En el campo</span>
              <p>“Sesión cancelada por lluvia. Recuperamos el jueves.”</p>
              <small>Nota del entrenador · Infantil A</small>
            </div>
            <ArrowRight className={styles.noteArrow} aria-hidden="true" size={34} />
            <div className={styles.noteDestination}>
              <span>En la oficina</span>
              <p>El responsable lo ve en el dashboard en cuanto se guarda.</p>
              <small>Sin llamadas y sin perder la historia de la sesión.</small>
            </div>
          </div>

          <section id="lista-espera" className={styles.waitlist} aria-labelledby="waitlist-title">
            <div className={styles.waitlistCopy}>
              <h2 id="waitlist-title">Sé de los primeros en probar SportApp.</h2>
              <p>
                Estamos cerrando las últimas piezas. Déjanos tu correo y te avisaremos
                cuando abramos las primeras pruebas para clubes y academias.
              </p>
            </div>
            <div className={styles.waitlistSheet}>
              <span className={styles.waitlistTape} aria-hidden="true" />
              <SportAppWaitlistForm />
            </div>
          </section>
        </section>
        </SectionCurtainStack>
      </main>
      <SiteFooter />
    </>
  );
}