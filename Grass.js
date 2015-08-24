function Grass(x,y) {
	this.x = x;
	this.y = y;
	this.width = 100;
	this.height = 60;
	
	var img = new Image();
	img.src = "grass2.png";
	
	this.draw = function() {
		//ctx.drawImage(img, x, y);
	};
	
}
