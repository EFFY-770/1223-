let spriteSheets = {
  player1: { idle: null, walk: null, jump: null },
  player2: { idle: null, walk: null, jump: null },
  explosion: null,
  bullet: null,
  background: null
};

let player1 = {
  x: 100,
  y: 200,
  speedX: 2,
  speedY: 0,
  gravity: 0.3,
  jumpForce: -10,
  isJumping: false,
  groundY: 300,
  currentFrame: 0,
  currentAction: 'idle',
  direction: 1,
  bullets: [],
  health: 100
};

let player2 = {
  x: 800,
  y: 200,
  speedX: 2,
  speedY: 0,
  gravity: 0.3,
  jumpForce: -10,
  isJumping: false,
  groundY: 300,
  currentFrame: 0,
  currentAction: 'idle',
  direction: -1,
  bullets: [],
  health: 100
};

let sprites = {
  player1: {
    idle: { img: null, width: 99, height: 103, frames: 3 },
    walk: { img: null, width: 87, height: 107, frames: 3 },
    jump: { img: null, width: 117, height: 107, frames: 3 }
  },
  player2: {
    idle: { img: null, width: 68, height: 120, frames: 3 },
    walk: { img: null, width: 78, height: 83, frames: 3 },
    jump: { img: null, width: 115, height: 86, frames: 3 }
  },
  explosion: { img: null, width: 133, height: 100, frames: 4 },
  bullet: { img: null, width: 70, height: 46, frames: 8 },
  background: { img: null }
};

function preload() {
  spriteSheets.player1.idle = loadImage('11.png');
  spriteSheets.player1.walk = loadImage('22.png');
  spriteSheets.player1.jump = loadImage('330.png');
  spriteSheets.player2.idle = loadImage('111.png');
  spriteSheets.player2.walk = loadImage('222.png');
  spriteSheets.player2.jump = loadImage('333.png');
  spriteSheets.explosion = loadImage('66.png');
  spriteSheets.bullet = loadImage('77.png');
  spriteSheets.background = loadImage('99.png'); // 加载背景图片
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  sprites.player1.idle.img = spriteSheets.player1.idle;
  sprites.player1.walk.img = spriteSheets.player1.walk;
  sprites.player1.jump.img = spriteSheets.player1.jump;
  sprites.player2.idle.img = spriteSheets.player2.idle;
  sprites.player2.walk.img = spriteSheets.player2.walk;
  sprites.player2.jump.img = spriteSheets.player2.jump;
  sprites.explosion.img = spriteSheets.explosion;
  sprites.bullet.img = spriteSheets.bullet;
  sprites.background.img = spriteSheets.background;
}

function draw() {
  drawBackground();
  drawBackgroundText(); // 绘制动态背景文字
  updatePhysics(player1);
  updatePhysics(player2);
  drawBullets(player1);
  drawBullets(player2);
  checkKeys();
  checkCollisions();
  drawCharacter(player1, sprites.player1);
  drawCharacter(player2, sprites.player2);
  drawHealth();
}

function drawBackground() {
  if (sprites.background.img) {
    image(sprites.background.img, 0, 0, width, height);
  } else {
    noStroke();
    for (let i = 0; i < height; i += 10) {
      let colorValue = map(i, 0, height, 135, 255);
      fill(colorValue, colorValue, 255);
      rect(0, i, width, 10);
    }
    fill(34, 139, 34);
    rect(0, height - 100, width, 100);
  }
}

function drawBackgroundText() {
  textAlign(CENTER, CENTER);
  textSize(64);
  fill(255, 255, 255, 50); // 半透明白色
  for (let y = 50; y < height; y += 100) {
    for (let x = 100; x < width; x += 200) {
      text("淡江教科", x, y);
    }
  }
}

function drawCharacter(player, playerSprites) {
  let currentSprite = playerSprites[player.currentAction];
  if (frameCount % 5 === 0) {
    player.currentFrame = (player.currentFrame + 1) % currentSprite.frames;
  }
  let sx = player.currentFrame * currentSprite.width;

  push();
  translate(player.x + (player.direction === -1 ? currentSprite.width : 0), player.y);
  scale(player.direction, 1);
  image(currentSprite.img, 0, 0, currentSprite.width, currentSprite.height, sx, 0, currentSprite.width, currentSprite.height);
  pop();
}

