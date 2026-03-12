//Pt 2: Paddles

let ball, paddleL, paddleR;

function setup() {
  createCanvas(640, 480);
  rectMode(CENTER);
  ball = new Ball(300, 10, 1, 1, 8, 4);
  paddleL = new Paddle(40, height / 2, 8, 32, 5, "left");
  paddleR = new Paddle(width - 40, height / 2, 8, 32, 5, "right");
}

function draw() {
  background(0);
  ball.update();
  ball.checkWallCollision();
  if(ball.dirX > 0) {
    ball.checkPaddleCollision(paddleR);
  } else {
    ball.checkPaddleCollision(paddleL);
  }
  ball.display();
  paddleL.update();
  paddleL.display();
  paddleR.update();
  paddleR.display();
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
  
  checkPaddleCollision(paddle) { // Axis-Aligned Bounding Box
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