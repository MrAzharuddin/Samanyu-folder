//These are variables created for further references
var mario, mario_running, mario_collided;
var bg, bgImage;
var brickGroup, brickImage;
var coinGroup, coinImage;
var coinScore = 0;
var obstacleGroup;
var gameState = "PLAY";

//Preload, to load the files
function preload() {
  //Here, we load the various files like images, sounds, etc using the respective funtions
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
  mushObstacle = loadAnimation(
    "images/mush1.png",
    "images/mush2.png",
    "images/mush3.png",
    "images/mush4.png",
    "images/mush5.png",
    "images/mush6.png"
  );
  turObstacle = loadAnimation(
    "images/tur1.png",
    "images/tur2.png",
    "images/tur3.png",
    "images/tur4.png",
    "images/tur5.png"
  );
  mario_collided = loadAnimation("images/dead.png");
  coinSound = loadSound("sounds/coinSound.mp3");
  dieSound = loadSound("sounds/dieSound.mp3");
  jumpSound = loadSound("sounds/jump.mp3")
  restartImg = loadImage("images/restart.png")
}

function setup() {
  //It helps to make canvas of certain width and height
  createCanvas(1000, 600);
  //This is a background sprite
  bg = createSprite(500, 300);
  bg.addImage(bgImage);
  bg.scale = 0.5;
  bg.velocityX = -6;

  //This is a mario sprite
  mario = createSprite(200, 505, 20, 50);
  mario.addAnimation("jogging", mario_running);
  mario.addAnimation("collided", mario_collided);
  mario.scale = 0.3;

  //This is a ground sprite
  ground = createSprite(200, 585, 400, 10);
  ground.visible = false;

  //These are groups to store infinite bricks, coins and obstacles
  brickGroup = new Group();
  coinGroup = new Group(); // []
  obstacleGroup = new Group();

  restart = createSprite(500,300);
  restart.addImage(restartImg)
  restart.visible = false
}

function draw() {
  background("black");
  if (gameState == "PLAY") {
    mario.setCollider("rectangle", 0,0,200,500);
    mario.scale = 0.3;
    bg.velocityX = -6;
    //Preventing the background to go out of canvas in X axis
    if (bg.x < 100) {
      bg.x = bg.width / 4;
    }

    //Preventing the mario to go out of canvas in Y axis
    if (mario.y < 50) {
      mario.y = 50;
    }

    //Preventing the mario to go out of canvas in X axis when the bricks are pushing him out
    if (mario.x < 200) {
      mario.x = 200;
    }

    //This is used to control the mario movement
    if (keyDown("space")) {
      mario.velocityY = -10;
      jumpSound.play()
    }
    //Gravity
    mario.velocityY += 0.5;

    //CallBack function to generate bricks
    generateBricks();
    //Looping to get individual bricks and for mario operations
    for (var i = 0; i < brickGroup.length; i++) {
      var temp = brickGroup.get(i);

      if (mario.isTouching(temp)) {
        mario.collide(temp);
      }
    }

    //CallBack function to generate coins
    generateCoins();
    //Looping to get individual coins and for mario operations
    for (var j = 0; j < coinGroup.length; j++) {
      var con = coinGroup.get(j); // con = 10

      if (mario.isTouching(con)) {
        coinSound.play();
        // coinScore = coinScore + 1
        coinScore++;
        // coinScore += 1
        con.destroy(); //if u destroy con = 10
        con = null; //con = null
      }
    }

    //CallBack function to generate obstacles
    generateObstacles();

    if (obstacleGroup.isTouching(mario)) {
      dieSound.play();
      gameState = "END";
    }
  } //end of if statement
  else if (gameState == "END") {
    mario.velocityX = 0;
    mario.velocityY = 0;
    bg.velocityX = 0;
    obstacleGroup.setVelocityXEach(0);
    brickGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);
    brickGroup.setLifetimeEach(-1);
    mario.changeAnimation("collided", mario_collided);
    mario.scale = 0.4;
    // mario.debug = true;
    mario.setCollider("rectangle", 0, 0, 300, 10);
    mario.y = 560;
    restart.visible = true;

    if(mousePressedOver(restart)){
      restartGame();
    }
  }
  //Collision between mario and ground
  mario.collide(ground);

  drawSprites();
  //Display score
  textSize(20);
  fill("brown");
  text("Coins Collected: " + coinScore, 500, 100);
}

function generateBricks() {
  if (frameCount % 70 === 0) {
    var brick = createSprite(1200, 120, 40, 10);
    brick.y = random(150, 400);
    brick.addImage(brickImage);
    brick.velocityX = -5;
    brick.scale = 0.5;

    brick.lifetime = 250;
    brickGroup.add(brick);
  }
}

function generateCoins() {
  if (frameCount % 50 === 0) {
    var coin = createSprite(1200, 120, 30, 30);
    coin.addAnimation("coin", coinImage);
    coin.velocityX = random(-4, -3.5);
    coin.scale = 0.1;
    coin.y = Math.round(random(80, 350));
    coin.lifetime = 300;
    coinGroup.add(coin);
  }
}

function generateObstacles() {
  if (frameCount % 200 === 0) {
    var obstacle = createSprite(1200, 545, 10, 40);
    obstacle.velocityX = -4;
    var rand = Math.round(random(1, 2));
    obstacle.scale = 0.2;
    switch (rand) {
      case 1:
        obstacle.addAnimation("Mushroom", mushObstacle);
        break;
      case 2:
        obstacle.addAnimation("Turtle", turObstacle);
        break;
      default:
        break;
    }
    obstacle.lifetime = 300;
    obstacleGroup.add(obstacle);
  }
}


function restartGame(){
  gameState = "PLAY";
  obstacleGroup.destroyEach()
  coinGroup.destroyEach()
  brickGroup.destroyEach()
  coinScore = 0
  mario.changeAnimation("jogging", mario_running);
  restart.visible = false
}