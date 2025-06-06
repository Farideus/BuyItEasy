const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gravity = 0.6;
let friction = 0.9;
let keys = {};

let player = {
  x: 50,
  y: 250,
  width: 30,
  height: 30,
  color: "red",
  dx: 0,
  dy: 0,
  jumpPower: -12,
  onGround: false
};

let platforms = [
  { x: 0, y: 300, width: 480, height: 20 },
  { x: 120, y: 240, width: 100, height: 10 },
  { x: 300, y: 180, width: 100, height: 10 }
];

let enemies = [
  { x: 200, y: 270, width: 30, height: 30, dx: 1 }
];

function drawRect(obj, color) {
  ctx.fillStyle = color;
  ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function drawPlayer() {
  ctx.beginPath();
  ctx.arc(player.x + player.width/2, player.y + player.height/2, player.width/2, 0, Math.PI * 2);
  ctx.fillStyle = player.color;
  ctx.fill();
  ctx.closePath();

  // Eyes
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(player.x + 10, player.y + 10, 5, 0, Math.PI * 2);
  ctx.arc(player.x + 20, player.y + 10, 5, 0, Math.PI * 2);
  ctx.fill();

  // Smile
  ctx.beginPath();
  ctx.arc(player.x + 15, player.y + 20, 8, 0, Math.PI);
  ctx.stroke();
}

function update() {
  // Horizontal movement
  if (keys["ArrowRight"]) player.dx = 3;
  else if (keys["ArrowLeft"]) player.dx = -3;
  else player.dx *= friction;

  // Apply gravity
  player.dy += gravity;

  // Update position
  player.x += player.dx;
  player.y += player.dy;
  player.onGround = false;

  // Collision with platforms
  platforms.forEach(p => {
    if (player.x < p.x + p.width &&
        player.x + player.width > p.x &&
        player.y + player.height < p.y + 10 &&
        player.y + player.height + player.dy >= p.y) {
      player.y = p.y - player.height;
      player.dy = 0;
      player.onGround = true;
    }
  });

  // Enemy movement and collision
  enemies.forEach(e => {
    e.x += e.dx;
    if (e.x < 0 || e.x + e.width > canvas.width) e.dx *= -1;

    if (player.x < e.x + e.width &&
        player.x + player.width > e.x &&
        player.y < e.y + e.height &&
        player.y + player.height > e.y) {
      alert("Game Over!");
      location.reload();
    }
  });

  // Ground
  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
    player.dy = 0;
    player.onGround = true;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  platforms.forEach(p => drawRect(p, "#444"));
  enemies.forEach(e => drawRect(e, "#666"));
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", e => {
  keys[e.key] = true;
  if (e.key === "ArrowUp" && player.onGround) {
    player.dy = player.jumpPower;
    player.onGround = false;
  }
});

document.addEventListener("keyup", e => {
  keys[e.key] = false;
});

gameLoop();

