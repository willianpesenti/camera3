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
let gameState = "TITLE"; // Estados possíveis: TITLE, PLAYING, GAME_OVER

// Configuração do herói
const hero = {
  x: WIDTH / 2 - 75,
  y: HEIGHT - 150,
  width: 150,
  height: 150,
  currentImage: heroIdleImg,
};

// Configuração dos inimigos (câmeras)
let enemies = [];
const enemyWidth = 90; // Aumentado em 50%
const enemyHeight = 90; // Aumentado em 50%
const enemySpeed = 1; // Velocidade base dos inimigos

// Configuração dos tiros (bolas)
let bullets = [];
const bulletWidth = 30; // Aumentado em 50%
const bulletHeight = 30; // Aumentado em 50%

// Contagem de pontos
let score = 0;

// Eventos de teclado
document.addEventListener("keydown", handleKeyDown);

function handleKeyDown(e) {
  if (gameState === "TITLE" && e.code === "Space") {
    gameState = "PLAYING";
    createEnemy();
  } else if (gameState === "PLAYING") {
    if (e.code === "ArrowLeft") hero.x -= 20;
    if (e.code === "ArrowRight") hero.x += 20;
    if (e.code === "Space") shoot();
  } else if (gameState === "GAME_OVER" && e.code === "KeyR") {
    restartGame();
  }
}

// Função para disparar
function shoot() {
  bullets.push({
    x: hero.x + hero.width / 2 - bulletWidth / 2,
    y: hero.y,
    width: bulletWidth,
    height: bulletHeight,
    speed: 8,
  });
}

// Função para criar inimigos randômicos
function createEnemy() {
  const x = Math.random() * (WIDTH - enemyWidth);
  const y = -enemyHeight; // Aparece fora da tela no topo
  enemies.push({
    x: x,
    y: y,
    width: enemyWidth,
    height: enemyHeight,
    speed: enemySpeed + score * 0.1, // Aumenta a velocidade conforme a pontuação
    alive: true,
  });

  // Adiciona novos inimigos a cada 2 segundos
  if (gameState === "PLAYING") {
    setTimeout(createEnemy, Math.max(2000 - score * 100, 500)); // Diminui o intervalo conforme a pontuação aumenta
  }
}

// Atualização do jogo
function updateGame() {
  // Atualiza os tiros
  bullets.forEach((bullet) => {
    bullet.y -= bullet.speed;
  });

  // Remove tiros fora da tela
  bullets = bullets.filter((bullet) => bullet.y > 0);

  // Atualiza os inimigos
  enemies.forEach((enemy) => {
    enemy.y += enemy.speed;

    // Verifica se o inimigo saiu da tela (Game Over)
    if (enemy.y > HEIGHT && enemy.alive) {
      gameState = "GAME_OVER";
    }
  });

  // Verifica colisões entre tiros e inimigos
  enemies.forEach((enemy) => {
    bullets.forEach((bullet) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
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
    ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
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
