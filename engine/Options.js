function OptionsMenu(name, width, height, parent) {
	this.state = 'options';
	this.optionsMenu = new BlockModel(name, width, height, parent);
	this.optionsMenu.active = false;
	var img = pattern(12, 12, '#67b9ff');
	this.optionsMenu.block.style.cssText = 'background-image: url(' + img + ')';
	this.optionsMenu.block.style.width = width + 'px';
	this.optionsMenu.block.style.height = height + 'px';
	this.optionsMenu.block.innerHTML = 'options';
	this.optionsMenu.offsetRightShow = -(parent.width / 2 - width / 2);
	this.optionsMenu.offsetRightHide = -(parent.width / 2 - this.optionsMenu.offsetRightShow);
	this.optionsMenu.offsetRight = this.optionsMenu.offsetRightHide;
	this.optionsMenu.setRight(this.optionsMenu.offsetRight);
	this.optionsMenu.setTop(parent.height / 2 - height / 2);
	this.optionsMenu.hideBtn = new BlockModel('hideBtn', 20, 20, this.optionsMenu);
	this.optionsMenu.hideBtn.addClass('blockCrossBtn');
	this.optionsMenu.block.addEventListener('click', this.onOptionsClick.bind(this));
}
OptionsMenu.prototype.toggle = function () {
	switch (this.optionsMenu.active) {
		case true:
			this.optionsMenu.active = false;
			break;
		case false:
			this.optionsMenu.active = true;
			break;
	}
};
OptionsMenu.prototype.onOptionsClick = function (event) {
	switch (event.target.id) {
		case this.optionsMenu.hideBtn.block.id:
			var optionsClosed = new Event('optionsClosed');
			document.dispatchEvent(optionsClosed);
			break;
	}
};
OptionsMenu.prototype.update = function (state) {
	if (state != this.state) {
		this.hide();
		this.optionsMenu.active = false;
	}
	else if (state == 'options') {
		this.show();
		this.optionsMenu.active = true;
	}
	this.optionsMenu.setRight(this.optionsMenu.offsetRight);
};
OptionsMenu.prototype.show = function () {
	var step = 10;
	var progress = this.optionsMenu.offsetRight / this.optionsMenu.offsetRightShow;
	if (this.optionsMenu.offsetRight < this.optionsMenu.offsetRightShow) {
		if (progress < 1.75) step = 8;
		if (progress < 1.25) step = 3;
		this.optionsMenu.offsetRight += step;
		if (this.optionsMenu.offsetRight > this.optionsMenu.offsetRightShow)this.optionsMenu.offsetRight = this.optionsMenu.offsetRightShow;
	}

	this.optionsMenu.block.style.display = 'block';
};
OptionsMenu.prototype.hide = function () {
	var step = 10;
	var progress = this.optionsMenu.offsetRight / this.optionsMenu.offsetRightHide;
	if (this.optionsMenu.offsetRight > this.optionsMenu.offsetRightHide) {
		if (progress < 0.35) step = 3;
		if (progress < 0.55) step = 8;
		this.optionsMenu.offsetRight -= step;
		if (this.optionsMenu.offsetRight < this.optionsMenu.offsetRightHide)this.optionsMenu.offsetRight = this.optionsMenu.offsetRightHide;
	} else
		this.optionsMenu.block.style.display = 'none';
};