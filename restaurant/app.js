/* ============================================================
   DIS RESTAURANT — 3D Scene & Interactions (by Dis Branding)
   ============================================================ */

import * as THREE from '../vendor/three.module.min.js';

/* ------------------------------------------------------------
   3D SCENE — golden cloche, ember particles, warm lights.
   Wrapped so a WebGL failure (disabled GPU, locked-down tablet
   browser, context loss) never blocks the rest of the page.
------------------------------------------------------------ */
const isSmallScreen = window.innerWidth < 768;

function supportsWebGL() {
  try {
    const test = document.createElement('canvas');
    return !!(test.getContext('webgl') || test.getContext('experimental-webgl'));
  } catch (e) {
    return false;
  }
}

function initScene() {
  const canvas = document.getElementById('scene');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isSmallScreen,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmallScreen ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050403, 0.05);

  const camera = new THREE.PerspectiveCamera(
    55, window.innerWidth / window.innerHeight, 0.1, 100
  );
  camera.position.set(0, 0.4, 9);

  /* ---------- Lights (warm, candle-like) ---------- */
  scene.add(new THREE.AmbientLight(0x8a6a30, 0.45));

  const lightGold = new THREE.PointLight(0xffc94d, 70, 40);
  lightGold.position.set(5, 5, 6);
  scene.add(lightGold);

  const lightAmber = new THREE.PointLight(0xff8c42, 45, 40);
  lightAmber.position.set(-6, -2, 5);
  scene.add(lightAmber);

  const lightWhite = new THREE.PointLight(0xfff2d8, 30, 30);
  lightWhite.position.set(0, 7, -3);
  scene.add(lightWhite);

  /* ---------- The Golden Cloche (matches the DIS logo) ---------- */
  const heroGroup = new THREE.Group();
  scene.add(heroGroup);

  const goldMat = new THREE.MeshPhysicalMaterial({
    color: 0xC8952C,
    metalness: 1,
    roughness: 0.22,
    emissive: 0x3a2708,
    emissiveIntensity: 0.5,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
  });

  // Dome (upper hemisphere)
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(1.9, 48, 32, 0, Math.PI * 2, 0, Math.PI / 2),
    goldMat
  );
  dome.position.y = -0.4;
  heroGroup.add(dome);

  // Dome rim
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(1.9, 0.08, 16, 64),
    goldMat
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = -0.4;
  heroGroup.add(rim);

  // Knob on top
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 16), goldMat);
  knob.position.y = 1.62;
  heroGroup.add(knob);
  const knobStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.09, 0.28, 16),
    goldMat
  );
  knobStem.position.y = 1.44;
  heroGroup.add(knobStem);

  // Serving plate under the dome
  const plate = new THREE.Mesh(
    new THREE.CylinderGeometry(2.6, 2.75, 0.12, 64),
    new THREE.MeshPhysicalMaterial({
      color: 0x1c1812,
      metalness: 0.9,
      roughness: 0.35,
      emissive: 0x14100a,
      emissiveIntensity: 0.4,
    })
  );
  plate.position.y = -0.62;
  heroGroup.add(plate);

  // Golden wireframe aura around everything
  const aura = new THREE.Mesh(
    new THREE.IcosahedronGeometry(3.1, 1),
    new THREE.MeshBasicMaterial({
      color: 0xE5A82E,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    })
  );
  heroGroup.add(aura);
  const auraMat = aura.material;

  /* ---------- Orbit rings ---------- */
  const rings = [];
  const ringColors = [0xffc94d, 0xE5A82E, 0xff8c42];
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.5 + i * 0.5, 0.012, 8, 160),
      new THREE.MeshBasicMaterial({
        color: ringColors[i],
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
      })
    );
    ring.rotation.x = Math.PI / 2 + (i - 1) * 0.3;
    ring.rotation.y = i * 0.6;
    heroGroup.add(ring);
    rings.push(ring);
  }

  /* ---------- Floating pizza & burger icons ---------- */
  function makeEmojiTexture(emoji, px = 128) {
    const c = document.createElement('canvas');
    c.width = c.height = px;
    const ctx = c.getContext('2d');
    ctx.font = `${px * 0.82}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, px / 2, px * 0.56);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  const shards = new THREE.Group();
  const foodTextures = [makeEmojiTexture('🍕'), makeEmojiTexture('🍔')];
  const SHARD_COUNT = isSmallScreen ? 12 : 22;
  for (let i = 0; i < SHARD_COUNT; i++) {
    const shard = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: foodTextures[i % 2],
        transparent: true,
        depthWrite: false,
      })
    );
    const radius = 3.6 + Math.random() * 2.4;
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI * 0.7;
    shard.position.set(
      radius * Math.cos(theta) * Math.cos(phi),
      radius * Math.sin(phi),
      radius * Math.sin(theta) * Math.cos(phi)
    );
    const scale = 0.4 + Math.random() * 0.5;
    shard.scale.set(scale, scale, 1);
    shard.userData = {
      baseY: shard.position.y,
      speed: 0.4 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 1.4,
    };
    shards.add(shard);
  }
  heroGroup.add(shards);

  /* ---------- Ember particles (slowly rising sparks) ---------- */
  const EMBER_COUNT = isSmallScreen ? 550 : 1200;
  const positions = new Float32Array(EMBER_COUNT * 3);
  const colors = new Float32Array(EMBER_COUNT * 3);
  const speeds = new Float32Array(EMBER_COUNT);
  const palette = [
    new THREE.Color(0xffc94d),
    new THREE.Color(0xE5A82E),
    new THREE.Color(0xff8c42),
    new THREE.Color(0xfff2d8),
  ];
  const FIELD = { x: 40, y: 26, z: 30 };
  for (let i = 0; i < EMBER_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * FIELD.x;
    positions[i * 3 + 1] = (Math.random() - 0.5) * FIELD.y;
    positions[i * 3 + 2] = (Math.random() - 0.5) * FIELD.z - 3;
    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
    speeds[i] = 0.2 + Math.random() * 0.7;
  }
  const emberGeo = new THREE.BufferGeometry();
  emberGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  emberGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const spriteCanvas = document.createElement('canvas');
  spriteCanvas.width = spriteCanvas.height = 64;
  const sctx = spriteCanvas.getContext('2d');
  const grd = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.35, 'rgba(255,255,255,.7)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  sctx.fillStyle = grd;
  sctx.fillRect(0, 0, 64, 64);

  const embers = new THREE.Points(
    emberGeo,
    new THREE.PointsMaterial({
      size: 0.12,
      map: new THREE.CanvasTexture(spriteCanvas),
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  scene.add(embers);

  /* ---------- Mouse & Scroll ---------- */
  const mouse = { x: 0, y: 0 };
  const smooth = { x: 0, y: 0 };
  window.addEventListener('pointermove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  });
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  /* ---------- Animation loop ---------- */
  const clock = new THREE.Clock();
  let running = true;
  let rafId;

  function animate() {
    if (!running) return;
    const t = clock.getElapsedTime();

    smooth.x += (mouse.x - smooth.x) * 0.04;
    smooth.y += (mouse.y - smooth.y) * 0.04;

    // Cloche: slow rotation + gentle hover; dome "lifts" periodically
    heroGroup.rotation.y = t * 0.22;
    heroGroup.position.y = Math.sin(t * 0.8) * 0.15;
    const lift = Math.max(0, Math.sin(t * 0.5)) ** 3 * 0.7;
    dome.position.y = -0.4 + lift;
    rim.position.y = -0.4 + lift;
    knob.position.y = 1.62 + lift;
    knobStem.position.y = 1.44 + lift;

    aura.rotation.y = -t * 0.12;
    aura.rotation.z = t * 0.07;

    rings.forEach((ring, i) => {
      ring.rotation.z = t * (0.1 + i * 0.05) * (i % 2 ? -1 : 1);
    });

    shards.children.forEach((shard) => {
      const u = shard.userData;
      shard.position.y = u.baseY + Math.sin(t * u.speed + u.phase) * 0.4;
      shard.material.rotation += u.rotSpeed * 0.012;
    });
    shards.rotation.y = t * 0.05;

    // Embers rise and wrap around
    const pos = emberGeo.attributes.position.array;
    for (let i = 0; i < EMBER_COUNT; i++) {
      pos[i * 3 + 1] += speeds[i] * 0.012;
      pos[i * 3] += Math.sin(t * 0.6 + i) * 0.0015;
      if (pos[i * 3 + 1] > FIELD.y / 2) pos[i * 3 + 1] = -FIELD.y / 2;
    }
    emberGeo.attributes.position.needsUpdate = true;

    // Warm lights flicker softly like candlelight
    lightGold.intensity = 70 + Math.sin(t * 7.3) * 6 + Math.sin(t * 13.7) * 4;
    lightAmber.intensity = 45 + Math.sin(t * 5.1 + 2) * 5;
    lightGold.position.x = Math.cos(t * 0.35) * 6;
    lightGold.position.z = Math.sin(t * 0.35) * 6 + 2;

    // Scroll-driven camera
    const scrollProgress = Math.min(scrollY / (window.innerHeight * 1.4), 1);
    const targetZ = 9 + scrollProgress * 7;
    const targetY = 0.4 - scrollProgress * 2.2;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.position.y += (targetY + smooth.y * -0.5 - camera.position.y) * 0.05;
    camera.position.x += (smooth.x * 0.8 - camera.position.x) * 0.05;
    camera.lookAt(0, 0, 0);

    const fade = Math.max(1 - scrollProgress * 1.1, 0);
    heroGroup.scale.setScalar(0.6 + fade * 0.4);
    auraMat.opacity = 0.14 * fade;
    rings.forEach((r) => (r.material.opacity = 0.3 * fade));

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    document.body.classList.add('no-3d');
  });
}

if (supportsWebGL()) {
  try {
    initScene();
  } catch (err) {
    console.warn('3D scene disabled:', err);
    document.body.classList.add('no-3d');
  }
} else {
  document.body.classList.add('no-3d');
}

/* ------------------------------------------------------------
   UI INTERACTIONS — always run, independent of the 3D scene, so a
   WebGL failure never leaves the page stuck (loader forever, order
   buttons / menu tabs unresponsive).
------------------------------------------------------------ */

/* ---------- Globals used by inline onclick handlers ---------- */
/* Pickup-only ordering: no payment happens online. Items are collected
   in a cart; placing the order stores it for the dashboard, and payment
   happens at pickup in the restaurant. */
const orderToast = document.createElement('div');
orderToast.id = 'order-toast';
document.body.appendChild(orderToast);
let toastTimer = null;

function showToast(title, sub) {
  orderToast.innerHTML = title + (sub ? '<br><small>' + sub + '</small>' : '');
  orderToast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => orderToast.classList.remove('show'), 3000);
}

window.showTab = function (btn, id) {
  document.querySelectorAll('.menu-tab').forEach((t) => t.classList.remove('active'));
  document.querySelectorAll('.menu-panel').forEach((p) => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(id).classList.add('active');
};

window.goToMittagstisch = function () {
  const tabBtn = [...document.querySelectorAll('.menu-tab')].find(
    (t) => t.getAttribute('onclick')?.includes("'mittagstisch'")
  );
  if (tabBtn) window.showTab(tabBtn, 'mittagstisch');
  document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
};

/* ---------- Extras Modal (Mayo/Ketchup) ---------- */
const EXTRA_PRICE = 0.6;
const extrasOverlay = document.getElementById('extras-overlay');
const extrasTitle = document.getElementById('extras-title');
const extrasTotalPrice = document.getElementById('extras-total-price');
const extraMayo = document.getElementById('extra-mayo');
const extraKetchup = document.getElementById('extra-ketchup');
let extrasBasePrice = 0;

function formatEUR(value) {
  return value.toFixed(2).replace('.', ',') + ' €';
}

function updateExtrasTotal() {
  let total = extrasBasePrice;
  if (extraMayo.checked) total += EXTRA_PRICE;
  if (extraKetchup.checked) total += EXTRA_PRICE;
  extrasTotalPrice.textContent = formatEUR(total);
}

window.openExtras = function (name, basePrice) {
  extrasBasePrice = basePrice;
  extrasTitle.textContent = name;
  extraMayo.checked = false;
  extraKetchup.checked = false;
  updateExtrasTotal();
  extrasOverlay.classList.add('open');
};

function closeExtras() {
  extrasOverlay.classList.remove('open');
}

extraMayo.addEventListener('change', updateExtrasTotal);
extraKetchup.addEventListener('change', updateExtrasTotal);
document.getElementById('extras-close').addEventListener('click', closeExtras);
extrasOverlay.addEventListener('click', (e) => {
  if (e.target === extrasOverlay) closeExtras();
});

/* ---------- Warenkorb ---------- */
function parseEUR(text) {
  return parseFloat(text.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
}

const CART_KEY = 'dis-cart';
const cartOverlay = document.getElementById('cart-overlay');
const cartFab = document.getElementById('cart-fab');
const cartCount = document.getElementById('cart-count');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartConfirm = document.getElementById('cart-confirm');
const pickupSelect = document.getElementById('pickup-time');

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
  catch (e) { return []; }
}
function saveCart(cart) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* ok */ }
}

function renderCart() {
  const cart = loadCart();
  cartCount.textContent = cart.length;
  cartFab.style.display = 'flex';

  if (!cart.length) {
    cartItemsEl.innerHTML = '<div class="cart-empty">Dein Warenkorb ist leer.<br>Füge Gerichte aus der Speisekarte hinzu.</div>';
  } else {
    cartItemsEl.innerHTML = cart.map((item, i) => `
      <div class="cart-item">
        <div class="cart-item-info">
          <p class="cart-item-name">${item.dish}</p>
          ${item.details && item.details.length ? `<p class="cart-item-details">${item.details.join(' · ')}</p>` : ''}
        </div>
        <span class="cart-item-price">${formatEUR(item.price)}</span>
        <button class="cart-item-remove" onclick="removeFromCart(${i})" aria-label="Entfernen">✕</button>
      </div>`).join('');
  }

  cartTotalEl.textContent = formatEUR(cart.reduce((s, i) => s + i.price, 0));
  cartConfirm.disabled = !cart.length || !isOrderingDay();
  cartConfirm.style.opacity = cart.length ? '1' : '.4';
}

function addToCart(item) {
  const cart = loadCart();
  cart.push(item);
  saveCart(cart);
  renderCart();
  cartFab.classList.remove('bump');
  void cartFab.offsetWidth;
  cartFab.classList.add('bump');
  showToast('✓ Zum Warenkorb hinzugefügt', item.dish);
}

window.removeFromCart = function (index) {
  const cart = loadCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
};

/* Pickup slots: Bestellannahme täglich 11:00 – 20:30 Uhr */
/* Bestellannahme: Montag – Samstag, 11:00 – 20:30 Uhr (Sonntag geschlossen) */
function isOrderingDay() {
  return new Date().getDay() !== 0;
}

function buildPickupOptions() {
  pickupSelect.innerHTML = '';

  if (!isOrderingDay()) {
    const closed = document.createElement('option');
    closed.textContent = 'Sonntag geschlossen – Bestellungen Mo–Sa möglich';
    closed.disabled = true;
    closed.selected = true;
    pickupSelect.appendChild(closed);
    pickupSelect.disabled = true;
    return;
  }
  pickupSelect.disabled = false;

  const asap = document.createElement('option');
  asap.value = 'schnellstmoeglich';
  asap.textContent = 'Schnellstmöglich';
  pickupSelect.appendChild(asap);

  const now = new Date();
  for (let mins = 11 * 60; mins <= 20 * 60 + 30; mins += 15) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const label = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} Uhr`;
    const opt = document.createElement('option');
    opt.value = label;
    opt.textContent = label;
    // Slots already passed today (with 20 min prep buffer) can't be picked
    const slot = new Date();
    slot.setHours(h, m, 0, 0);
    if (slot.getTime() < now.getTime() + 20 * 60 * 1000) opt.disabled = true;
    pickupSelect.appendChild(opt);
  }
}

