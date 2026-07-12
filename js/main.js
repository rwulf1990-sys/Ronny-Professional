/* ============================================================
   DIS BRANDING — 3D Scene & Interactions
   ============================================================ */

import * as THREE from '../vendor/three.module.min.js';

/* ------------------------------------------------------------
   3D SCENE
------------------------------------------------------------ */
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x05050f, 0.055);

const camera = new THREE.PerspectiveCamera(
  55, window.innerWidth / window.innerHeight, 0.1, 100
);
camera.position.set(0, 0, 9);

/* ---------- Lights ---------- */
scene.add(new THREE.AmbientLight(0x4444aa, 0.5));

const lightViolet = new THREE.PointLight(0x8b5cf6, 60, 40);
lightViolet.position.set(6, 4, 6);
scene.add(lightViolet);

const lightCyan = new THREE.PointLight(0x22d3ee, 50, 40);
lightCyan.position.set(-6, -3, 5);
scene.add(lightCyan);

const lightMagenta = new THREE.PointLight(0xec4899, 45, 40);
lightMagenta.position.set(0, 6, -4);
scene.add(lightMagenta);

/* ---------- Hero Crystal (facetted icosahedron) ---------- */
const heroGroup = new THREE.Group();
scene.add(heroGroup);

const crystalGeo = new THREE.IcosahedronGeometry(1.9, 0);
const crystalMat = new THREE.MeshPhysicalMaterial({
  color: 0x0e0e2a,
  metalness: 0.85,
  roughness: 0.12,
  flatShading: true,
  emissive: 0x1a0b3a,
  emissiveIntensity: 0.6,
  clearcoat: 1,
  clearcoatRoughness: 0.15,
});
const crystal = new THREE.Mesh(crystalGeo, crystalMat);
heroGroup.add(crystal);

// Glowing wireframe shell slightly larger than the crystal
const shellGeo = new THREE.IcosahedronGeometry(2.35, 1);
const shellMat = new THREE.MeshBasicMaterial({
  color: 0x8b5cf6,
  wireframe: true,
  transparent: true,
  opacity: 0.22,
});
const shell = new THREE.Mesh(shellGeo, shellMat);
heroGroup.add(shell);

// Inner core — bright, additive
const coreGeo = new THREE.IcosahedronGeometry(0.7, 2);
const coreMat = new THREE.MeshBasicMaterial({
  color: 0x22d3ee,
  transparent: true,
  opacity: 0.85,
  blending: THREE.AdditiveBlending,
});
const core = new THREE.Mesh(coreGeo, coreMat);
heroGroup.add(core);

