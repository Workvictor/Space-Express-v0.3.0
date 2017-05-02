function Projectile(sprite, x, y) {
	this.img = document.createElement("canvas");
	this.img.width = sprite.width;
	this.img.height = sprite.height;
	this.img.ctx = this.img.getContext('2d');
	this.img.ctx.drawImage(sprite, 0, 0);

	this.sprite = this.img;
	this.speed = 30;
	this.damage = 15;
	this.x = x;
	this.y = y;
	this.width = sprite.width;
	this.height = sprite.height;

}

Projectile.prototype.getPos = function () {
	return {
		x: this.x,
		y: this.y
	}
};
Projectile.prototype.update = function () {
	this.x += this.speed;
};
Projectile.prototype.draw = function (canvas) {
	canvas.ctx.drawImage(this.sprite, this.x, this.y);
};