function openCart() {
  renderCart();
  buildPickupOptions();
  cartOverlay.classList.add('open');
}
function closeCart() {
  cartOverlay.classList.remove('open');
}

cartFab.addEventListener('click', openCart);
document.getElementById('cart-close').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', (e) => {
  if (e.target === cartOverlay) closeCart();
});

/* ---------- Order recording (feeds the dashboard) ----------
   With Supabase configured (supabase-config.js) orders go to the
   database and arrive on the dashboard on any device. Without it —
   or if the request fails — they fall back to localStorage, which
   the dashboard on the same device also reads. */
const SUPA = window.DIS_SUPABASE || {};
const SUPA_ON = !!(SUPA.url && SUPA.anonKey);

function saveLocalOrder(items, total, pickup) {
  try {
    const orders = JSON.parse(localStorage.getItem('dis-orders') || '[]');
    orders.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      ts: Date.now(),
      items,
      total,
      pickup,
      status: 'neu',
    });
    localStorage.setItem('dis-orders', JSON.stringify(orders));
  } catch (e) {
    // localStorage unavailable (private mode etc.) — ordering still works
  }
}

function recordOrder(items, total, pickup) {
  if (SUPA_ON) {
    fetch(SUPA.url + '/rest/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPA.anonKey,
        Authorization: 'Bearer ' + SUPA.anonKey,
      },
      body: JSON.stringify({ items, total, pickup, status: 'neu' }),
    }).then((res) => {
      if (!res.ok) saveLocalOrder(items, total, pickup);
    }).catch(() => saveLocalOrder(items, total, pickup));
    return;
  }
  saveLocalOrder(items, total, pickup);
}

