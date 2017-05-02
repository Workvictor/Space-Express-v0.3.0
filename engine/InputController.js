function InputController() {

	this.input = {};
	this.input.fire = false;
	this.input.x = 0;
	this.input.y = 0;
	this.input.left = 0;
	this.input.right = 0;
	this.input.up = 0;
	this.input.down = 0;
	this.keyCode = {
		LEFT: 37, A: 65,
		RIGHT: 39, D: 68,
		UP: 38, W: 87,
		DOWN: 40, S: 83,
		FIRE: 32
	};

	window.addEventListener('keydown', this.onKeyDown.bind(this));
	window.addEventListener('keyup', this.onKeyUp.bind(this));

}

InputController.prototype.onKeyUp = function (event) {
	switch (event.keyCode) {
		case this.keyCode.LEFT:
		case this.keyCode.A:
			this.input.left = 0;
			break;
		case this.keyCode.RIGHT:
		case this.keyCode.D:
			this.input.right = 0;
			break;
		case this.keyCode.UP:
		case this.keyCode.W:
			this.input.up = 0;
			break;
		case this.keyCode.DOWN:
		case this.keyCode.S:
			this.input.down = 0;
			break;
		case this.keyCode.FIRE:
			this.input.fire = false;
			break;
	}
};
InputController.prototype.onKeyDown = function (event) {
	//console.log('test', event.keyCode);
	switch (event.keyCode) {
		case this.keyCode.LEFT:
		case this.keyCode.A:
			this.input.left = -1;
			break;
		case this.keyCode.RIGHT:
		case this.keyCode.D:
			this.input.right = 1;
			break;
		case this.keyCode.UP:
		case this.keyCode.W:
			this.input.up = -1;
			break;
		case this.keyCode.DOWN:
		case this.keyCode.S:
			this.input.down = 1;
			break;
		case this.keyCode.FIRE:
			this.input.fire = true;
			break;
	}
	switch (event.keyCode) {

		case (32):
			//console.log('fire');
			break;
		case (27):
			console.log('esc');
			break;
		case (49):
			console.log('1');
			break;
		case (50):
			console.log('2');
			break;
		case (51):
			console.log('3');
			break;
		case (52):
			console.log('4');
			break;
	}
};

InputController.prototype.update = function () {
	this.input.x = this.input.left + this.input.right;
	this.input.y = this.input.up + this.input.down;
};

