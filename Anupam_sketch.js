//these are variables used to create objects
var mario, mario_running, mario_collided;
var bg, bgImage;
var brickGroup, brickImage;
var coinsGroup, coinImage;
var coinScore = 0;
var MushImage, TurtleImage;
var obstacleGroup;
var gameState = "PLAY";

//preload is to load files
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
  bgImage = loadImage("images/bgnew.jpg");
  brickImage = loadImage("images/brick.png");
  coinImage = loadAnimation(
    "images/con1.png",
    "images/con2.png",
    "images/con3.png",
    "images/con4.png",
    "images/con5.png",
    "images/con6.png"
  );
  coinSound = loadSound("sounds/coinSound.mp3");
  MushImage = loadAnimation(
    "images/mush1.png",
    "images/mush2.png",
    "images/mush3.png",
    "images/mush4.png",
    "images/mush5.png",
    "images/mush6.png"
  );
  TurtleImage = loadAnimation(
    "images/tur1.png",
    "images/tur2.png",
    "images/tur3.png",
    "images/tur4.png",
    "images/tur5.png"
  );
  dieSound = loadSound("sounds/dieSound.mp3");
  mario_collided = loadAnimation("images/dead.png");

  restartImg = loadImage("images/restart.png");
}

function setup() {
  createCanvas(1000, 600);
  //create background sprite
  bg = createSprite(580, 300);
  bg.addImage(bgImage);
  bg.scale = 0.5;
  bg.velocityX = -6;
  //create mario sprite
  mario = createSprite(200, 505, 20, 50);
  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_collided);
  mario.scale = 0.3;
  //create ground sprite
  ground = createSprite(200, 585, 400, 10);
  ground.visible = false;

  //create bricks,coins,obstacles groups
  brickGroup = new Group(); //brickgroup = []
  coinsGroup = new Group();
  obstacleGroup = new Group();

  restart = createSprite(500, 300);
  restart.addImage(restartImg);
  restart.visible = false;
}

function draw() {
  if (gameState == "PLAY") {
    bg.velocityX = -6;
    mario.scale = 0.3;
    mario.setCollider("rectangle", 0, 0, 200, 500);
    //scroll background
    if (bg.x < 100) {
      bg.x = bg.width / 4;
    }
    //prevent mario going out of canvas in x direction
    if (mario.x < 200) {
      mario.x = 200;
    }
    //prevent mario going out of canvas in y direction
    if (mario.y < 50) {
      mario.y = 50;
    }
    //mario keyboard controls
    if (keyDown("space")) {
      mario.velocityY = -16;
    }
    //gravity
    mario.velocityY = mario.velocityY + 0.5;
    //support for mario for falling down
    mario.collide(ground);

    //callback funtion for generating bricks
    generateBricks();
    for (var i = 0; i < brickGroup.length; i++) {
      var temp = brickGroup.get(i);
      if (mario.isTouching(temp)) {
        mario.collide(temp);
      }
    }
    //callback funtion for generating coins
    generateCoins();
    for (var j = 0; j < coinsGroup.length; j++) {
      var coins = coinsGroup.get(j);
      if (mario.isTouching(coins)) {
        //this plays sound when mario touches coins
        coinSound.play();
        //score increment
        coinScore++;
        coins.destroy();
        coins = null;
      }
    }
    //callback funtion for generating obstacles
    generateObstacles();

    if (obstacleGroup.isTouching(mario)) {
      dieSound.play();
      gameState = "END";
    }
  } //end of if condition gameState == "play"
  else if (gameState == "END") {
    bg.velocityX = 0;
    mario.velocityX = 0;
    mario.velocityY = 0;
    obstacleGroup.setVelocityXEach(0);
    brickGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    brickGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
    mario.changeAnimation("collided", mario_collided);
    mario.scale = 0.4;
    // mario.debug = true;
    mario.setCollider("rectangle", 0, 0, 300, 10);
    mario.y = 550;
    restart.visible = true;

    if (mousePressedOver(restart)) {
      restartGame();
    }
  }
  drawSprites();
  textSize(20);
  fill("black");
  //Displays score
  text("Coins Collected: " + coinScore, 500, 50);
}

function generateBricks() {
  if (frameCount % 70 === 0) {
    var brick = createSprite(1200, 120, 40, 10);
    brick.y = random(100, 400);
    brick.velocityX = -5;
    brick.addImage(brickImage);
    brick.scale = 0.5;
    brick.lifetime = 300;
    brickGroup.add(brick);
  }
}

function generateCoins() {
  if (frameCount % 100 === 0) {
    var coin = createSprite(1200, 120, 40, 10);
    coin.addAnimation("coin-jumping", coinImage);
    coin.y = Math.round(random(100, 400));
    coin.scale = 0.1;
    coin.velocityX = -3;
    coin.lifetime = 500; //It helps in memory
    coinsGroup.add(coin);
  }
}

function generateObstacles() {
  if (frameCount % 200 === 0) {
    var obstacle = createSprite(1200, 545, 40, 40);
    obstacle.velocityX = -4;
    var rand = Math.round(random(1, 2));
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    // console.log(rand)
    switch (rand) {
      case 1:
        obstacle.addAnimation("Mushroom", MushImage);
        break;
      case 2:
        obstacle.addAnimation("Turtle", TurtleImage);
        break;
      default:
        break;
    }
    obstacleGroup.add(obstacle);
  }
}

function restartGame() {
  gameState = "PLAY";
  obstacleGroup.destroyEach();
  brickGroup.destroyEach();
  coinsGroup.destroyEach();
  coinScore = 0;
  mario.changeAnimation("running", mario_running);
  restart.visible = false;
}
 h