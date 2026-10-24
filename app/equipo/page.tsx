import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MoveUpRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TeamExperience } from "@/components/team/team-experience";
import styles from "@/components/team/team.module.css";
import { relayOrder, teamById } from "@/lib/team";

export const metadata: Metadata = {
  title: "Equipo",
  description:
    "Conoce a las tres personas detrás de Satorus: dos ingenieros de software especializados en arquitectura web e inteligencia artificial y un empresario con más de veinte años dirigiendo pymes.",
  alternates: { canonical: "/equipo" },
  // El perfil de Tony aún es provisional (ver `lib/team.ts`): sin indexar
  // hasta tener sus datos reales.
  robots: { index: false, follow: true },
};

export default function TeamPage() {
  return (
    <>
      <SiteHeader />
      <main id="contenido" className={styles.page}>
        <TeamExperience />

        <section className={styles.closing} aria-labelledby="closing-title">
          <div className={styles.closingFaces} aria-hidden="true">
            {relayOrder.map((id) => (
              <span key={id} data-accent={teamById[id].accent}>
                <Image src={teamById[id].photo} alt="" fill sizes="96px" />
              </span>
            ))}
            <span className={styles.closingChair}>+ tú</span>
          </div>
          <h2 id="closing-title" data-reveal="lines">
            Hay una silla libre <span>en nuestra mesa.</span>
          </h2>
          <p>
            Cuéntanos qué te frena con tus propias palabras. Juan pondrá la arquitectura y la IA, Damián
            la ingeniería de la interfaz y Tony la visión de empresa. Tú solo tienes que traer tu negocio.
          </p>
          <div className={styles.closingActions}>
            <Link className={styles.closingPrimary} href="/#contacto">
              Cuéntanos tu caso <MoveUpRight aria-hidden="true" size={20} />
            </Link>
            <Link className={styles.closingSecondary} href="/productos">
              Ver lo que hemos hecho
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
