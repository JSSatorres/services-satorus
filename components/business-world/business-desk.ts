import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { problemList, unansweredChats } from "@/lib/book-content";

/** A real working surface: the same six problems later become modules on screen two. */
export function createBusinessDesk() {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];
  const materials: THREE.Material[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const pieces: THREE.Group[] = [];
  const faces: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>[] =
    [];
  function texture(
    draw: (ctx: CanvasRenderingContext2D) => void,
    width = 640,
    height = 880,
  ) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    draw(canvas.getContext("2d")!);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
    textures.push(map);
    return map;
  }
  function material(parameters: THREE.MeshStandardMaterialParameters) {
    const result = new THREE.MeshStandardMaterial(parameters);
    materials.push(result);
    return result;
  }
  function box(
    parent: THREE.Group,
    size: [number, number, number],
    surface: THREE.Material,
    position: [number, number, number],
    radius = 0.025,
  ) {
    const geometry = new RoundedBoxGeometry(...size, 3, radius);
    geometries.push(geometry);
    const mesh = new THREE.Mesh(geometry, surface);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  const wood = texture((c) => {
    c.fillStyle = "#58402e";
    c.fillRect(0, 0, 640, 880);
    for (let i = 0; i < 1500; i++) {
      const x = (i * 137.51) % 640;
      c.strokeStyle = `rgba(${i % 3 ? "20,13,7" : "208,164,104"},${0.01 + (i % 7) * 0.003})`;
      c.lineWidth = 0.3 + (i % 5) * 0.25;
      c.beginPath();
      c.moveTo(x, 0);
      c.bezierCurveTo(x + Math.sin(i) * 12, 280, x - 5, 530, x + 4, 880);
      c.stroke();
    }
  });
  box(
    root,
    [8.2, 0.18, 4.9],
    material({ map: wood, roughness: 0.54 }),
    [0, -0.14, 0],
    0.075,
  );
  const black = material({
    color: "#202323",
    metalness: 0.65,
    roughness: 0.28,
  });
  const paper = material({ color: "#eee8d7", roughness: 0.9 });
  const brass = material({ color: "#a78859", metalness: 0.8, roughness: 0.3 });
  box(root, [0.06, 0.06, 1.3], brass, [3.35, 0.01, 0.45]);
  box(root, [0.075, 0.075, 0.28], black, [3.35, 0.01, 1.19]);
  const layouts = [
    { x: -2.15, z: -0.1, angle: -0.32, w: 1.04, h: 1.96 },
    { x: -0.45, z: -0.75, angle: 0.21, w: 1.84, h: 1.68 },
    { x: 1.05, z: -0.08, angle: -0.25, w: 1.56, h: 2.12 },
    { x: -1.25, z: 1.05, angle: 0.32, w: 1.38, h: 0.86 },
    { x: 0.52, z: 1.18, angle: -0.48, w: 0.87, h: 1.23 },
    { x: 2.48, z: 0.68, angle: 0.2, w: 1.14, h: 0.93 },
  ];
  const labels = [
    "WHATSAPP",
    "TU AGENDA / MARTES",
    "PRESUPUESTO Nº 031",
    "LLAMADAS",
    "TICKET DE CAJA",
    "SEGUIMIENTO",
  ];
  function drawDocument(index: number, ordered: boolean) {
    return texture((c) => {
      c.fillStyle =
        index === 0 ? "#f2f1e9" : index === 5 ? "#e4d2a1" : "#f1ecdf";
      c.fillRect(0, 0, 640, 880);
      // Fine paper fibres, kept below the contrast of printed text.
      for (let i = 0; i < 9000; i++) {
        c.fillStyle = `rgba(57,44,26,${(i % 4) * 0.009})`;
        c.fillRect((i * 97.3) % 640, (i * 43.7) % 880, 1, 1);
      }
      c.fillStyle = ordered ? "#355c46" : "#ab6346";
      c.fillRect(0, 0, 640, 116);
      c.fillStyle = "#fff6e6";
      c.font = "600 26px Arial";
      c.fillText(labels[index], 38, 73);
      c.fillStyle = "#273a30";
      c.font = "600 57px Arial";
      const words = (
        ordered ? problemList[index].fix : problemList[index].problem
      ).split(" ");
      let line = "",
        y = 195;
      for (const word of words) {
        if (c.measureText(`${line} ${word}`).width > 550) {
          c.fillText(line, 38, y);
          y += 65;
          line = word;
        } else line += `${line ? " " : ""}${word}`;
      }
      c.fillText(line, 38, y);
      y = Math.max(380, y + 90);
      c.font = "30px Arial";
      const lines =
        index === 0
          ? unansweredChats
              .slice(0, 3)
              .flatMap((chat) => [chat.name, chat.text])
          : index === 1
            ? [
                "10:00  Sra. López",
                ordered ? "11:00  Revisión · Pedro" : "10:00  Revisión · Pedro",
                ordered ? "Sin solapes" : "¿A quién atiendo?",
              ]
            : index === 2
              ? [
                  "Cliente: ________",
                  "Total: ________ €",
                  ordered ? "Listo para enviar" : "Pendiente desde el lunes",
                ]
              : index === 3
                ? [
                    "11:15 · Desconocido",
                    ordered ? "Aviso preparado" : "Devolver llamada",
                  ]
                : index === 4
                  ? [
                      "Venta  28,50 €",
                      "IVA incluido",
                      ordered ? "Registrado" : "¿Dónde lo guardé?",
                    ]
                  : [
                      "Luis G.",
                      ordered ? "Recordatorio: jueves" : "Volver a escribirle",
                    ];
      lines.forEach((text, n) => {
        c.fillStyle = n % 2 ? "#77806c" : "#384b40";
        c.fillText(text, 38, y + n * 58);
        c.strokeStyle = "#b8b6a633";
        c.beginPath();
        c.moveTo(38, y + n * 58 + 18);
        c.lineTo(600, y + n * 58 + 18);
        c.stroke();
      });
      c.font = "23px Arial";
      c.fillStyle = ordered ? "#355c46" : "#ab6346";
      c.fillText(ordered ? "CADA COSA, EN SU LUGAR" : "PENDIENTE", 38, 828);
    });
  }
  const maps = layouts.map((_, i) => [
    drawDocument(i, false),
    drawDocument(i, true),
  ]);
  layouts.forEach((layout, index) => {
    const group = new THREE.Group();
    group.position.set(layout.x, 0.015 + index * 0.003, layout.z);
    group.rotation.y = layout.angle;
    root.add(group);
    pieces.push(group);
    const depth = index === 0 ? 0.105 : 0.012;
    box(
      group,
      [layout.w, depth, layout.h],
      index === 0 ? black : paper,
      [0, depth / 2, 0],
      index === 0 ? 0.065 : 0.005,
    );
    const geometry = new THREE.PlaneGeometry(layout.w - 0.06, layout.h - 0.06);
    geometries.push(geometry);
    const surface = material({
      map: maps[index][0],
      roughness: index === 0 ? 0.24 : 0.86,
      metalness: index === 0 ? 0.1 : 0,
    });
    const face = new THREE.Mesh(geometry, surface);
    face.rotation.x = -Math.PI / 2;
    face.position.y = depth + 0.001;
    face.receiveShadow = true;
    group.add(face);
    faces.push(face);
    if (index === 0)
      box(
        group,
        [0.32, 0.012, 0.04],
        black,
        [0, depth + 0.007, -layout.h / 2 + 0.045],
        0.014,
      );
  });
  return {
    root,
    pieces,
    ordered() {
      faces.forEach((face, i) => {
        face.material.map = maps[i][1];
        face.material.needsUpdate = true;
      });
    },
    dispose() {
      textures.forEach((item) => item.dispose());
      materials.forEach((item) => item.dispose());
      geometries.forEach((item) => item.dispose());
    },
  };
}
