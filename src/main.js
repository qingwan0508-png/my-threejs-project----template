import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// 1. 初始化场景、相机、渲染器
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

const axesHelper = new THREE.AxesHelper(15);
scene.add(axesHelper);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(12, 10, 15);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// 2. 白天强光灯光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
const sunLight = new THREE.DirectionalLight(0xffffff, 1.6);
sunLight.position.set(25, 35, 10);
sunLight.castShadow = true;
sunLight.shadow.camera.left = -12;
sunLight.shadow.camera.right = 12;
sunLight.shadow.camera.top = 12;
sunLight.shadow.camera.bottom = -12;
scene.add(ambientLight, sunLight);

// 3. 材质定义
const grassMat = new THREE.MeshLambertMaterial({ color: 0x8dc268 });
const soilMat = new THREE.MeshLambertMaterial({ color: 0x8b5a2b });
const grassBladeMat = new THREE.MeshLambertMaterial({ color: 0x68b846 });
const flowerMat = new THREE.MeshLambertMaterial({ color: 0xff6b6b });
const mushroomCapMat = new THREE.MeshLambertMaterial({ color: 0xcc3333 });
const mushroomStemMat = new THREE.MeshLambertMaterial({ color: 0xf5e3c8 });
const stoneMat = new THREE.MeshLambertMaterial({ color: 0x9e9e9e });

// 4. 悬空圆形小岛
const islandGroup = new THREE.Group();

const grassDisk = new THREE.Mesh(
  new THREE.CylinderGeometry(5, 5, 0.3, 64),
  grassMat
);
grassDisk.position.y = 0;
grassDisk.castShadow = true;
grassDisk.receiveShadow = true;

const soilDisk = new THREE.Mesh(
  new THREE.CylinderGeometry(4.8, 4.8, 1.2, 64),
  soilMat
);
soilDisk.position.y = -0.3 / 2 - 1.2 / 2;
soilDisk.castShadow = true;
soilDisk.receiveShadow = true;

islandGroup.add(grassDisk, soilDisk);
islandGroup.position.y = 2;
scene.add(islandGroup);

// 5. 小山丘
function createHill(x, z, scaleX, scaleY, scaleZ) {
  const hillGeo = new THREE.SphereGeometry(1.2, 16, 10);
  hillGeo.scale(scaleX, scaleY, scaleZ);
  const hill = new THREE.Mesh(hillGeo, grassMat);
  hill.position.set(x, scaleY * 0.6, z);
  hill.castShadow = true;
  hill.receiveShadow = true;
  islandGroup.add(hill);

  // 山上也长草
  for (let i = 0; i < 120; i++) {
    const radius = Math.random() * scaleX * 0.45;
    const angle = Math.random() * Math.PI * 2;
    const px = x + Math.cos(angle) * radius;
    const pz = z + Math.sin(angle) * radius;

    const height = 0.25 + Math.random() * 0.35;
    const grassGeo = new THREE.ConeGeometry(0.025, height, 6);
    const grass = new THREE.Mesh(grassGeo, grassBladeMat);

    const localY = scaleY * 0.6 - Math.sqrt(radius * radius) * 0.15;
    grass.position.set(px, localY + height / 2, pz);

    grass.rotation.z = (Math.random() - 0.5) * 0.4;
    grass.rotation.x = (Math.random() - 0.5) * 0.4;
    grass.castShadow = true;
    islandGroup.add(grass);
  }

  return hill;
}

createHill(-2.2, -1.8, 1.8, 0.7, 1.5);
createHill(2.5, 1.2, 1.4, 0.5, 1.3);
createHill(-1.5, 2.6, 2.2, 0.4, 0.9);

// 6. 草地上的草：更密、长短不一
const grassCount = 2500;

for (let i = 0; i < grassCount; i++) {
  const radius = Math.random() * 4.6;
  const angle = Math.random() * Math.PI * 2;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  const height = 0.15 + Math.random() * 0.55;
  const grassGeo = new THREE.ConeGeometry(0.025, height, 6);
  const grass = new THREE.Mesh(grassGeo, grassBladeMat);

  grass.position.set(x, height / 2, z);
  grass.rotation.z = (Math.random() - 0.5) * 0.35;
  grass.rotation.x = (Math.random() - 0.5) * 0.35;
  grass.castShadow = true;
  islandGroup.add(grass);
}

// 7. 小花
const flowerCount = 80;

for (let i = 0; i < flowerCount; i++) {
  const radius = Math.random() * 4.4;
  const angle = Math.random() * Math.PI * 2;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  const stemHeight = 0.15 + Math.random() * 0.2;
  const stemGeo = new THREE.CylinderGeometry(0.008, 0.008, stemHeight, 6);
  const stem = new THREE.Mesh(stemGeo, new THREE.MeshLambertMaterial({ color: 0x4caf50 }));
  stem.position.set(x, stemHeight / 2, z);
  stem.castShadow = true;

  const petalGeo = new THREE.SphereGeometry(0.08, 8, 8);
  petalGeo.scale(1, 0.6, 1);
  const petal = new THREE.Mesh(petalGeo, flowerMat);
  petal.position.set(x, stemHeight + 0.04, z);
  petal.castShadow = true;

  islandGroup.add(stem, petal);
}

// 8. 蘑菇
const mushroomCount = 35;

for (let i = 0; i < mushroomCount; i++) {
  const radius = Math.random() * 4.3;
  const angle = Math.random() * Math.PI * 2;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  const scale = 0.6 + Math.random() * 0.6;

  const stemGeo = new THREE.CylinderGeometry(0.08 * scale, 0.1 * scale, 0.25 * scale, 8);
  const stem = new THREE.Mesh(stemGeo, mushroomStemMat);
  stem.position.set(x, 0.12 * scale, z);
  stem.castShadow = true;

  const capGeo = new THREE.SphereGeometry(0.18 * scale, 12, 8);
  capGeo.scale(1, 0.45, 1);
  const cap = new THREE.Mesh(capGeo, mushroomCapMat);
  cap.position.set(x, 0.25 * scale, z);
  cap.castShadow = true;

  islandGroup.add(stem, cap);
}

// 9. 石头
const stoneCount = 25;

for (let i = 0; i < stoneCount; i++) {
  const radius = Math.random() * 4.2;
  const angle = Math.random() * Math.PI * 2;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  const scale = 0.15 + Math.random() * 0.25;

  const stoneGeo = new THREE.SphereGeometry(scale, 10, 10);
  stoneGeo.scale(1.2, 0.7, 0.9);
  const stone = new THREE.Mesh(stoneGeo, stoneMat);
  stone.position.set(x, scale * 0.35, z);
  stone.rotation.set(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  );
  stone.castShadow = true;
  stone.receiveShadow = true;

  islandGroup.add(stone);
}

// 10. 动画渲染循环
function animate() {
  requestAnimationFrame(animate);
  islandGroup.rotation.y += 0.005;
  controls.update();
  renderer.render(scene, camera);
}

animate();

// 窗口自适应
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});