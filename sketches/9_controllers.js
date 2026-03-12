// Pt 9: Controllers
//1. File > Download sketch folder. (Script must run locally to use USB controllers)
//2. Install npm and run startserver.js - https://github.com/p5-serial/p5.serialserver
//3. Put p5.serialport.js in sketch files and include in index.html
//4. Confirm the system names in /dev for the controllers when plugged in (lines 31 & 33)
//5. Open index.html in browser

let game;
let scoreL = 0;
let scoreR = 0;
let winningScore = 11;
let font, sfxwall, sfxpaddle, sfxfail;
let lastY = 10;
let lastDirX = 1;
let lastDirY = 1;
let lastScoreTime = 0;
let serial0, serial1;
let buttonLPressed, buttonRPressed, paddleLInput, paddleRInput;

function preload() {
  font = loadFont('DepartureMono-Regular.otf');
  sfxwall = loadSound("wall.wav");
  sfxpaddle = loadSound("paddle.wav");
  sfxfail = loadSound("fail.wav");
}

function setup() {
  createCanvas(640, 480);
  rectMode(CENTER);
  textFont(font);
  serial0 = new p5.SerialPort();
  serial0.open('/dev/ttyACM0', {baudRate: 115200});
  serial1 = new p5.SerialPort();
  serial1.open('/dev/ttyACM1', {baudRate: 115200});
  serial0.on('data', gotData0);
  serial1.on('data', gotData1);
  nextServe();
}

function draw() {
  game.update();
  game.display();
}

function nextServe() {
  let gameNum = floor(random(3));
  if(gameNum == 0) {
    game = new Game();
  } else if(gameNum == 1) {
    game = new BallFadesGame();
  } else if(gameNum == 2) {
    game = new PaddlesShrinkGame();
  }
}

class Ball {
  constructor(x, y, dirX, dirY, size, vel) {
    this.x = x;
    this.y = y;
    this.dirX = dirX;
    this.dirY = dirY;
    this.size = size;
    this.vel = vel;
    this.hitCount = 0;
    this.color = 255;
  }
  
  update() {
    this.x += this.dirX * this.vel;
    this.y += this.dirY * this.vel;
  }
  
  display() {
    fill(this.color);
    noStroke();
    square(this.x, this.y, this.size);
  }

  checkWallCollision() {
    if(this.x + (this.size / 2) >= width || this.x - (this.size / 2) <= 0) {
      this.dirX *= -1;
    }
    if(this.y + (this.size / 2) >= height || this.y - (this.size / 2) <= 0) {
      this.dirY *= -1;
      if(game.state == "playing") {
        sfxwall.play();
      }
    }
  }
  
  checkPaddleCollision(paddle) {
    let nextX = this.x + this.dirX * this.vel;
    
    if(((this.dirX > 0 // right paddle
          && this.x + this.size / 2 <= paddle.x - paddle.w / 2
          && nextX + this.size / 2 > paddle.x - paddle.w / 2)
        || (this.dirX < 0 // left paddle
          && this.x - this.size / 2 >= paddle.x + paddle.w / 2
          && nextX - this.size / 2 < paddle.x + paddle.w / 2
        )
      ) && this.y + this.size / 2 > paddle.y - paddle.h / 2 // top/bottom (same for both)
      && this.y - this.size / 2 < paddle.y + paddle.h / 2
      ) {

      this.hitCount++;
      this.dirX = this.getBallDirX();
      this.dirY = this.getBallDirY(paddle);
      sfxpaddle.play();
      return true;
    }
  }
  
  getBallDirX() {
    if(this.hitCount < 4){
        if(this.dirX > 0){
          return -1;
        } else {
          return 1;
        }
      } else if(this.hitCount >=4 && this.hitCount < 12){
        if(this.dirX > 0){
          return -1.6;
        } else {
          return 1.6;
        }
      } else {
        if(this.dirX > 0){
          return -2.1;
        } else {
          return 2.1;
        }
      }
  }
  
  getBallDirY(paddle){
    let hitLocation = round((this.y - (paddle.y - (paddle.h/2))) * (8/paddle.h));
    if(hitLocation <= 1) {
        return -2;
      } else if(hitLocation == 2) {
        return -1.4;
      } else if(hitLocation == 3) {
        return -0.7;
      } else if(hitLocation == 4 || hitLocation == 5){
        return 0;
      } else if(hitLocation == 6){
        return 0.7
      } else if(hitLocation == 7){
        return 1.4;
      } else if(hitLocation >= 8){
        return 2.0;
      }
  }
}

class Paddle {
  constructor(x, y, w, h, speed, side) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.side = side;
    this.speed = speed;
  }

  update() {
    if (this.side == "left") {
      this.y = paddleLInput;
    } else {
      this.y = paddleRInput;
    }
  }

  display() {
    fill(255);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }
}

class Game {
  constructor() {
    if(lastDirX > 0) {
      this.ball = new Ball(300, lastY, lastDirX, lastDirY, 8, 4);
    } else {
      this.ball = new Ball(340, lastY, lastDirX, lastDirY, 8, 4);
    }
    this.paddleL = new Paddle(40, height / 2, 8, 32, 5, "left");
    this.paddleR = new Paddle(width - 40, height / 2, 8, 32, 5, "right");
    this.state = "title"; //title, playing, gameover
    this.startTitleTime = millis();
    this.title1Played = false;
    this.title2Played = false;
    this.title3Played = false;
    this.description = "it's just standard Pong this time";
  }
  
