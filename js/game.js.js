/*******************************************************
 * Configurações e variáveis principais
 *******************************************************/
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Imagens
const bgImg = new Image();
bgImg.src = "../images/background.png";

const titlePersonImg = new Image();
titlePersonImg.src = "../images/titlePerson.png";

const enemyImg = new Image();
enemyImg.src = "../images/camera.png";

const bulletImg = new Image();
bulletImg.src = "../images/bola.png";

const heroIdleImg = new Image();
heroIdleImg.src = "../images/hero_idle.png";

const heroKickImg = new Image();
heroKickImg.src = "../images/hero_kick.png";

// Estados do jogo: TÍTULO, JOGANDO, GAME_OVER
let gameState = "TITLE"; // "TITLE" | "PLAYING" | "GAME_OVER"

// Heroi
const hero = {
  x: WIDTH / 2 - 25,
  y: HEIGHT - 80,
  width: 50,
  height: 50,
  speed: 5,
  currentImage: heroIdleImg
};

// Tiros (bolas)
let bullets = [];

// Inimigos (câmeras)
let enemies = [];
const rows = 3;
const cols = 6;
const enemyWidth = 40;
const enemyHeight = 40;
const enemySpacing = 20;
const startX = 50;
const startY = 50;
let enemySpeedX = 1;
let moveDirection = 1;

// Controle de pontuação e câmeras destruídas
let score = 0;
let destroyedCameras = 0;
let level = 1;
let gameOver = false;

// Pontuação por linha de inimigos
const pointsPerRow = [40, 20, 10];

// Teclas pressionadas
let leftPressed = false;
let rightPressed = false;
let spacePressed = false;

// Listeners de teclado
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

// Inicializa inimigos
createEnemies();

/*******************************************************
 * Funções de criação e inicialização
 *******************************************************/
function createEnemies() {
  enemies = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      enemies.push({
        x: startX + col * (enemyWidth + enemySpacing),
        y: startY + row * (enemyHeight + enemySpacing),
        width: enemyWidth,
        height: enemyHeight,
        points: pointsPerRow[row],
        alive: true
      });
    }
  }
}

// Se quiser reiniciar o jogo em outro momento
function resetGame() {
  hero.x = WIDTH / 2 - 25;
  hero.y = HEIGHT - 80;
  hero.currentImage = heroIdleImg;
  bullets = [];
  score = 0;
  destroyedCameras = 0;
  level = 1;
  gameOver = false;
  moveDirection = 1;
  createEnemies();
}

/*******************************************************
 * Eventos de teclado
 *******************************************************/
function keyDownHandler(e) {
  switch (e.code) {
    case "ArrowLeft":
      leftPressed = true;
      break;
    case "ArrowRight":
      rightPressed = true;
      break;
    case "Space":
      spacePressed = true;
      if (gameState === "TITLE") {
        // Na tela de título, espaço inicia o jogo
        gameState = "PLAYING";
      } else if (gameState === "GAME_OVER") {
        // Na tela de game over, espaço volta ao título
        gameState = "TITLE";
      } else if (gameState === "PLAYING") {
        // No jogo, chutar
        kick();
      }
      break;
  }
}

function keyUpHandler(e) {
  switch (e.code) {
    case "ArrowLeft":
      leftPressed = false;
      break;
    case "ArrowRight":
      rightPressed = false;
      break;
    case "Space":
      spacePressed = false;
      break;
  }
}

/*******************************************************
 * Lógica do jogo
 *******************************************************/

// Chute do herói
function kick() {
  // Muda sprite para chutando
  hero.currentImage = heroKickImg;

  // Cria bola (tiro)
  bullets.push({
    x: hero.x + hero.width / 2 - 5,
    y: hero.y,
    width: 10,
    height: 20,
    speed: 5
  });

  // Retorna ao sprite idle após pequeno intervalo
  setTimeout(() => {
    hero.currentImage = heroIdleImg;
  }, 100);
}

