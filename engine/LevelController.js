function LevelController(display, player) {
	this.display = display;
	this.speed = 1;
	this.parallax = 0.25;
	this.levelDistanceMax = 100000;
	this.odometr = 0;

	this.asteroids = [];
	this.asteroidsTimer = 0;
	this.logTimer = 0;
	this.textBg = [];
	this.destroed = [];
	this.gravity = 2.5;
	this.stageComplit = false;
	this.destroedPlayer = [];
	this.setGUI();

	this.player = player;
	document.addEventListener('playerSpeedLimit', this.onPlayerSpeedLimit.bind(this));
	document.addEventListener('playerSpeedNormal', this.onPlayerSpeedNormal.bind(this));
}
LevelController.prototype.onPlayerSpeedNormal = function () {
	if (this.speed > 1)
		this.speed -= 0.025;
};
LevelController.prototype.onPlayerSpeedLimit = function () {
	if (this.speed < 10)
		this.speed += 0.095;
};

LevelController.prototype.destroyPlayer = function () {
	console.log('test');
	var parts = [];
	var w = 10;
	var h = 4;
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var canvas = document.createElement("canvas");
			canvas.ctx = canvas.getContext("2d");
			canvas.width = this.player.sprite.width / 10;
			canvas.height = this.player.sprite.height / 4;
			canvas.rotationSpeed = randomRange(5, 25);
			canvas.angle = randomRange(5, 65);
			canvas.x = x * canvas.width + this.player.sprite.x;
			canvas.y = y * canvas.width + this.player.sprite.y;
			canvas.partDir = {
				x: randomRange(-1, 1),
				y: randomRange(-1, 1)
			};
			canvas.velocity = {
				x: randomRange(2, 4) * canvas.partDir.x,
				y: randomRange(2, 4) * canvas.partDir.y
			};
			canvas.ctx.drawImage(this.player.sprite, x * canvas.width, y * canvas.width, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
			parts.push(canvas);
		}
	}
	this.destroedPlayer.push(parts);
};
LevelController.prototype.destroyObject = function (array, index) {
//создать 16 канвасов для отрисовки разорвавшихся частей
	var obj = array.splice(index, 1);
	var parts = [];
	var w = 4;
	var h = 4;
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var canvas = document.createElement("canvas");
			canvas.ctx = canvas.getContext("2d");
			canvas.width = obj[0].width / 4;
			canvas.height = obj[0].height / 4;
			canvas.rotationSpeed = randomRange(5, 25);
			canvas.angle = randomRange(5, 65);
			canvas.x = x * canvas.width + obj[0].x;
			canvas.y = y * canvas.width + obj[0].y;
			canvas.partDir = {
				x: randomRange(-1, 1),
				y: randomRange(-1, 1)
			};
			canvas.velocity = {
				x: randomRange(2, 4) * canvas.partDir.x,
				y: randomRange(2, 4) * canvas.partDir.y
			};
			canvas.ctx.drawImage(obj[0], x * canvas.width, y * canvas.width, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
			parts.push(canvas);
		}
	}
	this.destroed.push(parts);
};

LevelController.prototype.setLayerBg = function (img) {
	this.scrollBg = [];
	for (var i = 0; i < 2; i++) {
		var scrollBg = {};
		scrollBg.img = img;
		scrollBg.x = i * img.width;
		scrollBg.y = -(this.display.canvas.height / 2);
		this.scrollBg.push(scrollBg);
	}
};

LevelController.prototype.setSprites = function (sprites) {
	this.sprites = sprites;
};

LevelController.prototype.setScrollBg = function (img) {
	this.scrollLayer = [];
	for (var i = 0; i < 2; i++) {
		var scrollBg = {};
		scrollBg.img = img;
		scrollBg.x = i * img.width;
		scrollBg.y = 0;
		this.scrollLayer.push(scrollBg);
	}
};

