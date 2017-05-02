function Player(input, display, sprites) {
	this.sprites = sprites;
	this.bullets = [];
	this.rateOfFire = 10;
	this.fireTimer = 0;
	this.input = input;
	this.display = display;
	this.x = 20;
	this.y = 250;
	this.width = 128;
	this.height = 40;
	this.size = this.height;
	this.armor = 10;
	this.onHitTimer = 0;
	this.onHitCD = 30;
	this.force = {
		x: 0.1,
		y: 0.25
	};

	this.velocity = {
		x: 0,
		y: 0
	};
	this.speedMAX = 5;
	this.speedMove = 0;
	this.speed = 5;
	this.gravity = 1.75;
	this.automationMAX = 10;
	this.automation = this.automationMAX;
	this.bounds = {
		xMin: 0,
		xMax: this.display.canvas.width,
		yMin: 0,
		yMax: this.display.canvas.height
	};
	this.parts = [];
	this.speedLimit = new Event('playerSpeedLimit');
	this.speedNormal = new Event('playerSpeedNormal');
}

Player.prototype.attack = function () {
	if (this.fireTimer == 0) {
		this.bullets.push(new Projectile(this.sprites[3], this.x + this.width - 60, this.y + 15));
	}

};
Player.prototype.onHitStartTimer = function () {
	this.onHitTimer++;
};

Player.prototype.onHit = function () {
	if (this.onHitTimer >= this.onHitCD) {
		this.onHitTimer = 0;
	}
	if (this.onHitTimer != 0) {
		this.y = randomRange(this.y - 4, this.y + 4);
		this.onHitTimer++;
	}

};



Player.prototype.addParticles = function (x, y) {

	var part = {};
	part.x = x + 10;
	part.y = y + 30;
	part.speedX = -10;
	part.sizeJitter = 0.5;
	var canvas = document.createElement("canvas");
	canvas.width = 1;
	canvas.height = 1;
	canvas.ctx = canvas.getContext('2d');
	canvas.ctx.globalAlpha = 0.75;
	canvas.ctx.fillStyle = '#2098ff';
	canvas.ctx.fillRect(0, 0, canvas.width, canvas.width);
	part.img = canvas;
	this.parts.push(part);
	if (this.parts.length > 100) this.parts.shift();
};

Player.prototype.setSprite = function (sprites) {
	this.sprites = sprites;
	var canvas = document.createElement("canvas");
	canvas.width = this.width;
	canvas.height = this.height;
	canvas.ctx = canvas.getContext('2d');
	//canvas.ctx.scale(this.width / this.sprites[4].width, this.width / this.sprites[4].width);
	canvas.ctx.drawImage(this.sprites[4], 0, 0);
	this.sprite = canvas;
};

Player.prototype.checkBounds = function () {
	if (this.x > this.bounds.xMax - this.width) {
		this.x = this.bounds.xMax - this.width;
	}
	if (this.x < this.bounds.xMin) {
		this.x = this.bounds.xMin;
	}
	if (this.y > this.bounds.yMax - this.height / 2) {
		this.y = this.bounds.yMax - this.height / 2;
	}
	if (this.y < this.bounds.yMin) {
		this.y = this.bounds.yMin;
	}
	return (this.x < this.bounds.xMax && this.x > this.bounds.xMin &&
	this.y < this.bounds.yMax && this.y > this.bounds.yMin);
};

Player.prototype.update = function () {
	this.checkBounds();
	if (this.input.x > 0) {
		if (this.x > this.bounds.xMax / 4) {
			if (this.force.x >= 0.1) this.force.x /= 5;
			document.dispatchEvent(this.speedLimit);
			if (this.x > this.bounds.xMax / 2) {
				this.force.x /= 5;
			}
		}

	} else {
		this.force.x = 0.1;
		document.dispatchEvent(this.speedNormal);
	}

	if (this.input.fire && this.fireTimer == 0) {
		this.attack();
		this.fireTimer++;
	}

	if (this.fireTimer != 0) {
		this.fireTimer++;
		if (this.fireTimer >= this.rateOfFire)this.fireTimer = 0;
	}


	if (this.velocity.x <= this.speedMAX && this.input.x > 0) {
		this.velocity.x += this.force.x * this.input.x;
		if (this.velocity.x > this.speedMAX) this.velocity.x = this.speedMAX;
	}
	if (this.velocity.x >= -this.speedMAX && this.input.x < 0) {
		this.velocity.x += this.force.x * this.input.x;
		if (this.velocity.x < -this.speedMAX) this.velocity.x = -this.speedMAX;
	}
	else {
		this.velocity.x *= 0.98;
		if (this.velocity.x < 0.01 && this.velocity.x > -0.01) this.velocity.x = 0;
	}
	if (this.velocity.y <= this.speedMAX && this.input.y > 0) {


		this.velocity.y += this.force.y * this.input.y;
		if (this.velocity.y > this.speedMAX) this.velocity.y = this.speedMAX;
	}
	if (this.velocity.y >= -this.speedMAX && this.input.y < 0) {

		this.velocity.y += this.force.y * this.input.y;
		if (this.velocity.y < -this.speedMAX) this.velocity.y = -this.speedMAX;
	}
	else {
		this.velocity.y *= 0.98;
		if (this.velocity.y < 0.01 && this.velocity.y > -0.01) this.velocity.y = 0;
	}
	if (this.input.x != 0 || this.input.y != 0) {
		this.addParticles(this.x, this.y);
		this.addParticles(this.x + 35, this.y - 30);
	}

	for (var i = 0; i < this.parts.length; i++) {
		this.parts[i].x += this.parts[i].speedX;
	}

	this.x += this.velocity.x;
	this.y += this.velocity.y;

	if (this.automation > 0 && this.automation < this.automationMAX) {
		this.automation--;
	}
	if (this.automation < 0 && this.automation > -this.automationMAX) {
		this.automation++;
	}
	//console.log(this.velocity.x);
	this.y += this.gravity;
};

Player.prototype.draw = function () {
	for (var i = 0; i < this.parts.length; i++) {
		this.display.canvas.ctx.drawImage(this.parts[i].img, this.parts[i].x, this.parts[i].y);
	}
	this.display.canvas.ctx.drawImage(this.sprite, this.x, this.y);
};