const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gravity = 0.5;
const jumpPower = -10;
const friction = 0.8;

let keys = {};

let player = {
  x: 50,
  y: 300,
  width: 30,
  height: 30,
  dx: 0,
  dy: 0,
  onGround: false,
  color: "red"
};

let platforms = [
  { x: 0, y: 370, width: 800, height: 30 },
  { x: 200, y: 300, width: 100, height: 10 },
  { x: 350, y: 250, width: 100, height: 10 },
  { x: 500, y: 200, width: 100, height: 10 }
];

let enemies = [
  { x: 600, y: 340, width: 30, height: 30, dx: 1.5 }
];

function drawPlayer() {
  ctx.beginPath();
  ctx.arc(player.x + player.width / 2, player.y + player.height / 2, player.width / 2, 0, Math.PI * 2);
  ctx.fillStyle = player.color;
  ctx.fill();
  ctx.closePath();

  // Глаза
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(player.x + 10, player.y + 10, 3, 0, Math.PI * 2);
  ctx.arc(player.x + 20, player.y + 10, 3, 0, Math.PI * 2);
  ctx.fill();

  // Улыбка
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.arc(player.x + 15, player.y + 20, 6, 0, Math.PI);
  ctx.stroke();
}

function drawRect(obj, color) {
  ctx.fillStyle = color;
  ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function updatePlayer() {
  // Управление
  if (keys["ArrowLeft"]) player.dx = -3;
  else if (keys["ArrowRight"]) player.dx = 3;
  else player.dx *= friction;

  if (keys["ArrowUp"] && player.onGround) {
    player.dy = jumpPower;
    player.onGround = false;
  }

  // Гравитация
  player.dy += gravity;

  // Движение
  player.x += player.dx;
  player.y += player.dy;

  // Столкновения с платформами
  player.onGround = false;
  platforms.forEach(p => {
    if (
      player.x + player.width > p.x &&
      player.x < p.x + p.width &&
      player.y + player.height <= p.y &&
      player.y + player.height + player.dy >= p.y
    ) {
      player.dy = 0;
      player.y = p.y - player.height;
      player.onGround = true;
    }
  });

  // Границы экрана
  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
    player.dy = 0;
    player.onGround = true;
  }

  // Столкновение с врагами
  enemies.forEach(e => {
    e.x += e.dx;
    if (e.x <= 0 || e.x + e.width >= canvas.width) e.dx *= -1;

    if (
      player.x < e.x + e.width &&
      player.x + player.width > e.x &&
      player.y < e.y + e.height &&
      player.y + player.height > e.y
    ) {
      alert("Игра окончена!");
      window.location.reload();
    }
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
  draw();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

gameLoop();
