function Display(name, width, height, parent) {

	this.canvas = document.createElement("canvas");
	this.canvas.id = name;
	this.canvas.classList.add(name, 'layerModel');
	this.canvas.ctx = this.canvas.getContext("2d");
	this.canvas.width = width;
	this.canvas.height = height;
	this.pixelRatio = Math.floor((width / height) * 10) / 10;
	this.center = {
		x: this.canvas.width / 2,
		y: this.canvas.height / 2
	};
	this.layers = [];
	this.bgAlpha = 1;
	this.scale = {
		x: 1,
		y: 1,
		delta: 0
	};
	parent.block.appendChild(this.canvas);

}

Display.prototype.ClearScreen = function () {
	this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};


Display.prototype.fade = function (speed) {
	var curSpeed = 0.3 / 60;
	if (speed) {
		curSpeed = speed / 60;
	}
	if (this.bgAlpha > 0) {
		this.bgAlpha -= curSpeed;
		this.setBgColor('hsla(0,0%,' + 10 + '%, ' + this.bgAlpha + ')');
	}
};

Display.prototype.createImg = function (width, height) {
	var img = document.createElement("canvas");
	img.width = width;
	img.height = height;
	img.ctx = img.getContext('2d');

	return img;
};

Display.prototype.setBgColor = function (color) {
	var img = {};
	img.sprite = this.createImg(this.canvas.width, this.canvas.height);
	img.sprite.globalAlpha = 1;
	img.sprite.ctx.fillStyle = color;
	img.sprite.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	this.layers[0] = img;
};

Display.prototype.fadeColorOverflowLayer = function (layers) {
	if (layers[0].opacity > 0) {
		layers[0].opacity -= 0.01;
		layers[0].sprite.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		layers[0].sprite.ctx.fillStyle = 'hsla(0,0%,' + 10 + '%, ' + layers[0].opacity + ')';
		layers[0].sprite.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}
};

Display.prototype.addColorOverflowLayer = function () {
	var newLayer = {};
	newLayer.x = 0;
	newLayer.y = 0;
	newLayer.opacity = 1;
	newLayer.faded = true;
	newLayer.animated = true;
	newLayer.width = this.canvas.width;
	newLayer.height = this.canvas.height;
	newLayer.sprite = this.createImg(newLayer.width, newLayer.height);
	newLayer.sprite.ctx.fillStyle = 'hsla(0,0%,' + 10 + '%, ' + newLayer.opacity + ')';
	newLayer.sprite.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	return this.layers.push(newLayer) - 1;
};


Display.prototype.addLayer = function (img) {
	var newLayer = {};
	newLayer.x = 0;
	newLayer.y = 0;
	newLayer.opacity = 1;
	newLayer.faded = true;
	newLayer.animated = false;
	newLayer.width = this.canvas.width;
	newLayer.height = this.canvas.height;
	newLayer.sprite = this.createImg(newLayer.width, newLayer.height);
	newLayer.sprite.ctx.drawImage(img, newLayer.x, newLayer.y, newLayer.width, newLayer.height);
	return this.layers.push(newLayer) - 1;
};


Display.prototype.addAnimatedLayer = function (img) {
	var newLayer = {};
	newLayer.x = 0;
	newLayer.y = 0;
	newLayer.opacity = 0;
	newLayer.faded = true;
	newLayer.animated = true;
	newLayer.width = this.canvas.width;
	newLayer.height = this.canvas.height;
	newLayer.sprite = this.createImg(newLayer.width, newLayer.height);
	newLayer.sprite.ctx.drawImage(img, newLayer.x, newLayer.y, newLayer.width, newLayer.height);
	return this.layers.push(newLayer) - 1;
};

Display.prototype.animateLayer = function (layers) {

	for (var i = 1; i < layers.length; i++) {
		var layer = layers[i];
		if (layer.animated) {
			var step = {};
			step.aspect = 0.7;
			step.value = 0.5;
			step.opacity = 0.001;
			layer.x -= step.value / 2;
			layer.y -= step.value * step.aspect / 2;
			layer.width += step.value;
			layer.height += step.value * step.aspect;

			if (layer.faded && layer.opacity < 1) {
				layer.opacity += step.opacity;
				if (layer.opacity > 1 && layers.length < 3) {
					this.addAnimatedLayer(layer.sprite);
					layer.faded = false;
				}
			}

			if (!layer.faded) {
				layer.opacity -= step.opacity;
				if (layer.opacity <= 0) {
					layer.opacity = 0;
					layers.splice(i, 1);
				}
			}
		}

	}


};

Display.prototype.draw = function () {
	if (this.layers.length > 0) {
		this.ClearScreen();
		for (var i = 0; i < this.layers.length; i++) {
			var obj = this.layers[i];
			this.canvas.ctx.globalAlpha = obj.opacity;
			this.canvas.ctx.drawImage(obj.sprite, obj.x, obj.y, obj.width, obj.height);
			this.canvas.ctx.globalAlpha = 1;
		}
	}
};
