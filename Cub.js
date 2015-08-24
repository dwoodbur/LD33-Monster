function Cub(x,y) {
	this.x = x;
	this.y = y;
	this.width = 35;
	this.height = 35;
	
	this.speech = null;
	
	this.imgfront1 = new Image();
	this.imgfront1.src = "cub1front.png";
	
	this.draw = function() {
		ctx.drawImage(this.imgfront1, cameraX+this.x, cameraY+this.y);
		//ctx.fillStyle = "#FFFF33";
		//ctx.fillRect(cameraX+this.x, cameraY+this.y, this.width, this.height);
		
		if(this.speech != null) {
			if(this.speech.duration <= 0)
				this.speech = null;
		}
	};
	
	this.speak = function(text,dur,side) {
		this.speech = new Speech(cameraX+this.x, cameraY+this.y, this.width, text, dur, side);
	};
	
	this.runDown = function() {
		this.y += 6;
	}
	
	
	
}
