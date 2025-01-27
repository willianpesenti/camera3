// Configuração do Canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const WIDTH = 800;
const HEIGHT = 600;
canvas.width = WIDTH;
canvas.height = HEIGHT;

// Variáveis do Jogo
let gameState = "TITLE"; // Estados possíveis: TITLE, PLAYING, GAME_OVER
let hero = { x: WIDTH / 2 - 50, y: HEIGHT - 120, width: 100, height: 100 };
let bullets = [];
let enemies = [];
let score = 0;

// Função para redimensionar o canvas
function resizeCanvas() {
  const scale = Math.min(window.innerWidth / WIDTH, window.innerHeight / HEIGHT);
  canvas.style.width = `${WIDTH * scale}px`;
  canvas.style.height = `${HEIGHT * scale}px`;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Controles por teclado
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") moveHero(-20);
  if (e.key === "ArrowRight") moveHero(20);
  if (e.key === " ") handleShootOrRestart();
});

// Controles por toque
document.getElementById("leftButton").addEventListener("click", () => moveHero(-20));
document.getElementById("rightButton").addEventListener("click", () => moveHero(20));
document.getElementById("shootButton").addEventListener("click", handleShootOrRestart);

// Movimentação do herói
function moveHero(offset) {
  hero.x = Math.max(0, Math.min(WIDTH - hero.width, hero.x + offset));
}

// Disparo ou reinício do jogo
function handleShootOrRestart() {
  if (gameState === "PLAYING") {
    shoot();
  } else if (gameState === "GAME_OVER") {
    restartGame();
  }
}

// Disparo
function shoot() {
  bullets.push({ x: hero.x + hero.width / 2 - 5, y: hero.y, width: 10, height: 20 });
}

// Criação de inimigos
function createEnemy() {
  if (gameState !== "PLAYING") return;
  const x = Math.random() * (WIDTH - 60);
  enemies.push({ x, y: -60, width: 60, height: 60, speed: 2 });
  setTimeout(createEnemy, 1000); // Cria um novo inimigo a cada 1 segundo
}

// Atualização do jogo
function updateGame() {
  bullets.forEach((bullet) => {
    bullet.y -= 10;
  });
  bullets = bullets.filter((bullet) => bullet.y > 0);

  enemies.forEach((enemy) => {
    enemy.y += enemy.speed;
    if (enemy.y > HEIGHT) gameState = "GAME_OVER";
  });

  enemies = enemies.filter((enemy) => {
    const hit = bullets.some(
      (bullet) =>
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
    );
    if (hit) score++;
    return !hit;
  });
}

// Renderização
function render() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Fundo
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Herói
  ctx.fillStyle = "blue";
  ctx.fillRect(hero.x, hero.y, hero.width, hero.height);

  // Tiros
  ctx.fillStyle = "red";
  bullets.forEach((bullet) => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });

  // Inimigos
  ctx.fillStyle = "green";
  enemies.forEach((enemy) => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });

  // Pontuação
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`QUEBROU: ${score} câmeras`, 10, 30);
}

// Tela de Game Over
function drawGameOverScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "red";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`Fim de jogo! Pontuação: ${score}`, WIDTH / 2, HEIGHT / 2 - 50);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Pressione 'Chutar' para reiniciar", WIDTH / 2, HEIGHT / 2 + 50);
}

// Reinicia o jogo
function restartGame() {
  gameState = "TITLE";
  score = 0;
  bullets = [];
  enemies = [];
}

// Loop do Jogo
function gameLoop() {
  if (gameState === "PLAYING") {
    updateGame();
    render();
  } else if (gameState === "TITLE") {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Pressione ESPAÇO ou 'Chutar' para começar", WIDTH / 2, HEIGHT / 2);
  } else if (gameState === "GAME_OVER") {
    drawGameOverScreen();
  }
  requestAnimationFrame(gameLoop);
}

// Início do Jogo
document.addEventListener("keydown", (e) => {
  if (e.key === " " && gameState === "TITLE") {
    gameState = "PLAYING";
    createEnemy();
  }
});
gameLoop();
