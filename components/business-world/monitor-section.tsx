"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Check, ArrowRight } from "lucide-react";
import styles from "./monitor-section.module.css";

const examples = [
  {
    name: "Pedidos",
    title: "Del pedido a la entrega, sin perder el hilo.",
    description:
      "Cliente, estado y siguiente paso en el mismo lugar. Sin buscar la última versión entre mensajes y hojas de cálculo.",
    columns: ["Trabajo", "Siguiente paso"],
    rows: [
      ["Pedido recibido", "Confirmar detalles"],
      ["En preparación", "Coordinar entrega"],
      ["Entregado", "Revisar y cerrar"],
    ],
  },
  {
    name: "Equipo",
    title: "Cada persona sabe qué le toca.",
    description:
      "Responsabilidades claras, información compartida y tareas que avanzan aunque tú no estés pendiente de cada una.",
    columns: ["Tarea", "Responsable"],
    rows: [
      ["Revisar una solicitud", "Atención al cliente"],
      ["Preparar el trabajo", "Operaciones"],
      ["Dar el siguiente paso", "Administración"],
    ],
  },
  {
    name: "Reservas",
    title: "Una agenda que todo el equipo entiende.",
    description:
      "Disponibilidad, confirmaciones y cambios conectados. Para que una reserva no se pierda entre una llamada y un mensaje.",
    columns: ["Reserva", "Estado"],
    rows: [
      ["Nueva solicitud", "Por confirmar"],
      ["Horario acordado", "Confirmada"],
      ["Cambio de fecha", "Equipo avisado"],
    ],
  },
];

export function MonitorSection({ onContact }: { onContact: () => void }) {
  const [selected, setSelected] = useState(0);
  const example = examples[selected];
  return (
    <section
      className={styles.content}
      data-screen-content=""
      aria-labelledby="monitor-heading"
    >
      <div className={styles.heading}>
        <span>SATORUS / APLICACIONES A MEDIDA</span>
        <span>EL TRABAJO, EN SU SITIO.</span>
      </div>
      <div className={styles.layout}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>TU FORMA DE TRABAJAR, CONECTADA.</p>
          <h2 id="monitor-heading">
            Una herramienta
            <br />
            <em>a tu manera.</em>
          </h2>
          <p className={styles.description}>
            Pedidos, reservas, equipo o gestión. Construimos alrededor de tu
            forma de trabajar y aprovechamos lo que ya te sirve.
          </p>
          <p className={styles.promise}>
            De buscar en tres sitios
            <br />a tenerlo todo a mano.
          </p>
          <button className={styles.contact} onClick={onContact}>
            Hablemos de tu herramienta{" "}
            <ArrowUpRight size={19} aria-hidden="true" />
          </button>
        </div>
        <div className={styles.workspace}>
          <div className={styles.workspaceHeader}>
            <span className={styles.dot} /> ASÍ PODRÍA TRABAJAR TU EQUIPO{" "}
            <span>0{selected + 1} / 03</span>
          </div>
          <div
            className={styles.choices}
            aria-label="Explorar ejemplos de aplicaciones"
          >
            {examples.map((item, index) => (
              <button
                key={item.name}
                onClick={() => setSelected(index)}
                aria-pressed={selected === index}
              >
                {item.name}
                <ArrowUpRight size={15} aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className={styles.example} aria-live="polite" aria-atomic="true">
            <h3>{example.title}</h3>
            <p>{example.description}</p>
            <table>
              <thead>
                <tr>
                  {example.columns.map((column) => (
                    <th key={column} scope="col">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {example.rows.map((row) => (
                  <tr key={row[0]}>
                    <td>
                      <Check size={14} aria-hidden="true" />
                      {row[0]}
                    </td>
                    <td>{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.note}>
            Ejemplo ilustrativo. Tu herramienta se diseña contigo.
          </p>
        </div>
      </div>
      <a className={styles.case} href="/proyectos/goblintrader">
        <div className={styles.caseImage}>
          <Image
            src="/projects/goblintrader/overview-desktop.webp"
            alt="Interfaz real de la aplicación GoblinTrader"
            fill
            sizes="(max-width: 700px) 96px, 160px"
          />
        </div>
        <div>
          <span>UN CASO REAL / GOBLINTRADER</span>
          <p>Caja, compras, almacén y equipo. Una sola herramienta.</p>
        </div>
        <span className={styles.caseLink}>
          Ver el proyecto <ArrowRight size={19} aria-hidden="true" />
        </span>
      </a>
    </section>
  );
}
