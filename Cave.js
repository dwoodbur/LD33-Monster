function Cave(x,y) {
	this.x = x;
	this.y = y;
	this.width = 400;
	this.height = 200;
	
	this.img = new Image();
	this.img.src = "cave1.png";
	
	this.draw = function() {
		ctx.drawImage(this.img, cameraX+this.x, cameraY+this.y);
	};
	
}