/* ---------- Orbit Rings ---------- */
const rings = [];
const ringColors = [0x8b5cf6, 0x22d3ee, 0xec4899];
for (let i = 0; i < 3; i++) {
  const ringGeo = new THREE.TorusGeometry(3.1 + i * 0.55, 0.012, 8, 160);
  const ringMat = new THREE.MeshBasicMaterial({
    color: ringColors[i],
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2 + (i - 1) * 0.35;
  ring.rotation.y = i * 0.5;
  heroGroup.add(ring);
  rings.push(ring);
}

/* ---------- Floating Shards ---------- */
const shards = new THREE.Group();
const shardGeo = new THREE.TetrahedronGeometry(0.16, 0);
for (let i = 0; i < 26; i++) {
  const mat = new THREE.MeshPhysicalMaterial({
    color: ringColors[i % 3],
    metalness: 0.7,
    roughness: 0.25,
    emissive: ringColors[i % 3],
    emissiveIntensity: 0.35,
    flatShading: true,
  });
  const shard = new THREE.Mesh(shardGeo, mat);
  const radius = 3.4 + Math.random() * 2.6;
  const theta = Math.random() * Math.PI * 2;
  const phi = (Math.random() - 0.5) * Math.PI * 0.8;
  shard.position.set(
    radius * Math.cos(theta) * Math.cos(phi),
    radius * Math.sin(phi),
    radius * Math.sin(theta) * Math.cos(phi)
  );
  shard.rotation.set(Math.random() * 3, Math.random() * 3, 0);
  shard.scale.setScalar(0.5 + Math.random() * 1.3);
  shard.userData = {
    baseY: shard.position.y,
    speed: 0.4 + Math.random() * 0.8,
    phase: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 1.4,
  };
  shards.add(shard);
}
heroGroup.add(shards);

/* ---------- Particle Field ---------- */
const PARTICLE_COUNT = 1600;
const positions = new Float32Array(PARTICLE_COUNT * 3);
const colors = new Float32Array(PARTICLE_COUNT * 3);
const palette = [
  new THREE.Color(0x8b5cf6),
  new THREE.Color(0x22d3ee),
  new THREE.Color(0xec4899),
  new THREE.Color(0xffffff),
];
for (let i = 0; i < PARTICLE_COUNT; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 42;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 34 - 4;
  const c = palette[Math.floor(Math.random() * palette.length)];
  colors[i * 3] = c.r;
  colors[i * 3 + 1] = c.g;
  colors[i * 3 + 2] = c.b;
}
const particleGeo = new THREE.BufferGeometry();
particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Soft round sprite texture drawn on an offscreen canvas
const spriteCanvas = document.createElement('canvas');
spriteCanvas.width = spriteCanvas.height = 64;
const sctx = spriteCanvas.getContext('2d');
const grd = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
grd.addColorStop(0, 'rgba(255,255,255,1)');
grd.addColorStop(0.35, 'rgba(255,255,255,.7)');
grd.addColorStop(1, 'rgba(255,255,255,0)');
sctx.fillStyle = grd;
sctx.fillRect(0, 0, 64, 64);
const spriteTex = new THREE.CanvasTexture(spriteCanvas);

const particleMat = new THREE.PointsMaterial({
  size: 0.14,
  map: spriteTex,
  vertexColors: true,
  transparent: true,
  opacity: 0.85,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

/* ---------- Mouse Parallax & Scroll ---------- */
const mouse = { x: 0, y: 0 };
const smooth = { x: 0, y: 0 };
window.addEventListener('pointermove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
});

let scrollY = 0;
window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

/* ---------- Animation Loop ---------- */
const clock = new THREE.Clock();

function animate() {
  const t = clock.getElapsedTime();

  // Smooth mouse follow
  smooth.x += (mouse.x - smooth.x) * 0.04;
  smooth.y += (mouse.y - smooth.y) * 0.04;

  // Crystal motion
  crystal.rotation.y = t * 0.25;
  crystal.rotation.x = Math.sin(t * 0.3) * 0.25;
  crystal.position.y = Math.sin(t * 0.8) * 0.18;

  shell.rotation.y = -t * 0.14;
  shell.rotation.z = t * 0.08;

  core.scale.setScalar(1 + Math.sin(t * 2.2) * 0.14);
  core.rotation.y = t * 0.6;

  rings.forEach((ring, i) => {
    ring.rotation.z = t * (0.12 + i * 0.05) * (i % 2 ? -1 : 1);
  });

  shards.children.forEach((shard) => {
    const u = shard.userData;
    shard.position.y = u.baseY + Math.sin(t * u.speed + u.phase) * 0.45;
    shard.rotation.x += u.rotSpeed * 0.01;
    shard.rotation.y += u.rotSpeed * 0.013;
  });
  shards.rotation.y = t * 0.05;

  particles.rotation.y = t * 0.015;

  // Lights orbit slowly
  lightViolet.position.x = Math.cos(t * 0.4) * 7;
  lightViolet.position.z = Math.sin(t * 0.4) * 7;
  lightCyan.position.x = Math.cos(t * 0.3 + Math.PI) * 6;
  lightCyan.position.y = Math.sin(t * 0.5) * 4;

  // Scroll-driven camera: pull back & drift down as user scrolls
  const scrollProgress = Math.min(scrollY / (window.innerHeight * 1.4), 1);
  const targetZ = 9 + scrollProgress * 7;
  const targetY = -scrollProgress * 2.4;

  camera.position.z += (targetZ - camera.position.z) * 0.05;
  camera.position.y += (targetY + smooth.y * -0.6 - camera.position.y) * 0.05;
  camera.position.x += (smooth.x * 0.9 - camera.position.x) * 0.05;
  camera.lookAt(0, 0, 0);

  // Fade hero group out as we scroll past
  const fade = Math.max(1 - scrollProgress * 1.1, 0);
  heroGroup.scale.setScalar(0.6 + fade * 0.4);
  shellMat.opacity = 0.22 * fade;
  rings.forEach((r) => (r.material.opacity = 0.35 * fade));

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ------------------------------------------------------------
   UI INTERACTIONS
------------------------------------------------------------ */

/* ---------- Loader ---------- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
    document.body.classList.add('loaded');
    startCounters();
  }, 1400);
});
// Fallback if load event already fired or hangs
setTimeout(() => {
  document.getElementById('loader').classList.add('done');
  document.body.classList.add('loaded');
  startCounters();
}, 3500);

/* ---------- Custom Cursor ---------- */
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
const ringPos = { x: innerWidth / 2, y: innerHeight / 2 };
const dotPos = { x: innerWidth / 2, y: innerHeight / 2 };

window.addEventListener('pointermove', (e) => {
  dotPos.x = e.clientX;
  dotPos.y = e.clientY;
});

(function cursorLoop() {
  ringPos.x += (dotPos.x - ringPos.x) * 0.16;
  ringPos.y += (dotPos.y - ringPos.y) * 0.16;
  cursorDot.style.transform = `translate(${dotPos.x}px, ${dotPos.y}px) translate(-50%,-50%)`;
  cursorRing.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%,-50%)`;
  requestAnimationFrame(cursorLoop);
})();

document.querySelectorAll('a, button, .card, .show-item').forEach((el) => {
  el.addEventListener('pointerenter', () => cursorRing.classList.add('hovering'));
  el.addEventListener('pointerleave', () => cursorRing.classList.remove('hovering'));
});

/* ---------- Nav scroll state ---------- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ---------- Mobile menu ---------- */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  })
);

/* ---------- Scroll Reveal ---------- */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

/* ---------- Animated Counters ---------- */
let countersStarted = false;
function startCounters() {
  if (countersStarted) return;
  countersStarted = true;
  document.querySelectorAll('.stat-num').forEach((el) => {
    const target = +el.dataset.count;
    const duration = 1800;
    const start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  });
}

/* ---------- 3D Tilt Cards ---------- */
document.querySelectorAll('[data-tilt]').forEach((el) => {
  el.addEventListener('pointermove', (e) => {
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * 10;
    const ry = (px - 0.5) * 10;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
  });
  el.addEventListener('pointerleave', () => {
    el.style.transform = '';
  });
});

/* ---------- Magnetic Buttons ---------- */
document.querySelectorAll('[data-magnetic]').forEach((el) => {
  el.addEventListener('pointermove', (e) => {
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${dx * 0.18}px, ${dy * 0.18}px)`;
  });
  el.addEventListener('pointerleave', () => {
    el.style.transform = '';
  });
});
