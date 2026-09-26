import * as THREE from "three";
import type { DetailTools } from "./architecture-details";

type Point = [number, number, number];

/** Small objects need real edges and cavities because the tour passes at desk height. */
export function createOfficeProps(t: DetailTools) {
  const { box } = t;
  let seed = 47;
  const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  function texture(
    draw: (c: CanvasRenderingContext2D) => void,
    width = 256,
    height = 1024,
  ) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    draw(canvas.getContext("2d")!);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
    t.textures.push(map);
    return map;
  }
  function mesh(
    parent: THREE.Object3D,
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
  ) {
    t.geometries.push(geometry);
    const result = new THREE.Mesh(geometry, material);
    result.castShadow = true;
    result.receiveShadow = true;
    parent.add(result);
    return result;
  }
  const grain = texture(
    (c) => {
      c.fillStyle = "#b5b5b5";
      c.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 14000; i++) {
        c.fillStyle = `rgba(30,30,30,${random() * 0.12})`;
        c.fillRect(random() * 256, random() * 256, 1, 1);
      }
    },
    256,
    256,
  );
  grain.colorSpace = THREE.NoColorSpace;
  const pageMap = texture(
    (c) => {
      c.fillStyle = "#e7dfc9";
      c.fillRect(0, 0, 512, 512);
      for (let x = 0; x < 512; x += 2 + random() * 3) {
        c.fillStyle = `rgba(110,92,61,${0.1 + random() * 0.14})`;
        c.fillRect(x, 0, 0.6 + random() * 0.6, 512);
      }
      for (let i = 0; i < 7000; i++) {
        c.fillStyle = `rgba(85,60,36,${random() * 0.05})`;
        c.fillRect(random() * 512, random() * 512, 1, 1);
      }
    },
    512,
    512,
  );
  const pageEdges = t.standard({
    map: pageMap,
    roughness: 0.94,
    bumpMap: pageMap,
    bumpScale: 0.00035,
  });
  const palette = [
    "#3a5048",
    "#a2714c",
    "#dbd2b9",
    "#553a36",
    "#333d42",
    "#8d8a71",
    "#bb9d64",
    "#5d7065",
  ];
  const titles = [
    "ARQUITECTURA",
    "ESTRATEGIA",
    "DISEÑO",
    "PROCESOS",
    "ESTUDIO",
    "IDEAS",
    "FORMA",
    "NEGOCIO",
  ];
  const covers = palette.map((color) =>
    t.standard({ color, roughness: 0.72, bumpMap: grain, bumpScale: 0.0003 }),
  );
  const spines = palette.map((color, i) => {
    const map = texture((c) => {
      c.fillStyle = color;
      c.fillRect(0, 0, 256, 1024);
      for (let n = 0; n < 12000; n++) {
        c.fillStyle = `rgba(240,230,210,${random() * 0.045})`;
        c.fillRect(random() * 256, random() * 1024, 1, 1);
      }
      c.fillStyle = i === 2 || i === 6 ? "#504939" : "#ddc89a";
      c.fillRect(46, 72, 164, 3);
      c.fillRect(46, 930, 164, 3);
      c.save();
      c.translate(128, 490);
      c.rotate(-Math.PI / 2);
      c.font = "500 48px Georgia";
      c.textAlign = "center";
      c.fillText(titles[i], 0, 15);
      c.restore();
      c.textAlign = "center";
      c.font = "34px Georgia";
      c.fillText("S", 128, 865);
      c.font = "22px Arial";
      c.fillText("ESTUDIO", 128, 113);
    });
    return t.standard({
      map,
      roughness: 0.66,
      bumpMap: grain,
      bumpScale: 0.00025,
    });
  });
  const ribbon = t.standard({ color: "#a55843", roughness: 0.88 });
  const ceramic = new THREE.MeshPhysicalMaterial({
    color: "#c9c2ad",
    roughness: 0.27,
    clearcoat: 0.34,
    clearcoatRoughness: 0.2,
    bumpMap: grain,
    bumpScale: 0.00025,
  });
  const charcoal = new THREE.MeshPhysicalMaterial({
    color: "#4c5c52",
    roughness: 0.34,
    clearcoat: 0.23,
    clearcoatRoughness: 0.25,
    bumpMap: grain,
    bumpScale: 0.0003,
  });
  const glass = new THREE.MeshPhysicalMaterial({
    color: "#e4ece5",
    metalness: 0,
    roughness: 0.04,
    transmission: 1,
    thickness: 0.004,
    ior: 1.48,
    envMapIntensity: 1.2,
  });
  const coffee = t.standard({
    color: "#29170d",
    roughness: 0.18,
    metalness: 0,
  });
  const crema = t.standard({ color: "#805130", roughness: 0.28 });
  t.materials.push(ceramic, charcoal, glass);

  function book(
    parent: THREE.Object3D,
    position: Point,
    variant: number,
    thickness = 0.065,
    height = 0.32,
    depth = 0.235,
    tilt = 0,
  ) {
    const group = new THREE.Group();
    group.name = "bound-book";
    group.position.set(...position);
    group.position.y += Math.abs((Math.sin(tilt) * thickness) / 2);
    group.rotation.z = tilt;
    parent.add(group);
    const i = variant % covers.length;
    // Two overhanging cover boards frame a recessed, individually ruled page block.
    box(
      group,
      [thickness - 0.009, height - 0.006, depth - 0.008],
      [0, height / 2, -0.002],
      pageEdges,
      0.001,
    );
    for (const side of [-1, 1])
      box(
        group,
        [0.004, height, depth],
        [side * (thickness / 2 - 0.002), height / 2, 0],
        covers[i],
        0.0014,
      );
    const spine = mesh(
      group,
      new THREE.CylinderGeometry(
        thickness / 2,
        thickness / 2,
        height,
        24,
        1,
        false,
        -Math.PI / 2,
        Math.PI,
      ),
      spines[i],
    );
    spine.position.set(0, height / 2, depth / 2 - (thickness / 2) * 0.28);
    // Headbands and a ribbon break the uniform block silhouette at the page ends.
    for (const y of [0.006, height - 0.006])
      box(
        group,
        [thickness - 0.011, 0.003, 0.008],
        [0, y, depth / 2 - 0.008],
        t.brass,
        0.001,
      );
    if (variant % 3 === 0)
      box(
        group,
        [0.009, 0.025, 0.0015],
        [0, 0.001, -depth / 2 - 0.004],
        ribbon,
        0.0005,
      );
    return group;
  }
  function lathe(
    parent: THREE.Object3D,
    profile: number[][],
    material: THREE.Material,
  ) {
    return mesh(
      parent,
      new THREE.LatheGeometry(
        profile.map(([r, y]) => new THREE.Vector2(r, y)),
        64,
      ),
      material,
    );
  }
  function vessel(
    parent: THREE.Object3D,
    position: Point,
    kind: "mug" | "vase" | "glass",
    scale = 1,
    rotation = 0,
  ) {
    const group = new THREE.Group();
    group.name = `hollow-${kind}`;
    group.position.set(...position);
    group.scale.setScalar(scale);
    group.rotation.y = rotation;
    parent.add(group);
    if (kind === "vase") {
      lathe(
        group,
        [
          [0, 0],
          [0.057, 0],
          [0.065, 0.004],
          [0.069, 0.013],
          [0.084, 0.04],
          [0.097, 0.083],
          [0.1, 0.115],
          [0.096, 0.152],
          [0.078, 0.2],
          [0.061, 0.238],
          [0.058, 0.257],
          [0.06, 0.268],
          [0.059, 0.273],
          [0.053, 0.274],
          [0.051, 0.269],
          [0.051, 0.253],
          [0.055, 0.231],
          [0.071, 0.194],
          [0.088, 0.149],
          [0.092, 0.112],
          [0.087, 0.08],
          [0.074, 0.04],
          [0.055, 0.018],
          [0, 0.018],
        ],
        charcoal,
      );
    } else if (kind === "glass") {
      lathe(
        group,
        [
          [0, 0],
          [0.05, 0],
          [0.054, 0.003],
          [0.055, 0.014],
          [0.059, 0.115],
          [0.06, 0.15],
          [0.0598, 0.153],
          [0.057, 0.154],
          [0.0565, 0.15],
          [0.052, 0.025],
          [0.049, 0.017],
          [0, 0.017],
        ],
        glass,
      );
      // A heavy transparent base and thin rounded drinking rim catch different highlights.
      const rim = mesh(
        group,
        new THREE.TorusGeometry(0.0582, 0.0015, 8, 64),
        glass,
      );
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.152;
    } else {
      lathe(
        group,
        [
          [0, 0.003],
          [0.037, 0.003],
          [0.039, 0],
          [0.045, 0],
          [0.047, 0.004],
          [0.047, 0.012],
          [0.051, 0.02],
          [0.056, 0.075],
          [0.057, 0.104],
          [0.0565, 0.111],
          [0.054, 0.114],
          [0.0515, 0.112],
          [0.05, 0.105],
          [0.049, 0.078],
          [0.044, 0.025],
          [0.04, 0.018],
          [0, 0.018],
        ],
        ceramic,
      );
      // The handle attaches at two points and leaves a real open grip.
      const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0.052, 0.091, 0),
        new THREE.Vector3(0.111, 0.105, 0),
        new THREE.Vector3(0.11, 0.022, 0),
        new THREE.Vector3(0.049, 0.028, 0),
      );
      mesh(group, new THREE.TubeGeometry(curve, 36, 0.008, 10, false), ceramic);
      const liquid = mesh(group, new THREE.CircleGeometry(0.049, 64), coffee);
      liquid.rotation.x = -Math.PI / 2;
      liquid.position.y = 0.084;
      liquid.castShadow = false;
      const meniscus = mesh(
        group,
        new THREE.TorusGeometry(0.048, 0.0008, 6, 64),
        crema,
      );
      meniscus.rotation.x = Math.PI / 2;
      meniscus.position.y = 0.0845;
      meniscus.castShadow = false;
    }
    return group;
  }
  function notebook(parent: THREE.Object3D, position: Point) {
    const group = new THREE.Group();
    group.name = "bound-notebook";
    group.position.set(...position);
    group.rotation.y = -0.08;
    parent.add(group);
    box(group, [0.37, 0.021, 0.46], [0, 0.015, 0], pageEdges, 0.003);
    for (const y of [0.003, 0.03])
      box(group, [0.388, 0.006, 0.482], [0, y, 0], covers[0], 0.003);
    box(group, [0.009, 0.029, 0.478], [-0.188, 0.016, 0], covers[0], 0.004);
    box(group, [0.012, 0.0015, 0.475], [0.138, 0.034, 0], covers[4], 0.0005);
    box(group, [0.009, 0.001, 0.07], [-0.04, 0.013, 0.26], ribbon, 0.0004);
    return group;
  }
  return { book, vessel, notebook };
}
