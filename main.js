var canvas;

// Initialize game
var game = new Game();

// Main loop for game
function MainLoop() {
	game.update();
	game.draw();
	// Call main loop at 30 fps, 33.33
	setTimeout(MainLoop, 15);
}
// Start game
MainLoop();
