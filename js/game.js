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
  x: WIDTH / 2 - 25,
  y: HEIGHT - 80,
  width: 50,
  height: 50,
  currentImage: heroIdleImg,
};

// Configuração dos inimigos
let enemies = [];
const enemyWidth = 40;
const enemyHeight = 40;
const enemySpacing = 20;

// Tiros (bolas)
let bullets = [];

// Eventos de teclado
document.addEventListener("keydown", handleKeyDown);

function handleKeyDown(e) {
  if (gameState === "TITLE" && e.code === "Space") {
    gameState = "PLAYING"; // Inicia o jogo ao pressionar espaço na tela de título
  } else if (gameState === "PLAYING") {
    if (e.code === "ArrowLeft") hero.x -= 10;
    if (e.code === "ArrowRight") hero.x += 10;
    if (e.code === "Space") shoot();
  }
}

// Função para atirar
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
  // Atualiza os tiros
  bullets.forEach((bullet) => {
    bullet.y -= bullet.speed;
  });

  // Remove tiros fora da tela
  bullets = bullets.filter((bullet) => bullet.y > 0);
}

// Renderização da tela de título
function drawTitleScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "green";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  ctx.fillText("CÂMERA 3", WIDTH / 2, HEIGHT / 2 - 50);

  ctx.drawImage(titleImg, WIDTH / 2 - 100, HEIGHT / 2, 200, 200);

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
    ctx.fillStyle = "red";
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
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
