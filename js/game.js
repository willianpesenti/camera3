// Configuração do canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Imagens
const bgImg = new Image();
bgImg.src = "images/background.png";

const titleImg = new Image();
titleImg.src = "images/titlePerson.png";

const heroIdleImg = new Image();
heroIdleImg.src = "images/hero_idle.png";

const heroKickImg = new Image();
heroKickImg.src = "images/hero_kick.png";

const enemyImg = new Image();
enemyImg.src = "images/camera.png";

const bulletImg = new Image();
bulletImg.src = "images/bola.png";

// Estado do jogo
let gameState = "TITLE"; // Estados: TITLE, PLAYING, GAME_OVER

// Configuração do herói
const hero = {
  x: WIDTH / 2 - 50,
  y: HEIGHT - 120,
  width: 100,
  height: 100,
  currentImage: heroIdleImg,
};

// Configuração de inimigos
let enemies = [];
const enemyWidth = 60;
const enemyHeight = 60;
const enemySpacing = 40;

// Tiros (bolas)
let bullets = [];

// Contagem de pontos
let score = 0;

// Eventos de teclado
document.addEventListener("keydown", handleKeyDown);

function handleKeyDown(e) {
  if (gameState === "TITLE" && e.code === "Space") {
    gameState = "PLAYING"; // Inicia o jogo
    createEnemies();
  } else if (gameState === "PLAYING") {
    if (e.code === "ArrowLeft") hero.x -= 15;
    if (e.code === "ArrowRight") hero.x += 15;
    if (e.code === "Space") shoot();
  } else if (gameState === "GAME_OVER" && e.code === "KeyR") {
    restartGame();
  }
}

// Função para disparar
function shoot() {
  bullets.push({
    x: hero.x + hero.width / 2 - 10,
    y: hero.y,
    width: 20,
    height: 20,
    speed: 8,
  });
}

// Atualização do jogo
function updateGame() {
  // Atualiza os tiros
  bullets.forEach((bullet) => {
    bullet.y -= bullet.speed;
  });

  // Remove tiros fora da tela
  bullets = bullets.filter((bullet) => bullet.y > 0);

  // Verifica colisões entre tiros e inimigos
  enemies.forEach((enemy) => {
    bullets.forEach((bullet) => {
      if (
        bullet.x < enemy.x + enemyWidth &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemyHeight &&
        bullet.y + bullet.height > enemy.y &&
        enemy.alive
      ) {
        enemy.alive = false;
        score++; // Incrementa a pontuação
      }
    });
  });

  // Remove inimigos "mortos"
  enemies = enemies.filter((enemy) => enemy.alive);

  // Se todos os inimigos forem destruídos, termina o jogo
  if (enemies.length === 0) {
    gameState = "GAME_OVER";
  }
}

// Renderização da tela de título
function drawTitleScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "green";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  ctx.fillText("CÂMERA 3", WIDTH / 2, HEIGHT / 2 - 100);

  ctx.drawImage(titleImg, WIDTH / 2 - 100, HEIGHT / 2 - 50, 200, 200);

  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Pressione ESPAÇO para começar", WIDTH / 2, HEIGHT / 2 + 150);
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

  // Mostra a pontuação
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText(`Pontos: ${score}`, 10, 30);
}

// Renderização da tela de game over
function drawGameOverScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "red";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  ctx.fillText(
    `VOCÊ QUEBROU ${score} CÂMERAS!`,
    WIDTH / 2,
    HEIGHT / 2 - 50
  );

  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Pressione R para reiniciar", WIDTH / 2, HEIGHT / 2 + 50);
}

// Inicializa os inimigos
function createEnemies() {
  enemies = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 6; col++) {
      enemies.push({
        x: 50 + col * (enemyWidth + enemySpacing),
        y: 50 + row * (enemyHeight + enemySpacing),
        alive: true,
      });
    }
  }
}

// Reinicia o jogo
function restartGame() {
  gameState = "TITLE";
  score = 0;
  bullets = [];
  enemies = [];
}

// Loop principal
function gameLoop() {
  if (gameState === "TITLE") {
    drawTitleScreen();
  } else if (gameState === "PLAYING") {
    updateGame();
    drawGame();
  } else if (gameState === "GAME_OVER") {
    drawGameOverScreen();
  }
  requestAnimationFrame(gameLoop);
}

// Inicia o jogo
gameLoop();
