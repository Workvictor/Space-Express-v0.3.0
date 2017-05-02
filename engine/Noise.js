//генератор статического шума, для усиления эффекта кинематографичности
function Noise(width, height, parent) {

	//создадим новый дисплей, для отображения шума
	this.noise = new Display("noise", width, height, parent);
	//настройки шумоф
	this.noise.framesMax = 16;
	this.noise.radius = 1;//не использовать меньше 1, лучший вариант 1, при значении выше шум выглядит плохо
	this.noise.alpha = 0.1;
	this.noise.period = 2;
	//настройки шумоф
	this.noise.canvas.ctx.scale(this.noise.radius, this.noise.radius);
	this.noise.READY = false;
	this.noise.lines = [];
	this.noise.frames = [];
	this.noise.frameToDraw = 0;
	this.noise.grid = {
		width: Math.floor(width / this.noise.radius),
		height: Math.floor(height / this.noise.radius)
	};

}

Noise.prototype.createImg = function (width, height) {
	var img = document.createElement("canvas");
	img.width = width;
	img.height = height;
	img.ctx = img.getContext('2d');

	return img;
};

//разбиваем на состовляющие для повышения производительности

Noise.prototype.generateLine = function (width) {
	//генерируем линию с шумом
	var line = this.createImg(width, this.noise.radius);
	for (var x = 0; x < width; x++) {
		line.ctx.fillStyle = this.randomColor();
		line.ctx.fillRect(x * this.noise.radius, 0, this.noise.radius, this.noise.radius);
	}

	return line;
};

Noise.prototype.pushLines = function () {
	//заполняем массив с линиями
	this.noise.lines.push(this.generateLine(this.noise.grid.width));
};


Noise.prototype.generateFrame = function (width, height) {
	//создаем фрэйм
	var frame = this.createImg(width, height);
	var repeatHold = this.noise.lines.slice();

	for (var y = 0; y < height; y++) {
		if (y % this.noise.period == 0) {
			frame.ctx.fillStyle = this.lineColor(0);
			frame.ctx.fillRect(0, y, width, this.noise.radius);
		} else {
			var randomLine = repeatHold.splice(randomRange(0, repeatHold.length), 1);
			frame.ctx.drawImage(randomLine[0], 0, y);
		}
	}

	return frame;

};

Noise.prototype.pushFrames = function () {
	//заполняем массив фрэймов
	this.noise.frames.push(this.generateFrame(this.noise.grid.width, this.noise.grid.height));
};

Noise.prototype.generateFrameRandomly = function (width, height) {
	var frame = this.createImg(width, height);
	for (var y = 0; y < height; y++) {
		if (y % this.noise.period == 0) {
			frame.ctx.fillStyle = this.lineColor(0);
			frame.ctx.fillRect(0, y, width, this.noise.radius);
		} else {
			var line = this.generateLine(width);
			frame.ctx.drawImage(line, 0, y);
		}
	}
};

Noise.prototype.drawFrame = function (frame, x, y) {
	this.noise.canvas.ctx.drawImage(frame, x, y);
};

Noise.prototype.hotLoad = function (img) {
	//для подгрузки в память холста
	this.noise.canvas.ctx.drawImage(img, 0, 0);
	this.noise.ClearScreen();//унаследовано от дисплея
};

Noise.prototype.randomColor = function () {
	return 'hsla(0,0%,' + Math.floor((Math.random() * 100)) + '%, ' + this.noise.alpha + ')';
};

Noise.prototype.lineColor = function (color) {
	return 'hsla(0,0%,' + color + '%, ' + this.noise.alpha * 3 + ')';
};

Noise.prototype.setReady = function (state) {
	this.noise.READY = state;
};

Noise.prototype.Update = function () {
	//всего будет два состояния. Шумы созданы и шумы не созданы
	//проверим их
	if (this.noise.frames.length != this.noise.framesMax) {
		//шумы несозданы. Создаем их
		//проверим созданы ли составляющие
		if (this.noise.lines.length < this.noise.grid.height / this.noise.period) {
			this.pushLines();
		}
		if (this.noise.lines.length == this.noise.grid.height / this.noise.period) {
			this.pushFrames();
		}
		//создаем событие для оповещения прогресса генерации
		var generateProgress = new CustomEvent("generateProgress", {
			detail: {
				progress: Math.floor(((this.noise.lines.length + this.noise.frames.length) / ((this.noise.grid.height / this.noise.period) + this.noise.framesMax)) * 100)
			}
		});
		document.dispatchEvent(generateProgress);
	} else if ((this.noise.frames.length == this.noise.framesMax) && this.noise.READY) {
		//шумы созданы
		this.noise.ClearScreen();//унаследовано от дисплея
		this.drawFrame(this.noise.frames[this.noise.frameToDraw], 0, 0);
		this.noise.frameToDraw++;
		if (this.noise.frameToDraw == this.noise.framesMax) this.noise.frameToDraw = 0;
	}

};

