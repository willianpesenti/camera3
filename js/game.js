// Configuração do canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Configuração do vídeo
const introVideo = document.getElementById("introVideo");

// Estados do jogo
let gameState = "TITLE"; // Estados possíveis: TITLE, VIDEO, PLAYING, GAME_OVER

// Configuração do herói
const hero = {
  x: canvas.width / 2 - 75,
  y: canvas.height - 150,
  width: 150,
  height: 150,
};

// Configuração do jogo
let enemies = [];
let bullets = [];
let score = 0;

// Eventos de teclado
document.addEventListener("keydown", handleKeyDown);

function handleKeyDown(e) {
  if (gameState === "TITLE" && e.code === "Space") {
    startVideo(); // Inicia o vídeo antes da partida
  } else if (gameState === "PLAYING") {
    if (e.code === "ArrowLeft") hero.x = Math.max(hero.x - 20, 0);
    if (e.code === "ArrowRight") hero.x = Math.min(hero.x + 20, canvas.width - hero.width);
    if (e.code === "Space") shoot();
  } else if (gameState === "GAME_OVER" && e.code === "KeyR") {
    restartGame();
  }
}

// Inicia o vídeo antes da partida
function startVideo() {
  gameState = "VIDEO";
  canvas.style.display = "none"; // Oculta o canvas durante o vídeo
  introVideo.style.display = "block"; // Mostra o vídeo
  introVideo.play();

  introVideo.onended = () => {
    // Após o vídeo terminar, inicia o jogo
    introVideo.style.display = "none";
    canvas.style.display = "block";
    gameState = "PLAYING";
    createEnemy();
  };
}

// Função para disparar
function shoot() {
  bullets.push({
    x: hero.x + hero.width / 2 - 15,
    y: hero.y,
    width: 30,
    height: 30,
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
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "green";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  ctx.fillText("CÂMERA 3", canvas.width / 2, canvas.height / 2 - 100);

  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Pressione ESPAÇO para começar", canvas.width / 2, canvas.height / 2 + 50);
}

// Renderização do jogo
function drawGame() {
  // Implementação do jogo
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