cartConfirm.addEventListener('click', () => {
  const cart = loadCart();
  if (!cart.length || !isOrderingDay()) return;
  const pickup = pickupSelect.value === 'schnellstmoeglich'
    ? 'Schnellstmöglich'
    : pickupSelect.value;
  recordOrder(cart, cart.reduce((s, i) => s + i.price, 0), pickup);
  saveCart([]);
  renderCart();
  closeCart();
  showToast('✓ Bestellung eingegangen!', 'Abholung ' + pickup + ' · Bezahlung vor Ort');
});

window.orderDirect = function (dish, price) {
  addToCart({ dish, details: [], price });
};

/* Soft drinks carry a 0,25 € takeaway deposit, charged automatically */
const DRINK_PFAND = 0.25;
window.orderDrink = function (dish, price) {
  addToCart({ dish, details: ['inkl. 0,25 € Pfand'], price: price + DRINK_PFAND });
};

document.getElementById('extras-confirm').addEventListener('click', () => {
  const details = [];
  if (extraMayo.checked) details.push('Mayo');
  if (extraKetchup.checked) details.push('Ketchup');
  addToCart({ dish: extrasTitle.textContent, details, price: parseEUR(extrasTotalPrice.textContent) });
  closeExtras();
});

renderCart();

/* ---------- Buns Modal (Burger customization) ---------- */
const ORDER_TYPE_PRICES = { einzeln: 9.9, menu: 15.9 };
const BUN_PRICES = { brioche: 0, rustikal: 0, glutenfrei: 1 };
const DOUBLE_PRICE = 4;
const POMMES_PRICE = 4.5;
const SAUCE_PRICES = {
  none: 0,
  mayo: 0.6,
  ketchup: 0.6,
  'vegan-mayo': 1,
  'trueffel-mayo': 1,
  'chili-cheese': 1,
  bbq: 1,
};
const DRINK_PRICES = {
  none: 0,
  cola: 2.9,
  'cola-zero': 2.9,
  sprite: 2.9,
  fanta: 2.9,
  mineralwasser: 2.9,
  'stilles-wasser': 2.5,
  'fuze-tea': 2.9,
  apfelschorle: 2.9,
};
const bunsOverlay = document.getElementById('buns-overlay');
const bunsTitle = document.getElementById('buns-title');
const bunsTotalPrice = document.getElementById('buns-total-price');
const orderTypeRadios = document.querySelectorAll('input[name="order-type"]');
const bunRadios = document.querySelectorAll('input[name="bun-choice"]');
const pattyRadios = document.querySelectorAll('input[name="patty-choice"]');
const pattyDouble = document.getElementById('patty-double');
const dipChecks = document.querySelectorAll('.dip-choice');
const priceMayo = document.getElementById('price-mayo');
const priceKetchup = document.getElementById('price-ketchup');
const einzelnExtras = document.getElementById('einzeln-extras');
const einzelnPommes = document.getElementById('einzeln-pommes');
const drinkNoneOption = document.getElementById('drink-none-option');
const drinkRadios = document.querySelectorAll('input[name="drink-choice"]');

