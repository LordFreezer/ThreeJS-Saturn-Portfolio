import './style.css';
//import * as THREE from 'three';
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'https://cdn.skypack.dev/three';
import { OrbitControls } from 'https://rawgit.com/mrdoob/three.js/dev/examples/jsm/controls/OrbitControls.js';

// scene
const scene = new THREE.Scene();
{
  const color = 0x000000;
  const density = 0.05;
  scene.fog = new THREE.FogExp2(color, density)
}

// camera                                andgle             aspect ratio            view frustum
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.setZ(30);
camera.position.setX(5);
camera.position.setY(5);


// renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);



// Create saturn's ring
const geometry = new THREE.RingBufferGeometry(3, 5, 64);
const ringTexture = new THREE.TextureLoader().load('/assets/rings.jpg');
var pos = geometry.attributes.position;
var v3 = new THREE.Vector3();
for (let i = 0; i < pos.count; i++) {
  v3.fromBufferAttribute(pos, i);
  geometry.attributes.uv.setXY(i, v3.length() < 4 ? 0 : 1, 1);
}
const material = new THREE.MeshBasicMaterial({
  map: ringTexture,
  color: 0xffffff,
  side: THREE.DoubleSide,
  transparent: true
});
const ring = new THREE.Mesh(geometry, material);
ring.rotation.x -= 2;

// create saturn
const saturnTexture = new THREE.TextureLoader().load('/assets/saturn.jpg');
const saturn = new THREE.Mesh(
  new THREE.SphereGeometry(2, 32, 32),
  new THREE.MeshBasicMaterial({ map: saturnTexture })
);
saturn.rotation.x = 5 * Math.PI / 6;

// lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
const lightHelper = new THREE.PointLightHelper(pointLight);

// grid
const gridHelper = new THREE.GridHelper(200, 50);

// orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// add textures
const spaceTexture = new THREE.TextureLoader().load('/assets/space.jpg');
scene.background = spaceTexture;

// build the scene
scene.add(
  //gridHelper,
  //lightHelper,
  ambientLight,
  pointLight,
  ring,
  saturn);


function addStar() {
  const colors = ['/assets/redGlow.jpg', '/assets/blueGlow.jpg', '/assets/whiteGlow.jpg']
  const starTexture = new THREE.TextureLoader().load(colors[getRandomInt(3)]);
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ map: starTexture/*color: 0x717171*/ });

  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x * 5, y * 5, z * 5);
  scene.add(star);
}
Array(200).fill().forEach(addStar);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}
document.body.onscroll = moveCamera;
moveCamera();

// controls animateion
function animate() {
  requestAnimationFrame(animate);

  ring.rotation.z += 0.005;
  saturn.rotation.y -= 0.005;
  //controls.update();
  renderer.render(scene, camera);
}
animate();

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
