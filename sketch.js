//Viyath Wanninayake
///1/5/2021
//Project 18

//Create sprites for all the variables and gamestates
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var sun,sunI;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  //Add animation to the necessary variables
  trex_running = loadImage("trex img.png")
  trex_collided = loadImage("trexdead.png");
  sunI = loadImage("sun.png");
  groundImage = loadImage("ground4img.png");
  
  cloudImage = loadImage("rainbow.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  //Create a canvas 
  createCanvas(windowWidth,windowHeight);
  //Create a trex sprite and animation to it 
  trex = createSprite(windowWidth-750,windowHeight-50,90,90);
  trex.addImage(trex_running);
  trex.scale = 0.6;
  //Create a sun sprite and add animation to it 
  sun = createSprite(windowWidth-125,windowHeight-700,20,20);
  sun.addImage(sunI);
  sun.scale=0.2
  //Create a ground sprite
  ground = createSprite(windowWidth,windowHeight+10,2000,50);
  //Create a game over sprite and add animation 
  gameOver = createSprite(windowWidth-450 ,windowHeight-700);
  gameOver.addImage(gameOverImg); 
  //Create a sprite for restart and add animation to it
  restart = createSprite(windowWidth-450,windowWidth-690);
  restart.addImage(restartImg);
  gameOver.scale = 1;
  restart.scale = 2;
//Create an invisible ground and hide it  
  invisibleGround = createSprite(windowWidth,windowHeight,4000,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  //Create a trex collider radius
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  //Make the score 0
  score = 0;
  
}

function draw() {
  
  background("lightblue");
  //Show the score
  textSize(25)
  text("Score: "+ score, windowWidth-400,windowHeight-750);
  
  
  if(gameState === PLAY){
//Hid the game over and restart
    gameOver.visible = false;
    restart.visible = false;
    //Add animation to the trex
    trex.addImage(trex_running);
    trex.scale=0.6 ;
    //scoring
    score = score + Math.round(getFrameRate()/55);
    //Add noise when score increases
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    //Make the ground move
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed or when the screen is touched
    if((keyDown("space")||touches>0)&& trex.y >= windowHeight-220) {
        trex.velocityY = -12;
        jumpSound.play();
      touches=[];
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
     //Show the game over and restart sprites
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.addImage(trex_collided);
    
     trex.scale=0.36;
     //Stop the ground and trex moving
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    //Make them stop moving 
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0); 
     
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }


  drawSprites();
}

//Create a function for the reset
function reset(){
  //Reset the score
  score = 0;
  //Change the gamestate
  gameState = PLAY;
  //Hide the gameover  and restart variables
  gameOver.visible = false;
  restart.visible = false;
  //Detsroy the clouds and the obstacles
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  //Change the trex animation
  trex.changeAnimation("running", trex_running);
}

function spawnObstacles(){
  //Create obstacles every 120 framecounts    
 if (frameCount % 120 === 0){
   var obstacle = createSprite(windowWidth+10,windowHeight-50 ,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 1  ;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    var cloud = createSprite(windowWidth+10,50,40,10);
    cloud.y = Math.round(random(windowHeight-100,windowHeight-500));
    cloud.addImage(cloudImage);
    cloud.scale = 0.1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

