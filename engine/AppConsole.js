function AppConsole(parent) {
	var height = 80;
	var widthShrink = 200;
	var width = parent.width - widthShrink;
	this.appConsole = new BlockModel('appConsole', width, height, parent);
	var img = pattern(12, 12, '#67b9ff');
	this.appConsole.block.style.cssText = 'background-image: url(' + img + ')';
	this.appConsole.block.style.width = width + 'px';
	this.appConsole.block.style.height = height + 'px';
	this.appConsole.rowHeight = 18;
	this.appConsole.maxMsgCount = 10;
	this.appConsole.childs = [];
	this.appConsole.width = width;
	this.appConsole.height = height;
	this.appConsole.setLeft(widthShrink / 2);
	this.appConsole.setBottom(0);
	this.active = false;
	this.timeActive = 0;
	this.timeToDeactivate = 180;//прячем консоль, если не выводяться сообщения
	this.posY = -(this.appConsole.height + 20);
	this.posHide = -(this.appConsole.height + 20);
	this.BUSY = false;
}

AppConsole.prototype.setActive = function (state) {
	this.active = state;
	this.timeActive = 0;
};

AppConsole.prototype.addMsg = function (text) {

	this.active = true;
	this.timeActive = 0;
	var msg = new BlockModel('appMsg', (this.appConsole.width - 100), this.appConsole.rowHeight, this.appConsole);
	msg.block.innerHTML = text;
	//при добавлении нового сообщения нужно сдвинуть старые сообщения вниз на высоту строки
	msg.posY = -this.appConsole.rowHeight;
	for (var i = 0; i < this.appConsole.childs.length; i++) {
		if (this.appConsole.childs[i].posY < 0) {
			msg.posY = this.appConsole.childs[i].posY - this.appConsole.rowHeight;
		}
	}

	this.appConsole.childs.push(msg);

	var parent = this.appConsole.block;
	parent.insertBefore(msg.block, parent.firstChild);

	return msg;//возвращаем ссылку на сообщения для возможности обращаться именно к этому сообщению


};

AppConsole.prototype.editMsg = function (msgId, text) {
	for (var i = 0; i < this.appConsole.childs.length; i++) {
		if (this.appConsole.childs[i].block.id == msgId) {
			this.appConsole.childs[i].block.innerHTML = text;
		}
	}

};

AppConsole.prototype.Update = function () {
	var hasNewRow = false;
	var i;
	this.show();
	if (this.timeActive >= this.timeToDeactivate) {
		this.hide();
		this.active = false;
	}
	for (i = 0; i < this.appConsole.childs.length; i++) {
		if (this.appConsole.childs[i].posY < 0) {
			hasNewRow = true;
		}
	}
	if (hasNewRow) {
		for (i = 0; i < this.appConsole.childs.length; i++) {
			this.appConsole.childs[i].posY += 1;
			this.appConsole.childs[i].block.style.top = this.appConsole.childs[i].posY + 'px';
		}
	} else if (this.appConsole.childs.length > this.appConsole.maxMsgCount) {
		//удаляем старые сообщения
		this.appConsole.block.removeChild(document.getElementById(this.appConsole.childs.shift().block.id));
	}
	else if (this.timeActive <= this.timeToDeactivate) {
		this.timeActive++;
	}
};

AppConsole.prototype.show = function () {
	if (this.active && this.posY <= 0) {
		this.posY += 4;
		if (this.posY > 0) this.posY = 0;
		this.appConsole.block.style.bottom = this.posY + 'px';
	}
};
AppConsole.prototype.hide = function () {
	if (this.posY > this.posHide) {
		this.posY -= 0.5;
		this.appConsole.block.style.bottom = this.posY + 'px';
	}
};
