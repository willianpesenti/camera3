// Configuração do canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Detecta se o dispositivo é móvel
const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent);

// Mostra os controles na tela apenas em dispositivos móveis
if (isMobile) {
  document.getElementById("controls").style.display = "flex";
}

// Estados do jogo
let gameState = "TITLE"; // Estados possíveis: TITLE, PLAYING, GAME_OVER

// Configuração do herói
const hero = {
  x: canvas.width / 2 - 75,
  y: canvas.height - 150,
  width: 150,
  height: 150,
  currentImage: null,
};

// Eventos de teclado para desktop
document.addEventListener("keydown", (e) => {
  if (gameState === "TITLE" && e.code === "Space") {
    gameState = "PLAYING";
  } else if (gameState === "PLAYING") {
    if (e.code === "ArrowLeft") hero.x = Math.max(hero.x - 20, 0);
    if (e.code === "ArrowRight") hero.x = Math.min(hero.x + 20, canvas.width - hero.width);
    if (e.code === "Space") shoot();
  }
});

// Eventos de toque para os botões de controle (apenas dispositivos móveis)
if (isMobile) {
  document.getElementById("leftButton").addEventListener("click", () => {
    hero.x = Math.max(hero.x - 20, 0);
  });

  document.getElementById("rightButton").addEventListener("click", () => {
    hero.x = Math.min(hero.x + 20, canvas.width - hero.width);
  });

  document.getElementById("shootButton").addEventListener("click", shoot);
}

// Função para disparar
function shoot() {
  console.log("Tiro disparado!");
}

// Loop principal
function gameLoop() {
  // Implementação do jogo
  requestAnimationFrame(gameLoop);
}

// Inicia o loop do jogo
gameLoop();
