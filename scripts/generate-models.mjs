import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// GLTFExporter uses the browser FileReader API for its final binary Blob.
globalThis.FileReader ??= class {
  result = null;
  onloadend = null;
  async readAsArrayBuffer(blob) {
    this.result = await blob.arrayBuffer();
    this.onloadend?.();
  }
};

// Deterministic concept geometry derived from the supplied reference images.
// It is not a scan, production CAD, or a claim about final materials.
const output = resolve(dirname(fileURLToPath(import.meta.url)), '../public/models');
await mkdir(output, { recursive: true });

function material(color, roughness = .86, metalness = 0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness, side: THREE.DoubleSide });
}

function mesh(parent, name, geometry, mat, position = [0, 0, 0], rotation = [0, 0, 0]) {
  const item = new THREE.Mesh(geometry, mat);
  item.name = name;
  item.position.set(...position);
  item.rotation.set(...rotation);
  parent.add(item);
  return item;
}

function shirtBody() {
  const segments = 48;
  const levels = [
    [-1.27, .74, .21], [-1.15, .77, .24], [-.65, .81, .27],
    [0, .86, .30], [.54, .92, .31], [.86, .88, .28], [1.08, .62, .22],
  ];
  const vertices = [], normals = [], uvs = [], indices = [];
  for (let i = 0; i < levels.length; i++) {
    const [y, width, depth] = levels[i];
    for (let j = 0; j <= segments; j++) {
      const a = (j / segments) * Math.PI * 2;
      const fold = .015 * Math.sin(a * 7 + y * 4);
      vertices.push((width + fold) * Math.cos(a), y, (depth + fold) * Math.sin(a));
      normals.push(Math.cos(a), 0, Math.sin(a));
      uvs.push(j / segments, i / (levels.length - 1));
    }
  }
  for (let i = 0; i < levels.length - 1; i++) for (let j = 0; j < segments; j++) {
    const a = i * (segments + 1) + j, b = a + segments + 1;
    indices.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function sleeve(parent, side, fabric, cuff) {
  const direction = new THREE.Vector3(side * .7, -.38, 0);
  const start = new THREE.Vector3(side * .76, .76, 0);
  const end = start.clone().add(direction);
  const midpoint = start.clone().add(end).multiplyScalar(.5);
  const cylinder = mesh(parent, `sleeve_${side}`, new THREE.CylinderGeometry(.27, .205, direction.length(), 32, 1), fabric, midpoint.toArray());
  cylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
  const band = mesh(parent, `cuff_${side}`, new THREE.CylinderGeometry(.208, .211, .085, 32), cuff, end.toArray());
  band.quaternion.copy(cylinder.quaternion);
}

function collarFlap(parent, side, fabric) {
  const shape = new THREE.Shape();
  shape.moveTo(side * .05, 1.09);
  shape.lineTo(side * .47, 1.17);
  shape.lineTo(side * .56, .77);
  shape.lineTo(side * .18, .88);
  shape.closePath();
  const flap = mesh(parent, `collar_${side}`, new THREE.ExtrudeGeometry(shape, { depth: .025, bevelEnabled: true, bevelSize: .015, bevelThickness: .012, bevelSegments: 2 }), fabric, [0, 0, .255]);
  flap.rotation.y = side * -.12;
}

function makePolo() {
  const scene = new THREE.Scene();
  scene.name = 'polo_concept';
  const cloth = material('#202d4b', .94);
  const rib = material('#182541', .96);
  const stitch = material('#415073', 1);
  mesh(scene, 'pique_body', shirtBody(), cloth);
  sleeve(scene, -1, cloth, rib); sleeve(scene, 1, cloth, rib);
  collarFlap(scene, -1, rib); collarFlap(scene, 1, rib);
  mesh(scene, 'inner_neck', new THREE.CylinderGeometry(.34, .29, .16, 40, 1, true), rib, [0, 1.1, 0]);
  mesh(scene, 'placket', new THREE.BoxGeometry(.14, .48, .028), rib, [0, .75, .32]);
  for (const y of [.88, .68]) mesh(scene, `button_${y}`, new THREE.CylinderGeometry(.028, .028, .012, 16), stitch, [0, y, .345], [Math.PI / 2, 0, 0]);
  mesh(scene, 'hem', new THREE.CylinderGeometry(.746, .75, .048, 48, 1, true), rib, [0, -1.245, 0]);
  return scene;
}

function lathe(points, segments = 64) {
  return new THREE.LatheGeometry(points.map(([r, y]) => new THREE.Vector2(r, y)), segments);
}

const cupProfile = [[0, -.56], [.36, -.56], [.39, -.51], [.42, .42], [.4, .49], [.35, .49], [.34, .4], [.32, -.43], [0, -.45]];
const bowlProfile = [[0, -.55], [.25, -.55], [.52, -.35], [.78, -.08], [.8, .01], [.76, .04], [.72, -.02], [.48, -.24], [.2, -.38], [0, -.4]];
const vaseProfile = [[0, -.6], [.28, -.6], [.46, -.29], [.49, .05], [.31, .51], [.21, .82], [.23, .89], [.17, .89], [.16, .78], [.26, .43], [.38, 0], [.37, -.22], [.21, -.47], [0, -.49]];

function makeCeramics() {
  const scene = new THREE.Scene(); scene.name = 'ceramic_set_concept';
  const stages = [
    ['mesh_clay', material('#a78368', 1), material('#a78368', 1)],
    ['mesh_painted', material('#b7ad95', .95), material('#2e513f', .9)],
    ['mesh_glazed', material('#ded9c8', .29), material('#274c3c', .23)],
  ];
  for (const [stageName, base, accent] of stages) {
    const group = new THREE.Group(); group.name = stageName;
    mesh(group, `${stageName}_cup`, lathe(cupProfile), base, [-1.12, 0, .05]);
    mesh(group, `${stageName}_cup_glaze`, lathe(cupProfile.map(([r, y]) => [r * 1.005, y]).filter((_, i) => i >= 4 && i <= 6)), accent, [-1.12, 0, .05]);
    mesh(group, `${stageName}_bowl`, lathe(bowlProfile), base, [0, -.12, .42]);
    mesh(group, `${stageName}_bowl_glaze`, lathe(bowlProfile.map(([r, y]) => [r * 1.006, y]).filter((_, i) => i >= 3 && i <= 6)), accent, [0, -.12, .42]);
    mesh(group, `${stageName}_vase`, lathe(vaseProfile), base, [1.18, 0, -.3]);
    mesh(group, `${stageName}_vase_glaze`, lathe(vaseProfile.map(([r, y]) => [r * 1.006, y]).filter((_, i) => i >= 3 && i <= 8)), accent, [1.18, 0, -.3]);
    const handle = mesh(group, `${stageName}_handle`, new THREE.TorusGeometry(.3, .075, 12, 32, Math.PI * 1.65), base, [-1.55, -.02, 0], [0, 0, Math.PI * .18]);
    handle.scale.set(.7, 1.1, .7);
    scene.add(group);
  }
  return scene;
}

async function save(scene, filename) {
  const data = await new GLTFExporter().parseAsync(scene, { binary: true, onlyVisible: false });
  await writeFile(resolve(output, filename), Buffer.from(data));
  console.log(`${filename}: ${Math.round(data.byteLength / 1024)} KiB`);
}

await save(makePolo(), 'polo_shirt.glb');
await save(makeCeramics(), 'ceramic_set.glb');
