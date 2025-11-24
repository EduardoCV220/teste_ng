import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js";

const canvas = document.getElementById("webgl");

// --- CENA, CÂMERA E RENDERER ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x121224);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  2000
);
camera.position.set(0, 0, 8);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// --- LUZ ---
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(3, 5, 2);
scene.add(light);

// --- CARROSSEL ---
const carousel = new THREE.Group();
scene.add(carousel);

// --- TEXTURE LOADER ---
const loader = new THREE.TextureLoader();

// --- SUAS CAPAS ---
const images = games.map((game) => game.img);

// Use um radius fixo (ajuste se quiser)
const RADIUS = games.length;
const cubes = [];
const STEP = (Math.PI * 2) / RADIUS;

// --- CRIAR CAIXAS DE CD ---
images.forEach((img, i) => {
  const jewel = createJewelCase(img, loader, i, RADIUS);
  carousel.add(jewel);
  cubes.push(jewel);
});

// --- RESPONSIVIDADE ---
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- NAVEGAÇÃO POR SETAS ---
let currentIndex = 0;
let currentRotation = 0;
let targetRotation = 0;
const rotationSpeed = 0.08;

// Botão esquerda
document.querySelector(".left-arrow").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + RADIUS) % RADIUS;
  // NOTE: sinal NEGATIVO — corrige direção
  targetRotation = -currentIndex * STEP;

  shakeCD(currentIndex);

  $("#modalBtn").data("game-id", currentIndex);
  $("#modalBtn").attr("data-game-id", currentIndex);
});

// Botão direita
document.querySelector(".right-arrow").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % RADIUS;
  // sinal NEGATIVO
  targetRotation = -currentIndex * STEP;

  shakeCD(currentIndex);
  $("#modalBtn").data("game-id", currentIndex);
  $("#modalBtn").attr("data-game-id", currentIndex);
});

// --- FUNÇÃO DE BALANÇO ---
function shakeCD(index) {
  const cd = cubes[index];
  if (!cd || !cd.tiltGroup) return;

  const tg = cd.tiltGroup;

  // Posição original salva no createJewelCase
  const orig = tg.originalPos;

  // Mata qualquer shake anterior para não acumular
  if (window.gsap) gsap.killTweensOf(tg.rotation);

  if (window.gsap) {
    gsap.fromTo(
      tg.rotation,
      { z: orig.z - 0.25 },
      {
        z: orig.z + 0.15,
        duration: 0.45,
        ease: "power2.out",
        repeat: 1,
        yoyo: true,
        onComplete: () => {
          tg.rotation.z = orig.z;
        },
      }
    );
  } else {
    // fallback simples sem GSAP: faz um pequeno ping-pong em dois frames
    tg.rotation.z = orig.z - 0.25;
    setTimeout(() => {
      tg.rotation.z = orig.z + 0.15;
      setTimeout(() => {
        tg.rotation.z = orig.z;
      }, 200);
    }, 200);
  }
}

// --- LOOP DE ANIMAÇÃO ---
function animate() {
  requestAnimationFrame(animate);

  // LERP suave entre rotações
  currentRotation += (targetRotation - currentRotation) * rotationSpeed;

  cubes.forEach((wrapper, i) => {
    const baseAngle = (i / RADIUS) * Math.PI * 2 + Math.PI / 2;
    const finalAngle = baseAngle + currentRotation;

    wrapper.position.x = Math.cos(finalAngle) * RADIUS;
    wrapper.position.z = Math.sin(finalAngle) * RADIUS;

    // Garantir que o wrapper fique voltado pra câmera (mantém o tiltGroup isolado)
    wrapper.lookAt(camera.position);
  });

  renderer.render(scene, camera);
}

// --- FUNÇÃO DE CRIAÇÃO DO JEWEL CASE ---
function createJewelCase(img, loader, i, totalImages) {
  // grupo principal
  const jewelCase = new THREE.Group();

  // grupo interno que recebe a animação (tilt)
  const tiltGroup = new THREE.Group();
  jewelCase.add(tiltGroup);
  // Caixa de CD
  const caseGeometry = new THREE.BoxGeometry(1.42, 1.25, 0.1);
  const caseMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });

  const coverMaterial = new THREE.MeshBasicMaterial({
    map: loader.load(img),
  });

  const cdCase = new THREE.Mesh(caseGeometry, [
    caseMaterial,
    caseMaterial,
    caseMaterial,
    caseMaterial,
    coverMaterial,
    caseMaterial,
  ]);

  tiltGroup.add(cdCase);

  // Acrílico frontal
  const acrylicGeometry = new THREE.PlaneGeometry(1.42, 1.25);
  const acrylicMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.4,
    roughness: 0.2,
    ior: 1.45,
    thickness: 0.02,
  });

  const acrylic = new THREE.Mesh(acrylicGeometry, acrylicMaterial);
  acrylic.position.z = 0.051;
  tiltGroup.add(acrylic);

  // posicionamento inicial no carrossel (mesma fórmula usada em animate)
  const angle = (i / totalImages) * Math.PI * 2 + Math.PI / 2;

  jewelCase.position.x = Math.cos(angle) * RADIUS;
  jewelCase.position.z = Math.sin(angle) * RADIUS;

  jewelCase.lookAt(camera.position);

  tiltGroup.originalPos = {
    x: tiltGroup.rotation.x,
    y: tiltGroup.rotation.y,
    z: tiltGroup.rotation.z,
  };

  jewelCase.tiltGroup = tiltGroup;
  return jewelCase;
}

animate();