function isMenuOrder() {
  const selected = document.querySelector('input[name="order-type"]:checked');
  return selected ? selected.value === 'menu' : false;
}

function handleOrderTypeChange() {
  const menuOrder = isMenuOrder();
  einzelnExtras.classList.toggle('visible', !menuOrder);
  drinkNoneOption.style.display = menuOrder ? 'none' : 'flex';

  if (menuOrder) {
    // Menü always includes a free Mayo or Ketchup dip — make sure one is picked
    if (!document.getElementById('sauce-mayo').checked && !document.getElementById('sauce-ketchup').checked) {
      document.getElementById('sauce-mayo').checked = true;
    }
    // ...and a real drink, since it's included either way
    const currentDrink = document.querySelector('input[name="drink-choice"]:checked');
    if (!currentDrink || currentDrink.value === 'none') {
      document.getElementById('drink-cola').checked = true;
    }
  } else {
    // Einzeln: drink and fries are optional paid add-ons, default to none
    document.getElementById('drink-none').checked = true;
    einzelnPommes.checked = false;
  }

  updateBunsTotal();
}

function updateBunsTotal() {
  const selectedOrderType = document.querySelector('input[name="order-type"]:checked');
  const basePrice = selectedOrderType ? ORDER_TYPE_PRICES[selectedOrderType.value] : ORDER_TYPE_PRICES.einzeln;
  const menuOrder = isMenuOrder();

  // One Mayo or Ketchup is included free with the Menü; picking both
  // makes the second one cost 0,60 €. The labels update live: once one
  // of the two is ticked, the other switches from inclusive to +0,60 €.
  if (!menuOrder) {
    priceMayo.textContent = '+0,60 €';
    priceKetchup.textContent = '+0,60 €';
  } else {
    const mayoChecked = document.getElementById('sauce-mayo').checked;
    const ketchupChecked = document.getElementById('sauce-ketchup').checked;
    if (mayoChecked) {
      priceMayo.textContent = 'Inklusive';
      priceKetchup.textContent = '+0,60 €';
    } else if (ketchupChecked) {
      priceKetchup.textContent = 'Inklusive';
      priceMayo.textContent = '+0,60 €';
    } else {
      priceMayo.textContent = '1× inklusive';
      priceKetchup.textContent = '1× inklusive';
    }
  }

  // Drink prices show as included with the Menü, otherwise their normal price
  Object.keys(DRINK_PRICES).forEach((key) => {
    if (key === 'none') return;
    const label = document.getElementById('price-drink-' + key);
    if (label) {
      label.textContent = menuOrder
        ? 'Inklusive · +0,25 € Pfand'
        : '+' + formatEUR(DRINK_PRICES[key] + DRINK_PFAND) + ' inkl. Pfand';
    }
  });

  const selectedBun = document.querySelector('input[name="bun-choice"]:checked');
  const bunExtra = selectedBun ? BUN_PRICES[selectedBun.value] : 0;
  const doubleExtra = pattyDouble.checked ? DOUBLE_PRICE : 0;
  // Multi-select dips: sum all picked dips; with the Menü the first
  // Mayo/Ketchup is free, a second one costs its normal 0,60 €.
  let sauceExtra = 0;
  let freeDipUsed = false;
  dipChecks.forEach((cb) => {
    if (!cb.checked) return;
    const value = cb.dataset.value;
    if (menuOrder && (value === 'mayo' || value === 'ketchup') && !freeDipUsed) {
      freeDipUsed = true;
      return;
    }
    sauceExtra += SAUCE_PRICES[value];
  });

  const selectedDrink = document.querySelector('input[name="drink-choice"]:checked');
  // Any bottled drink adds the 0,25 € takeaway deposit — with the Menü
  // the drink itself is free, the deposit still applies.
  let drinkExtra = 0;
  if (selectedDrink && selectedDrink.value !== 'none') {
    drinkExtra = (menuOrder ? 0 : DRINK_PRICES[selectedDrink.value]) + DRINK_PFAND;
  }
  const pommesExtra = !menuOrder && einzelnPommes.checked ? POMMES_PRICE : 0;

  bunsTotalPrice.textContent = formatEUR(basePrice + bunExtra + doubleExtra + sauceExtra + drinkExtra + pommesExtra);
}

