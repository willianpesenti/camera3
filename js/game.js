// Elementos do jogo
const hero = document.getElementById("hero");
const bullet = document.getElementById("bullet");
const scoreboard = document.getElementById("score");
let score = 0;

// Variáveis do jogo
let enemies = [];
let bulletActive = false;
let gameInterval;
let enemySpeed = 2;
const gameArea = document.getElementById("gameArea");

// Controle do herói
document.addEventListener("keydown", handleKeyboard);
document.getElementById("leftButton").addEventListener("click", () => moveHero(-20));
document.getElementById("rightButton").addEventListener("click", () => moveHero(20));
document.getElementById("shootButton").addEventListener("click", shoot);

function handleKeyboard(e) {
  if (e.key === "ArrowLeft") moveHero(-20);
  if (e.key === "ArrowRight") moveHero(20);
  if (e.key === " ") shoot();
}

// Função para mover o herói
function moveHero(offset) {
  const currentLeft = parseInt(window.getComputedStyle(hero).left, 10);
  const newLeft = Math.max(0, Math.min(gameArea.offsetWidth - hero.offsetWidth, currentLeft + offset));
  hero.style.left = `${newLeft}px`;
}

// Função para disparar
function shoot() {
  if (bulletActive) return;
  bulletActive = true;
  bullet.style.display = "block";
  bullet.style.left = `${hero.offsetLeft + hero.offsetWidth / 2 - bullet.offsetWidth / 2}px`;
  bullet.style.top = `${hero.offsetTop - bullet.offsetHeight}px`;

  const interval = setInterval(() => {
    const bulletTop = parseInt(bullet.style.top, 10);
    if (bulletTop <= 0) {
      clearInterval(interval);
      bullet.style.display = "none";
      bulletActive = false;
   
