import * as THREE from "three";

type Point = [number, number, number];
export type DetailTools = {
  box: (
    parent: THREE.Object3D,
    size: Point,
    position: Point,
    material: THREE.Material,
    bevel?: number,
  ) => THREE.Mesh;
  cylinder: (
    parent: THREE.Object3D,
    top: number,
    bottom: number,
    height: number,
    position: Point,
    material: THREE.Material,
  ) => THREE.Mesh;
  line: (
    parent: THREE.Object3D,
    points: Point[],
    radius: number,
    material: THREE.Material,
  ) => THREE.CatmullRomCurve3;
  standard: (
    parameters: THREE.MeshStandardMaterialParameters,
  ) => THREE.MeshStandardMaterial;
  geometries: THREE.BufferGeometry[];
  materials: THREE.Material[];
  textures: THREE.Texture[];
  oak: THREE.MeshStandardMaterial;
  darkOak: THREE.MeshStandardMaterial;
  metal: THREE.MeshStandardMaterial;
  aluminum: THREE.MeshStandardMaterial;
  brass: THREE.MeshStandardMaterial;
  cloth: THREE.MeshStandardMaterial;
  stone: THREE.MeshStandardMaterial;
  leather: THREE.MeshStandardMaterial;
  paper: THREE.MeshStandardMaterial;
  light: THREE.MeshStandardMaterial;
  random: () => number;
};

/** Upholstered shell with a curved lumbar profile, armrests and paired castors. */
export function addTaskChair(parent: THREE.Object3D, t: DetailTools) {
  const { box, cylinder, line, leather, metal, aluminum } = t;
  const chair = new THREE.Group();
  chair.position.set(0, 0, 0.94);
  parent.add(chair);
  box(chair, [0.6, 0.055, 0.57], [0, 0.47, -0.01], metal, 0.025);
  box(chair, [0.6, 0.105, 0.56], [0, 0.53, -0.01], leather, 0.047);
  const positions: number[] = [],
    indices: number[] = [],
    uv: number[] = [];
  const point = (u: number, v: number): Point => [
    u * 0.305 * (0.91 + 0.09 * Math.sin(v * Math.PI)),
    0.59 + v * 0.55,
    0.24 + 0.09 * v - 0.105 * u * u + 0.026 * Math.sin(v * Math.PI * 2),
  ];
  const segments = 20;
  for (let y = 0; y <= segments; y++)
    for (let x = 0; x <= segments; x++) {
      positions.push(...point((x / segments) * 2 - 1, y / segments));
      uv.push(x / segments, y / segments);
      if (x < segments && y < segments) {
        const a = y * (segments + 1) + x;
        indices.push(
          a,
          a + 1,
          a + segments + 1,
          a + 1,
          a + segments + 2,
          a + segments + 1,
        );
      }
    }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  t.geometries.push(geometry);
  const upholstery = leather.clone();
  upholstery.side = THREE.DoubleSide;
  t.materials.push(upholstery);
  const back = new THREE.Mesh(geometry, upholstery);
  back.castShadow = true;
  back.receiveShadow = true;
  chair.add(back);
  const piping = t.standard({ color: "#766b59", roughness: 0.86 });
  for (const side of [-1, 1]) {
    line(
      chair,
      Array.from({ length: 12 }, (_, i) => point(side, i / 11)),
      0.007,
      piping,
    );
    line(
      chair,
      [
        [side * 0.27, 0.49, 0.18],
        [side * 0.36, 0.66, 0.2],
        [side * 0.36, 0.76, -0.09],
      ],
      0.014,
      metal,
    );
    box(
      chair,
      [0.072, 0.037, 0.35],
      [side * 0.36, 0.78, -0.045],
      leather,
      0.017,
    );
  }
  line(
    chair,
    Array.from({ length: 16 }, (_, i) => point((i / 15) * 2 - 1, 1)),
    0.009,
    piping,
  );
  line(
    chair,
    [
      [0, 0.4, 0.05],
      [0, 0.56, 0.26],
      [0, 0.88, 0.31],
    ],
    0.027,
    metal,
  );
  cylinder(chair, 0.028, 0.039, 0.29, [0, 0.305, 0], aluminum);
  cylinder(chair, 0.06, 0.05, 0.12, [0, 0.22, 0], metal);
  for (let i = 0; i < 5; i++) {
    const a = (i * Math.PI * 2) / 5,
      x = Math.sin(a) * 0.34,
      z = Math.cos(a) * 0.34;
    line(
      chair,
      [
        [0, 0.22, 0],
        [x * 0.56, 0.17, z * 0.56],
        [x, 0.145, z],
      ],
      0.024,
      aluminum,
    );
    for (const offset of [-0.027, 0.027]) {
      const wheel = cylinder(
        chair,
        0.041,
        0.041,
        0.023,
        [x + offset, 0.115, z],
        metal,
      );
      wheel.rotation.z = Math.PI / 2;
    }
  }
}

