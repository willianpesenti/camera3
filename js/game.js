// Configuração do canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Imagens
const bgImg = new Image();
bgImg.src = "images/background.png";

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
const enemyWidth = 90;
const enemyHeight = 90;

// Configuração dos tiros (bolas)
let bullets = [];
const bulletWidth = 30;
const bulletHeight = 30;

// Contagem de pontos
let score = 0;

// Eventos de teclado
document.addEventListener("keydown", handleKeyDown);

// Eventos de toque para os botões
document.getElementById("leftButton").addEventListener("click", () => {
  hero.x = Math.max(hero.x - 20, 0);
});

document.getElementById("rightButton").addEventListener("click", () => {
  hero.x = Math.min(hero.x + 20, WIDTH - hero.width);
});

document.getElementById("shootButton").addEventListener("click", () => {
  shoot();
});

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

// Atualização do jogo
function updateGame() {
  bullets.forEach((bullet) => (bullet.y -= bullet.speed));
  bullets = bullets.filter((bullet) => bullet.y > 0);
}

// Renderização da tela de título
function drawTitleScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "green";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  ctx.fillText("CÂMERA 3", WIDTH / 2, HEIGHT / 2 - 100);

  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Pressione ESPAÇO para começar", WIDTH / 2, HEIGHT / 2 + 50);
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

  // Mostra a pontuação
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Pontuação: ${score}`, 10, 30);
}

// Loop principal
function gameLoop() {
  if (gameState === "TITLE") {
    drawTitleScreen();
  } else if (gameState === "PLAYING") {
    updateGame();
    drawGame();
  }
  requestAnimationFrame(gameLoop);
}

// Inicia o loop do jogo
gameLoop();
