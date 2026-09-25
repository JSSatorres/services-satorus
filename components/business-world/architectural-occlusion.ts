import * as THREE from "three";
import { SSAOPass } from "three/addons/postprocessing/SSAOPass.js";

/** Glass transmits light: it must not be treated as an opaque wall in the AO buffer. */
export class ArchitecturalOcclusion extends SSAOPass {
  private hiddenObjects: THREE.Object3D[] = [];

  _overrideVisibility() {
    this.scene.traverse((object) => {
      if (!object.visible) return;
      const material = object instanceof THREE.Mesh ? object.material : null;
      const surfaces = material
        ? Array.isArray(material)
          ? material
          : [material]
        : [];
      if (
        object instanceof THREE.Line ||
        object instanceof THREE.Points ||
        surfaces.some((surface) => surface.transparent)
      ) {
        this.hiddenObjects.push(object);
        object.visible = false;
      }
    });
  }

  _restoreVisibility() {
    this.hiddenObjects.forEach((object) => {
      object.visible = true;
    });
    this.hiddenObjects.length = 0;
  }
}
