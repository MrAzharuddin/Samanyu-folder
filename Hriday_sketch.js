var mario, mario_running, mario_collided;
var bg, bgImage;
var brickGroup, brickImage;
var coinScore = 0;

function preload() {
  mario_running = loadAnimation(
    "images/mar1.png",
    "images/mar2.png",
    "images/mar3.png",
    "images/mar4.png",
    "images/mar5.png",
    "images/mar6.png",
    "images/mar7.png"
  );
  coinImage = loadAnimation(
    "images/con1.png",
    "images/con2.png",
    "images/con3.png",
    "images/con4.png",
    "images/con5.png",
    "images/con6.png"
  );
  bgImage = loadImage("images/bgnew.jpg");
  brickImage = loadImage("images/brick.png");
  coinSound = loadSound("sounds/coinSound.mp3");
}

function setup() {
  createCanvas(1000, 600);

  bg = createSprite(580, 300);
  bg.addImage(bgImage);
  bg.scale = 0.5;
  bg.velocityX = -6;
  mario = createSprite(200, 505, 20, 50);
  mario.addAnimation("mario", mario_running);
  mario.scale = 0.25;
  ground = createSprite(200, 585, 400, 10);
  ground.visible = false;
  coinGroup = new Group();
  brickGroup = new Group(); //brickGroup = []
}

function draw() {
  background("black");
  if (bg.x < 100) {
    bg.x = bg.width / 4;
  }
  if (mario.y < 50) {
    mario.y = 50;
  }
  if (mario.x < 200) {
    mario.x = 200;
  }
  if (keyDown("space")) {
    mario.velocityY = -16;
  }
  mario.velocityY = mario.velocityY + 0.5;
  mario.collide(ground);
  generateBricks();
  for (var i = 0; i < brickGroup.length; i++) {
    var bricktemp = brickGroup.get(i);
    if (mario.isTouching(bricktemp)) {
      mario.collide(bricktemp);
    }
  }
  generateCoins();
  for (var i = 0; i < coinGroup.length; i++) {
    var tempCoin = coinGroup.get(i);
    if (mario.isTouching(tempCoin)) {
      coinSound.play();
      coinScore++;
      tempCoin.destroy();
      tempCoin = null;
    }
  }
  drawSprites();
  textSize(20);
  fill("brown");
  text("Coins Collected: " + coinScore, 500, 50);
}

function generateBricks() {
  if (frameCount % 70 === 0) {
    var brick = createSprite(1200, 120, 40, 10);
    brick.velocityX = -5;
    brick.addImage(brickImage);
    brick.scale = 0.5;
    brick.y = random(150, 400);
    brick.lifetime = 250;
    brickGroup.add(brick);
  }
}

function generateCoins() {
  if (frameCount % 100 == 0) {
    var coin = createSprite(1200, 120, 40, 10);
    coin.addAnimation("coin", coinImage);
    coin.y = Math.round(random(80, 350));
    coin.scale = 0.1;
    coin.velocityX = -3;
    coin.lifetime = 600;
    coinGroup.add(coin);
  }
}
