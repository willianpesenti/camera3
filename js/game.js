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

// Controle de carregamento de imagens
let imagesLoaded = 0;
const totalImages = 6; // Quantidade de imagens a serem carregadas

function onImageLoad() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    // Todas as imagens foram carregadas, inicia o jogo
    gameLoop();
  }
}

// Adiciona eventos de carregamento às imagens
[bgImg, titleImg, heroIdleImg, heroKickImg, enemyImg, bulletImg].forEach((img) => {
  img.onload = onImageLoad;
});

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

// Função para renderizar a tela de título
function drawTitleScreen() {
  // Desenha o fundo (mesmo do jogo)
  ctx.drawImage(bgImg, 0, 0, WIDTH, HEIGHT);

  // Desenha o título
  ctx.fillStyle = "green";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  ctx.fillText("CÂMERA 3", WIDTH / 2, HEIGHT / 2 - 100);

  // Desenha a imagem de título
  ctx.drawImage(titleImg, WIDTH / 2 - 100, HEIGHT / 2 - 50, 200, 200);

  // Instruções para iniciar
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Pressione ESPAÇO para começar", WIDTH / 2, HEIGHT / 2 + 150);
}

// Loop principal do jogo
function gameLoop() {
  if (gameState === "TITLE") {
    drawTitleScreen();
  } else if (gameState === "PLAYING") {
    // Renderização e lógica do jogo (já implementada antes)
  }
  requestAnimationFrame(gameLoop);
}
