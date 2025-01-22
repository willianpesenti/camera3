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
const enemyWidth = 90; // Tamanho das câmeras
const enemyHeight = 90;
const baseEnemySpeed = 2; // Velocidade base das câmeras

// Configuração dos tiros (bolas)
let bullets = [];
const bulletWidth = 30;
const bulletHeight = 30;

// Contagem de pontos
let score = 0;

// Eventos de teclado
document.addEventListener("keydown", handleKeyDown);

function handleKeyDown(e) {
  if (gameState === "TITLE" && e.code === "Space") {
    gameState = "PLAYING";
    createEnemy();
  } else if (gameState === "PLAYING") {
    if (e.code === "ArrowLeft") hero.x = Math.max(hero.x - 20, 0);
    if (e.code === "ArrowRight") hero.x = Math.min(hero.x + 20, WIDTH - hero.width);
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
  if (gameState !== "PLAYING") return; // Impede a criação de inimigos após o Game Over

  const x = Math.random() * (WIDTH - enemyWidth);
  enemies.push({
    x: x,
    y: -enemyHeight, // Aparece fora da tela no topo
    width: enemyWidth,
    height: enemyHeight,
    speed: baseEnemySpeed + score * 0.1, // Aumenta a velocidade conforme a pontuação
    alive: true,
  });

  // Adiciona novos inimigos a cada 2 segundos
  setTimeout(createEnemy, Math.max(2000 - score * 100, 500)); // Diminui o intervalo conforme a pontuação aumenta
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

    // Verifica se o inimigo atingiu o herói
    if (
      enemy.x < hero.x + hero.width &&
      enemy.x + enemy.width > hero.x &&
      enemy.y + enemy.height > hero.y
    ) {
      gameState = "GAME_OVER";
    }

    // Verifica se o inimigo ultrapassou o limite inferior da tela
    if (enemy.y > HEIGHT) {
      gameState = "GAME_OVER";
    }
  });

  // Verifica colisões entre tiros e inimigos
  bullets.forEach((bullet) => {
    enemies.forEach((enemy) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y &&
        enemy.alive
      ) {
        enemy.alive = false;
        bullet.hit = true; // Marca o tiro como utilizado
        score++; // Incrementa a pontuação
      }
    });
  });

  // Remove inimigos "mortos"
  enemies = enemies.filter((enemy) => enemy.alive);

  // Remove tiros que acertaram
  bullets = bullets.filter((bullet) => !bullet.hit);
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

  // Mostra o placar em um quadrado preto com texto vermelho
  ctx.fillStyle = "black";
  ctx.fillRect(WIDTH - 220, HEIGHT - 50, 210, 40);

  ctx.fillStyle = "red";
  ctx.font = "20px Arial";
  ctx.textAlign = "right";
  ctx.fillText(`QUEBROU: ${score} câmeras`, WIDTH - 10, HEIGHT - 20);
}

// Renderização da tela de game over
function drawGameOverScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "red";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";

  // Exibe mensagem no singular ou plural
  if (score === 1) {
    ctx.fillText(`VOCÊ QUEBROU ${score} CÂMERA!`, WIDTH / 2, HEIGHT / 2 - 100);
  } else {
    ctx.fillText(`VOCÊ QUEBROU ${score} CÂMERAS!`, WIDTH / 2, HEIGHT / 2 - 100);
  }

  ctx.drawImage(titleImg, WIDTH / 2 - 100, HEIGHT / 2, 200, 200);

  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Pressione R para reiniciar", WIDTH / 2, HEIGHT / 2 + 200);
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
