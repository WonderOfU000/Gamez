export default class Player {
  constructor(x, y, gameWidth, gameHeight, difficulty) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.baseSpeed = difficulty === "hard" ? 8 : difficulty === "easy" ? 4 : 6;
    this.speed = this.baseSpeed;
    this.moving = { left: false, right: false, up: false, down: false };
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.image = new Image();
    this.image.src =
      "https://i.ibb.co/tTVJYyhB/th-removebg-preview-removebg-preview.png"; // Update with correct path
    this.image.onload = () => console.log("Player image loaded");
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update() {
    const acceleration = 0.2; // Adjust this value to control acceleration

    if (this.moving.left && this.x > 0) {
      this.speed = Math.min(this.speed + acceleration, this.baseSpeed);
      this.x -= this.speed;
    } else if (this.moving.right && this.x < this.gameWidth - this.width) {
      this.speed = Math.min(this.speed + acceleration, this.baseSpeed);
      this.x += this.speed;
    } else if (this.moving.up && this.y > 0) {
      this.speed = Math.min(this.speed + acceleration, this.baseSpeed);
      this.y -= this.speed;
    } else if (this.moving.down && this.y < this.gameHeight - this.height) {
      this.speed = Math.min(this.speed + acceleration, this.baseSpeed);
      this.y += this.speed;
    } else {
      this.speed = this.baseSpeed;
    }
  }
}