  update() {
    if(this.state == "playing") {
      if(millis() - lastScoreTime > 5000) {
        this.ball.update();
      }
      this.ball.checkWallCollision();
      if(this.ball.dirX > 0) {
        this.ball.checkPaddleCollision(this.paddleR);
      } else {
        this.ball.checkPaddleCollision(this.paddleL);
      }
      this.paddleL.update();
      this.paddleR.update();
      this.score();
    } else if(this.state == "gameover"){
      this.ball.update();
      this.ball.checkWallCollision();
      this.checkButtonPress();
    }
  }
  
  display() {
    if(this.state == "title") {
      this.drawTitle();
    } else if(this.state == "playing") {
      this.drawCourt();
      if(millis() - lastScoreTime > 5000) {
        this.ball.display();
      }
      this.paddleL.display();
      this.paddleR.display();
      this.drawScoreboard();
    } else if(this.state == "gameover") {
      this.drawCourt();
      this.ball.display();
      this.drawScoreboard();
    }
  }
  
  score() {
    if (this.ball.x < 10) {
      scoreR++;
      if (scoreR == winningScore) {
        this.state = 'gameover';
      } else {
        this.ball.x = width / 2 + 20;
        lastY = this.ball.y;
        lastDirX = -1;
        lastDirY = this.ball.dirY;
        lastScoreTime = millis();
        sfxfail.play();
        nextServe();
      }
    }
    
    if (this.ball.x > width - 10) {
      scoreL++;
      if (scoreL == winningScore) {
        this.state = 'gameover';
      } else {
        this.ball.x = width / 2 - 20;
        lastY = this.ball.y;
        lastDirX = 1;
        lastDirY = this.ball.dirY;
        lastScoreTime = millis();
        sfxfail.play();
        nextServe();
      }
    }
  }
  
  drawCourt() {
    background(0);
    stroke(255);
    strokeWeight(2);
    let dashLength = 8;
    for (let i = dashLength; i <= height; i += dashLength * 2) {
      line(width / 2, i, width / 2, i + dashLength);
    }
  }

  drawScoreboard() {
    noStroke();
    fill(255);
    textAlign(CENTER);
    textSize(96);
    text(scoreL, width / 4, 80);
    text(scoreR, (width / 4) * 3, 80);
  }
  
  drawTitle() {
    background(0);
    fill(255);
    textAlign(CENTER);
    textSize(182);
    let timeElapsed = millis() - this.startTitleTime;

    if (timeElapsed > 1000) {
      if(!this.title1Played){
        sfxwall.play();
        this.title1Played = true;
      }
      text("PONG", width / 2, 175);
    }

    if (timeElapsed > 1500) {
      if(!this.title2Played){
        sfxwall.play();
        this.title2Played = true;
      }
      text("BUT", width / 2, 350);
    }

    if (timeElapsed > 2000) {
      if(!this.title3Played){
        sfxpaddle.play();
        this.title3Played = true;
      }
      let size = floor(width / this.description.length * 1.5);
      textSize(size);
      text(this.description, width / 2, 425);
    }

    if (timeElapsed > 4500) {
      this.state = 'playing';
    }
  }
  
  checkButtonPress() {
    if(buttonLPressed || buttonRPressed) {
      buttonLPressed = false;
      buttonRPressed = false;
      scoreL = 0;
      scoreR = 0;
      lastY = 10;
      lastDirX = 1;
      lastDirY = 1;
      nextServe();
    }
  }
}


class BallFadesGame extends Game {
  constructor() {
    super();
    this.description = "the ball fades each time you hit it";
  }

  update() {
    super.update();
    this.ball.color = 255 / (this.ball.hitCount + 1);
  }
}

class PaddlesShrinkGame extends Game {
  constructor() {
    super();
    this.description = "your paddle shrinks on every hit";
  }
  
  update() {
    if(this.state == "playing") {
      if(millis() - lastScoreTime > 5000) {
        this.ball.update();
      }
      this.ball.checkWallCollision();
      if(this.ball.dirX > 0) {
        if(this.ball.checkPaddleCollision(this.paddleR)) {
          if(this.paddleR.h > this.ball.size) {
            this.paddleR.h -= 5;
          }
        }
      } else {
        if(this.ball.checkPaddleCollision(this.paddleL)) {
          if(this.paddleL.h > this.ball.size) {
            this.paddleL.h -= 5;
          }
        }
      }
      this.paddleL.update();
      this.paddleR.update();
      this.score();
    } else if(this.state == "gameover"){
      this.ball.update();
      this.ball.checkWallCollision();
      this.checkButtonPress();
    }
  }
  
}

function gotData0() {
  let currentString = serial0.readLine();
  trim(currentString);
  if (!currentString) return;
  console.log(currentString);

  if(currentString == "LB1"){
    buttonLPressed = true;
  } else if(currentString == "RB1") {
    buttonRPressed = true;
  } else if(currentString.substring(0, 2) == "LP") {
    paddleLInput = currentString.substring(2);
  } else if(currentString.substring(0, 2) == "RP") {
    paddleRInput = currentString.substring(2);
  }
}

function gotData1() {
  let currentString = serial1.readLine();
  trim(currentString);
  if (!currentString) return;
  console.log(currentString);

  if(currentString == "LB1"){
    buttonLPressed = true;
  } else if(currentString == "RB1") {
    buttonRPressed = true;
  } else if(currentString.substring(0, 2) == "LP") {
    paddleLInput = currentString.substring(2);
  } else if(currentString.substring(0, 2) == "RP") {
    paddleRInput = currentString.substring(2);
  }
}