function drawHealth() {
  fill(255, 0, 0);
  rect(10, 10, player1.health, 20);
  push();
  translate(width - 10, 10);
  rect(-player2.health, 0, player2.health, 20);
  pop();
}

function checkCollisions() {
  for (let i = player1.bullets.length - 1; i >= 0; i--) {
    let bullet = player1.bullets[i];
    if (checkBulletHit(bullet, player2)) {
      bullet.isExploding = true;
      bullet.explosionFrame = 0;
      player2.health -= 10;
    }
  }
  for (let i = player2.bullets.length - 1; i >= 0; i--) {
    let bullet = player2.bullets[i];
    if (checkBulletHit(bullet, player1)) {
      bullet.isExploding = true;
      bullet.explosionFrame = 0;
      player1.health -= 10;
    }
  }
}

function checkBulletHit(bullet, player) {
  return bullet.x > player.x && bullet.x < player.x + sprites.player1.idle.width && bullet.y > player.y && bullet.y < player.y + sprites.player1.idle.height;
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) shoot(player1);
  if (key === 's' || key === 'S') shoot(player2);
}

function checkKeys() {
  if (keyIsDown(65)) {
    player1.x -= player1.speedX;
    player1.direction = -1;
    player1.currentAction = 'walk';
  } else if (keyIsDown(68)) {
    player1.x += player1.speedX;
    player1.direction = 1;
    player1.currentAction = 'walk';
  } else if (!player1.isJumping) {
    player1.currentAction = 'idle';
  }
  if (keyIsDown(87) && !player1.isJumping) {
    player1.speedY = player1.jumpForce;
    player1.isJumping = true;
    player1.currentAction = 'jump';
  }

  if (keyIsDown(LEFT_ARROW)) {
    player2.x -= player2.speedX;
    player2.direction = -1;
    player2.currentAction = 'walk';
  } else if (keyIsDown(RIGHT_ARROW)) {
    player2.x += player2.speedX;
    player2.direction = 1;
    player2.currentAction = 'walk';
  } else if (!player2.isJumping) {
    player2.currentAction = 'idle';
  }
  if (keyIsDown(UP_ARROW) && !player2.isJumping) {
    player2.speedY = player2.jumpForce;
    player2.isJumping = true;
    player2.currentAction = 'jump';
  }
}

function shoot(player) {
  if (player.bullets.length < 3) {
    let playerWidth = sprites[player === player1 ? 'player1' : 'player2'].idle.width;
    let bullet = {
      x: player.x + (player.direction === 1 ? playerWidth : 0),
      y: player.y + playerWidth / 2,
      speed: 10 * player.direction,
      isExploding: false,
      currentFrame: 0,
      explosionFrame: 0
    };
    player.bullets.push(bullet);
  }
}

function updatePhysics(player) {
  if (player.y < player.groundY) {
    player.speedY += player.gravity;
    player.isJumping = true;
  }
  player.y += player.speedY;
  if (player.y >= player.groundY) {
    player.y = player.groundY;
    player.speedY = 0;
    player.isJumping = false;
  }
}

function drawBullets(player) {
  for (let i = player.bullets.length - 1; i >= 0; i--) {
    let bullet = player.bullets[i];
    if (bullet.isExploding) {
      if (frameCount % 5 === 0) bullet.explosionFrame++;
      if (bullet.explosionFrame >= 4) player.bullets.splice(i, 1);
    } else {
      bullet.x += bullet.speed;
      if (bullet.x < 0 || bullet.x > width) player.bullets.splice(i, 1);
    }

    if (bullet.isExploding) {
      let sx = bullet.explosionFrame * sprites.explosion.width;
      image(sprites.explosion.img, bullet.x, bullet.y, 50, 50, sx, 0, sprites.explosion.width, sprites.explosion.height);
    } else {
      image(sprites.bullet.img, bullet.x, bullet.y, 30, 20);
    }
  }
}
