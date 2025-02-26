export default class Enemy {
  constructor(x, y, speed, gameWidth, gameHeight) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.speed = speed;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.image = new Image();
    this.image.src =
      "https://i.ibb.co/JwsmZSj6/daki-removebg-preview.png"; // Update with correct path
    this.image.onload = () => console.log("Enemy image loaded");
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update() {
    this.y += this.speed;
    if (this.y > this.gameHeight) {
      this.y = -this.height;
      this.x = Math.random() * (this.gameWidth - this.width);
    }
  }
}