LevelController.prototype.addAsteroid = function () {
	var asteroid = document.createElement("canvas");
	asteroid.x = this.display.canvas.width;
	asteroid.y = randomRange(0, 540);
	asteroid.size = randomRange(15, 75);
	asteroid.damage = asteroid.size / 10;
	asteroid.width = asteroid.size;
	asteroid.height = asteroid.size;
	asteroid.hip = asteroid.size;
	asteroid.rotationSpeed = randomRange(1, 8);
	asteroid.angle = randomRange(5, 65);
	asteroid.ctx = asteroid.getContext('2d');
	asteroid.ctx.globalAlpha = 1;
	asteroid.ctx.drawImage(this.sprites[7], 0, 0, asteroid.width, asteroid.height);

	if (this.asteroids.length < 15) {
		this.asteroids.push(asteroid);
	}
};

LevelController.prototype.addText = function (textData) {
	var text = document.createElement("canvas");
	text.x = this.display.canvas.width;
	text.y = this.display.canvas.height / 2;
	text.ctx = text.getContext('2d');
	text.width = 300;
	text.height = 300;
	text.ctx.globalAlpha = 0.15;
	text.ctx.textBaseline = "top";
	text.ctx.textAlign = "left";
	text.ctx.font = "64px Play";
	text.ctx.fillStyle = '#e48c21';
	text.ctx.fillText(textData, 0, 0);
	this.textBg.push(text);

};