window.openBuns = function (name) {
  bunsTitle.textContent = name;
  document.getElementById('order-einzeln').checked = true;
  document.getElementById('bun-brioche').checked = true;
  document.getElementById('patty-beef').checked = true;
  pattyDouble.checked = false;
  dipChecks.forEach((cb) => { cb.checked = false; });
  document.getElementById('drink-none').checked = true;
  einzelnPommes.checked = false;
  einzelnExtras.classList.add('visible');
  drinkNoneOption.style.display = 'flex';
  updateBunsTotal();
  bunsOverlay.classList.add('open');
};

function closeBuns() {
  bunsOverlay.classList.remove('open');
}

orderTypeRadios.forEach((r) => r.addEventListener('change', handleOrderTypeChange));
bunRadios.forEach((r) => r.addEventListener('change', updateBunsTotal));
pattyRadios.forEach((r) => r.addEventListener('change', updateBunsTotal));
pattyDouble.addEventListener('change', updateBunsTotal);
dipChecks.forEach((cb) => cb.addEventListener('change', updateBunsTotal));
einzelnPommes.addEventListener('change', updateBunsTotal);
drinkRadios.forEach((r) => r.addEventListener('change', updateBunsTotal));
document.getElementById('buns-close').addEventListener('click', closeBuns);
bunsOverlay.addEventListener('click', (e) => {
  if (e.target === bunsOverlay) closeBuns();
});
function checkedLabel(name) {
  const input = document.querySelector(`input[name="${name}"]:checked`);
  if (!input) return null;
  return input.closest('.extras-option-left').innerText.trim().split('\n')[0];
}

