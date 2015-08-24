function Rock(x,y, type) {
	this.x = x;
	this.y = y;
	this.type = type;
	
	this.img = new Image();
	switch(type) {
		case 1:
			this.img.src = "rock1.png";
			this.width = 50;
			this.height = 30;
			break;
		case 2:
			this.img.src = "rock2.png";
			this.width = 80;
			this.height = 65;
			break;
	}
	
	this.draw = function() {
		ctx.drawImage(this.img, cameraX+this.x, cameraY+this.y);
	};
	
	
}