LevelController.prototype.checkCollisions = function (obj1, obj2) {

	var p = this.player;
	for (var i = 0; i < this.asteroids.length; i++) {
		var asteroid = this.asteroids[i];
		if (p.x < asteroid.x + asteroid.size && p.x + p.width - 28 > asteroid.x &&
			p.y < asteroid.y + asteroid.size && p.y + p.height > asteroid.y) {
			p.armor -= Math.floor(asteroid.damage);
			p.onHitStartTimer();			
			if (p.armor <= 0)this.destroyPlayer();
			this.destroyObject(this.asteroids, i);
		}
	}
	if (obj1 != undefined && obj2 != undefined) {
		return (obj1.getPos().x < obj2.x + obj2.width && obj1.getPos().x + obj1.width > obj2.x &&
		obj1.getPos().y < obj2.y + obj2.height && obj1.getPos().y + obj1.height > obj2.y);
	}
};
LevelController.prototype.setGUI = function () {
	this.gui = document.createElement("canvas");
	this.gui.x = 0;
	this.gui.y = 0;
	this.gui.ctx = this.gui.getContext('2d');
	this.gui.width = this.display.canvas.width;
	this.gui.height = this.display.canvas.height;
	this.gui.ctx.globalAlpha = 1;
	this.gui.ctx.textBaseline = "top";
	this.gui.ctx.textAlign = "left";
	this.gui.ctx.fillStyle = '#e48c21';
	this.gui.ctx.font = "16px Play";
};
LevelController.prototype.updateGUI = function () {

	this.gui.ctx.clearRect(0, 0, this.gui.width, this.gui.height);
	this.gui.ctx.fillText('БРОНЯ: ' + this.player.armor, 10, 150);
	this.gui.ctx.fillText('Пролетел: ' + this.odometr + '(' + this.levelProgress + '%)', 10, 500);


};
LevelController.prototype.drawGUI = function () {
	//БРОНЯ
	this.display.canvas.ctx.drawImage(this.gui, 0, 0);

};
LevelController.prototype.addHint = function (text, x, y) {

	this.gui.ctx.fillText(text, x, y);
};
LevelController.prototype.update = function () {
	if (this.asteroidsTimer > 60 && !this.stageComplit) {
		this.addAsteroid();
		this.asteroidsTimer = 0;
	}
	this.asteroidsTimer++;
	var i;
	if (this.textBg.length > 0) {
		for (i = 0; i < this.textBg.length; i++) {
			this.textBg[i].x -= this.speed * this.parallax;
			if (this.textBg[i].x < -this.textBg[i].width) {
				this.textBg.shift();
			}
		}
	}

	for (i = 0; i < this.scrollLayer.length; i++) {
		if (this.scrollLayer[i].x < -(this.scrollLayer[i].img.width)) {
			this.scrollLayer[i].x = this.scrollLayer[i].img.width;
		}
		this.scrollLayer[i].x -= this.speed;
		if (this.levelProgress <= 100) {
			this.odometr = (Math.floor((this.odometr + this.speed) * 100)) / 100;
		}

	}

	for (i = 0; i < this.asteroids.length; i++) {
		this.asteroids[i].x -= this.speed * 1.15;
		this.asteroids[i].angle += this.asteroids[i].rotationSpeed;
		if (this.asteroids[i].x < -this.asteroids[i].width) {
			this.asteroids.splice(i, 1);
		}
	}
	for (i = 0; i < this.scrollBg.length; i++) {
		if (this.scrollBg[i].x < -(this.scrollBg[i].img.width)) {
			this.scrollBg[i].x = this.scrollBg[i].img.width;
		}
		this.scrollBg[i].x -= this.speed * this.parallax;
	}
	if (this.asteroids.length > 0) {
		this.checkCollisions();
		this.player.onHit();
	}

	if (this.player.bullets.length > 0) {
		for (i = 0; i < this.player.bullets.length; i++) {
			this.player.bullets[i].update();
			if (this.player.bullets[i].getPos().x > this.display.canvas.width * 1.5) {
				this.player.bullets.splice(i, 1);
			} else {
				if (this.asteroids.length > 0) {
					for (var k = 0; k < this.asteroids.length; k++) {
						if (this.checkCollisions(this.player.bullets[i], this.asteroids[k])) {
							this.asteroids[k].hip -= this.player.bullets[i].damage;
							this.player.bullets.splice(i, 1);
							if (this.asteroids[k].hip <= 0)
								this.destroyObject(this.asteroids, k);
						}
					}
				}
			}
		}
	}
	if (this.destroed.length > 0) {
		for (var d = 0; d < this.destroed.length; d++) {
			for (var p = 0; p < this.destroed[d].length; p++) {
				this.destroed[d][p].x += this.destroed[d][p].velocity.x;
				this.destroed[d][p].x -= this.speed;
				this.destroed[d][p].y += this.destroed[d][p].velocity.y;
				this.destroed[d][p].y += this.gravity;
				this.destroed[d][p].angle += this.destroed[d][p].rotationSpeed;
			}
		}
	}
	if (this.destroedPlayer.length > 0) {
		for (var pd = 0; pd < this.destroedPlayer.length; pd++) {
			for (var pp = 0; pp < this.destroedPlayer[pd].length; pp++) {
				this.destroedPlayer[pd][pp].x += this.destroedPlayer[pd][pp].velocity.x;
				this.destroedPlayer[pd][pp].x -= this.speed;
				this.destroedPlayer[pd][pp].y += this.destroedPlayer[pd][pp].velocity.y;
				this.destroedPlayer[pd][pp].y += this.gravity;
				this.destroedPlayer[pd][pp].angle += this.destroedPlayer[pd][pp].rotationSpeed;
			}
		}
	}

	this.levelProgress = (Math.floor(((this.odometr / this.levelDistanceMax) * 100) * 100)) / 100;
	if ((this.levelProgress % 5 != 0) && this.textBg.length < 1 && this.levelProgress <= 100) {
		this.addText(Math.floor(this.levelProgress) + "%");
	}

	if (this.logTimer > 20) {
		if (this.levelProgress >= 100 && this.asteroids.length == 0) {
			this.levelProgress = 100;
			this.player.gravity = 0;
			this.updateGUI();
			this.addHint("Уровень пройден", this.display.canvas.width / 2, this.display.canvas.height / 2);
			this.stageComplit = true;
		}
		if (!this.stageComplit) {
			this.updateGUI();
			if (this.speed > 0 && this.speed <= 1) {
				this.addHint("Жми -> или D, чтобы ускориться", this.display.canvas.width / 2, this.display.canvas.height / 2 - 60);
				this.addHint("Жми SPACE, чтобы стрелять", this.display.canvas.width / 2, this.display.canvas.height / 2 + 60);
			}
			if (this.speed < 3) {
				this.addHint("Ускоряйся, чтобы лететь быстрее!", this.display.canvas.width / 2, this.display.canvas.height / 2);
			}
		}
		this.logTimer = 0;
	}
	this.logTimer++;

};
LevelController.prototype.draw = function () {
	var i;

	for (i = 0; i < this.scrollBg.length; i++) {
		this.display.canvas.ctx.drawImage(this.scrollBg[i].img, this.scrollBg[i].x, this.scrollBg[i].y);
	}
	if (this.textBg.length > 0) {
		for (i = 0; i < this.textBg.length; i++) {
			this.display.canvas.ctx.drawImage(this.textBg[i], this.textBg[i].x, this.textBg[i].y);
		}
	}
	for (i = 0; i < this.scrollLayer.length; i++) {
		this.display.canvas.ctx.globalAlpha = 0.45;
		this.display.canvas.ctx.drawImage(this.scrollLayer[i].img, this.scrollLayer[i].x, this.scrollLayer[i].y);
		this.display.canvas.ctx.globalAlpha = 1;
	}
	for (i = 0; i < this.asteroids.length; i++) {
		var dx = this.asteroids[i].x + this.asteroids[i].width / 2;
		var dy = this.asteroids[i].y + this.asteroids[i].height / 2;
		var a = this.asteroids[i].angle * (Math.PI / 180);
		this.display.canvas.ctx.save();
		this.display.canvas.ctx.translate(dx, dy);
		this.display.canvas.ctx.rotate(a);
		this.display.canvas.ctx.translate(-dx, -dy);
		this.display.canvas.ctx.drawImage(this.asteroids[i], this.asteroids[i].x, this.asteroids[i].y);
		this.display.canvas.ctx.restore();
	}
	if (this.destroed.length > 0) {
		for (var d = 0; d < this.destroed.length; d++) {
			for (var p = 0; p < this.destroed[d].length; p++) {
				var pdx = this.destroed[d][p].x + this.destroed[d][p].width / 2;
				var pdy = this.destroed[d][p].y + this.destroed[d][p].height / 2;
				var pa = this.destroed[d][p].angle * (Math.PI / 180);
				this.display.canvas.ctx.save();
				this.display.canvas.ctx.translate(pdx, pdy);
				this.display.canvas.ctx.rotate(pa);
				this.display.canvas.ctx.translate(-pdx, -pdy);
				this.display.canvas.ctx.drawImage(this.destroed[d][p], this.destroed[d][p].x, this.destroed[d][p].y);
				this.display.canvas.ctx.restore();
			}
		}
	}
	if (this.player.bullets.length > 0) {
		for (i = 0; i < this.player.bullets.length; i++) {
			this.player.bullets[i].draw(this.display.canvas);
		}
	}
	if (this.destroedPlayer.length > 0) {
		for (var h = 0; h < this.destroedPlayer.length; h++) {
			for (var j = 0; j < this.destroedPlayer[h].length; j++) {
				var dpdx = this.destroedPlayer[h][j].x + this.destroedPlayer[h][j].width / 2;
				var dpdy = this.destroedPlayer[h][j].y + this.destroedPlayer[h][j].height / 2;
				var dpa =  this.destroedPlayer[h][j].angle * (Math.PI / 180);
				this.display.canvas.ctx.save();
				this.display.canvas.ctx.translate(dpdx, dpdy);
				this.display.canvas.ctx.rotate(dpa);
				this.display.canvas.ctx.translate(-dpdx, -dpdy);
				this.display.canvas.ctx.drawImage(this.destroedPlayer[h][j], this.destroedPlayer[h][j].x, this.destroedPlayer[h][j].y);
				this.display.canvas.ctx.restore();
			}
		}

	}
	this.drawGUI();
};