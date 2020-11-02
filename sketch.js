var PLAY = 1;
var END = 0;
var gamestate = PLAY;

var monkey , monkey_running, monkey_collide;
var banana ,bananaImage;
var obstacle, obstacleImage;
var foodGroup, obstaclesGroup;
var score;
var survival_time;

function preload()
{
  
  monkey_running =                          loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png", "sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png")
  monkey_collide = loadAnimation("sprite_2.png");
  
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
}

function setup() 
{
  createCanvas(600,400);
  
  monkey = createSprite(60,315,10,10);
  monkey.addAnimation("running",monkey_running);
  monkey.addAnimation("collided", monkey_collide);
  monkey.scale = 0.1;
  
  ground = createSprite(400,375,1500,60);
  ground.shapeColor = "green";
  ground.velocityX = -4;
  ground.x = ground.width/2;
  
  restart = createSprite(293,240,20,20);
  restart.visible = false;
  
  score = 0;
  survival_time = 0;
  
  obstaclesGroup = new Group();
  foodGroup = new Group();
}


function draw() 
{
  background("skyblue");
  
  if(gamestate == PLAY)
  {
    if(keyDown("space") && monkey.y >= 310) 
    {
      monkey.velocityY = -18;
    }

    monkey.velocityY = monkey.velocityY + 1;

    if (ground.x < 0)
    {
      ground.x = ground.width/2;
    }

    if(monkey.isTouching(foodGroup))
    {
      foodGroup.destroyEach(); 
      score++;
    }
    
    restart.visible = false;
    survival_time = survival_time + Math.round(getFrameRate()/60);
     
    spawnObstacles();
    bananas();
    
    if(obstaclesGroup.isTouching(monkey))
    {
      gamestate = END;
    }
  }
  
  if(gamestate == END)
  {
    restart.visible = true;
    
    textSize(30);
    textFont("bembo");
    fill("black");
    text("GAME OVER!",200,200);
    
    textSize(15);
    textFont("bembo");
    fill("black");
    text("Press 👇 to restart",250,220);
    
    foodGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach (0);
    obstaclesGroup.setLifetimeEach(-1);
    foodGroup.setLifetimeEach(-1);
    
    ground.velocityX = 0;
    monkey.velocityY = 0;
    monkey.changeAnimation("collided", monkey_collide);
    
    if(mousePressedOver(restart))
    {
      reset();
      survival_time = 0;
    }
  }
  
  monkey.collide(ground);
    
  drawSprites();
  
  textSize(15);
  textFont("bembo");
  fill("black");
  text("Bananas = "+score,250,70);
  
  textSize(20);
  textFont("bembo");
  fill("black");
  text("Survival Time = "+survival_time,210,50);
  
}

function reset()
{
  gamestate = PLAY;
  monkey.changeAnimation("running",monkey_running);
  obstaclesGroup.destroyEach();
  foodGroup.destroyEach();
  score = 0;
}

function bananas()
{
  if (frameCount % 100 === 0)
  {
    var banana = createSprite(600,120,40,10);
    banana.y = Math.round(random(120,200));
    banana.addImage(bananaImage);
    banana.scale = 0.1;
    banana.velocityX = -(6+2*score/3);
    banana.lifetime = 110;
  
    foodGroup.add(banana);
  }
}

function spawnObstacles()
{ 
  if (frameCount % 150 === 0)
  {
    var obstacle = createSprite(600,318,10,40);
  
    obstacle.velocityX = -(6+2*score/3);
    obstacle.addImage(obstacleImage);
    obstacle.scale = 0.14;
    obstacle.setCollider("circle",0,0,150);
    obstacle.lifetime = 110;
    
    obstaclesGroup.add(obstacle);
  }
}
