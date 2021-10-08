//Variables created for loading objects
var mario, mario_running, mario_collided;
var bg, bgImage;
var brickGroup, brickImg;
var coinsGroup, coinImage;
var coinScore = 0;
var mushObstacle, turtleObstacle;
var gameState = "PLAY";

function preload() {
  //This purpose to load the files it can be mp3 or animation or image
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
  brickImg = loadImage("images/brick.png");
  coinImage = loadAnimation(
    "images/con1.png",
    "images/con2.png",
    "images/con3.png",
    "images/con4.png",
    "images/con5.png",
    "images/con6.png"
  );
  coinSound = loadSound("sounds/coinSound.mp3");
  mushObstacle = loadAnimation(
    "images/mush1.png",
    "images/mush2.png",
    "images/mush3.png",
    "images/mush4.png",
    "images/mush5.png",
    "images/mush6.png"
  );
  turtleObstacle = loadAnimation(
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
  //created a canvas
  createCanvas(1000, 600);

  //create background sprite
  bg = createSprite(580, 300);
  bg.addImage(bgImage);
  bg.scale = 0.5;
  bg.velocityX = -6;

  //created mario sprite
  mario = createSprite(200, 505, 20, 50);
  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_collided);
  mario.scale = 0.3;

  //created ground sprite
  ground = createSprite(200, 585, 400, 10);
  ground.visible = false; //this visible function makes sprite hidden or vanish

  restart = createSprite(500, 300);
  restart.addImage(restartImg);
  restart.scale = 0.8;
  restart.visible = false;
  //created empty lists for bricks, coins and obstacles
  brickGroup = new Group();
  coinsGroup = new Group();
  obstaclesGroup = new Group();
}

function draw() {
  if (gameState == "PLAY") {
    mario.scale = 0.3;
    bg.velocityX = -6
    mario.setCollider("rectangle",0,0,200,500)
    //loops the background
    if (bg.x < 100) {
      bg.x = bg.width / 4;
    }

    //if brick is moving, so the mario goes out of canvas in X axis
    if (mario.x < 200) {
      mario.x = 200;
    }

    //prevent mario moving out from top
    if (mario.y < 50) {
      mario.y = 50;
    }

    //Jump with space button
    if (keyDown("space")) {
      mario.velocityY = -16;
    }

    //Gravity
    mario.velocityY = mario.velocityY + 1;

    //call the function to generate the bricks
    generateBricks();

    //make mario step on the brick
    for (var i = 0; i < brickGroup.length; i++) {
      var temp = brickGroup.get(i);

      if (mario.isTouching(temp)) {
        mario.collide(temp);
      }
    }

    //call the function to generate the coins
    generateCoins();

    //Make the mario to collect the coins
    for (var j = 0; j < coinsGroup.length; j++) {
      var temp = coinsGroup.get(j);

      if (mario.isTouching(temp)) {
        //Play sound when coin is collected
        coinSound.play();
        //If mario touches the coin, score increases
        coinScore++;
        //If mario touches the coin, coin destroy or disappear
        temp.destroy();
        temp = null;
      }
    }

    //call the function to generate Obstacles
    generateObstacles();
    if (obstaclesGroup.isTouching(mario)) {
      dieSound.play();
      gameState = "END";
    }
  } else if (gameState == "END") {
    bg.velocityX = 0;
    mario.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    brickGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    brickGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
    mario.changeAnimation("collided", mario_collided);
    mario.scale = 0.4;
    // mario.debug = true;
    mario.setCollider("rectangle", 0, 0, 300, 10);
    mario.y = 560;
    restart.visible = true;

    if (mousePressedOver(restart)) {
      restartGame();
    }
  }

  //Helps mario to stand on the ground
  mario.collide(ground);
  // background("black");

  //This function helps to draw all the sprites on screen
  drawSprites();
  textSize(20);
  fill("brown");
  //Displays the score
  text("coins collected: " + coinScore, 500, 100);
}

function generateBricks() {
  if (frameCount % 120 == 0) {
    var brick = createSprite(1200, 100, 40, 10);
    brick.velocityX = -3;
    brick.y = random(100, 500);
    brick.addImage(brickImg);
    brick.scale = 0.5;

    brick.lifetime = 1000;
    brickGroup.add(brick);
  }
}

function generateCoins() {
  if (frameCount % 50 === 0) {
    var coin = createSprite(1200, 120, 40, 10);
    coin.addAnimation("coin", coinImage);
    coin.y = Math.round(random(80, 350));
    coin.scale = 0.1;
    coin.velocityX = -5;
    coin.lifetime = 1200;
    coinsGroup.add(coin);
  }
}

function generateObstacles() {
  if (frameCount % 200 === 0) {
    var obstacle = createSprite(1200, 545, 30, 40);
    obstacle.velocityX = -4;
    obstacle.scale = 0.2;
    var rand = Math.round(random(1, 2));
    switch (rand) {
      case 1:
        obstacle.addAnimation("mushroom", mushObstacle);
        break;
      case 2:
        obstacle.addAnimation("turtle", turtleObstacle);
        break;
      default:
        break;
    }
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}

function restartGame() {
  gameState = "PLAY";
  obstaclesGroup.destroyEach();
  brickGroup.destroyEach();
  coinsGroup.destroyEach();
  coinScore = 0;
  mario.changeAnimation("running", mario_running);
  restart.visible = false;
}
