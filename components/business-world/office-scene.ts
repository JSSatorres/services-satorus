import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ArchitecturalOcclusion } from "./architectural-occlusion";
import { gsap } from "gsap";
import { createArchitecture } from "./architecture-model";
import { createBusinessDesk } from "./business-desk";

import type { OfficePhase } from "@/lib/office-route";

type VisitCallbacks = {
  phase: (phase: OfficePhase) => void;
  complete: () => void;
};

export function createOfficeScene(
  host: HTMLDivElement,
  markers: HTMLButtonElement[],
  onSelect: (index: number) => void,
  onLost: () => void,
  introMarkers: HTMLButtonElement[],
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
  const businessDesk = createBusinessDesk();
  scene.add(businessDesk.root);
  model.root.visible = false;
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
  // Camera travel follows real elapsed time even on a slower graphics device.
  gsap.ticker.lagSmoothing(0);
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const objects = [...model.screens, model.envelope];
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const projected = new THREE.Vector3();
  const lookUp = new THREE.Vector3(0, 1, 0);
  let timeline: gsap.core.Timeline | null = null;
  let introduction = true;
  let organizing = false;
  let arrival: gsap.core.Timeline | null = null;
  let current = -1;
  let opened = false;
  let travelling = false;
  let unfolding = false;
  let frame = 0;
  let disposed = false;
  let visible = true;
  let lastCallbacks: VisitCallbacks | null = null;

  function render() {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    camera.up.copy(lookUp).normalize();
    camera.lookAt(lookAt);
    if (
      organizing ||
      arrival?.isActive() ||
      (unfolding && (timeline?.time() ?? 0) < 1.15)
    )
      renderer.shadowMap.needsUpdate = true;
    // Keep the expensive contact-occlusion pass for settled views.
    if (travelling || arrival?.isActive()) renderer.render(scene, camera);
    else composer.render();
    introMarkers.forEach((marker, i) => {
      businessDesk.pieces[i].getWorldPosition(projected);
      projected.y += 0.3;
      projected.z -= 0.9;
      projected.project(camera);
      marker.style.left = ((projected.x + 1) * host.clientWidth) / 2 + "px";
      marker.style.top = ((1 - projected.y) * host.clientHeight) / 2 + "px";
      marker.style.visibility =
        introduction && !organizing ? "visible" : "hidden";
    });
    objects.forEach((object, index) => {
      object.getWorldPosition(projected).project(camera);
      const inView =
        Math.abs(projected.x) < 0.9 &&
        Math.abs(projected.y) < 0.8 &&
        projected.z > -1 &&
        projected.z < 1;
      markers[index].style.left =
        `${((projected.x + 1) * host.clientWidth) / 2}px`;
      markers[index].style.top =
        `${((1 - projected.y) * host.clientHeight) / 2}px`;
      markers[index].style.visibility =
        opened && current === -1 && !travelling && inView
          ? "visible"
          : "hidden";
    });
  }
  function invalidate() {
    if (!frame && !disposed) frame = requestAnimationFrame(render);
  }
  function destination(index: number) {
    model.root.updateMatrixWorld(true);
    const object = objects[index];
    const target = object.getWorldPosition(new THREE.Vector3());
    const orientation = object.getWorldQuaternion(new THREE.Quaternion());
    const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(orientation);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(orientation);
    const width = index === 3 ? 0.58 : 1.01;
    const height = index === 3 ? 0.38 : 0.565;
    const distance =
      Math.max(height, width / camera.aspect) /
      (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    return {
      target,
      up,
      camera: target.clone().addScaledVector(normal, distance * 1.04),
      approach: target
        .clone()
        .addScaledVector(normal, index === 3 ? 1.8 : 2.65)
        .add(
          new THREE.Vector3(0, index === 3 ? 0.2 : 1.05, index === 3 ? 1.5 : 0),
        ),
    };
  }
  function overview() {
    if (host.clientWidth <= 760 && camera.aspect < 1.5) {
      // Frame the useful interior at a consistent screen width, not the whole plinth.
      const distance = 0.84 / camera.aspect;
      return {
        camera: new THREE.Vector3(8.8, opened ? 12 : 10, 16).multiplyScalar(
          distance,
        ),
        target: new THREE.Vector3(0, 1.15, 0.15),
      };
    }
    const distance =
      camera.aspect < 0.9 ? 1.65 : camera.aspect < 1.3 ? 1.2 : 0.92;
    return {
      camera: new THREE.Vector3(13, opened ? 10 : 8.5, 17).multiplyScalar(
        distance,
      ),
      target: new THREE.Vector3(0, 0.9, 0.1),
    };
  }
  function pose(
    position: THREE.Vector3,
    target: THREE.Vector3,
    duration: number,
    at?: number | string,
    up = new THREE.Vector3(0, 1, 0),
  ) {
    const start = at ?? timeline!.duration();
    timeline!
      .to(
        camera.position,
        {
          x: position.x,
          y: position.y,
          z: position.z,
          duration,
          ease: "power2.inOut",
        },
        start,
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
        start,
      )
      .to(
        lookUp,
        { x: up.x, y: up.y, z: up.z, duration, ease: "power2.inOut" },
        start,
      );
  }
  function deskView() {
    const distance = camera.aspect < 0.9 ? 1.5 : camera.aspect < 1.3 ? 1.2 : 1;
    return {
      camera: new THREE.Vector3(0.3, 7.8, 8.8).multiplyScalar(distance),
      target: new THREE.Vector3(0, 1.15, 0),
    };
  }
  function showOffice() {
    introduction = false;
    businessDesk.root.visible = false;
    model.root.visible = true;
    renderer.shadowMap.needsUpdate = true;
  }
  function organize(callbacks: { ordered: () => void; complete: () => void }) {
    if (!introduction || organizing) return;
    arrival?.kill();
    timeline?.kill();
    organizing = true;
    travelling = true;
    timeline = gsap.timeline({
      onUpdate: invalidate,
      onComplete: () => {
        showOffice();
        organizing = false;
        travelling = false;
        renderer.shadowMap.needsUpdate = true;
        invalidate();
        callbacks.complete();
      },
    });
    businessDesk.pieces.forEach((piece, i) => {
      const start = i * 0.06;
      timeline!
        .to(
          piece.position,
          { y: 0.32, duration: 0.18, ease: "power2.out" },
          start,
        )
        .to(
          piece.position,
          {
            x: ((i % 3) - 1) * 2.25,
            z: i < 3 ? -0.65 : 1.1,
            duration: 0.42,
            ease: "power2.inOut",
          },
          start,
        )
        .to(
          piece.rotation,
          { y: 0, duration: 0.42, ease: "power2.inOut" },
          start,
        )
        .to(
          piece.position,
          { y: 0.015 + i * 0.003, duration: 0.2, ease: "power2.inOut" },
          start + 0.22,
        );
    });
    timeline.call(
      () => {
        businessDesk.ordered();
        callbacks.ordered();
      },
      [],
      0.75,
    );
    // Briefly show the ordered desk, then hand off without a long idle pause.
    timeline.to({}, { duration: 0.15 });
    timeline.to(businessDesk.root.scale, {
      x: 0.78,
      y: 0.78,
      z: 0.78,
      duration: 0.3,
      ease: "power2.in",
    });
    timeline.to(
      businessDesk.root.position,
      { y: -4.5, duration: 0.3, ease: "power2.in" },
      "<",
    );
    timeline.call(() => {
      showOffice();
      const view = overview();
      camera.position.copy(view.camera).multiplyScalar(1.14);
      lookAt.copy(view.target);
      model.root.position.y = -0.7;
    });
    const view = overview();
    const start = timeline.duration();
    pose(view.camera, view.target, 0.55, start);
    timeline.to(
      model.root.position,
      { y: 0, duration: 0.55, ease: "power2.out" },
      start,
    );
    if (reduced.matches) timeline.progress(1);
    invalidate();
  }
  function visit(index: number, callbacks: VisitCallbacks) {
    timeline?.kill();
    arrival?.kill();
    organizing = false;
    if (introduction) {
      showOffice();
      const view = overview();
      camera.position.copy(view.camera);
      lookAt.copy(view.target);
    }
    model.root.position.y = 0;
    const previous = current;
    unfolding = !opened && index >= 0;
    current = Math.max(-1, Math.min(3, index));
    lastCallbacks = callbacks;
    travelling = true;
    model.services.visible = false;
    host.dataset.destination = String(current);
    callbacks.phase(previous >= 0 ? "departing" : "entering");
    timeline = gsap.timeline({
      onUpdate: () => {
        host.dataset.flightTime = String(timeline?.time());
        invalidate();
      },
      onComplete: () => {
        renderer.shadowMap.needsUpdate = true;
        travelling = false;
        lastCallbacks = null;
        invalidate();
        callbacks.complete();
      },
    });
    const duration = (seconds: number) => (reduced.matches ? 0 : seconds);
    if (previous >= 0) {
      const from = destination(previous);
      pose(from.approach, from.target, duration(0.85));
    }
    if (current === -1) {
      const view = overview();
      pose(view.camera, view.target, duration(1.2));
    } else {
      opened = true;
      timeline
        .to(
          model.roof.position,
          { y: 8, duration: duration(1.1), ease: "power2.inOut" },
          0,
        )
        .to(
          model.facade.position,
          { y: 6, duration: duration(1.1), ease: "power2.inOut" },
          0,
        );
      timeline.call(
        () => {
          model.roof.visible = false;
          model.facade.visible = false;
          renderer.shadowMap.needsUpdate = true;
          invalidate();
        },
        [],
        duration(1.1),
      );
      const interiorStart = previous >= 0 ? duration(0.8) : 0;
      pose(
        new THREE.Vector3(0.1, 3.4, 4.9),
        new THREE.Vector3(0, 1.3, -0.55),
        duration(1.05),
        interiorStart,
      );
      timeline.call(() => callbacks.phase("interior"));
      timeline.to({}, { duration: duration(0.35) });
      const next = destination(current);
      timeline.call(() => callbacks.phase("entering"));
      pose(next.approach, next.target, duration(0.95));
      pose(next.camera, next.target, duration(1.15), undefined, next.up);
    }
    host.dataset.flightDuration = String(timeline.duration());
    invalidate();
  }
  function resize() {
    const width = host.clientWidth,
      height = host.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.fov = 37;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, width < 700 ? 1.75 : 1.7),
    );
    renderer.setSize(width, height);
    composer.setPixelRatio(
      Math.min(Math.max(window.devicePixelRatio, 1.25), 1.75),
    );
    composer.setSize(width, height);
    if (organizing || (travelling && lastCallbacks)) {
      // A new aspect ratio must not leave the destination camera behind the HTML.
      timeline?.progress(1);
    }
    if (current >= 0) {
      const next = destination(current);
      camera.position.copy(next.camera);
      lookAt.copy(next.target);
      lookUp.copy(next.up);
    } else {
      const view = introduction ? deskView() : overview();
      camera.position.copy(view.camera);
      lookAt.copy(view.target);
      lookUp.set(0, 1, 0);
    }
    invalidate();
  }
  function pick(event: MouseEvent) {
    if (introduction || travelling || current >= 0) return -1;
    const bounds = renderer.domElement.getBoundingClientRect();
    pointer.set(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(
      opened ? objects : [model.root],
      !opened,
    )[0];
    return hit ? (opened ? objects.indexOf(hit.object as THREE.Mesh) : 0) : -1;
  }
  const move = (event: MouseEvent) => {
    renderer.domElement.style.cursor = pick(event) >= 0 ? "pointer" : "default";
  };
  const click = (event: MouseEvent) => {
    const index = pick(event);
    if (index >= 0) onSelect(index);
  };
  const motion = () => {
    if (reduced.matches) {
      timeline?.progress(1);
      arrival?.progress(1);
    }
  };
  const visibility = () => {
    if (document.hidden) {
      timeline?.pause();
      arrival?.pause();
    } else {
      timeline?.resume();
      arrival?.resume();
      invalidate();
    }
  };
  const contextLost = (event: Event) => {
    event.preventDefault();
    timeline?.kill();
    onLost();
  };
  const observer = new ResizeObserver(resize);
  const intersection = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible) {
      timeline?.resume();
      invalidate();
    } else timeline?.pause();
  });
  observer.observe(host);
  intersection.observe(host);
  renderer.domElement.addEventListener("pointermove", move);
  renderer.domElement.addEventListener("click", click);
  renderer.domElement.addEventListener("webglcontextlost", contextLost);
  document.addEventListener("visibilitychange", visibility);
  reduced.addEventListener("change", motion);
  resize();
  if (!reduced.matches) {
    arrival = gsap.timeline({
      onUpdate: invalidate,
      onComplete: () => {
        renderer.shadowMap.needsUpdate = true;
        invalidate();
      },
    });
    businessDesk.pieces.forEach((piece, i) => {
      arrival!.from(
        piece.position,
        { y: 0.3 + i * 0.08, duration: 1.1, ease: "power2.out" },
        i * 0.09,
      );
    });
    arrival.to(
      businessDesk.pieces[0].rotation,
      { y: -0.16, duration: 0.07, repeat: 5, yoyo: true },
      1.7,
    );
  }
  return {
    visit,
    organize,
    dispose() {
      gsap.ticker.lagSmoothing(500, 33);
      disposed = true;
      cancelAnimationFrame(frame);
      timeline?.kill();
      arrival?.kill();
      businessDesk.dispose();
      observer.disconnect();
      intersection.disconnect();
      renderer.domElement.removeEventListener("pointermove", move);
      renderer.domElement.removeEventListener("click", click);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", motion);
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
