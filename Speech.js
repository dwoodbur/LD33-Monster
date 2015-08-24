function Speech(x,y,objWidth,text,duration,side) {
	this.x = x;
	this.y = y;
	this.objWidth = objWidth;
	this.width = 30;
	this.height = 30;
	this.text = text;
	this.duration = duration;
	
	switch(side) {
		case "right":
			this.x += this.objWidth+20;
			break;
		case "left":
			this.x -= this.width;
			break;
	}
	
	ctx.font = "15px Arial";
	var metrics = ctx.measureText(text);
	this.width += metrics.width;
			console.log(this.width + " " + this.height);
	
	
	
	this.draw = function() {
		ctx.fillStyle = "#FFFFFF";
		ctx.font = "15px Arial";
		ctx.fillRect(this.x, this.y-this.height, this.width, this.height);
		ctx.fillStyle = "#000000";
		ctx.fillText(this.text, this.x+15, this.y+15-this.height);
		
		
		this.duration--;
	};
	
}
