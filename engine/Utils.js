function importScript(name, fromDir) {
	var srcPathDefault = 'engine/';
	if (!fromDir) {
		fromDir = srcPathDefault;
	}

	if (typeof name === 'string') {
		var head = document.getElementsByTagName("head")[0];
		var scriptNode = document.createElement("script");
		scriptNode.src = fromDir + name;
		head.insertBefore(scriptNode, head.firstChild);

		var importCounter = new Event("importCounter");
		document.dispatchEvent(importCounter);

		scriptNode.onload = function () {
			var imported = new Event("imported");
			document.dispatchEvent(imported);
		}
	}
}

function importer() {
	var progress = 0;
	var loaded = 0;
	var total = 0;
	document.addEventListener("importCounter", onImportStart);
	document.addEventListener("imported", onImportProgress);
	function onImportStart() {
		total++;
	}

	function onImportProgress() {
		loaded++;
		progress = Math.floor((loaded / total) * 100);
		document.body.innerHTML = ('Import progress--' + progress + '%');
		//удалить обработчики событий
		if (progress == 100) {
			document.body.innerHTML = ('');
			document.removeEventListener("importCounter", onImportStart);
			document.removeEventListener("imported", onImportProgress);
			main();
		}

	}
}

function Canvas(name, width, height) {
	var error = document.getElementById(name);
	if (error) {
		name = name + randomSeed();
	}
	var canvas = document.createElement("canvas");
	canvas.id = name;
	canvas.width = width;
	canvas.height = height;
	document.body.insertBefore(canvas, document.body.firstChild);
	return canvas;
}

function BlockModel(name, width, height, parent) {
	var error = document.getElementById(name);
	this.block = document.createElement("div");
	this.block.classList.add(name, 'blockModel');
	if (error) {
		name = name + randomSeed();
	}
	this.block.id = name;
	this.width = width;
	this.height = height;
	this.block.style.width = width + 'px';
	this.block.style.height = height + 'px';
	parent.block.appendChild(this.block);
}
BlockModel.prototype.setLeft = function (left) {
	this.block.style.left = left + 'px';
};
BlockModel.prototype.setRight = function (right) {
	this.block.style.right = right + 'px';
};
BlockModel.prototype.setTop = function (top) {
	this.block.style.top = top + 'px';
};
BlockModel.prototype.setBottom = function (bottom) {
	this.block.style.bottom = bottom + 'px';
};
BlockModel.prototype.addClass = function (className) {
	this.block.classList.add(className);
};

function setLayer(obj, layer) {
	obj.layer = layer;
	obj.classList.add(layer);
}

function randomSeed() {
	return Date.now();
}
function randomRange(min, max) {
	return Math.floor(min + (Math.random() * (max - min)));
}
function Body(name) {
	this.block = document.getElementsByTagName("body")[0];
	this.block.id = "body";
}
function pattern(width, height, color) {
	var pattern = document.createElement("canvas");
	pattern.width = width;
	pattern.height = height;
	pattern.ctx = pattern.getContext('2d');
	pattern.ctx.globalAlpha = 0.1;
	pattern.ctx.strokeStyle = color;

	pattern.ctx.beginPath();
	pattern.ctx.moveTo(0, height / 2);
	pattern.ctx.lineTo(width, height / 2);
	pattern.ctx.moveTo(width / 2, height);
	pattern.ctx.lineTo(width / 2, 0);
	pattern.ctx.stroke();


	return pattern.toDataURL("image/png");

}
