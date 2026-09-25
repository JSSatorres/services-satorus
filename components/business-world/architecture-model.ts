import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

import {
  addTaskChair,
  addFicus,
  addConstructionDetails,
} from "./architecture-details";

type Surface = THREE.Material;
type Point = [number, number, number];

/** All dimensions are in metres; the object is a small commercial studio. */
export function createArchitecture(invalidate: () => void) {
  const root = new THREE.Group();
  const roof = new THREE.Group();
  const westWall = new THREE.Group();
  const backWall = new THREE.Group();
  const facade = new THREE.Group();
  const interior = new THREE.Group();
  const services = new THREE.Group();
  const screens: THREE.Mesh[] = [];
  root.add(roof, westWall, backWall, facade, interior, services);
  const textures: THREE.Texture[] = [];
  const materials: THREE.Material[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  let seed = 18;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  function canvasTexture(
    draw: (c: CanvasRenderingContext2D) => void,
    width = 512,
    height = 512,
  ) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d")!;
    draw(context);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    textures.push(texture);
    return texture;
  }
  const stoneMap = canvasTexture((c) => {
    c.fillStyle = "#bcb4a5";
    c.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 48000; i++) {
      const n = random();
      c.fillStyle =
        n > 0.5
          ? `rgba(255,250,235,${n * 0.06})`
          : `rgba(62,49,36,${n * 0.05})`;
      c.fillRect(random() * 512, random() * 512, 1 + random() * 2, 1);
    }
    for (let i = 0; i < 70; i++) {
      c.fillStyle = `rgba(81,67,48,${random() * 0.015})`;
      c.fillRect(0, random() * 512, 512, random() * 3);
    }
  });
  const woodMap = canvasTexture((c) => {
    c.fillStyle = "#9d7750";
    c.fillRect(0, 0, 512, 512);
    for (let x = 0; x < 512; x++) {
      c.strokeStyle = `rgba(${random() > 0.4 ? "49,25,10" : "241,214,161"},${0.025 + random() * 0.065})`;
      c.lineWidth = 0.5 + random();
      c.beginPath();
      c.moveTo(x, 0);
      c.bezierCurveTo(x + Math.sin(x * 0.05) * 6, 170, x - 4, 340, x + 2, 512);
      c.stroke();
    }
  });
  const fabricMap = canvasTexture((c) => {
    c.fillStyle = "#b4ac9a";
    c.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 512; y += 3)
      for (let x = 0; x < 512; x += 3) {
        c.fillStyle = `rgba(30,28,22,${random() * 0.065})`;
        c.fillRect(x, y, 1, 2);
      }
  });
  const standard = (parameters: THREE.MeshStandardMaterialParameters) => {
    const material = new THREE.MeshStandardMaterial(parameters);
    materials.push(material);
    return material;
  };
  const stone = standard({
    map: stoneMap,
    bumpMap: stoneMap,
    bumpScale: 0.003,
    roughness: 0.86,
  });
  const wallConcrete = standard({
    map: stoneMap,
    roughness: 0.88,
    bumpMap: stoneMap,
    bumpScale: 0.003,
  });
  const oak = standard({
    map: woodMap,
    bumpMap: woodMap,
    bumpScale: 0.002,
    roughness: 0.9,
  });
  const darkOak = standard({ map: woodMap, color: "#aba08c", roughness: 0.94 });
  const metal = standard({
    color: "#282b29",
    roughness: 0.43,
    metalness: 0.75,
  });
  const aluminum = standard({
    color: "#999d9b",
    roughness: 0.38,
    metalness: 0.88,
  });
  const plaster = standard({
    color: "#d6d1c5",
    roughness: 0.9,
    bumpMap: stoneMap,
    bumpScale: 0.002,
  });
  const cloth = standard({ map: fabricMap, roughness: 0.97 });
  const paper = standard({ color: "#ded9ca", roughness: 0.96 });
  const leather = standard({ color: "#54483b", roughness: 0.74 });
  const brass = standard({
    color: "#b49a65",
    metalness: 0.74,
    roughness: 0.35,
  });
  const light = standard({
    color: "#fff2cf",
    emissive: "#ffcd87",
    emissiveIntensity: 2.1,
  });
  const glass = new THREE.MeshPhysicalMaterial({
    color: "#ecf2eb",
    roughness: 0.012,
    metalness: 0,
    transmission: 0.94,
    thickness: 0.008,
    ior: 1.5,
    transparent: true,
    opacity: 0.9,
    envMapIntensity: 1.1,
    depthWrite: false,
  });
  materials.push(glass);

  function box(
    parent: THREE.Object3D,
    size: Point,
    position: Point,
    material: Surface,
    bevel = 0,
  ) {
    const geometry = bevel
      ? new RoundedBoxGeometry(...size, 3, bevel)
      : new THREE.BoxGeometry(...size);
    geometries.push(geometry);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function cylinder(
    parent: THREE.Object3D,
    top: number,
    bottom: number,
    height: number,
    position: Point,
    material: Surface,
  ) {
    const geometry = new THREE.CylinderGeometry(top, bottom, height, 24);
    geometries.push(geometry);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function line(
    parent: THREE.Object3D,
    points: Point[],
    radius: number,
    material: Surface,
  ) {
    const curve = new THREE.CatmullRomCurve3(
      points.map((p) => new THREE.Vector3(...p)),
      false,
      "centripetal",
    );
    const geometry = new THREE.TubeGeometry(curve, 48, radius, 8, false);
    geometries.push(geometry);
    const mesh = new THREE.Mesh(geometry, material);
    parent.add(mesh);
    return curve;
  }
  function label(
    parent: THREE.Object3D,
    text: string,
    width: number,
    height: number,
    position: Point,
    color = "#ddd4bf",
    background = "#292d2b",
  ) {
    const map = canvasTexture(
      (c) => {
        c.fillStyle = background;
        c.fillRect(0, 0, 1024, 256);
        c.fillStyle = color;
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.font = "400 91px Arial";
        c.fillText(text, 512, 135);
      },
      1024,
      256,
    );
    const mat = standard({ map, roughness: 0.6 });
    return box(parent, [width, height, 0.025], position, mat);
  }
  function contactShadow(
    parent: THREE.Object3D,
    x: number,
    z: number,
    width: number,
    depth: number,
    y: number,
  ) {
    const map = canvasTexture((c) => {
      const g = c.createRadialGradient(256, 256, 20, 256, 256, 245);
      g.addColorStop(0, "rgba(0,0,0,.4)");
      g.addColorStop(0.5, "rgba(0,0,0,.15)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = g;
      c.fillRect(0, 0, 512, 512);
    });
    const mat = new THREE.MeshBasicMaterial({
      map,
      transparent: true,
      depthWrite: false,
    });
    materials.push(mat);
    const geometry = new THREE.PlaneGeometry(width, depth);
    geometries.push(geometry);
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, y, z);
    parent.add(mesh);
  }

  const detailTools = {
    box,
    cylinder,
    line,
    standard,
    geometries,
    materials,
    textures,
    oak,
    darkOak,
    metal,
    aluminum,
    brass,
    cloth,
    stone,
    leather,
    paper,
    light,
    random,
  };

  // A layered stone plinth and recessed service void anchor the architecture.
  box(root, [11.6, 0.22, 7.9], [0, -0.48, 0.35], stone, 0.035);
  box(root, [10.25, 0.2, 6.7], [0, -0.23, 0], metal, 0.025);
  box(interior, [10.3, 0.17, 6.75], [0, -0.025, 0], stone, 0.02);
  // Staggered boards share one instanced draw call; lengths and tones vary subtly.
  const floorMaterial = standard({
    map: woodMap,
    roughness: 0.91,
    bumpMap: woodMap,
    bumpScale: 0.004,
  });
  const boardGeometry = new RoundedBoxGeometry(0.351, 0.035, 1, 2, 0.003);
  geometries.push(boardGeometry);
  const boards: { x: number; z: number; length: number }[] = [];
  for (let row = 0; row < 28; row++) {
    let z = -3.175;
    let first = true;
    while (z < 3.175 - 0.001) {
      const length = Math.min(
        first ? 0.64 + (row % 3) * 0.53 : 1.92,
        3.175 - z,
      );
      boards.push({
        x: -4.77 + row * 0.355,
        z: z + length / 2,
        length: length - 0.006,
      });
      z += length;
      first = false;
    }
  }
  const flooring = new THREE.InstancedMesh(
    boardGeometry,
    floorMaterial,
    boards.length,
  );
  const boardTransform = new THREE.Object3D();
  boards.forEach((board, index) => {
    boardTransform.position.set(board.x, 0.077, board.z);
    boardTransform.scale.set(1, 1, board.length);
    boardTransform.updateMatrix();
    flooring.setMatrixAt(index, boardTransform.matrix);
    flooring.setColorAt(
      index,
      new THREE.Color().setHSL(0.09, 0.06, 0.87 + random() * 0.055),
    );
  });
  flooring.castShadow = true;
  flooring.receiveShadow = true;
  interior.add(flooring);
  box(root, [5.1, 0.13, 1], [1.3, -0.32, 4.37], stone, 0.02);
  box(root, [4.9, 0.12, 0.6], [1.3, -0.45, 4.99], stone, 0.02);

  box(westWall, [0.22, 3.5, 6.5], [-5, 1.85, 0], wallConcrete, 0.016);
  box(backWall, [10, 3.5, 0.22], [0, 1.85, -3.2], plaster, 0.016);
  for (let x = -4.85; x < -0.2; x += 0.14)
    box(backWall, [0.055, 3.35, 0.095], [x, 1.83, -3.055], darkOak, 0.008);
  label(backWall, "S A T O R U S", 2.65, 0.62, [-2.8, 2.5, -2.97]);
  // Shelving, recessed illumination, and small objects create a credible interior.
  for (const y of [0.45, 1.28, 2.11]) {
    box(backWall, [3.1, 0.055, 0.48], [2.85, y, -2.82], oak, 0.008);
    box(backWall, [2.9, 0.012, 0.025], [2.85, y - 0.035, -2.57], light);
    for (let j = 0; j < 8; j++) {
      const mat = j % 3 === 0 ? leather : j % 3 === 1 ? paper : metal;
      const book = box(
        backWall,
        [0.09 + random() * 0.035, 0.26 + random() * 0.12, 0.23],
        [1.55 + j * 0.14, y + 0.2, -2.79],
        mat,
        0.005,
      );
      if (j === 7) book.rotation.z = -0.15;
    }
    cylinder(backWall, 0.12, 0.09, 0.28, [3.72, y + 0.17, -2.8], stone);
  }
  // Slim glazing structure, mullions and brushed brass handles.
  for (const x of [-4.92, -2.5, 0, 2.5, 4.92]) {
    box(facade, [0.065, 3.45, 0.095], [x, 1.81, 3.23], metal, 0.008);
  }
  for (const y of [0.12, 2.83, 3.49])
    box(facade, [9.9, 0.055, 0.095], [0, y, 3.23], metal, 0.006);
  for (let x = -3.75; x <= 3.75; x += 2.5) {
    const pane = box(facade, [2.42, 2.64, 0.022], [x, 1.47, 3.225], glass);
    pane.castShadow = false;
  }
  for (const x of [0.12, 2.38])
    cylinder(facade, 0.015, 0.015, 0.45, [x, 1.18, 3.31], brass);
  box(facade, [9.94, 0.55, 0.12], [0, 3.18, 3.23], metal, 0.008);
  label(facade, "S A T O R U S", 3.3, 0.49, [-2.5, 3.18, 3.304]);
  label(facade, "ESTUDIO DIGITAL", 1.9, 0.27, [3.12, 3.18, 3.305], "#a9a58f");
  for (const z of [-3.18, 0, 3.18])
    box(interior, [0.085, 3.4, 0.085], [4.94, 1.82, z], metal);
  const eastGlass = box(interior, [0.024, 3.25, 6.3], [4.94, 1.82, 0], glass);
  eastGlass.castShadow = false;
  // Solar screen on the side; dense, slender fins rather than toy proportions.
  for (let z = -3; z < 1.2; z += 0.22)
    box(interior, [0.22, 3.4, 0.065], [5.12, 1.82, z], darkOak, 0.006);

  // Flat roof with a genuine central skylight opening and metal coping.
  const roofY = 3.66;
  box(roof, [10.6, 0.2, 2.32], [0, roofY, -2.33], metal, 0.02);
  box(roof, [10.6, 0.2, 2.32], [0, roofY, 2.33], metal, 0.02);
  box(roof, [2.7, 0.2, 2.36], [-3.95, roofY, 0], metal, 0.02);
  box(roof, [2.7, 0.2, 2.36], [3.95, roofY, 0], metal, 0.02);
  const skylight = box(roof, [5.15, 0.025, 2.29], [0, roofY + 0.12, 0], glass);
  skylight.castShadow = false;
  for (let x = -2.6; x <= 2.6; x += 1.3)
    box(roof, [0.05, 0.07, 2.38], [x, roofY + 0.16, 0], aluminum);
  for (const z of [-3.49, 3.49])
    box(roof, [10.65, 0.13, 0.06], [0, roofY + 0.17, z], aluminum, 0.006);
  for (let x = -5.15; x < 5.2; x += 0.23) {
    box(roof, [0.15, 0.042, 2.23], [x, roofY - 0.12, -2.32], oak);
    box(roof, [0.15, 0.042, 2.23], [x, roofY - 0.12, 2.32], oak);
  }
  for (const z of [-2.7, 2.7])
    box(roof, [8.8, 0.02, 0.035], [0, roofY - 0.16, z], light);

  function addMonitor(group: THREE.Group, sectionIndex: number) {
    box(group, [1.08, 0.64, 0.048], [0.2, 1.35, -0.27], aluminum, 0.025);
    box(group, [0.09, 0.2, 0.045], [0.2, 0.995, -0.305], aluminum, 0.015);
    box(group, [0.42, 0.025, 0.3], [0.2, 0.925, -0.2], aluminum, 0.012);
    const screenMap = canvasTexture(
      (c) => {
        const labels = ["CÓMO TRABAJAMOS", "SOLUCIONES", "PROYECTOS"];
        const titles = [
          ["Primero, tu día a día.", "Después, la herramienta."],
          ["Tu lista,", "convertida en una app."],
          ["Lo que hacemos,", "dicho claro."],
        ];
        const accent = ["#c8a678", "#c1805b", "#88a298"][sectionIndex];
        c.fillStyle = "#f1eee5";
        c.fillRect(0, 0, 1600, 900);
        c.fillStyle = "#24352e";
        c.fillRect(0, 0, 1600, 95);
        c.fillStyle = "#f3f0e6";
        c.font = "24px Arial";
        c.fillText("satorus.   /   " + labels[sectionIndex], 65, 60);
        c.fillStyle = accent;
        c.fillRect(90, 205, 9, 315);
        c.fillStyle = "#263a30";
        c.font = "65px Arial";
        c.fillText(titles[sectionIndex][0], 140, 330);
        c.fillText(titles[sectionIndex][1], 140, 415);
        c.font = "28px Arial";
        c.fillText(
          [
            "Te escuchamos. Lo dejamos por escrito. Lo pruebas tú.",
            "Vemos el problema y lo convertimos en una solución útil.",
            "Cuatro necesidades. Cuatro proyectos reales.",
          ][sectionIndex],
          140,
          515,
        );
        c.fillStyle = "#24352e";
        c.fillRect(140, 650, 440, 74);
        c.fillStyle = "#f3f0e6";
        c.fillText(
          "Entrar en " + labels[sectionIndex].toLowerCase() + "  →",
          160,
          697,
        );
        c.fillStyle = accent;
        c.font = "180px Georgia";
        c.fillText("0" + (sectionIndex + 1), 1220, 750);
      },
      1600,
      900,
    );
    const screenMaterial = new THREE.MeshBasicMaterial({
      map: screenMap,
      toneMapped: false,
    });
    materials.push(screenMaterial);
    const screen = box(
      group,
      [1.01, 0.565, 0.009],
      [0.2, 1.35, -0.241],
      screenMaterial,
    );
    screen.castShadow = false;
    screen.receiveShadow = false;
    screens[sectionIndex] = screen;
  }

  function desk(x: number, z: number, sectionIndex: number) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    interior.add(group);
    box(group, [2.8, 0.085, 1.16], [0, 0.86, 0], oak, 0.025);
    for (const px of [-1.16, 1.16]) {
      box(group, [0.065, 0.76, 0.065], [px, 0.46, 0], metal, 0.014);
      box(group, [0.13, 0.035, 0.89], [px, 0.105, 0], metal, 0.012);
    }
    addMonitor(group, sectionIndex);
    box(group, [0.7, 0.024, 0.23], [0.16, 0.92, 0.23], aluminum, 0.014);
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 12; j++)
        box(
          group,
          [0.042, 0.008, 0.036],
          [-0.14 + j * 0.053, 0.938, 0.15 + i * 0.049],
          paper,
          0.004,
        );
    box(group, [0.1, 0.036, 0.16], [0.74, 0.928, 0.22], paper, 0.024);
    box(group, [0.38, 0.03, 0.48], [-0.9, 0.924, 0.03], leather, 0.01);
    box(group, [0.011, 0.011, 0.28], [-0.78, 0.946, 0.03], brass);
    cylinder(group, 0.066, 0.05, 0.11, [0.99, 0.96, -0.23], stone);
    addTaskChair(group, detailTools);
    contactShadow(interior, x, z + 0.35, 3.9, 2.7, 0.101);
  }
  desk(-1.4, -0.65, 0);
  desk(2.05, -0.65, 2);
  const receptionMonitor = new THREE.Group();
  receptionMonitor.position.set(-3.45, 0.31, 1.62);
  interior.add(receptionMonitor);
  addMonitor(receptionMonitor, 1);

  // Reception, waiting area, fabric seams and a low stone table.
  box(interior, [2.35, 1.02, 0.74], [-3.45, 0.62, 1.62], stone, 0.025);
  box(interior, [2.45, 0.055, 0.85], [-3.45, 1.16, 1.62], darkOak, 0.014);
  for (let x = -4.5; x < -2.35; x += 0.1)
    box(interior, [0.03, 0.86, 0.018], [x, 0.62, 2], brass, 0.003);
  label(
    interior,
    "BIENVENIDO",
    1.16,
    0.19,
    [-3.45, 0.87, 2.025],
    "#ded5bc",
    "#6e695e",
  );
  const sofa = new THREE.Group();
  interior.add(sofa);
  sofa.position.set(3.35, 0, 1.84);
  sofa.rotation.y = -Math.PI / 2;
  box(sofa, [1.7, 0.22, 0.66], [0, 0.31, 0], metal, 0.05);
  for (const x of [-0.43, 0.43])
    box(sofa, [0.82, 0.18, 0.66], [x, 0.51, 0], cloth, 0.06);
  box(sofa, [1.73, 0.61, 0.18], [0, 0.63, -0.36], cloth, 0.055);
  for (const x of [-0.92, 0.92])
    box(sofa, [0.16, 0.49, 0.77], [x, 0.5, 0], cloth, 0.04);
  cylinder(interior, 0.48, 0.48, 0.055, [2.15, 0.5, 1.95], stone);
  cylinder(interior, 0.14, 0.22, 0.36, [2.15, 0.295, 1.95], metal);
  box(interior, [0.24, 0.028, 0.32], [2.13, 0.545, 1.96], paper, 0.005);

  // The contact destination is a physical letter on the coffee table.
  const envelopeMap = canvasTexture(
    (c) => {
      c.fillStyle = "#ece5d3";
      c.fillRect(0, 0, 1024, 640);
      c.strokeStyle = "#afa68e";
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(512, 350);
      c.lineTo(1024, 0);
      c.moveTo(0, 640);
      c.lineTo(350, 310);
      c.moveTo(1024, 640);
      c.lineTo(674, 310);
      c.stroke();
      c.fillStyle = "#bd704e";
      c.beginPath();
      c.arc(512, 350, 49, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#f9edda";
      c.font = "42px Georgia";
      c.textAlign = "center";
      c.fillText("S", 512, 365);
      c.fillStyle = "#4b5949";
      c.font = "22px Arial";
      c.fillText("TU SIGUIENTE PASO", 512, 550);
    },
    1024,
    640,
  );
  const envelopeMaterial = standard({ map: envelopeMap, roughness: 0.92 });
  const envelope = box(
    interior,
    [0.58, 0.38, 0.012],
    [2.15, 0.572, 1.95],
    envelopeMaterial,
    0.004,
  );
  envelope.rotation.x = -Math.PI / 2;
  envelope.rotation.z = -0.12;

  addFicus(interior, -4.3, -2.28, detailTools);
  addFicus(interior, 4.05, 2.65, detailTools);
  addConstructionDetails(
    { root, roof, westWall, backWall, facade, interior },
    detailTools,
  );

  // Service conduits are revealed below the raised floor, with a travelling signal.
  const paths: THREE.CatmullRomCurve3[] = [];
  const conduit = standard({
    color: "#9a8060",
    metalness: 0.7,
    roughness: 0.38,
  });
  const signalMat = standard({
    color: "#eed19c",
    emissive: "#fbd49c",
    emissiveIntensity: 3,
  });
  for (const z of [-1.5, -0.9, -0.3]) {
    paths.push(
      line(
        services,
        [
          [-4.4, 0.18, 2.5],
          [-3.8, 0.18, z],
          [0, 0.18, z],
          [2.5, 0.18, z],
          [3.7, 0.18, -2.5],
        ],
        0.025,
        conduit,
      ),
    );
  }
  for (const x of [-3.9, 0, 3.75]) {
    box(services, [0.65, 0.13, 0.5], [x, 0.16, -0.9], metal, 0.03);
    for (let j = 0; j < 4; j++)
      box(
        services,
        [0.08, 0.018, 0.035],
        [x - 0.2 + j * 0.13, 0.235, -0.69],
        light,
      );
  }
  const signals = paths.map(() => {
    const geometry = new THREE.SphereGeometry(0.065, 12, 12);
    geometries.push(geometry);
    const mesh = new THREE.Mesh(geometry, signalMat);
    services.add(mesh);
    return mesh;
  });
  services.visible = false;
  contactShadow(root, 0, 0.2, 16, 12, -0.585);
  // Photographic CC0 maps enhance the procedural materials once available.
  // Retain the procedural map when a request fails; dispose late arrivals after unmount.
  let disposed = false;
  const loader = new THREE.TextureLoader();
  const materialSets = [
    {
      asset: "oak_veneer_01",
      members: materials.filter(
        (m) => m instanceof THREE.MeshStandardMaterial && m.map === woodMap,
      ) as THREE.MeshStandardMaterial[],
      normal: 0.065,
    },
    { asset: "concrete_wall_001", members: [wallConcrete], normal: 0.045 },
  ];
  for (const set of materialSets) {
    for (const kind of ["Diffuse", "nor_gl", "Rough"] as const) {
      loader.load(
        `/materials/architecture/${set.asset}-${kind}.jpg`,
        (texture: THREE.Texture) => {
          if (disposed) {
            texture.dispose();
            return;
          }
          textures.push(texture);
          texture.anisotropy = 8;
          if (kind === "Diffuse") texture.colorSpace = THREE.SRGBColorSpace;
          // A sealed veneer has restrained albedo variation and a satin finish.
          // Remap measured roughness to this finish instead of multiplying into mirror-like grain.
          if (set.asset === "oak_veneer_01") {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(2, 1);
            if (kind !== "nor_gl") {
              const image = texture.image as HTMLImageElement;
              const canvas = document.createElement("canvas");
              canvas.width = image.naturalWidth;
              canvas.height = image.naturalHeight;
              const context = canvas.getContext("2d")!;
              if (kind === "Diffuse")
                context.filter = "saturate(0.78) contrast(0.68)";
              else {
                context.fillStyle = "#c7c7c7";
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.globalAlpha = 0.18;
              }
              context.drawImage(image, 0, 0);
              texture.source = new THREE.Source(canvas);
              texture.needsUpdate = true;
            }
          }
          for (const material of set.members) {
            if (kind === "Diffuse") material.map = texture;
            if (kind === "nor_gl") {
              material.normalMap = texture;
              material.normalScale.setScalar(set.normal);
              material.bumpMap = null;
            }
            if (kind === "Rough") material.roughnessMap = texture;
            material.needsUpdate = true;
          }
          invalidate();
        },
        undefined,
        () => {
          /* The local procedural material remains usable. */
        },
      );
    }
  }
  return {
    root,
    roof,
    westWall,
    backWall,
    facade,
    interior,
    services,
    signals,
    screens,
    envelope,
    paths,
    dispose() {
      disposed = true;
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      flooring.dispose();
    },
  };
}
