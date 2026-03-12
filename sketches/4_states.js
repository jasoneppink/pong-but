//Pt 4: States (Playing, Gameover)
//1. move Ball and Paddle logic inside Game
//2. add update() and display() to Ball class
//3. add state logic for playing & gameover

let game;
let scoreL = 0;
let scoreR = 0;
let winningScore = 3;

function setup() {
  createCanvas(640, 480);
  rectMode(CENTER);
  game = new Game();
}

function draw() {
  game.update();
  game.display();
}

class Ball {
  constructor(x, y, dirX, dirY, size, vel) {
    this.x = x;
    this.y = y;
    this.dirX = dirX;
    this.dirY = dirY;
    this.size = size;
    this.vel = vel;
  }
  
  update() {
    this.x += this.dirX * this.vel;
    this.y += this.dirY * this.vel;
  }
  
  display() {
    fill(255);
    noStroke();
    square(this.x, this.y, this.size);
  }

  checkWallCollision() {
    if(this.x + (this.size / 2) >= width || this.x - (this.size / 2) <= 0) {
      this.dirX *= -1;
    }
    if(this.y + (this.size / 2) >= height || this.y - (this.size / 2) <= 0) {
      this.dirY *= -1;
    }
  }
  
  checkPaddleCollision(paddle) {
    if(this.x + this.size / 2 > paddle.x - paddle.w / 2
      && this.x - this.size / 2 < paddle.x + paddle.w / 2
      && this.y + this.size / 2 > paddle.y - paddle.h / 2
      && this.y - this.size / 2 < paddle.y + paddle.h / 2) {
      this.dirX *= -1;
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
      if (keyIsDown(87)) { // 'w'
        this.y -= this.speed;
      }
      if (keyIsDown(83)) { // 's'
        this.y += this.speed;
      }
    } else {
      this.y = mouseY;
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
    this.ball = new Ball(300, 10, 1, 1, 8, 4);
    this.paddleL = new Paddle(40, height / 2, 8, 32, 5, "left");
    this.paddleR = new Paddle(width - 40, height / 2, 8, 32, 5, "right");
    this.state = "playing"; //playing, gameover
  }
  
  update() {
    if(this.state == "playing") {
      this.ball.update();
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
    }
  }
  
  display() {
    if(this.state == "playing") {
      this.drawCourt();
      this.ball.display();
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
      }
    }
    
    if (this.ball.x > width - 10) {
      scoreL++;
      if (scoreL == winningScore) {
        this.state = 'gameover';
      } else {
        this.ball.x = width / 2 - 20;
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
}