document.getElementById('buns-confirm').addEventListener('click', () => {
  const details = [];
  details.push(checkedLabel('order-type'));
  details.push('Bun: ' + checkedLabel('bun-choice'));
  details.push('Patty: ' + checkedLabel('patty-choice'));
  if (pattyDouble.checked) details.push('Double (2 Patties)');
  const dips = [...dipChecks]
    .filter((cb) => cb.checked)
    .map((cb) => cb.closest('.extras-option-left').innerText.trim().split('\n')[0]);
  if (dips.length) details.push('Dips: ' + dips.join(', '));
  const drink = checkedLabel('drink-choice');
  if (drink && drink !== 'Ohne Getränk') details.push('Getränk: ' + drink + ' (inkl. 0,25 € Pfand)');
  if (!isMenuOrder() && einzelnPommes.checked) details.push('Pommes');
  addToCart({
    dish: bunsTitle.textContent,
    details: details.filter(Boolean),
    price: parseEUR(bunsTotalPrice.textContent),
  });
  closeBuns();
});

/* ---------- Pizza-Baukasten Modal (Nr. 28) ---------- */
const pizzaOverlay = document.getElementById('pizza-overlay');
const pizzaTotalPrice = document.getElementById('pizza-total-price');
const pizzaToppings = document.querySelectorAll('.pizza-topping');
let pizzaBasePrice = 0;