/** Thin curved leaf meshes, branching stems and a rolled ceramic pot rim. */
export function addFicus(
  parent: THREE.Object3D,
  x: number,
  z: number,
  t: DetailTools,
) {
  const { cylinder, line, standard, random } = t;
  const plant = new THREE.Group();
  plant.position.set(x, 0, z);
  parent.add(plant);
  const ceramic = standard({
    color: "#8a8375",
    roughness: 0.68,
    bumpMap: t.stone.bumpMap,
    bumpScale: 0.004,
  });
  const soil = standard({ color: "#24231b", roughness: 1 });
  const bark = standard({ color: "#615640", roughness: 0.92 });
  cylinder(plant, 0.235, 0.17, 0.48, [0, 0.345, 0], ceramic);
  cylinder(plant, 0.216, 0.216, 0.018, [0, 0.572, 0], soil);
  const rimGeometry = new THREE.TorusGeometry(0.224, 0.015, 8, 40);
  t.geometries.push(rimGeometry);
  const rim = new THREE.Mesh(rimGeometry, ceramic);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.583;
  plant.add(rim);
  line(
    plant,
    [
      [0, 0.58, 0],
      [0.02, 1, 0],
      [-0.035, 1.43, 0.015],
      [0.01, 1.91, 0],
    ],
    0.017,
    bark,
  );
  const leafMaterials = ["#273b25", "#384c2e", "#43543a", "#5a6447"].map(
    (color) => standard({ color, roughness: 0.48, side: THREE.DoubleSide }),
  );
  const leafGeometry = new THREE.PlaneGeometry(1, 1, 8, 12);
  const vertices = leafGeometry.attributes.position;
  for (let i = 0; i < vertices.count; i++) {
    const u = vertices.getX(i) * 2,
      v = vertices.getY(i) + 0.5;
    vertices.setXYZ(
      i,
      u * Math.pow(Math.sin(v * Math.PI), 0.72) * 0.071,
      v * 0.25,
      Math.sin(v * Math.PI) * 0.034 + Math.abs(u) * 0.018,
    );
  }
  leafGeometry.computeVertexNormals();
  t.geometries.push(leafGeometry);
  for (let branch = 0; branch < 12; branch++) {
    const angle = branch * 2.399,
      height = 0.92 + branch * 0.077;
    const reach = 0.3 + random() * 0.18;
    const end: Point = [
      Math.sin(angle) * reach,
      height + 0.13,
      Math.cos(angle) * reach,
    ];
    line(
      plant,
      [
        [0, height - 0.11, 0],
        [end[0] * 0.6, height + 0.045, end[2] * 0.6],
        end,
      ],
      0.0055,
      bark,
    );
    for (let i = 0; i < 7; i++) {
      const along = 0.25 + i * 0.105;
      const leaf = new THREE.Mesh(
        leafGeometry,
        leafMaterials[(branch + i) % 4],
      );
      leaf.position.set(end[0] * along, height + along * 0.1, end[2] * along);
      leaf.rotation.set(
        -0.8 + random() * 0.7,
        angle + (i % 2 ? 0.85 : -0.85),
        -0.4 + random() * 0.8,
      );
      leaf.scale.setScalar(0.7 + random() * 0.55);
      leaf.castShadow = true;
      leaf.receiveShadow = true;
      plant.add(leaf);
    }
  }
}

