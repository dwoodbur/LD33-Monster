function Game() {
	// Canvas data
	canvas = document.getElementById('game');
	ctx = canvas.getContext('2d');
	ctx.fillStyle = 'white';
	ctx.font = "10px Arial";
	ctxWidth = canvas.width;
	ctxHeight = canvas.height;
	BOTTOM_BOUNDARY = 5000;
	TOP_BOUNDARY = -5000;
	LEFT_BOUNDARY = -5000;
	RIGHT_BOUNDARY = 5000;
	
	// Mode/Transition data
	playerMode = "lion";
	MODE = "intro";
	inputPaused = true;
	//MODE = "";
	//inputPaused = false;
	//var titleCount = 250;
	var titleCount = 50;
	var cubIntro1 = false;
	var cubIntro2 = false;
	var cubIntro3 = false;
	var cubIntro4 = false;
	var lionIntro1 = false;
	var lionIntro2 = false;
	
	var cubMid1 = false;
	var cubMid2 = false;
	var lionMid1 = false;
	var lionMid2 = false;
	var lionMid3 = false;
	var hunterMid1 = false;
	
	var fadeOut = false;
	var alpha = 0;
	
	var lionsRunMid = false;
	var lionsRunCount = 0;
	
	var hunterEntrance = false;
	
	var cubEntrance = false;
	
	var spaceBreak = false;
	
	var controlsCount = 0;
	
	var zebra_near = false;
	var zebraHunted = false;
	
	var showData = true;
	var oneDown = false;
	
	// Camera data
	cameraX = 0;
	cameraY = 0;
	var upShift = false;
	var downShift = false;
	var rightShift = false;
	var leftShift = false;
	var SCREEN_SHIFT_MIN = .35;
	var SCREEN_SHIFT_MAX = .65;
	
	var grassesRight = 0;
	var grassesLeft = 0;
	var grassesUp = 0;
	var grassesDown = 0;
	
	var directionWarning = false;
	
	// Input data
	keys = new KeyListener();
	
	// Objects
	//player = new Player(480, 260);
	cub = new Cub(500, 190);
	grasses = [];
	rocks = [];
	trees = [];
	cave = new Cave(300, 20);
	zebras = [];
	deadZebra = null;
	grassTracker = new GrassRowTrack();
	arrow = null;
	hunter = null;
	
	zebras.push(new Zebra(100, 1500));
	zebras.push(new Zebra(700, 3500));
	zebras.push(new Zebra(1000, -1500));
	zebras.push(new Zebra(2000, 1000));
	zebras.push(new Zebra(-2000, -1000));
	zebras.push(new Zebra(-1500, 3000));
	//zebras[1].switchVert();
	//zebras[1].changeSpriteDir("f");
	
	player = new Lion(438, 176);
	
	
	// Grass data
	var GRASSES_HIGH = 18;
	var GRASSES_WIDE = 14;
	var pacesX = 0;
	var pacesY = 0;
	
	
	// Set up grass
	var grassOffsets = [];
	for(var i=0; i<20; i++)
		grassOffsets.push(Math.floor(Math.random()*100));
		
	for(var i=0; i<GRASSES_HIGH; i++) {
		grasses[i] = [];
		for(var j=0; j<GRASSES_WIDE; j++) {
			var yOffset = Math.random()*10;
			if(Math.random()>.5)
				yOffset *= -1;
			grasses[i][j] = new Grass(j*100-200-grassOffsets[i], yOffset+i*40-70);
		}
	}
	
	// Set up rocks
	rocks.push(new Rock(200, 200, 1));
	rocks.push(new Rock(100, 400, 1));
	rocks.push(new Rock(800, 300, 2));
	// Set up trees
	trees.push(new Tree(700, 200, 1));
	
	// Graphics
	var grassImg = new Image();
	grassImg.src = "grass2.png";
	
	
	this.update = function() {
		
		if(keys.isPressed(49) && !oneDown) {
			oneDown = true;
			if(showData)
				showData = false;
			else showData = true;
		}
		if(!keys.isPressed(49))
			oneDown = false;
	
		for(var i=0; i<zebras.length; i++) {
			if(!zebras[i].dead)
				zebras[i].update();
		}
	
		var near = false;
		for(var i=0; i<zebras.length; i++) {
			var zebra = zebras[i];
			
			if(!zebra.dead) {
				if(Math.sqrt(Math.pow((zebra.x+(zebra.width/2))-(player.x+(player.width/2)), 2) + Math.pow((zebra.y+(zebra.height/2))-(player.y+(player.height/2)), 2)) < 800) {
					near = true;
					//if(!zebra.active) {
					//	zebra.activate();
					//}
				}
			}
		}
		if(near && !zebra_near) {
			console.log("NEAR ZEBRA!");
			zebra_near = true;
		} else if(!near && zebra_near) {
			console.log("No longer near zebra.");
			zebra_near = false;
			for(var i=0; i<zebras.length; i++) {
				//zebras[i].deactivate();
			}
		}
		
		
		for(var i=0; i<zebras.length; i++) {
			//if(!zebras[i].dead) {
				var diff = Math.sqrt(Math.pow((zebra.x+(zebra.width/2))-(player.x+(player.width/2)), 2) + Math.pow((zebra.y+(zebra.height/2))-(player.y+(player.height/2)), 2));
				//console.log("Flee calc: "+diff);
				if(diff < 200) {
					zebras[i].flee();
					//console.log("FLEEING");
				}
			//}
		}
		
		for(var i=0; i<zebras.length; i++) {
			if(!zebras[i].dead && zebras[i].actionMode == "flee") {
				if(Math.sqrt(Math.pow((zebra.x+(zebra.width/2))-(player.x+(player.width/2)), 2) + Math.pow((zebra.y+(zebra.height/2))-(player.y+(player.height/2)), 2)) > 800) {
					zebras[i].deflee();
				}
			}
		}
		
		if(player.attack && !zebraHunted) {
			var lionAttackX;
			var lionAttackY;
			switch(player.spriteDir) {
				case "f":
					lionAttackX = player.x+(player.width/2);
					lionAttackY = player.y+player.height;
					break;
				case "b":
					lionAttackX = player.x+(player.width/2);
						lionAttackY = player.y;
					break;
				case "r":
					lionAttackX = player.x+player.width;
					lionAttackY = player.y+(player.height/2);
					break;
				case "l":
					lionAttackX = player.x;
					lionAttackY = player.y+(player.height/2);
					break;
				
			}
			for(var i=0; i<zebras.length; i++) {
				var zx = zebras[i].x;
				var zy = zebras[i].y;
				var zw = zebras[i].width;
				var zh = zebras[i].height;
				if(lionAttackX > zx && lionAttackX < zx+zw && lionAttackY > zy && lionAttackY < zy+zh) {
					zebras[i].dead = true;
					zebras[i].changeSpriteDir("dead");
					cub = new Cub(zebras[i].x+zebras[i].width/2, zebras[i].y-600);
					zebraDeadMarkY = zebras[i].y;
					deadZebra = zebras[i];
					zebras = [];
					zebraHunted = true;
					cubEntrance = true;
					inputPaused = true;
				}
			}
		}
		
	
		/* INPUT */
		
		
		if(!keys.isPressed(32) && spaceBreak)
			spaceBreak = false;
		
		
		if(!inputPaused) {
			
			
			player.update();
			
			if(keys.isPressed(32))
				player.crouched = true;
			else {
				player.crouched = false;
			}
			
			if(keys.isPressed(16))
				player.sprint = true;
			else player.sprint = false;
			
			directionWarning = false;
			
			// Down
			if(keys.isPressed(40)) {
				if(player.y <= BOTTOM_BOUNDARY) {
					player.moveDown();
					if(player.y+(player.height/2)+cameraY >= ctxHeight*SCREEN_SHIFT_MAX) {
						if(player.crouched)
							cameraY -= player.crouchSpeed;
						else if(player.sprint && !player.inebriated)
							cameraY -= player.sprintSpeed;
						else cameraY -= player.speed;
					}
					
					if(cameraY < 0) {
					if(Math.abs(cameraY/40) > grassesDown) {
						var index = grassTracker.getColShift("f");
						console.log(index);
						grassesDown++;
						grassesUp = grassesDown-1;
					
						for(var i=0; i<grasses[0].length; i++) {
							grasses[index][i].y += (GRASSES_HIGH)*40;
						}
					}
					}
					else if(cameraY > 0) {
						//console.log("CAMERERAY/100: " + cameraY/100 + " GRASSES DOWN: " + grassesDown);
					if((cameraY/40) < grassesDown-1) {
						var index = grassTracker.getColShift("f");
						console.log(index);
						grassesDown--;
						grassesUp = grassesDown-1;
					
						for(var i=0; i<grasses[0].length; i++) {
							grasses[index][i].y += (GRASSES_HIGH)*40;
						}
					}
					}
					
				
				} else {
					directionWarning = true;
				}
					
				if(playerMode == "lion") {
					if(player.directionMode == "horiz")
						player.switchVert();
				}
				
				
				
				player.changeSpriteDir("f");
			}
			// Up
			if(keys.isPressed(38)) {
				if(player.y >= TOP_BOUNDARY) {
					player.moveUp();
					if(player.y+(player.height/2)+cameraY  <= ctxHeight*SCREEN_SHIFT_MIN) {
						if(player.crouched)
							cameraY += player.crouchSpeed;
						else if(player.sprint && !player.inebriated)
							cameraY += player.sprintSpeed;
						else cameraY += player.speed;
					}
					
					if(cameraY/(-40) < grassesUp) {
						var index = grassTracker.getColShift("b");
						console.log(index);
						grassesUp--;
						grassesDown = grassesDown+1;
					
						for(var i=0; i<grasses[0].length; i++) {
							grasses[index][i].y -= (GRASSES_HIGH)*40;
						}
					}
					
				} else {
					directionWarning = true;
				}		
					
				if(playerMode == "lion") {
					if(player.directionMode == "horiz")
						player.switchVert();
				}
				
				player.changeSpriteDir("b");
				
			}
			// Left
			if(keys.isPressed(37)) {
				if(player.x >= LEFT_BOUNDARY) {
					player.moveLeft();
					if(player.x+(player.width/2)+cameraX <= ctxWidth*SCREEN_SHIFT_MIN) {
						if(player.crouched)
							cameraX += player.crouchSpeed;
						else if(player.sprint && !player.inebriated)
							cameraX += player.sprintSpeed;
						else cameraX += player.speed;
					}
					
					
					if(cameraX/(-100) < grassesLeft) {
						var index = grassTracker.getColShift("l");
						//console.log(index);
						grassesLeft--;
						grassesRight = grassesLeft+1;
					
						//console.log(Math.abs());
						for(var i=0; i<grasses.length; i++) {
							grasses[i][index].x -= (GRASSES_WIDE)*grasses[i][0].width;
						}
					}
					
				} else {
					directionWarning = true;
				}
				
				if(playerMode == "lion") {
					if(!keys.isPressed(40) && !keys.isPressed(38) && player.directionMode == "vert")
						player.switchHoriz();
				}
				
				if(!keys.isPressed(40) && !keys.isPressed(38)) {
					player.changeSpriteDir("l");
				}
			}
			// Right
			if(keys.isPressed(39)) {
				if(player.x <= RIGHT_BOUNDARY) {
					player.moveRight();
					if(player.x+(player.width/2)+cameraX >= ctxWidth*SCREEN_SHIFT_MAX) {
						if(player.crouched)
							cameraX -= player.crouchSpeed;
						else if(player.sprint && !player.inebriated)
							cameraX -= player.sprintSpeed;
						else cameraX -= player.speed;
					}
					
					if(cameraX < 0) {
					if(Math.abs(cameraX/100) > grassesRight) {
						var index = grassTracker.getColShift("r");
						grassesRight++;
						grassesLeft = grassesRight-1;
					
						for(var i=0; i<grasses.length; i++) {
							grasses[i][index].x += (GRASSES_WIDE)*grasses[i][0].width;
						}
					}
					}
					else if(cameraX > 0) {
					if((cameraX/100)-1 < grassesRight*-1) {
						var index = grassTracker.getColShift("r");
						grassesRight++;
						grassesLeft = grassesRight-1;
					
						for(var i=0; i<grasses.length; i++) {
							grasses[i][index].x += (GRASSES_WIDE)*grasses[i][0].width;
						}
					}
					}
						
				} else {
					directionWarning = true;
				}
		
					
				if(playerMode == "lion") {
					if(!keys.isPressed(40) && !keys.isPressed(38) && player.directionMode == "vert")
						player.switchHoriz();
				}
				
				
				
				if(!keys.isPressed(40) && !keys.isPressed(38)) {
					player.changeSpriteDir("r");
				}
			}
			
			
			if(!keys.isPressed(37) && !keys.isPressed(38) && !keys.isPressed(39) && !keys.isPressed(40)) {
				player.changeSpriteDir(player.spriteDir);
			}
			
		
		}
		
		if(cubEntrance) {
			//console.log("Cub y: " + cub.y);
			//cub.runDown();
			cub.y += 6;
			if(cub.y+cub.height >= zebraDeadMarkY) {
				cub.speak("Thanks Dad!", 100, "right");
				cubEntrance = false;
				cubMid1 = true;
			}
		}
		else if(cubMid1) {
			if(keys.isPressed(32) && !spaceBreak) {
				cub.speech = null;
				spaceBreak = true;
			}
			if(cub.speech == null) {
				player.speak("Sure. Eat some, and we'll take the rest back to the pride.", 250, "left");
				cubMid1 = false;
				lionMid1 = true;
			}
		}
		else if(lionMid1) {
			if(keys.isPressed(32) && !spaceBreak) {
				player.speech = null;
				spaceBreak = true;
			}
			if(player.speech == null) {
				//inputPaused = false;
				lionMid1 = false;
				// Shoot arrow, cub cries, lion says run, hunter appears, talks to son, controls shifts to hunter
				arrow = new Arrow(player.x+(player.width/2), player.y+300);
			}
		}
		else if(arrow != null) {
			if(arrow.y < player.y+(player.height/2)) {
				arrow = null;
				player.speak("ROAAAR!", 75, "left");
				lionMid2 = true;
			} else {
				arrow.y -= 15;
				console.log("ARROW MOVE");
			}
		}
		else if(lionMid2) {
			if(player.speech == null) {
				cub.speak("Dad!", 75, "right");
				lionMid2 = false;
				cubMid2 = true;
			}
		}
		else if(cubMid2) {
			if(cub.speech == null) {
				player.speak("Run!", 75, "left");
				cubMid2 = false;
				lionMid3 = true;
			}
		}
		else if(lionMid3) {
			if(player.speech == null) {
				lionsRunMid = true;
				lionsRunCount = 0;
				lionMid3 = false;
				player.changeSpriteDir("b");
			}
		}
		else if(lionsRunMid) {
			if(lionsRunCount >= 100) {
				//player.x = 438;
				//player.y = 176;
				cub.x = 500;
				cub.y = 190;
				hunter = new Hunter(deadZebra.x+(deadZebra.width/2), deadZebra.y+400);
				hunterEntrance = true;
				lionsRunMid = false;
			} else {
				player.y -= 1;
				cub.y -= 9;
				lionsRunCount++;
			}
		}
		else if(hunterEntrance) {
			hunter.y -= 3;
			if(hunter.y < deadZebra.y+80) {
				hunter.speak("This beast is gonna look great on my mantle.", 270, "left");
				hunterMid1 = true;
				hunterEntrance = false;
			}
		}
		else if(hunterMid1) {
			if(hunter.speech == null) {
				fadeOut = true;
			}
		}
		
		
			

	};
	
	this.draw = function() {
		ctx.clearRect(0, 0, ctxWidth, ctxHeight);
		
		// Draw background.
		ctx.fillStyle = "#FFFF33";
		ctx.fillRect(0, 0, ctxWidth, ctxHeight);
		
		var PLAYER_DRAWN = false;
		var HUNTER_DRAWN = false;
		var CUB_DRAWN = false;
		var CAVE_DRAWN = false;
		var CAVE_DRAWN_NOW = false;
		var ROCKS_DRAWN = [];
		var TREES_DRAWN = [];
		var ZEBRAS_DRAWN = [];
		var DEAD_ZEBRA_DRAWN = false;
		for(var i=0; i<rocks.length; i++)
			ROCKS_DRAWN[i] = false;
		for(var i=0; i<trees.length; i++)
			TREES_DRAWN[i] = false;
		for(var i=0; i<zebras.length; i++)
			ZEBRAS_DRAWN[i] = false;
		
		for(var i=0; i<GRASSES_HIGH; i++) {
			/* DRAW OBJECTS IN FRONT OF GRASS */
			var diff;
			
			// Draw cave.
			if(!CAVE_DRAWN) {
				diff = (cave.y+cave.height)-(grasses[i][0].y+grasses[i][0].height)+45;
				if( diff > 0 && diff <= 45) {
					cave.draw();
					CAVE_DRAWN = true;
					CAVE_DRAWN_NOW = true;
				}
			}
			
			// Draw rocks.
			for(var j=0; j<rocks.length; j++) {
				if(!ROCKS_DRAWN[j]) {
					diff = (rocks[j].y+rocks[j].height)-(grasses[i][0].y+grasses[i][0].height)+45;
					if( diff > 0 && diff <= 45) {
						rocks[j].draw();
						ROCKS_DRAWN[j] = true;
					}
				}
			}
			// Draw trees.
			for(var j=0; j<trees.length; j++) {
				if(!TREES_DRAWN[j]) {
					diff = (trees[j].y+trees[j].height)-(grasses[i][0].y+grasses[i][0].height)+45;
					if( diff > 0 && diff <= 45) {
						trees[j].draw();
						TREES_DRAWN[j] = true;
					}
				}
			}
			
			if(deadZebra != null) {
				diff = (deadZebra.y+deadZebra.height+cameraY)-(grasses[i][0].y+grasses[i][0].height+cameraY)+45;
				if(diff > 0 && diff <= 45) {
					deadZebra.draw();
					DEAD_ZEBRA_DRAWN = true;
				}
			}
			
			// Draw player.
			diff = (player.y+player.height+cameraY)-(grasses[i][0].y+grasses[i][0].height+cameraY)+45;
			if( diff > 0 && diff <= 45) {
				player.draw();
				PLAYER_DRAWN = true;
			}
			
			// Draw cub.
			diff = (cub.y+cub.height+cameraY)-(grasses[i][0].y+grasses[i][0].height+cameraY)+45;
			if(diff > 0 && diff <= 45) {
				cub.draw();
				CUB_DRAWN = true;
			}
			
			// Draw hunter
			if(hunter != null) {
				diff = (hunter.y+hunter.height+cameraY)-(grasses[i][0].y+grasses[i][0].height+cameraY)+45;
				if(diff > 0 && diff <= 45) {
					hunter.draw();
					HUNTER_DRAWN = true;
				}
			}
			
			// Draw zebras.
			for(var j=0; j<zebras.length; j++) {
				if(!ZEBRAS_DRAWN[j]) {
					diff = (zebras[j].y+zebras[j].height)-(grasses[i][0].y+grasses[i][0].height)+45;
					if(diff > 0 && diff <= 45) {
						zebras[j].draw();
						ZEBRAS_DRAWN[j] = true;
					}
				}
			}
			
			
			
			/* ============================= */
			//rocks[0].draw();
			
			
				// Draw next row of grass.
				for(var j=0; j<GRASSES_WIDE; j++) {
					ctx.drawImage(grassImg, cameraX+grasses[i][j].x, cameraY+grasses[i][j].y);
				}
			
		}
		
		// Draw undrawn objects.
		if(!DEAD_ZEBRA_DRAWN && deadZebra != null)
			deadZebra.draw();
		if(!PLAYER_DRAWN)
			player.draw();
		if(!CAVE_DRAWN)
			cave.draw();
		if(hunter != null) {
			if(!HUNTER_DRAWN)
				hunter.draw();
		}
		for(var i=0; i<ROCKS_DRAWN.length; i++) {
			if(!ROCKS_DRAWN[i])
				rocks[i].draw();
		}
		for(var i=0; i<TREES_DRAWN.length; i++) {
			if(!TREES_DRAWN[i])
				trees[i].draw();
		}
		for(var i=0; i<ZEBRAS_DRAWN.length; i++) {
			if(!ZEBRAS_DRAWN[i])
				zebras[i].draw();
		}
		for(var i=0; i<zebras.length; i++) {
			//if(zebras[i].active) {
			//	zebras[i].circle.draw();
			//}
		}
		
		if(controlsCount > 0) {
			ctx.fillStyle = "#000000";
			ctx.fillRect(690, 10, 300, 90);
			ctx.fillStyle = "#FFFFFF";
			ctx.font = "15px Arial";
			ctx.fillText("CONTROLS", 800, 25);
			ctx.fillText("Arrow Keys... Move", 700, 45);
			ctx.fillText("Space Bar.... Crouch", 700, 65);
			ctx.fillText("Shift........ Sprint", 700, 85);
			controlsCount--;
		}
		
		if(MODE == "intro") {
			if(titleCount > 0) {
				ctx.fillStyle = "#000000";
				ctx.font = "50px Arial";
				ctx.fillText("You Are The Monster", 450, 500);
				ctx.font = "30px Arial";
				ctx.fillText("by Dylan Woodbury", 460, 550);
				titleCount--;
				if(titleCount <= 0) {
					cub.speak("I'm hungry Dad.", 250, "right");
					cubIntro1 = true;
				}
			}
			else if(cubIntro1) {
				if(keys.isPressed(32)) {
					cub.speech = null;
					spaceBreak = true;
				}
				if(cub.speech == null) {
					player.speak("I'll go kill a zebra.", 250, "left");
					cubIntro1 = false;
					lionIntro1 = true;
				}
			}
			else if(lionIntro1) {
				if(keys.isPressed(32) && !spaceBreak) {
					player.speech = null;
					spaceBreak = true;
				}
				if(player.speech == null) {
					cub.speak("Is it ok to kill zebras Dad?", 250, "right");
					lionIntro1 = false;
					cubIntro2 = true;
				}
			}
			else if(cubIntro2) {
				if(keys.isPressed(32) && !spaceBreak) {
					cub.speech = null;
					spaceBreak = true;
				}
				if(cub.speech == null) {
					player.speak("Yes, we need them to survive.", 300, "left");
					cubIntro2 = false;
					lionIntro2 = true;
				}
			}
			else if(lionIntro2) {
				if(keys.isPressed(32) && !spaceBreak) {
					player.speech = null;
					spaceBreak = true;
				}
				if(player.speech == null) {
					cub.speak("Ok.", 150, "right");
					lionIntro2 = false;
					cubIntro3 = true;
				}
			}
			else if(cubIntro3) {
				if(keys.isPressed(32) && !spaceBreak) {
					cub.speech = null;
					spaceBreak = true;
				}
				if(cub.speech == null) {
					cub.speak("In that case I'm hungry!", 200, "right");
					cubIntro3 = false;
					cubIntro4 = true;
				}
			}
			else if(cubIntro4) {
				if(keys.isPressed(32) && !spaceBreak) {
					cub.speech = null;
					spaceBreak = true;
				}
				if(cub.speech == null) {
					inputPaused = false;
					MODE = "";
					controlsCount = 420;
				}
			}
		}
		
		
		if(player.speech != null) {
			player.speech.draw();
		}
		if(cub.speech != null) {
			cub.speech.draw();
		}
		if(hunter != null) {
			if(hunter.speech != null) {
				hunter.speech.draw();
			}
		}
		
		if(arrow != null)
			arrow.draw();
		
		if(zebra_near) {
			ctx.fillStyle = "#FF0000";
			ctx.font = "20px Arial";
			ctx.fillText("NEAR ZEBRA", 850, 580);
		}
		
		if(directionWarning) {
			ctx.fillStyle = "red";
			ctx.font = "30px Arial";
			ctx.fillText("THERE ARE HUNTERS BEYOND THE RESERVATION", 100, 580);
			//console.log("TEXT DRAWN");
		}
		
		if(fadeOut) {
			ctx.fillStyle = "rgba(0,0,0,"+alpha+")";
			ctx.fillRect(0,0,ctxWidth, ctxHeight);
			alpha+=.005;
			hunter.y -= 1;
		}
		
		if(showData) {
			ctx.fillStyle = "#000000";
			ctx.font = "10px Arial";
			ctx.fillRect(0, 0, 200, 100);
			ctx.fillStyle="#FFFFFF";
			ctx.fillText("DATA", 10, 10);
			ctx.fillText("Player: (" + player.x+","+player.y+")", 10, 20);
			ctx.fillText("Camera: (" + cameraX+","+cameraY+")", 10, 30);
			ctx.fillText("Grasses: " + grasses.length*grasses[0].length, 10, 40);
			ctx.fillText("Rocks: " + rocks.length, 10, 50);
			ctx.fillText("Trees: " + trees.length, 10, 60);
			ctx.fillText("Zebras: " + zebras.length, 10, 70);
			if(zebras.length > 0)
				ctx.fillText("First zebra: ("+zebras[0].x+","+zebras[0].y+")", 10, 80);
			ctx.fillText("Cub: ("+cub.x+","+cub.y+")", 10, 90);
		}
	};
	
}