function updatePizzaTotal() {
  let total = pizzaBasePrice;
  pizzaToppings.forEach((cb) => {
    if (cb.checked) total += parseFloat(cb.dataset.price);
  });
  pizzaTotalPrice.textContent = formatEUR(total);
}

window.openPizzaBuilder = function (basePrice) {
  pizzaBasePrice = basePrice;
  pizzaToppings.forEach((cb) => { cb.checked = false; });
  updatePizzaTotal();
  pizzaOverlay.classList.add('open');
};

function closePizza() {
  pizzaOverlay.classList.remove('open');
}

pizzaToppings.forEach((cb) => cb.addEventListener('change', updatePizzaTotal));
document.getElementById('pizza-close').addEventListener('click', closePizza);
pizzaOverlay.addEventListener('click', (e) => {
  if (e.target === pizzaOverlay) closePizza();
});
document.getElementById('pizza-confirm').addEventListener('click', () => {
  const toppings = [...pizzaToppings]
    .filter((cb) => cb.checked)
    .map((cb) => cb.closest('.extras-option-left').innerText.trim().split('\n')[0]);
  addToCart({ dish: 'DEINE EIGENE PIZZA', details: toppings, price: parseEUR(pizzaTotalPrice.textContent) });
  closePizza();
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (extrasOverlay.classList.contains('open')) closeExtras();
  if (bunsOverlay.classList.contains('open')) closeBuns();
  if (pizzaOverlay.classList.contains('open')) closePizza();
  if (cartOverlay.classList.contains('open')) closeCart();
});

/* ---------- Loader ---------- */
function finishLoading() {
  document.getElementById('loader').classList.add('done');
  document.body.classList.add('loaded');
}
window.addEventListener('load', () => setTimeout(finishLoading, 1300));
setTimeout(finishLoading, 3500);

/* ---------- Nav scroll state + back-to-top ---------- */
const navbar = document.getElementById('navbar');
const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  backTop.classList.toggle('show', window.scrollY > 400);
}, { passive: true });
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- Mobile menu ---------- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  })
);

/* ---------- Scroll reveal ---------- */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

/* ---------- 3D tilt cards ---------- */
document.querySelectorAll('[data-tilt]').forEach((el) => {
  el.addEventListener('pointermove', (e) => {
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 8}deg) rotateY(${(px - 0.5) * 8}deg) translateY(-3px)`;
    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
  });
  el.addEventListener('pointerleave', () => { el.style.transform = ''; });
});

/* ---------- Smooth anchor scroll ---------- */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