export function addConstructionDetails(
  groups: Record<
    "root" | "roof" | "westWall" | "backWall" | "facade" | "interior",
    THREE.Group
  >,
  t: DetailTools,
) {
  const { roof, westWall, backWall, facade, interior, root } = groups;
  const {
    box,
    cylinder,
    line,
    metal,
    aluminum,
    brass,
    oak,
    darkOak,
    paper,
    light,
  } = t;
  const gasket = t.standard({ color: "#151915", roughness: 0.94 });
  // Skirting, stone panel joints and the exposed edges of the structural deck.
  box(westWall, [0.027, 0.09, 6.25], [-4.87, 0.16, 0], aluminum, 0.004);
  box(backWall, [9.7, 0.09, 0.027], [0, 0.16, -3.07], aluminum, 0.004);
  for (let z = -3.2; z <= 3.2; z += 1.6)
    box(westWall, [0.226, 3.4, 0.006], [-5, 1.84, z], gasket);
  box(root, [10.4, 0.04, 6.85], [0, -0.125, 0], aluminum, 0.008);
  for (const z of [-3.32, 3.32])
    box(interior, [10.05, 0.035, 0.035], [0, 0.075, z], darkOak, 0.004);
  // Gaskets, hinges and door-pull stand-offs are small but visible in the front shot.
  for (const x of [-4.88, -2.46, 0.04, 2.54, 4.88])
    box(facade, [0.018, 2.67, 0.04], [x, 1.47, 3.285], gasket, 0.003);
  for (const x of [0.12, 2.38])
    for (const y of [0.975, 1.385]) {
      const mount = cylinder(facade, 0.024, 0.024, 0.08, [x, y, 3.275], brass);
      mount.rotation.x = Math.PI / 2;
    }
  for (const y of [0.38, 2.44])
    box(facade, [0.048, 0.12, 0.06], [2.48, y, 3.27], aluminum, 0.007);
  box(facade, [2.42, 0.034, 0.17], [1.25, 0.113, 3.24], aluminum, 0.006);
  // Standing seams and folded coping give the roof an actual construction method.
  for (let x = -4.8; x < 5; x += 0.6) {
    for (const z of [-2.34, 2.34])
      box(roof, [0.018, 0.028, 2.27], [x, 3.78, z], metal, 0.004);
  }
  for (const x of [-5.28, 5.28])
    box(roof, [0.065, 0.13, 6.97], [x, 3.83, 0], aluminum, 0.008);
  for (const x of [-2.65, 2.65])
    box(roof, [0.085, 0.16, 2.47], [x, 3.84, 0], metal, 0.008);
  for (const z of [-1.22, 1.22])
    box(roof, [5.38, 0.16, 0.085], [0, 3.84, z], metal, 0.008);
  // Suspended linear luminaire, with cable suspension and an opal diffuser.
  for (const x of [-1.4, 2.05]) {
    for (const dx of [-0.75, 0.75])
      cylinder(roof, 0.004, 0.004, 0.84, [x + dx, 3.13, -0.65], metal);
    box(roof, [1.92, 0.06, 0.095], [x, 2.69, -0.65], aluminum, 0.014);
    box(roof, [1.84, 0.013, 0.071], [x, 2.654, -0.65], light, 0.005);
  }
  // Fine woven rug anchors the waiting furniture without merging with the floor.
  const rug = t.standard({ color: "#756f5c", map: t.cloth.map, roughness: 1 });
  box(interior, [2.7, 0.014, 2.25], [2.89, 0.105, 1.77], rug, 0.006);
  for (const z of [0.68, 2.86])
    line(
      interior,
      [
        [1.6, 0.115, z],
        [2.89, 0.115, z],
        [4.18, 0.115, z],
      ],
      0.007,
      t.cloth,
    );
  // Split cushions, feet and seams replace the single solid sofa silhouette.
  for (const x of [3.05, 3.62])
    for (const z of [1.03, 2.65])
      cylinder(interior, 0.022, 0.018, 0.19, [x, 0.22, z], metal);
  for (const z of [1.41, 2.27]) {
    const pillow = box(
      interior,
      [0.17, 0.42, 0.7],
      [3.55, 0.65, z],
      t.cloth,
      0.065,
    );
    pillow.rotation.z = -0.14;
    line(
      interior,
      [
        [3.56, 0.51, z - 0.27],
        [3.59, 0.79, z - 0.27],
        [3.55, 0.85, z],
        [3.59, 0.79, z + 0.27],
      ],
      0.005,
      rug,
    );
  }
  // Reception back storage, sensible cable routing and daily-use objects.
  box(interior, [2.13, 0.77, 0.47], [-3.45, 0.54, 1.45], darkOak, 0.013);
  for (let x = -4.14; x < -2.7; x += 0.69) {
    box(interior, [0.675, 0.64, 0.022], [x, 0.55, 1.201], oak, 0.006);
    box(interior, [0.17, 0.017, 0.022], [x, 0.77, 1.184], aluminum, 0.004);
  }
  for (const x of [-1.4, 2.05]) {
    line(
      interior,
      [
        [x + 0.2, 1.1, -0.94],
        [x + 0.2, 0.86, -1.01],
        [x + 0.1, 0.72, -1.06],
        [x - 0.85, 0.7, -1.04],
      ],
      0.009,
      gasket,
    );
    box(interior, [0.38, 0.055, 0.075], [x - 0.86, 0.71, -1.03], paper, 0.01);
    const sheet = box(
      interior,
      [0.27, 0.0015, 0.36],
      [x - 0.91, 0.944, -0.51],
      paper,
    );
    sheet.rotation.y = 0.14;
    box(interior, [0.14, 0.012, 0.27], [x + 0.99, 0.914, -0.3], metal, 0.01);
  }
  // A hollow ceramic cup and handle instead of a capped cylinder.
  const ceramic = t.standard({ color: "#d1c6af", roughness: 0.3 });
  const cupGeometry = new THREE.LatheGeometry(
    [
      new THREE.Vector2(0.001, 0),
      new THREE.Vector2(0.047, 0),
      new THREE.Vector2(0.063, 0.102),
      new THREE.Vector2(0.057, 0.106),
      new THREE.Vector2(0.052, 0.019),
      new THREE.Vector2(0.001, 0.016),
    ],
    32,
  );
  t.geometries.push(cupGeometry);
  const cup = new THREE.Mesh(cupGeometry, ceramic);
  cup.position.set(2.34, 0.531, 1.93);
  cup.castShadow = true;
  cup.receiveShadow = true;
  interior.add(cup);
  line(
    interior,
    [
      [2.39, 0.614, 1.93],
      [2.433, 0.608, 1.93],
      [2.437, 0.565, 1.93],
      [2.394, 0.552, 1.93],
    ],
    0.007,
    ceramic,
  );
  cylinder(interior, 0.052, 0.052, 0.003, [2.34, 0.608, 1.93], t.leather);
}
