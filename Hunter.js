function Hunter(x,y) {
	this.x = x;
	this.y = y;
	this.width = 60;
	this.height = 25;
	this.speed = 4;
	
	this.speech = null;
	
	this.imgfront1 = new Image();
	this.imgback1 = new Image();
	
	this.imgfront1.src = "hunter1front.png";
	this.imgback1.src = "hunter1back.png";
	
	this.sprite = this.imgfront1;
	this.spriteDir = "f";
	
	this.draw = function() {
		ctx.drawImage(this.sprite, cameraX+this.x, cameraY+this.y);
		
		if(this.speech != null) {
			if(this.speech.duration <= 0)
				this.speech = null;
		}
	};
	
	this.speak = function(text,dur,side) {
		this.speech = new Speech(cameraX+this.x, cameraY+this.y, this.width, text, dur, side);
	};
	
	// Movement functions
	this.moveUp = function() {
		this.y-=this.speed;
	};
	this.moveDown = function() {
		this.y+=this.speed;
	};
	this.moveLeft = function() {
		this.x-=this.speed;
	};
	this.moveRight = function() {
		this.x+=this.speed;
	};
	
	this.changeSpriteDir = function(dir) {
		switch(dir) {
			case "f":
				this.spriteDir = "f";
				this.sprite = this.imgfront1;
				break;
			case "b":
				this.spriteDir = "b";
				this.sprite = this.imgback1;
				break;
			/*case "l":
				this.spriteDir = "l";
				if(this.crouched)
					this.sprite = this.imgleftdown1;
				else this.sprite = this.imgleft1;
				break;
			case "r":
				this.spriteDir = "r";
				if(this.crouched)
					this.sprite = this.imgrightdown1;
				else this.sprite = this.imgright1;
				break;*/
			
		}
	};
	
}
