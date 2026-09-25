import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ArchitecturalOcclusion } from "./architectural-occlusion";
import { gsap } from "gsap";
import { createArchitecture } from "./architecture-model";

const shots = [
  {
    camera: [13, 8.5, 16],
    target: [0, 1.3, 0],
    roof: 0,
    wall: 0,
    floor: 0,
    front: 0,
  },
  {
    camera: [13, 11, 17],
    target: [0, 2.4, 0],
    roof: 3.5,
    wall: 1.8,
    floor: 0,
    front: 0.9,
  },
  {
    camera: [1.8, 3.8, 15],
    target: [0, 1.8, 1.1],
    roof: 0,
    wall: 0,
    floor: 0,
    front: 0,
  },
  {
    camera: [9.8, 8.2, 11.8],
    target: [0, 0.9, -0.45],
    roof: 7,
    wall: 1.1,
    floor: 0,
    front: 5,
  },
  {
    camera: [12.5, 7.2, 14],
    target: [0, 2.1, 0],
    roof: 6.5,
    wall: 2,
    floor: 2.5,
    front: 2,
  },
  {
    camera: [-13, 9, 17],
    target: [0, 1.5, 0],
    roof: 1.5,
    wall: 0,
    floor: 0,
    front: 0,
  },
  {
    camera: [-6, 5, 18],
    target: [0, 1.5, 0],
    roof: 0,
    wall: 0,
    floor: 0,
    front: 0,
  },
  {
    camera: [12, 6.5, 16],
    target: [0, 1.4, 0],
    roof: 0,
    wall: 0,
    floor: 0,
    front: 0,
  },
];

