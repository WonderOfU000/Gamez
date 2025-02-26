export default class Bullet {
  constructor(x, y, speed, gameHeight) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 10;
    this.speed = speed;
    this.gameHeight = gameHeight;
  }

  // Reinitialize method
  reinit(x, y, speed, gameHeight) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.gameHeight = gameHeight;
  }

  draw(ctx) {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.y -= this.speed;
  }

  isOffScreen() {
    return this.y < -this.height;
  }
}
