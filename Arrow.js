function Arrow(x,y) {
	this.x = x;
	this.y = y;
	
	
	this.draw = function() {
		ctx.fillStyle = "#993300";
		ctx.fillRect(cameraX+this.x, cameraY+this.y, 5, 35);
	};
	
}
