function GameObject(name, parent) {
	if (parent) this.parent = parent;

	this.name = name;
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	
}

GameObject.prototype.setSprite = function (img) {
	this.sprite = img;
};

GameObject.prototype.setWidth = function (newWidth) {
	this.width = newWidth;
};

GameObject.prototype.setHeight = function (newHeight) {
	this.height = newHeight;
};

GameObject.prototype.moveToPoint = function (point) {
	this.x = point.x;
	this.y = point.y;
};