// Elementos do jogo
const hero = document.getElementById("hero");
const bullet = document.getElementById("bullet");
const scoreboard = document.getElementById("score");
let score = 0;

// Variáveis do jogo
let enemies = [];
let bulletActive = false;
let gameInterval;
let enemySpeed = 2;
const gameArea = document.getElementById("gameArea");

// Controle do herói
document.addEventListener("keydown", handleKeyboard);
document.getElementById("leftButton").addEventListener("click", () => moveHero(-20));
document.getElementById("rightButton").addEventListener("click", () => moveHero(20));
document.getElementById("shootButton").addEventListener("click", shoot);

function handleKeyboard(e) {
  if (e.key === "ArrowLeft") moveHero(-20);
  if (e.key === "ArrowRight") moveHero(20);
  if (e.key === " ") shoot();
}

// Função para mover o herói
function moveHero(offset) {
  const currentLeft = parseInt(window.getComputedStyle(hero).left, 10);
  const newLeft = Math.max(0, Math.min(gameArea.offsetWidth - hero.offsetWidth, currentLeft + offset));
  hero.style.left = `${newLeft}px`;
}

// Função para disparar
function shoot() {
  if (bulletActive) return;
  bulletActive = true;
  bullet.style.display = "block";
  bullet.style.left = `${hero.offsetLeft + hero.offsetWidth / 2 - bullet.offsetWidth / 2}px`;
  bullet.style.top = `${hero.offsetTop - bullet.offsetHeight}px`;

  const interval = setInterval(() => {
    const bulletTop = parseInt(bullet.style.top, 10);
    if (bulletTop <= 0) {
      clearInterval(interval);
      bullet.style.display = "none";
      bulletActive = false;
    } else {
      bullet.style.top = `${bulletTop - 10}px`;
      checkCollision();
    }
  }, 30);
}

// Função para criar inimigos
function createEnemy() {
  const enemy = document.createElement("div");
  enemy.classList.add("enemy");
  enemy.style.position = "absolute";
  enemy.style.width = "60px";
  enemy.style.height = "60px";
  enemy.style.background = "url('../images/camera.png') no-repeat center";
  enemy.style.backgroundSize = "contain";
  enemy.style.left = `${Math.random() * (gameArea.offsetWidth - 60)}px`;
  enemy.style.top = "-60px";
  gameArea.appendChild(enemy);
  enemies.push(enemy);
}

// Atualiza inimigos
function updateEnemies() {
  enemies.forEach((enemy, index) => {
    const currentTop = parseInt(enemy.style.top, 10);
    if (currentTop > gameArea.offsetHeight) {
      endGame();
    } else {
      enemy.style.top = `${currentTop + enemySpeed}px`;
    }
  });
}

// Verifica colisão do tiro
function checkCollision() {
  enemies.forEach((enemy, index) => {
    const bulletRect = bullet.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();

    if (
      bulletRect.top <= enemyRect.bottom &&
      bulletRect.bottom >= enemyRect.top &&
      bulletRect.left <= enemyRect.right &&
      bulletRect.right >= enemyRect.left
    ) {
      score++;
      scoreboard.textContent = score;
      enemy.remove();
      enemies.splice(index, 1);
      bullet.style.display = "none";
      bulletActive = false;
    }
  });
}

// Fim do jogo
function endGame() {
  alert(`Game Over! Você quebrou ${score} câmera(s)!`);
  window.location.reload();
}

// Inicia o jogo
function startGame() {
  gameInterval = setInterval(() => {
    if (Math.random() < 0.02) createEnemy();
    updateEnemies();
  }, 30);
}

startGame();