function updateGame() {
  if (gameOver) return;

  // Movimentação do herói
  if (leftPressed && hero.x > 0) {
    hero.x -= hero.speed;
  }
  if (rightPressed && hero.x + hero.width < WIDTH) {
    hero.x += hero.speed;
  }

  // Movimentar os tiros
  bullets.forEach((bullet, index) => {
    bullet.y -= bullet.speed;
    // remove se sair da tela
    if (bullet.y + bullet.height < 0) {
      bullets.splice(index, 1);
    }
  });

  // Movimento horizontal das câmeras
  let moveX = enemySpeedX * moveDirection * level;
  enemies.forEach(enemy => {
    if (!enemy.alive) return;
    enemy.x += moveX;
  });

  // Verificar limites (se bater à direita ou esquerda, inverte e desce)
  let needToMoveDown = false;
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    if (!enemy.alive) continue;
    if (enemy.x + enemy.width >= WIDTH || enemy.x <= 0) {
      needToMoveDown = true;
      break;
    }
  }
  if (needToMoveDown) {
    moveDirection *= -1;
    enemies.forEach(enemy => {
      if (enemy.alive) {
        enemy.y += enemyHeight / 2;
      }
    });
  }

  // Colisão das bolas com as câmeras
  bullets.forEach((bullet, bIndex) => {
    enemies.forEach((enemy, eIndex) => {
      if (enemy.alive && isColliding(bullet, enemy)) {
        enemy.alive = false;
        bullets.splice(bIndex, 1);
        score += enemy.points;
        destroyedCameras++;
      }
    });
  });

  // Se todas câmeras destruídas, avançar nível
  if (enemies.every(enemy => !enemy.alive)) {
    level++;
    createEnemies();
  }

  // Se alguma câmera chegou ao herói, game over
  enemies.forEach(enemy => {
    if (enemy.alive && enemy.y + enemy.height >= hero.y) {
      gameOver = true;
    }
  });

  if (gameOver) {
    gameState = "GAME_OVER";
  }
}

// Função de colisão retangular
function isColliding(a, b) {
  return !(
    a.x + a.width < b.x ||
    a.x > b.x + b.width ||
    a.y + a.height < b.y ||
    a.y > b.y + b.height
  );
}

/*******************************************************
 * Desenho das telas
 *******************************************************/

// Tela de título
function drawTitleScreen() {
  ctx.drawImage(bgImg, 0, 0, WIDTH, HEIGHT);

  // Título em verde estilo pixel
  ctx.fillStyle = "lime";
  ctx.font = "bold 40px monospace";
  ctx.fillText("CÂMERA 3", WIDTH / 2 - 120, HEIGHT / 2 - 100);

  // Instrução
  ctx.font = "20px monospace";
  ctx.fillText("Pressione ESPAÇO para jogar", WIDTH / 2 - 180, HEIGHT / 2);

  // Imagem da pessoa
  ctx.drawImage(titlePersonImg, WIDTH / 2 - 50, HEIGHT / 2 + 40, 100, 120);
}

// Tela de jogo
function drawGame() {
  // Background
  ctx.drawImage(bgImg, 0, 0, WIDTH, HEIGHT);

  // Herói
  ctx.drawImage(hero.currentImage, hero.x, hero.y, hero.width, hero.height);

  // Tiros
  bullets.forEach(bullet => {
    ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);
  });

  // Inimigos
  enemies.forEach(enemy => {
    if (enemy.alive) {
      ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
    }
  });

  // Info
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText(`Pontuação: ${score}`, 20, 30);
  ctx.fillText(`Nível: ${level}`, 20, 60);
  ctx.fillText(`Câmeras destruídas: ${destroyedCameras}`, 20, 90);
}

// Tela de game over
function drawGameOver() {
  ctx.drawImage(bgImg, 0, 0, WIDTH, HEIGHT);

  // Mensagem de game over
  ctx.fillStyle = "red";
  ctx.font = "40px monospace";
  ctx.fillText("GAME OVER", WIDTH / 2 - 110, HEIGHT / 2 - 50);

  // Mensagem adicional
  ctx.font = "20px monospace";
  ctx.fillStyle = "yellow";
  ctx.fillText(
    `O ORÇAMENTO CHEGOU! VOCÊ QUEBROU ${destroyedCameras} CÂMERAS.`,
    WIDTH / 2 - 240,
    HEIGHT / 2
  );

  // Instrução
  ctx.fillStyle = "#fff";
  ctx.fillText(
    "Pressione ESPAÇO para voltar ao título",
    WIDTH / 2 - 190,
    HEIGHT / 2 + 40
  );
}

/*******************************************************
 * Loop principal
 *******************************************************/
function gameLoop() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  switch (gameState) {
    case "TITLE":
      drawTitleScreen();
      break;
    case "PLAYING":
      updateGame();
      drawGame();
      break;
    case "GAME_OVER":
      drawGameOver();
      break;
  }

  requestAnimationFrame(gameLoop);
}
gameLoop();
