function Zebra(x,y) {
	this.x = x;
	this.y = y;
	this.width = 80;
	this.height = 60;
	this.speed = 1;
	this.sprintSpeed = 7;
	this.directionMode = "horiz";
	this.dead = false;
	
	this.imgfront1 = new Image();
	this.imgback1 = new Image();
	this.imgright1 = new Image();
	this.imgleft1 = new Image();
	this.imgdead1 = new Image();
	
	this.imgfront1.src = "zebra1front.png";
	this.imgback1.src = "zebra1back.png";
	this.imgright1.src = "zebra1right.png";
	this.imgleft1.src = "zebra1left.png";
	this.imgdead1.src = "zebra1dead.png";
	
	this.sprite = this.imgright1;
	this.spriteDir = "r";
	
	this.circle;
	this.active = false;
	this.alertness;
	this.circleDecreaseBuffer=8;
	
	this.nextActionCount = 0;
	this.eating = false;
	this.actionMode;
	
	this.update = function() {
		if(this.actionMode == "flee") {
			if(this.nextActionCount > 0) {
				this.nextActionCount--;
				switch (this.spriteDir) {
					case "f":
						this.moveUp();
						break;
					case "b":
						this.moveDown();
						break;
						case "r":
						this.moveRight();
						break;
					case "l":
						this.moveLeft();
						break;
				}
				
			} else {
				var r = Math.random();
				if(r < .25) {
					this.changeSpriteDir("f");
				} else if(r < .5) {
					this.changeSpriteDir("b");
				} else if(r < .75) {
					this.changeSpriteDir("r");
				} else this.changeSpriteDir("l");
				
				this.nextActionCount = Math.floor(Math.random()*200)+150;
			}
		}
		else if(this.nextActionCount>0) {
			this.nextActionCount--;
			if(this.actionMode == "walk") {
				if(this.circle != null)
					this.changeAlertness(300);
				switch (this.spriteDir) {
					case "f":
						this.moveUp();
						break;
					case "b":
						this.moveDown();
						break;
						case "r":
						this.moveRight();
						break;
					case "l":
						this.moveLeft();
						break;
				}
			}
			else if(this.actionMode == "eat") {
				// eat
				if(this.circle != null) {
					if(this.alertness > 100) {
						if(this.circleDecreaseBuffer == 0) {
							this.changeAlertness(this.alertness-1);
							this.circleDecreaseBuffer = 8;
						} else this.circleDecreaseBuffer--;
					}
				}
			}
		}
		else if(this.nextActionCount == 0) {
			var r = Math.random();
			if(r < .75) {
				this.actionMode = "walk";
				var walkR = Math.random();
				var walkDir;
				if (walkR < .25)
					walkDir = "r";
				else if (walkR < .5)
					walkDir = "l";
				else if (walkR < .75)
					walkDir = "f";
				else
					walkDir = "b";
				
				this.changeSpriteDir(walkDir);
				this.nextActionCount = Math.floor(Math.random()*200)+150;
				
			}
			else {
				this.actionMode = "eat";
				//console.log("Zebra eating...");
				// change sprite
				this.nextActionCount = Math.floor(Math.random()*200)+150;
			}
		}
		
		
		
		
		
	};
	
	this.draw = function() {
		ctx.drawImage(this.sprite, cameraX+this.x, cameraY+this.y);
	};
	
	
	this.flee = function() {
		this.actionMode = "flee";
		var r = Math.random();
		
		if(r < .25) {
			this.changeSpriteDir("f");
		} else if(r < .5) {
			this.changeSpriteDir("b");
		} else if(r < .75) {
			this.changeSpriteDir("r");
		} else this.changeSpriteDir("l");
				
		this.nextActionCount = Math.floor(Math.random()*200)+150;
	};
	
	this.deflee = function() {
		this.actionMode = "walk";
	}
	
	this.changeSpriteDir = function(dir) {
		switch(dir) {
			case "f":
				if(this.spriteDir == "r" || this.spriteDir == "l")
					this.switchVert();
				this.spriteDir = "f";
				this.sprite = this.imgfront1;
				break;
			case "b":
				if(this.spriteDir == "r" || this.spriteDir == "l")
					this.switchVert();
				this.spriteDir = "b";
				this.sprite = this.imgback1;
				break;
			case "r":
				if(this.spriteDir == "f" || this.spriteDir == "b")
					this.switchHoriz();
				this.spriteDir = "r";
				this.sprite = this.imgright1;
				break;
			case "l":
				if(this.spriteDir == "f" || this.spriteDir == "b")
					this.switchHoriz();
				this.spriteDir = "l";
				this.sprite = this.imgleft1;
				break;
			case "dead":
				if(this.spriteDir == "f" || this.spriteDir == "b")
					this.switchHoriz();
				this.spriteDir = "r";
				this.sprite = this.imgdead1;
		}
	};
	
	this.switchHoriz = function() {
		this.directionMode = "horiz";
		this.width = 80;
		this.height = 60;
		
		this.x -= 20;
		if(this.circle != null)
			this.circle.x += 20;
	};
	
	this.switchVert = function() {
		this.directionMode = "vert";
		this.width = 40;
		this.height = 60;
		
		this.x += 20;
		if(this.circle != null)
			this.circle.x -= 20;
	};
	
	this.moveUp = function() {
		if(this.actionMode == "flee")
			this.y -= this.sprintSpeed;
		else this.y -= this.speed;
	};
	this.moveDown = function() {
		if(this.actionMode == "flee")
			this.y += this.sprintSpeed;
		else this.y += this.speed;
	};
	this.moveRight = function() {
		if(this.actionMode == "flee")
			this.x += this.sprintSpeed;
		else this.x += this.speed;
	};
	this.moveLeft = function() {
		if(this.actionMode == "flee")
			this.x -= this.sprintSpeed;
		else this.x -= this.speed;
	};
	
	
	this.activate = function() {
		this.alertness = 300;
		//this.circle = new Circle(this.x+(this.width/2), this.y+(this.height/2), this.alertness, 3);
		this.active = true;
	};
	this.deactivate = function() {
		//this.circle = null;
		this.active = false;
	};
	
	this.changeAlertness = function(alertness) {
		this.alertness = alertness;
		//this.circle.r = this.alertness;
	};
	
	
}
