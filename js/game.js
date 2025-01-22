// Configuração do canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Imagens
const bgImg = new Image();
bgImg.src = "images/background.png"; // Fundo do jogo

const heroIdleImg = new Image();
heroIdleImg.src = "images/hero_idle.png"; // Herói parado

const heroKickImg = new Image();
heroKickImg.src = "images/hero_kick.png"; // Herói chutando

const enemyImg = new Image();
enemyImg.src = "images/camera.png"; // Imagem dos inimigos

const bulletImg = new Image();
bulletImg.src = "images/bola.png"; // Tiros

// Estado do jogo
let gameState = "TITLE"; // "TITLE", "PLAYING", "GAME_OVER"

// Configuração do herói
const hero = {
  x: WIDTH / 2 - 25,
  y: HEIGHT - 80,
  width: 50,
  height: 50,
  speed: 5,
  currentImage: heroIdleImg,
};

// Configuração de inimigos
let enemies = [];
const rows = 3;
const cols = 6;
const enemyWidth = 40;
const enemyHeight = 40;
const enemySpacing = 20;
const startX = 50;
const startY = 50;

// Tiros (bolas)
let bullets = [];

// Eventos de teclado
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

// Funções de controle
function handleKeyDown(e) {
  if (e.code === "ArrowLeft") hero.x -= hero.speed;
  if (e.code === "ArrowRight") hero.x += hero.speed;
  if (e.code === "Space") shoot();
}

function handleKeyUp(e) {
  // Aqui você pode adicionar ações se necessário
}

// Disparo
function shoot() {
  bullets.push({
    x: hero.x + hero.width / 2 - 5,
    y: hero.y,
    width: 10,
    height: 20,
    speed: 5,
  });
}

// Atualização do jogo
function updateGame() {
  // Movimenta os tiros
  bullets = bullets.filter((bullet) => bullet.y > 0);
  bullets.forEach((bullet) => {
    bullet.y -= bullet.speed;
  });

  // Verifica colisões
  enemies.forEach((enemy) => {
    bullets.forEach((bullet) => {
      if (
        bullet.x < enemy.x + enemyWidth &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemyHeight &&
        bullet.y + bullet.height > enemy.y
      ) {
        enemy.alive = false;
      }
    });
  });

  // Atualiza posição dos inimigos (exemplo simples)
  enemies.forEach((enemy) => {
    if (enemy.alive) enemy.y += 0.5;
  });
}

// Renderização do jogo
function drawGame() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Desenha o fundo
  ctx.drawImage(bgImg, 0, 0, WIDTH, HEIGHT);

  // Desenha o herói
  ctx.drawImage(hero.currentImage, hero.x, hero.y, hero.width, hero.height);

  // Desenha os tiros
  bullets.forEach((bullet) => {
    ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);
  });

  // Desenha os inimigos
  enemies.forEach((enemy) => {
    if (enemy.alive) {
      ctx.drawImage(enemyImg, enemy.x, enemy.y, enemyWidth, enemyHeight);
    }
  });
}

// Inicializa os inimigos
function createEnemies() {
  enemies = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      enemies.push({
        x: startX + col * (enemyWidth + enemySpacing),
        y: startY + row * (enemyHeight + enemySpacing),
        alive: true,
      });
    }
  }
}

// Loop principal
function gameLoop() {
  updateGame();
  drawGame();
  requestAnimationFrame(gameLoop);
}

// Inicia o jogo
createEnemies();
gameLoop();
