const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gravity = 0.5;
const jumpForce = -10;
const speed = 3;

let keys = {};

let player = {
  x: 50,
  y: 350,
  radius: 20,
  dx: 0,
  dy: 0,
  onGround: false,
  color: "red"
};

let platforms = [
  { x: 0, y: 430, width: 800, height: 20 },
  { x: 150, y: 350, width: 120, height: 10 },
  { x: 320, y: 280, width: 120, height: 10 },
  { x: 500, y: 220, width: 120, height: 10 }
];

let enemies = [
  { x: 600, y: 400, width: 30, height: 30, dx: 1.5 }
];

function drawPlayer() {
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = player.color;
  ctx.fill();
  ctx.closePath();

  // Eyes
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(player.x - 7, player.y - 7, 4, 0, Math.PI * 2);
  ctx.arc(player.x + 7, player.y - 7, 4, 0, Math.PI * 2);
  ctx.fill();

  // Smile
  ctx.beginPath();
  ctx.arc(player.x, player.y + 5, 8, 0, Math.PI);
  ctx.stroke();
}

function drawRect(obj, color) {
  ctx.fillStyle = color;
  ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function updatePlayer() {
  // Движение
  if (keys["ArrowLeft"]) player.dx = -speed;
  else if (keys["ArrowRight"]) player.dx = speed;
  else player.dx = 0;

  if (keys["ArrowUp"] && player.onGround) {
    player.dy = jumpForce;
    player.onGround = false;
  }

  player.dy += gravity;

  player.x += player.dx;
  player.y += player.dy;

  player.onGround = false;

  platforms.forEach(p => {
    if (
      player.x + player.radius > p.x &&
      player.x - player.radius < p.x + p.width &&
      player.y + player.radius < p.y + 10 &&
      player.y + player.radius + player.dy >= p.y
    ) {
      player.y = p.y - player.radius;
      player.dy = 0;
      player.onGround = true;
    }
  });

  if (player.y + player.radius > canvas.height) {
    player.y = canvas.height - player.radius;
    player.dy = 0;
    player.onGround = true;
  }

  // Столкновение с врагами
  enemies.forEach(e => {
    if (
      player.x + player.radius > e.x &&
      player.x - player.radius < e.x + e.width &&
      player.y + player.radius > e.y &&
      player.y - player.radius < e.y + e.height
    ) {
      alert("Game Over!");
      location.reload();
    }
  });
}

function updateEnemies() {
  enemies.forEach(e => {
    e.x += e.dx;
    if (e.x <= 0 || e.x + e.width >= canvas.width) e.dx *= -1;
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  platforms.forEach(p => drawRect(p, "#444"));
  enemies.forEach(e => drawRect(e, "#666"));
}

function gameLoop() {
  updatePlayer();
  updateEnemies();
  draw();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

gameLoop();
