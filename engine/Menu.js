function Menu(parent) {

	this.menu = new BlockModel("mainMenu", parent.width, parent.height, parent);
	this.menu.active = false;
	this.menu.opacity = 0;

	this.options = new OptionsMenu("optionsMenu", 400, 350, this.menu);

	var playBtn = new BlockModel('play', 150, 35, this.menu);
	var optionsBtn = new BlockModel('options', 150, 35, this.menu);
	var quitBtn = new BlockModel('quit', 150, 35, this.menu);

	this.menu.buttons = [
		playBtn,
		optionsBtn,
		quitBtn
	];

	for (var i = 0; i < this.menu.buttons.length; i++) {
		this.menu.buttons[i].addClass('menuBtn');
		this.menu.buttons[i].block.innerHTML = this.menu.buttons[i].block.id;
		this.menu.buttons[i].setLeft(this.menu.width / 2 - this.menu.buttons[i].width / 2);
		this.menu.buttons[i].setTop(this.menu.height / 2 - this.menu.buttons[i].height / 2 + i * 1.2 * this.menu.buttons[i].height);
	}

	document.addEventListener('click', onMenuClick.bind(this));
	function onMenuClick(event) {
		switch (event.target.id) {
			case 'play':
				//событие при клике на кнопку играть
				var menuPlayEvent = new Event('menuPlayEvent');
				document.dispatchEvent(menuPlayEvent);
				break;
			case 'options':
				//событие при клике на кнопку опции
				var menuOptionsEvent = new Event('menuOptionsEvent');
				document.dispatchEvent(menuOptionsEvent);
				this.options.toggle();
				break;
			case 'quit':
				//событие при клике на кнопку выход
				var menuQuitEvent = new Event('menuQuitEvent');
				document.dispatchEvent(menuQuitEvent);
				break;

		}
	}

}

Menu.prototype.setActive = function (state) {
	this.menu.active = state;
};


Menu.prototype.update = function (state) {
	if (this.menu.active) {
		this.options.update(state);
		//show menu
		this.menu.block.style.display = 'block';
		if (this.menu.opacity < 1) {
			this.menu.opacity += 0.05;
		}
		if (this.menu.opacity >= 1) {
			this.menu.opacity = 1;
		}

	} else if (!this.menu.active) {
		//hide menu
		if (this.menu.opacity > 0) {
			this.menu.opacity -= 1;
		}
		if (this.menu.opacity <= 0) {
			this.menu.opacity = 0;
			this.menu.block.style.display = 'none';
		}
	}
	this.menu.block.style.opacity = this.menu.opacity;
};

Menu.prototype.draw = function () {


};