export function createArchitecturalScene(
  host: HTMLDivElement,
  initialChapter: number,
  onLost: () => void,
  hotspot: HTMLButtonElement,
  onScreenSelect: (index: number) => void,
) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.98;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.setAttribute("aria-hidden", "true");
  renderer.domElement.dataset.architectureCanvas = "true";
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(37, 1, 0.025, 180);
  const lookAt = new THREE.Vector3(0, 1.3, 0);
  const model = createArchitecture(() => invalidate());
  scene.add(model.root);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.055);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.8;
  room.dispose();
  pmrem.dispose();
  const ambient = new THREE.HemisphereLight(0xe9eff4, 0x74614b, 0.65);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xffe8c5, 1.75);
  sun.position.set(-8, 14, 9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -15;
  sun.shadow.camera.right = 15;
  sun.shadow.camera.top = 14;
  sun.shadow.camera.bottom = -14;
  sun.shadow.normalBias = 0.012;
  sun.shadow.bias = -0.0002;
  sun.shadow.radius = 6;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xc2d6ef, 1.1);
  fill.position.set(10, 5, -6);
  scene.add(fill);
  const interiorLight = new THREE.PointLight(0xffd397, 9, 12, 2);
  interiorLight.position.set(-1, 2.7, 0);
  scene.add(interiorLight);
  const groundGeometry = new THREE.PlaneGeometry(180, 180);
  const groundMaterial = new THREE.ShadowMaterial({
    color: 0x000000,
    opacity: 0.34,
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.6;
  ground.receiveShadow = true;
  scene.add(ground);
  const renderTarget = new THREE.WebGLRenderTarget(1, 1, {
    type: THREE.HalfFloatType,
    samples: 4,
  });
  const composer = new EffectComposer(renderer, renderTarget);
  const beautyPass = new RenderPass(scene, camera);
  const occlusion = new ArchitecturalOcclusion(scene, camera, 1, 1, 32);
  occlusion.kernelRadius = 0.28;
  occlusion.minDistance = 0.001;
  occlusion.maxDistance = 0.022;
  const output = new OutputPass();
  composer.addPass(beautyPass);
  composer.addPass(occlusion);
  composer.addPass(output);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let chapter = initialChapter;
  let focusedScreen: number | null = null;
  let transitionComplete: (() => void) | undefined;
  let hoveredScreen = 1;
  const projected = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let timeline: gsap.core.Timeline | null = null;
  let renderFrame = 0;
  let disposed = false;
  let visible = true;
  function render() {
    renderFrame = 0;
    if (disposed || !visible || document.hidden) return;
    camera.lookAt(lookAt);
    composer.render();
    model.screens[1].getWorldPosition(projected);
    projected.project(camera);
    const inView =
      projected.z > -1 &&
      projected.z < 1 &&
      Math.abs(projected.x) < 0.93 &&
      Math.abs(projected.y) < 0.86;
    hotspot.style.left = inView
      ? ((projected.x + 1) * host.clientWidth) / 2 + "px"
      : "65%";
    hotspot.style.top = inView
      ? ((1 - projected.y) * host.clientHeight) / 2 + "px"
      : "60%";
  }
  function invalidate() {
    if (!renderFrame && !disposed) renderFrame = requestAnimationFrame(render);
  }
  function goTo(index: number, immediate = false, onComplete?: () => void) {
    if (focusedScreen !== null) return;
    transitionComplete = onComplete;
    chapter = Math.max(0, Math.min(shots.length - 1, index));
    timeline?.kill();
    const shot = shots[chapter];
    const mobile = host.clientWidth < 680;
    const distance = mobile ? (chapter === 1 ? 1.02 : 0.95) : 1;
    const duration = immediate || reduced.matches ? 0 : 2.3;
    model.services.visible = chapter === 4;
    host.dataset.view = String(chapter);
    timeline = gsap.timeline({
      onUpdate: invalidate,
      onComplete: () => {
        invalidate();
        const complete = transitionComplete;
        transitionComplete = undefined;
        complete?.();
      },
      defaults: { duration, ease: "power2.inOut" },
    });
    timeline
      .to(
        camera.position,
        {
          x: shot.camera[0] * distance,
          y: shot.camera[1] * distance,
          z: shot.camera[2] * distance,
        },
        0,
      )
      .to(
        lookAt,
        { x: shot.target[0], y: shot.target[1], z: shot.target[2] },
        0,
      )
      .to(model.roof.position, { y: shot.roof }, 0)
      .to(model.westWall.position, { x: -shot.wall, y: shot.floor }, 0)
      .to(model.backWall.position, { z: -shot.wall * 0.6, y: shot.floor }, 0)
      .to(model.facade.position, { z: shot.front, y: shot.floor }, 0)
      .to(model.interior.position, { y: shot.floor }, 0);
    if (chapter === 4) {
      const signal = { progress: 0 };
      timeline.to(
        signal,
        {
          progress: 1,
          duration: reduced.matches ? 0 : 4.5,
          ease: "none",
          onUpdate: () => {
            model.signals.forEach((mesh, i) =>
              mesh.position.copy(
                model.paths[i].getPointAt((signal.progress + i * 0.15) % 1),
              ),
            );
            invalidate();
          },
        },
        duration * 0.7,
      );
    }
    invalidate();
  }
  function screenDestination(index: number) {
    model.root.updateMatrixWorld(true);
    const target = model.screens[index].getWorldPosition(new THREE.Vector3());
    // Fit the physical monitor before handing over to accessible HTML.
    const distance =
      Math.max(0.565, 1.01 / camera.aspect) /
      (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    return { target, distance: distance * 1.035 };
  }
  function enterScreen(onComplete: () => void, index = 1) {
    timeline?.kill();
    focusedScreen = index;
    transitionComplete = onComplete;
    model.services.visible = false;
    model.interior.position.y = 0;
    const { target, distance } = screenDestination(focusedScreen);
    const duration = reduced.matches ? 0 : 1.25;
    timeline = gsap.timeline({
      onUpdate: invalidate,
      onComplete: () => {
        invalidate();
        const complete = transitionComplete;
        transitionComplete = undefined;
        complete?.();
      },
    });
    timeline
      .to(model.roof.position, { y: 7, duration, ease: "power2.inOut" }, 0)
      .to(
        model.facade.position,
        { z: 7, y: 0, duration, ease: "power2.inOut" },
        0,
      )
      .to(
        camera.position,
        {
          x: target.x,
          y: target.y + 1.5,
          z: target.z + 2.8,
          duration,
          ease: "power2.inOut",
        },
        0,
      )
      .to(
        lookAt,
        {
          x: target.x,
          y: target.y,
          z: target.z,
          duration,
          ease: "power2.inOut",
        },
        0,
      )
      .to(camera.position, {
        x: target.x,
        y: target.y,
        z: target.z + distance,
        duration: reduced.matches ? 0 : 1.3,
        ease: "power2.inOut",
      });
    invalidate();
  }
  function leaveScreen(onComplete: () => void) {
    focusedScreen = null;
    goTo(chapter, false, onComplete);
  }
  function pickScreen(event: PointerEvent | MouseEvent) {
    if (focusedScreen !== null || chapter > 3) return false;
    const bounds = renderer.domElement.getBoundingClientRect();
    pointer.set(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(model.screens, false)[0];
    if (!hit) return false;
    hoveredScreen = model.screens.indexOf(hit.object as THREE.Mesh);
    return true;
  }
  const pointerMove = (event: PointerEvent) => {
    renderer.domElement.style.cursor = pickScreen(event)
      ? "pointer"
      : "default";
  };
  const screenClick = (event: MouseEvent) => {
    if (pickScreen(event)) onScreenSelect(hoveredScreen);
  };
  renderer.domElement.addEventListener("pointermove", pointerMove);
  renderer.domElement.addEventListener("click", screenClick);
  let previousWidth = 0;
  let previousHeight = 0;
  function resize() {
    const width = host.clientWidth,
      height = host.clientHeight;
    if (
      !width ||
      !height ||
      (width === previousWidth && height === previousHeight)
    )
      return;
    previousWidth = width;
    previousHeight = height;
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, width < 680 ? 1.35 : 1.7),
    );
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.fov = camera.aspect < 1.2 ? 40 : 37;
    camera.updateProjectionMatrix();
    composer.setPixelRatio(
      Math.min(
        Math.max(window.devicePixelRatio, 1.25),
        width < 680 ? 1.25 : 1.75,
      ),
    );
    composer.setSize(width, height);
    if (focusedScreen === null && !transitionComplete) goTo(chapter, true);
    else {
      if (focusedScreen !== null && !timeline?.isActive()) {
        const { target, distance } = screenDestination(focusedScreen);
        camera.position.copy(target).add(new THREE.Vector3(0, 0, distance));
        lookAt.copy(target);
      }
      invalidate();
    }
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const intersection = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible) {
      timeline?.resume();
      invalidate();
    } else timeline?.pause();
  });
  intersection.observe(host);
  const visibility = () => {
    if (document.hidden) timeline?.pause();
    else {
      timeline?.resume();
      invalidate();
    }
  };
  const motionChange = () => {
    if (reduced.matches && timeline?.isActive()) timeline.progress(1);
    else if (focusedScreen === null) goTo(chapter, true);
  };
  const contextLost = (event: Event) => {
    event.preventDefault();
    timeline?.kill();
    onLost();
  };
  document.addEventListener("visibilitychange", visibility);
  reduced.addEventListener("change", motionChange);
  renderer.domElement.addEventListener("webglcontextlost", contextLost);
  resize();
  if (initialChapter === 0 && !reduced.matches) {
    camera.position.multiplyScalar(1.16);
    camera.position.x += 2;
    goTo(0);
  }
  return {
    goTo,
    enterScreen,
    leaveScreen,
    dispose() {
      disposed = true;
      cancelAnimationFrame(renderFrame);
      timeline?.kill();
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", motionChange);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      renderer.domElement.removeEventListener("pointermove", pointerMove);
      renderer.domElement.removeEventListener("click", screenClick);
      model.dispose();
      environment.dispose();
      groundGeometry.dispose();
      groundMaterial.dispose();
      sun.shadow.dispose();
      occlusion.dispose();
      output.dispose();
      beautyPass.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
