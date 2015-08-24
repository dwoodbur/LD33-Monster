function Lion(x,y) {
	this.x = x;
	this.y = y;
	this.width = 60;
	this.height = 60;
	this.speed = 4;
	this.crouchSpeed = 2;
	this.sprintSpeed = 9;
	this.directionMode = "vert";
	this.spriteDir = "f";
	this.sprite;
	this.crouched = false;
	this.sprint = false;
	this.stamina = 100;
	this.staminaFallBuffer;
	this.coolDown = 0;
	this.inebriated = false;
	this.attack = true;
	
	this.speech = null;
	
	this.imgfront1 = new Image();
	this.imgback1 = new Image();
	this.imgright1 = new Image();
	this.imgleft1 = new Image();
	this.imgfrontdown1 = new Image();
	this.imgbackdown1 = new Image();
	this.imgrightdown1 = new Image();
	this.imgleftdown1 = new Image();
	
	this.imgfront1.src = "lion1front.png";
	this.imgback1.src = "lion1back.png";
	this.imgright1.src = "lion1right.png";
	this.imgleft1.src = "lion1left.png";
	this.imgfrontdown1.src = "lion1frontdown.png";
	this.imgbackdown1.src = "lion1backdown.png";
	this.imgrightdown1.src = "lion1rightdown.png";
	this.imgleftdown1.src = "lion1leftdown.png";
	
	this.sprite = this.imgfront1;
	
	this.update = function() {
		if(this.sprint && this.stamina != 0 && !this.inebriated && (keys.isPressed(37) || keys.isPressed(38) || keys.isPressed(39) || keys.isPressed(40))) {
			this.stamina--;
			if(this.stamina == 0) {
				this.inebriated = true;
				this.sprint = false;
				this.coolDown = 300;
			}
		}
		if(this.coolDown > 0) {
			this.coolDown--;
			this.sprint = false;
			if(this.coolDown == 0) {
				this.inebriated = false;
			}
		}
		if(!this.sprint && !this.inebriated && this.stamina < 100) {
			this.stamina++;
		}
	};
	
	this.draw = function() {
		ctx.drawImage(this.sprite, cameraX+this.x, cameraY+this.y);
		//ctx.fillStyle = "#993300";
		//ctx.fillRect(cameraX+this.x, cameraY+this.y, this.width, this.height);
		
		if(this.speech != null) {
			if(this.speech.duration <= 0)
				this.speech = null;
		}
		
		
		ctx.fillStyle = "#00FF00";
		ctx.fillRect(370, 5, this.stamina*3, 30);
	};
	
	this.speak = function(text,dur,side) {
		this.speech = new Speech(cameraX+this.x, cameraY+this.y, this.width, text, dur, side);
	};
	
	// Movement functions
	this.moveUp = function() {
		if(this.crouched)
			this.y-=this.crouchSpeed;
		else if(this.sprint && !this.inebriated) 
			this.y-=this.sprintSpeed;
		else this.y-=this.speed;
	};
	this.moveDown = function() {
		if(this.crouched)
			this.y+=this.crouchSpeed;
		else if(this.sprint && !this.inebriated)
			this.y+=this.sprintSpeed;
		else this.y+=this.speed;
	};
	this.moveLeft = function() {
		if(this.crouched)
			this.x-=this.crouchSpeed;
		else if(this.sprint && !this.inebriated)
			this.x-=this.sprintSpeed;
		else this.x-=this.speed;
	};
	this.moveRight = function() {
		if(this.crouched)
			this.x+=this.crouchSpeed;
		else if(this.sprint && !this.inebriated)
			this.x+=this.sprintSpeed;
		else this.x+=this.speed;
	};
	
	this.switchHoriz = function() {
		this.directionMode = "horiz";
		this.width = 100;
		this.height = 60;
		
		this.x -= 20;
	};
	
	this.switchVert = function() {
		this.directionMode = "vert";
		this.width = 60;
		this.height = 60;
		
		this.x += 20;
	};
	
	this.changeSpriteDir = function(dir) {
		switch(dir) {
			case "f":
				this.spriteDir = "f";
				if(this.crouched)
					this.sprite = this.imgfrontdown1;
				else this.sprite = this.imgfront1;
				break;
			case "b":
				this.spriteDir = "b";
				if(this.crouched)
					this.sprite = this.imgbackdown1;
				else this.sprite = this.imgback1;
				break;
			case "l":
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
				break;
			
		}
	};
	
	
}
