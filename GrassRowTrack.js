function GrassRowTrack() {
	this.xCurrent = null;
	this.yCurrent = null;
	this.lastXDir = null;
	this.lastYDir = null;
	
	this.getColShift = function(dir) {
		
		switch(dir) {
			case "r":
				if(this.xCurrent == null) {
					this.xCurrent = 0;
				}
				else if(this.lastXDir == "r") {
					this.xCurrent++;
					if(this.xCurrent > 13)
						this.xCurrent = 0;
				}
				this.lastXDir = "r";
				return this.xCurrent;
				break;
			case "l":
				if(this.xCurrent == null) {
					this.xCurrent = 13;
				}
				if(this.lastXDir == "l") {
					this.xCurrent--;
					if(this.xCurrent < 0)
						this.xCurrent = 13;
				}
				this.lastXDir = "l";
				return this.xCurrent;
				break;
			case "f":
				if(this.yCurrent == null) {
					this.yCurrent = 0;
				}
				else if(this.lastYDir == "f") {
					this.yCurrent++;
					if(this.yCurrent > 17)
						this.yCurrent = 0;
				}
				this.lastYDir = "f";
				return this.yCurrent;
				break;
			case "b":
				if(this.yCurrent == null) {
					this.yCurrent = 17;
				}
				if(this.lastYDir == "b") {
					this.yCurrent--;
					if(this.yCurrent < 0)
						this.yCurrent = 17;
				}
				this.lastYDir = "b";
				return this.yCurrent;
				break;
			
		}
		
	};
	
	this.getRowShift = function(dir) {
		
	};
	
}
