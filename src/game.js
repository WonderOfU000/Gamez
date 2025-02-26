import Player from "./player.js";
import Enemy from "./enemy.js";
import Bullet from "./bullet.js";
import ObjectPool from "./objectPool.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const menu = document.getElementById("menu");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
canvas.width = 800;
canvas.height = 600;

let gameRunning = false;
let score = 0;
let player;
let enemies = [];
let bullets = [];
let lastEnemySpawnTime = 0;
let startTime = 0; // Track the game start time
let difficulty = "medium";
let soundEnabled = true;
let controls = "arrows";

const bulletPool = new ObjectPool(
  (x, y, speed, gameHeight) => new Bullet(x, y, speed, gameHeight),
  50
);

const enemyPool = new ObjectPool(
  (x, y, speed, gameWidth, gameHeight) =>
    new Enemy(x, y, speed, gameWidth, gameHeight),
  20
);

document.getElementById("difficulty").addEventListener("change", (event) => {
  difficulty = event.target.value;
  console.log("Difficulty set to:", difficulty);
});

document.getElementById("sound").addEventListener("change", (event) => {
  soundEnabled = event.target.checked;
  console.log("Sound enabled:", soundEnabled);
});

document.getElementById("controls").addEventListener("change", (event) => {
  controls = event.target.value;
  console.log("Controls set to:", controls);
});

export function startGame() {
  menu.classList.add("hidden");
  canvas.style.display = "block";
  gameOverScreen.classList.add("hidden");
  gameRunning = true;
  score = 0;
  startTime = Date.now(); // Set the game start time
  player = new Player(375, 500, canvas.width, canvas.height, difficulty);
  enemies = [];
  bullets = [];
  gameLoop();
}

export function gameOver() {
  gameRunning = false;
  canvas.style.display = "none";
  gameOverScreen.classList.remove("hidden");
  finalScore.innerText = score;
}

function gameLoop() {
  if (!gameRunning) return;
  const currentTime = Date.now();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  player.draw(ctx);

  bullets.forEach((bullet, bulletIndex) => {
    bullet.update();
    bullet.draw(ctx);
    if (bullet.isOffScreen()) {
      bulletPool.release(bullets.splice(bulletIndex, 1)[0]);
    }
  });

  // Adjust the initial enemy spawn delay to 3 seconds
  if (
    currentTime - startTime > 3000 && // 3-second initial delay
    currentTime - lastEnemySpawnTime >
      1000 / (difficulty === "hard" ? 1.5 : difficulty === "easy" ? 0.5 : 1)
  ) {
    const enemy = enemyPool.acquire(
      Math.random() * (canvas.width - 40),
      -40,
      difficulty === "hard" ? 4 : difficulty === "easy" ? 1 : 2,
      canvas.width,
      canvas.height
    );
    enemies.push(enemy);
    lastEnemySpawnTime = currentTime;
  }

  enemies = enemies.filter((enemy) => {
    enemy.update();
    enemy.draw(ctx);

    let hit = false;

    bullets.forEach((bullet, bulletIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.height + bullet.y > enemy.y
      ) {
        enemyPool.release(enemy);
        bulletPool.release(bullets.splice(bulletIndex, 1)[0]);
        score += 10;

        const newEnemy = enemyPool.acquire(
          Math.random() * (canvas.width - 40),
          -40,
          difficulty === "hard" ? 4 : difficulty === "easy" ? 1 : 2,
          canvas.width,
          canvas.height
        );
        enemies.push(newEnemy);

        hit = true;
      }
    });

    if (enemy.y > canvas.height) {
      enemyPool.release(enemy);
      score -= 5;

      const newEnemy = enemyPool.acquire(
        Math.random() * (canvas.width - 40),
        -40,
        difficulty === "hard" ? 4 : difficulty === "easy" ? 1 : 2,
        canvas.width,
        canvas.height
      );
      enemies.push(newEnemy);

      hit = true;
    }

    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.height + player.y > enemy.y
    ) {
      gameOver();
    }

    return !hit;
  });

  ctx.fillStyle = "white";
  ctx.fillText(`Score: ${score}`, 20, 30);
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (event) => {
  if (
    (controls === "arrows" &&
      (event.key === "ArrowLeft" || event.key === "a")) ||
    (controls === "wasd" && event.key === "a")
  )
    player.moving.left = true;
  if (
    (controls === "arrows" &&
      (event.key === "ArrowRight" || event.key === "d")) ||
    (controls === "wasd" && event.key === "d")
  )
    player.moving.right = true;
  if (
    (controls === "arrows" && (event.key === "ArrowUp" || event.key === "w")) ||
    (controls === "wasd" && event.key === "w")
  )
    player.moving.up = true;
  if (
    (controls === "arrows" &&
      (event.key === "ArrowDown" || event.key === "s")) ||
    (controls === "wasd" && event.key === "s")
  )
    player.moving.down = true;
  if (event.key === " ") {
    const bullet = bulletPool.acquire(
      player.x + player.width / 2 - 2.5,
      player.y,
      5,
      canvas.height
    );
    bullets.push(bullet);
  }
});

document.addEventListener("keyup", (event) => {
  if (
    (controls === "arrows" &&
      (event.key === "ArrowLeft" || event.key === "a")) ||
    (controls === "wasd" && event.key === "a")
  )
    player.moving.left = false;
  if (
    (controls === "arrows" &&
      (event.key === "ArrowRight" || event.key === "d")) ||
    (controls === "wasd" && event.key === "d")
  )
    player.moving.right = false;
  if (
    (controls === "arrows" && (event.key === "ArrowUp" || event.key === "w")) ||
    (controls === "wasd" && event.key === "w")
  )
    player.moving.up = false;
  if (
    (controls === "arrows" &&
      (event.key === "ArrowDown" || event.key === "s")) ||
    (controls === "wasd" && event.key === "s")
  )
    player.moving.down = false;
});
