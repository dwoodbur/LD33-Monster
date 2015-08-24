function Tree(x,y, type) {
	this.x = x;
	this.y = y;
	this.type = type;
	
	this.img = new Image();
	switch(type) {
		case 1:
			this.img.src = "tree1.png";
			this.width = 150;
			this.height = 150;
			break;
	}
	
	this.draw = function() {
		ctx.drawImage(this.img, cameraX+this.x, cameraY+this.y);
	};
	
	
}
